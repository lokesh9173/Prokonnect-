import {
    demoAuthenticate,
    demoRegister,
    demoGetUserById,
    demoGetUserProfile,
    demoUpdateUserProfile,
    demoGetUsers,
    demoGetOffers,
    demoGetMyOffers,
    demoGetOfferById,
    demoCreateOffer,
    demoUpdateOffer,
    demoDeleteOffer,
    demoApplyToOffer,
    demoGetOfferApplications,
    demoGetMyApplications,
    demoUpdateApplicationStatus,
    demoUploadAvatar,
    demoUploadVerification
} from './demoStorage.js';

/**
 * Extracts the user ID from a Bearer token.
 * In demo mode, tokens have the format 'demo-jwt-token-<userId>-<timestamp>'
 * or 'demo-token-<userId>'.
 */
function extractUserIdFromToken(authHeader) {
    if (!authHeader) return null;
    const match = authHeader.match(/Bearer\s+demo-(?:jwt-)?token-([a-zA-Z0-9_-]+)/);
    if (match) {
        // Strip trailing timestamp if present
        const parts = match[1].split('-');
        if (parts.length >= 3 && !isNaN(parts[parts.length - 1])) {
            return parts.slice(0, -1).join('-');
        }
        return match[1];
    }
    return null;
}

/**
 * Helper to build standard JSON Response object
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'X-ProKonnect-Demo': 'true'
        }
    });
}

/**
 * Helper to build error JSON Response object
 */
function errorResponse(message, status = 400) {
    return new Response(JSON.stringify({ message }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'X-ProKonnect-Demo': 'true'
        }
    });
}

/**
 * Handles all intercepted `/api/*` requests in demo mode.
 */
export async function handleDemoApiRequest(input, init = {}) {
    // Determine method and normalized pathname
    const method = ((init.method || (typeof input === 'object' && input.method) || 'GET')).toUpperCase();
    const urlString = typeof input === 'string' ? input : input.url;

    let parsedUrl;
    try {
        parsedUrl = new URL(urlString, window.location.origin);
    } catch {
        parsedUrl = new URL(urlString, 'http://localhost');
    }

    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // Extract headers
    let authHeader = null;
    if (init.headers) {
        if (init.headers instanceof Headers) {
            authHeader = init.headers.get('Authorization') || init.headers.get('authorization');
        } else if (typeof init.headers === 'object') {
            authHeader = init.headers.Authorization || init.headers.authorization;
        }
    }
    const currentUserId = extractUserIdFromToken(authHeader) || 'demo-biz-1';

    // Parse body if present
    let body = {};
    if (init.body) {
        if (typeof init.body === 'string') {
            try {
                body = JSON.parse(init.body);
            } catch {
                body = {};
            }
        } else if (init.body instanceof FormData) {
            // Convert FormData to plain object
            for (const [key, value] of init.body.entries()) {
                body[key] = value;
            }
        }
    }

    // Small simulated network latency (60ms) to ensure UI state transitions behave naturally
    await new Promise(r => setTimeout(r, 60));

    try {
        // ==========================================
        // Auth Routes
        // ==========================================
        if (pathname === '/api/auth/login' && method === 'POST') {
            const user = demoAuthenticate(body.email, body.password);
            return jsonResponse(user, 200);
        }

        if (pathname === '/api/auth/register' && method === 'POST') {
            const user = demoRegister(body);
            return jsonResponse(user, 201);
        }

        if (pathname === '/api/auth/profile' && (method === 'PUT' || method === 'PATCH')) {
            const updated = demoUpdateUserProfile(currentUserId, body);
            return jsonResponse(updated, 200);
        }

        if (pathname === '/api/auth/forgot-password' && method === 'POST') {
            return jsonResponse({ message: 'Demo mode: Password reset email simulated.' }, 200);
        }

        if (pathname.startsWith('/api/auth/reset-password/') && (method === 'PUT' || method === 'POST')) {
            return jsonResponse({ message: 'Demo mode: Password reset successfully.' }, 200);
        }

        // ==========================================
        // User & Settings Routes
        // ==========================================
        if (pathname === '/api/users/profile') {
            if (method === 'GET') {
                const profile = demoGetUserProfile(currentUserId);
                return jsonResponse(profile, 200);
            }
            if (method === 'PUT' || method === 'PATCH') {
                const updated = demoUpdateUserProfile(currentUserId, body);
                return jsonResponse(updated, 200);
            }
        }

        if (pathname === '/api/users/settings') {
            if (method === 'GET') {
                const savedTheme = localStorage.getItem('prokonnect_appearance');
                const parsed = savedTheme ? JSON.parse(savedTheme) : { theme: 'light', language: 'en' };
                return jsonResponse(parsed, 200);
            }
            if (method === 'PUT' || method === 'PATCH') {
                if (body.theme) {
                    localStorage.setItem('prokonnect_appearance', JSON.stringify({
                        theme: body.theme,
                        language: body.language || 'en'
                    }));
                }
                return jsonResponse({ message: 'Settings updated successfully', ...body }, 200);
            }
        }

        if (pathname === '/api/users' && method === 'GET') {
            const role = searchParams.get('role');
            const search = searchParams.get('search');
            const users = demoGetUsers({ role, search });
            return jsonResponse(users, 200);
        }

        // Match /api/users/:id
        const userMatch = pathname.match(/^\/api\/users\/([a-zA-Z0-9_-]+)$/);
        if (userMatch && method === 'GET') {
            const targetId = userMatch[1];
            const targetUser = demoGetUserById(targetId);
            return jsonResponse(targetUser, 200);
        }

        // ==========================================
        // Offer / Campaign Routes
        // ==========================================
        if (pathname === '/api/offers/my' && method === 'GET') {
            const myOffers = demoGetMyOffers(currentUserId);
            return jsonResponse(myOffers, 200);
        }

        if (pathname === '/api/offers') {
            if (method === 'GET') {
                const category = searchParams.get('category');
                const type = searchParams.get('type');
                const search = searchParams.get('search');
                const offers = demoGetOffers({ category, type, search });
                return jsonResponse(offers, 200);
            }
            if (method === 'POST') {
                const newOffer = demoCreateOffer(currentUserId, body);
                return jsonResponse(newOffer, 201);
            }
        }

        // Match /api/offers/:id/applications
        const offerAppsMatch = pathname.match(/^\/api\/offers\/([a-zA-Z0-9_-]+)\/applications$/);
        if (offerAppsMatch && method === 'GET') {
            const offerId = offerAppsMatch[1];
            const apps = demoGetOfferApplications(offerId, currentUserId);
            return jsonResponse({
                success: true,
                count: apps.length,
                applications: apps
            }, 200);
        }

        // Match /api/offers/:id/apply
        const offerApplyMatch = pathname.match(/^\/api\/offers\/([a-zA-Z0-9_-]+)\/apply$/);
        if (offerApplyMatch && method === 'POST') {
            const offerId = offerApplyMatch[1];
            const pitch = body.pitchMessage || body.message || '';
            const newApp = demoApplyToOffer(currentUserId, offerId, pitch);
            return jsonResponse({
                success: true,
                message: 'Application submitted successfully',
                application: newApp
            }, 201);
        }

        // Match /api/offers/:id
        const offerDetailMatch = pathname.match(/^\/api\/offers\/([a-zA-Z0-9_-]+)$/);
        if (offerDetailMatch) {
            const offerId = offerDetailMatch[1];
            if (method === 'GET') {
                const offer = demoGetOfferById(offerId);
                return jsonResponse(offer, 200);
            }
            if (method === 'PUT' || method === 'PATCH') {
                const updated = demoUpdateOffer(offerId, body, currentUserId);
                return jsonResponse(updated, 200);
            }
            if (method === 'DELETE') {
                const result = demoDeleteOffer(offerId, currentUserId);
                return jsonResponse(result, 200);
            }
        }

        // ==========================================
        // Applications Routes
        // ==========================================
        if (pathname === '/api/applications/my' && method === 'GET') {
            const myApps = demoGetMyApplications(currentUserId);
            return jsonResponse({
                success: true,
                count: myApps.length,
                applications: myApps
            }, 200);
        }

        // Match /api/applications/:id/status
        const appStatusMatch = pathname.match(/^\/api\/applications\/([a-zA-Z0-9_-]+)\/status$/);
        if (appStatusMatch && (method === 'PATCH' || method === 'PUT')) {
            const appId = appStatusMatch[1];
            const updated = demoUpdateApplicationStatus(appId, body.status, currentUserId);
            return jsonResponse(updated, 200);
        }

        // ==========================================
        // Upload & Verification Routes
        // ==========================================
        if (pathname === '/api/upload/avatar' && method === 'POST') {
            const result = demoUploadAvatar(currentUserId);
            return jsonResponse(result, 200);
        }

        if (pathname === '/api/upload/verification' && method === 'POST') {
            const result = demoUploadVerification(currentUserId);
            return jsonResponse(result, 200);
        }

        // Return a mock visual document for verification previews
        if (pathname.startsWith('/api/upload/verification/')) {
            const svgDoc = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="400" height="280" rx="14" fill="url(#bg)"/>
  <rect x="16" y="16" width="368" height="248" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="6,4" stroke-opacity="0.6"/>
  <circle cx="200" cy="95" r="32" fill="#3b82f6" fill-opacity="0.15"/>
  <path d="M188 95l8 8 16-16" fill="none" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="200" y="160" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="700" fill="#f8fafc" text-anchor="middle">Official Verification Proof</text>
  <text x="200" y="188" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="500" fill="#94a3b8" text-anchor="middle">Analytics &amp; Identity Verified (Demo)</text>
  <text x="200" y="215" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Secure Local Vault • ID: DEMO-VERIF-2026</text>
</svg>`;

            return new Response(svgDoc, {
                status: 200,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache',
                    'X-ProKonnect-Demo': 'true'
                }
            });
        }

        // ==========================================
        // Chatbot Widget
        // ==========================================
        if (pathname === '/api/chat' && method === 'POST') {
            const userMsg = (body.message || '').toLowerCase();
            let botReply = "Hello! I am ProKonnect AI Assistant. In Demo Mode, you can browse verified campaigns, test brand-influencer matchmaking, review applications, and simulate collaborations in your browser!";

            if (userMsg.includes('campaign') || userMsg.includes('offer')) {
                botReply = "You can view active campaigns in Explore or under your dashboard. As a business, you can create and manage paid and barter campaigns with custom requirements!";
            } else if (userMsg.includes('influencer') || userMsg.includes('creator')) {
                botReply = "ProKonnect connects verified influencers with top brands. Influencers can apply with customized pitch messages and unlock brand contacts upon acceptance.";
            } else if (userMsg.includes('verification') || userMsg.includes('document')) {
                botReply = "Influencers can upload analytics screenshots in Edit Profile. Documents are secured and private, visible only for verification checks.";
            }

            return jsonResponse({
                response: botReply,
                status: 'success'
            }, 200);
        }

        // Health check
        if (pathname === '/api/health') {
            return jsonResponse({ status: 'ok', mode: 'demo' }, 200);
        }

        // Unhandled API endpoint in demo mode
        console.warn(`[Demo API] Unhandled route: ${method} ${pathname}`);
        return jsonResponse({ message: `Demo mode: Request to ${pathname} handled successfully` }, 200);

    } catch (err) {
        console.error(`[Demo API Error] ${method} ${pathname}:`, err);
        return errorResponse(err.message || 'Demo operation failed', 400);
    }
}
