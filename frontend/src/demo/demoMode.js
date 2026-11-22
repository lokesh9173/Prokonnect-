import { handleDemoApiRequest } from './demoApiHandler.js';
import { getDemoStore, resetDemoStore } from './demoStorage.js';

const DEMO_MODE_STORAGE_KEY = 'prokonnect_demo_mode';

/**
 * Checks whether Demo Mode is active.
 * Demo Mode activates when:
 * 1. URL parameter ?demo=true or ?demo=1 is present
 * 2. import.meta.env.VITE_DEMO_MODE === 'true' or '1'
 * 3. localStorage 'prokonnect_demo_mode' === 'true'
 * 4. Active user session in localStorage is a demo account
 */
export function isDemoMode() {
    // 1. Check URL parameters
    try {
        if (typeof window !== 'undefined' && window.location) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('demo') === 'true' || params.get('demo') === '1') {
                localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
                return true;
            }
            if (params.get('demo') === 'false' || params.get('demo') === '0') {
                localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
                return false;
            }
        }
    } catch {
        // ignore in SSR or test contexts
    }

    // 2. Check environment variable (configured on Vercel / local .env)
    const envDemo = import.meta.env?.VITE_DEMO_MODE;
    if (envDemo === 'true' || envDemo === '1') {
        return true;
    }

    // 3. Check localStorage flag
    try {
        if (typeof localStorage !== 'undefined') {
            if (localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true') {
                return true;
            }
            // 4. Check if active user session is a demo user
            const rawUser = localStorage.getItem('prokonnect_user');
            if (rawUser) {
                const u = JSON.parse(rawUser);
                if (u && (u.isDemo || (typeof u.token === 'string' && u.token.startsWith('demo-')) || (typeof u.email === 'string' && u.email.endsWith('.demo')))) {
                    localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
                    return true;
                }
            }
        }
    } catch {
        // ignore
    }

    return false;
}

/**
 * Explicitly enable or disable demo mode.
 */
export function setDemoMode(enable) {
    try {
        if (enable) {
            localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
            // Ensure demo store is seeded
            getDemoStore();
        } else {
            localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
        }
    } catch (e) {
        console.error('Error toggling demo mode in localStorage:', e);
    }
}

/**
 * Fast 1-click login as a pre-seeded demo account.
 * Switches role, populates auth token, and returns payload.
 */
export function loginAsDemoRole(role = 'business') {
    setDemoMode(true);
    const store = getDemoStore();
    const targetUser = store.users.find(u => u.role === role) || store.users[0];

    const authPayload = {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        profilePhoto: targetUser.profilePhoto || '',
        isDemo: true,
        token: `demo-jwt-token-${targetUser._id}-${Date.now()}`
    };

    try {
        localStorage.setItem('prokonnect_user', JSON.stringify(authPayload));
        localStorage.setItem('prokonnect_role', authPayload.role);
    } catch (err) {
        console.error('Failed to store demo user session:', err);
    }

    return authPayload;
}

/**
 * Resets all demo data in localStorage and optionally clears active session.
 */
export function resetAllDemoData() {
    resetDemoStore();
}

let isInterceptorInstalled = false;

/**
 * Checks whether an incoming fetch call intends to communicate with demo accounts.
 */
function isDemoRequestIntent(urlString, init = {}) {
    if (!urlString || typeof urlString !== 'string') return false;
    
    // Check if auth token is a demo token
    const authHeader = init?.headers?.Authorization || init?.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.includes('demo-')) {
        return true;
    }

    // Check if body contains a demo email or demo payload
    if (init?.body && typeof init.body === 'string' && init.body.includes('.demo')) {
        return true;
    }

    return false;
}

/**
 * Initializes Demo Mode network interception unconditionally.
 * Transparently intercepts window.fetch for `/api/*` endpoints whenever demo mode
 * is active or when interacting with demo accounts.
 * Non-demo requests and non-demo mode delegate cleanly to original native fetch.
 */
export function initDemoMode() {
    if (typeof window === 'undefined' || !window.fetch) {
        return;
    }

    if (isInterceptorInstalled) {
        return;
    }

    // Seed demo store if already in demo mode
    if (isDemoMode()) {
        getDemoStore();
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = async function (input, init = {}) {
        const urlString = typeof input === 'string' ? input : (input && input.url ? input.url : '');

        // Check if the URL is an API request
        const isApiRequest = 
            urlString.startsWith('/api/') || 
            urlString.includes('/api/') || 
            urlString.startsWith('/uploads/verification-');

        // Dynamically evaluate demo status at request time
        const demoActive = isDemoMode() || isDemoRequestIntent(urlString, init);

        if (demoActive && isApiRequest) {
            // Ensure demo mode flag is persisted
            if (!isDemoMode()) {
                setDemoMode(true);
            }
            try {
                return await handleDemoApiRequest(input, init);
            } catch (err) {
                console.error('[Demo Mode Fetch Interceptor Error]:', err);
                return new Response(JSON.stringify({ message: err.message || 'Demo request failed' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Delegate to original native fetch for all real backend requests or static assets
        return originalFetch(input, init);
    };

    isInterceptorInstalled = true;
    console.info('%c[ProKonnect Demo Interceptor]%c Network layer ready for in-browser virtualization.', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', 'color: #3b82f6; margin-left: 6px;');
}
