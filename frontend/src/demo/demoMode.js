import { handleDemoApiRequest } from './demoApiHandler.js';
import { getDemoStore, resetDemoStore } from './demoStorage.js';

const DEMO_MODE_STORAGE_KEY = 'prokonnect_demo_mode';

/**
 * Checks whether Demo Mode is active.
 * Demo Mode activates when:
 * 1. URL parameter ?demo=true is present
 * 2. import.meta.env.VITE_DEMO_MODE === 'true' or '1'
 * 3. localStorage 'prokonnect_demo_mode' === 'true'
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

    // 3. Check localStorage
    try {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
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
 * Switches role, populates auth token, and redirects to appropriate dashboard.
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
        token: `demo-jwt-token-${targetUser._id}-${Date.now()}`
    };

    localStorage.setItem('prokonnect_user', JSON.stringify(authPayload));
    localStorage.setItem('prokonnect_role', authPayload.role);

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
 * Initializes Demo Mode network interception if active.
 * When active, transparently intercepts window.fetch for `/api/*` endpoints.
 * Leaves non-API requests and non-demo mode completely untouched.
 */
export function initDemoMode() {
    if (!isDemoMode()) {
        return;
    }

    // Ensure initial store is populated
    getDemoStore();

    if (isInterceptorInstalled) {
        return;
    }

    if (typeof window === 'undefined' || !window.fetch) {
        return;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = async function (input, init) {
        const urlString = typeof input === 'string' ? input : (input && input.url ? input.url : '');

        // Check if the URL is an API request
        const isApiRequest = 
            urlString.startsWith('/api/') || 
            urlString.includes('/api/') || 
            urlString.startsWith('/uploads/verification-');

        if (isDemoMode() && isApiRequest) {
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

        // Delegate to original fetch for all other assets/routes
        return originalFetch(input, init);
    };

    isInterceptorInstalled = true;
    console.info('%c[ProKonnect Demo Mode Active]%c All /api/* calls are simulated locally in-browser.', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', 'color: #3b82f6; margin-left: 6px;');
}
