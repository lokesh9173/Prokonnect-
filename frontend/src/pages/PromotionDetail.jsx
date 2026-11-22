import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, DollarSign, CheckCircle, Target, ArrowRight, Clock, XCircle, Send, X, Mail, Phone, Globe } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { getApiUrl } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user } = useUser();
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [pitchMessage, setPitchMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPromotionAndApplication = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/offers/${id}`), {
                    headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setPromotion(data);
                } else {
                    addToast('Failed to load promotion details', 'error');
                }

                // If logged in as an influencer, check application status
                if (user?.token && user?.role === 'influencer') {
                    const appRes = await fetch(getApiUrl('/api/applications/my'), {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (appRes.ok) {
                        const appData = await appRes.json();
                        const myApps = appData.applications || appData;
                        const match = myApps.find(a => {
                            const offerRef = a.offerId?._id || a.offerId;
                            return offerRef === id;
                        });
                        if (match) {
                            setApplication(match);
                        }
                    }
                }
            } catch (err) {
                addToast('An error occurred during fetch', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPromotionAndApplication();
    }, [id, user?.token, user?.role, addToast]);

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) {
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(getApiUrl(`/api/offers/${id}/apply`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ pitchMessage: pitchMessage.trim() })
            });

            const data = await res.json();
            if (res.ok) {
                addToast('Application submitted successfully! 🚀', 'success');
                setApplication(data.application || { status: 'pending', pitchMessage });
                setShowApplyModal(false);
                setPitchMessage('');
            } else {
                throw new Error(data.message || 'Failed to submit application');
            }
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const isOwner = user && promotion && promotion.businessId && (
        (promotion.businessId._id && promotion.businessId._id.toString() === user._id?.toString()) ||
        (promotion.businessId.toString() === user._id?.toString())
    );

    // Business contact details unlocked if accepted
    const businessContact = application?.status === 'accepted' ? (
        application.offerId?.businessId || promotion?.businessId
    ) : null;

    return (
        <DashboardLayout role={user?.role || 'influencer'}>
            <div className="max-w-4xl mx-auto pb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden min-h-[500px]">
                    {loading ? (
                        // Skeleton Loaders
                        <div className="animate-pulse p-8">
                            <div className="h-48 bg-slate-200 rounded-2xl mb-8 w-full"></div>
                            <div className="h-10 bg-slate-200 rounded mb-4 w-3/4"></div>
                            <div className="h-6 bg-slate-200 rounded mb-8 w-1/2"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                            </div>
                        </div>
                    ) : !promotion ? (
                        <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh]">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Promotion Not Found</h2>
                            <p className="text-slate-500">The promotion you are looking for does not exist.</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                            <div className="h-48 bg-gradient-to-r from-brand-600 to-indigo-600 shadow-inner flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                                <h1 className="text-white text-4xl font-black drop-shadow-md z-10 px-6 text-center">{promotion.title}</h1>
                            </div>

                            <div className="p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-100 pb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 border border-brand-100 font-bold text-xl uppercase shadow-sm overflow-hidden">
                                            {promotion.businessId?.profilePhoto ? (
                                                <img src={promotion.businessId.profilePhoto} alt={promotion.businessId?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                promotion.businessId?.name?.charAt(0) || 'B'
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">{promotion.businessId?.name || 'Unknown Business'}</h2>
                                            <p className="text-slate-500 font-medium capitalize">{promotion.category} Promotion</p>
                                        </div>
                                    </div>

                                    {/* Action Button Area */}
                                    <div className="w-full md:w-auto">
                                        {isOwner ? (
                                            <button
                                                onClick={() => navigate('/business-dashboard')}
                                                className="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                            >
                                                Manage in Dashboard <ArrowRight size={18} />
                                            </button>
                                        ) : application?.status === 'pending' ? (
                                            <div className="px-6 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm">
                                                <Clock size={18} className="text-amber-500" /> Application Pending
                                            </div>
                                        ) : application?.status === 'accepted' ? (
                                            <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm">
                                                <CheckCircle size={18} className="text-emerald-500" /> Application Accepted 🎉
                                            </div>
                                        ) : application?.status === 'rejected' ? (
                                            <div className="px-6 py-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm">
                                                <XCircle size={18} className="text-rose-500" /> Application Declined
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (user?.role === 'business') {
                                                        addToast('Business accounts cannot apply to campaigns', 'info');
                                                    } else {
                                                        setShowApplyModal(true);
                                                    }
                                                }}
                                                className="w-full md:w-auto px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                Apply Now <ArrowRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Unlocked Contact Info Card (If Accepted) */}
                                {application?.status === 'accepted' && businessContact && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 mb-8 shadow-sm"
                                    >
                                        <h3 className="text-emerald-900 font-bold text-lg flex items-center gap-2 mb-2">
                                            <CheckCircle size={20} className="text-emerald-600" /> Collaboration Unlocked!
                                        </h3>
                                        <p className="text-emerald-700 text-sm mb-4">
                                            Your application was accepted by <strong>{promotion.businessId?.name}</strong>. You can now coordinate your collaboration directly:
                                        </p>
                                        <div className="grid sm:grid-cols-3 gap-3">
                                            {businessContact.email && (
                                                <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-slate-800 text-sm">
                                                    <Mail size={16} className="text-emerald-600 shrink-0" />
                                                    <a href={`mailto:${businessContact.email}`} className="truncate font-semibold hover:text-brand-600">
                                                        {businessContact.email}
                                                    </a>
                                                </div>
                                            )}
                                            {businessContact.phone && (
                                                <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-slate-800 text-sm">
                                                    <Phone size={16} className="text-emerald-600 shrink-0" />
                                                    <span className="font-semibold">{businessContact.phone}</span>
                                                </div>
                                            )}
                                            {businessContact.website && (
                                                <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-slate-800 text-sm">
                                                    <Globe size={16} className="text-emerald-600 shrink-0" />
                                                    <a
                                                        href={businessContact.website.startsWith('http') ? businessContact.website : `https://${businessContact.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate font-semibold hover:text-brand-600"
                                                    >
                                                        {businessContact.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <Target size={20} className="text-brand-500" /> Campaign Description
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                {promotion.description || 'No description provided.'}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <CheckCircle size={20} className="text-green-500" /> Campaign Requirements
                                            </h3>
                                            <ul className="list-disc list-inside text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100 marker:text-brand-500">
                                                {promotion.requirements && promotion.requirements.length > 0 ? (
                                                    promotion.requirements.map((req, i) => (
                                                        <li key={i}>{req}</li>
                                                    ))
                                                ) : (
                                                    <li>Standard content creation guidelines apply.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl"><DollarSign size={24} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Budget / Compensation</p>
                                                <p className="text-2xl font-black text-slate-900">
                                                    {promotion.price && promotion.price > 0 ? `₹${(promotion.price * 83).toLocaleString()}` : (promotion.type === 'paid' ? 'Paid' : 'Barter / Collab')}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1 font-medium capitalize">Type: {promotion.type}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Building size={24} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Audience</p>
                                                <p className="text-xl font-bold text-slate-900 capitalize">{promotion.targetAudience || 'Everyone'}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 p-6 rounded-2xl mt-6 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-transparent"></div>
                                            <h4 className="text-white font-bold text-lg relative z-10">Ready to collaborate?</h4>
                                            <p className="text-slate-400 text-sm mt-2 relative z-10 w-4/5">Apply quickly and reach out to the brand for next steps.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Apply Pitch Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowApplyModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Apply to {promotion?.title}</h3>
                                    <p className="text-xs text-slate-500">Send your pitch to {promotion?.businessId?.name}</p>
                                </div>
                                <button
                                    onClick={() => setShowApplyModal(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Your Pitch / Proposal Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={pitchMessage}
                                        onChange={(e) => setPitchMessage(e.target.value)}
                                        placeholder="Describe why you're a great fit for this promotion, your content ideas, and your expected turnaround..."
                                        className="w-full p-4 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none bg-slate-50"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Your public profile portfolio will be attached automatically. Contact info is shared only upon approval.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowApplyModal(false)}
                                        className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50"
                                    >
                                        <Send size={15} /> {submitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default PromotionDetail;
