/**
 * Centralized API & Asset URL Configuration
 * 
 * - In local development: Defaults to relative paths ('') using Vite proxy.
 * - In unified production (Docker/VPS/Render single service): Defaults to relative paths ('').
 * - In decoupled production (Vercel Frontend + Render/Railway Backend):
 *   Uses `VITE_API_URL` (e.g., https://api.prokonnect.com or https://prokonnect-api.onrender.com).
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Helper to construct full API endpoint URL
 * @param {string} endpoint - e.g. '/api/auth/login'
 * @returns {string} - Full URL or relative path
 */
export const getApiUrl = (endpoint) => {
    if (!endpoint) return API_BASE_URL;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Helper to construct media/image URL
 * @param {string} path - e.g. '/uploads/image-123.jpg'
 * @returns {string} - Full image URL
 */
export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Reusable fetch wrapper with automatic base URL, auth token header, and JSON handling
 */
export const apiRequest = async (endpoint, options = {}, token = null) => {
    const url = getApiUrl(endpoint);
    const headers = { ...(options.headers || {}) };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    return response;
};
