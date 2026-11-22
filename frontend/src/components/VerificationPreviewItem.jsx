import React, { useState, useEffect } from 'react';
import { Lock, FileText } from 'lucide-react';
import { getApiUrl } from '../config/api';

/**
 * Secure preview component for private verification documents.
 * Fetches private documents via Authorization: Bearer <token>,
 * converts to an in-memory Blob Object URL, and cleans up (revokes)
 * the Object URL on unmount or URL change to prevent memory leaks.
 */
const VerificationPreviewItem = ({ url, token, onRemove, alt = 'Verification document' }) => {
    const [blobUrl, setBlobUrl] = useState(() => (url && (url.startsWith('blob:') || url.startsWith('data:'))) ? url : null);
    const [isPdf, setIsPdf] = useState(() => Boolean(url && url.toLowerCase().endsWith('.pdf')));
    const [loading, setLoading] = useState(() => Boolean(url && !url.startsWith('blob:') && !url.startsWith('data:')));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url || url.startsWith('blob:') || url.startsWith('data:')) {
            return;
        }

        let isSubscribed = true;
        let createdBlobUrl = null;

        // Normalize legacy /uploads/verification-* to authenticated endpoint
        let resolvedUrl = url;
        const legacyMatch = resolvedUrl.match(/\/uploads\/(verification-[^?#]+)/i);
        if (legacyMatch) {
            resolvedUrl = `/api/upload/verification/${legacyMatch[1]}`;
        }

        const targetUrl = getApiUrl(resolvedUrl);
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(targetUrl, { headers })
            .then(async (res) => {
                if (res.status === 401) {
                    throw new Error('Session expired');
                }
                if (res.status === 403) {
                    throw new Error('Access denied');
                }
                if (!res.ok) {
                    throw new Error(`Failed to load (${res.status})`);
                }

                const contentType = res.headers.get('content-type') || '';
                const isPdfType = contentType.includes('pdf') || url.toLowerCase().endsWith('.pdf');
                const blob = await res.blob();

                if (!isSubscribed) return;

                createdBlobUrl = URL.createObjectURL(blob);
                setBlobUrl(createdBlobUrl);
                setIsPdf(isPdfType);
                setLoading(false);
            })
            .catch((err) => {
                if (isSubscribed) {
                    setError(err.message || 'Failed to load preview');
                    setLoading(false);
                }
            });

        return () => {
            isSubscribed = false;
            if (createdBlobUrl) {
                URL.revokeObjectURL(createdBlobUrl);
            }
        };
    }, [url, token]);

    return (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group flex items-center justify-center">
            {loading ? (
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-slate-400">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
                    <span className="text-[11px] font-medium text-slate-500">Loading...</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center gap-1 p-3 text-center">
                    <Lock size={18} className="text-amber-500" />
                    <span className="text-[11px] font-medium text-slate-600 line-clamp-2">{error}</span>
                </div>
            ) : isPdf ? (
                <a
                    href={blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center text-slate-700 hover:text-blue-600 p-3 text-center transition-colors bg-slate-100 hover:bg-slate-200/70"
                    title="Open PDF document in new tab"
                >
                    <FileText size={26} className="text-red-500 mb-1" />
                    <span className="text-xs font-semibold">PDF Document</span>
                    <span className="text-[10px] text-blue-600 font-medium mt-0.5">Click to view</span>
                </a>
            ) : (
                <a
                    href={blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full cursor-pointer hover:opacity-95 transition-opacity"
                    title="Click to view full image in new tab"
                >
                    <img src={blobUrl} alt={alt} className="w-full h-full object-cover" />
                </a>
            )}

            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2.5 right-2.5 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white flex items-center justify-center shadow-lg transition-colors text-xs font-bold z-10"
                    title="Remove item"
                    aria-label="Remove item"
                >
                    &times;
                </button>
            )}
        </div>
    );
};

export default VerificationPreviewItem;
