import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { getApiUrl } from '../config/api';
import {
    Plus, Users, Search, Filter, Megaphone, Tag, MapPin, Calendar,
    ArrowRight, X, Zap, TrendingUp, Eye, MousePointer, Sparkles, ChevronRight,
    CheckCircle, XCircle, Clock, Mail, Phone, Globe, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AVATAR_GRADIENTS = [
    'from-brand-500 to-indigo-600',
    'from-rose-500 to-pink-600',
    'from-orange-400 to-amber-500',
    'from-emerald-400 to-teal-500',
    'from-purple-500 to-violet-600',
    'from-cyan-400 to-blue-500',
];

const BusinessDashboard = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const { user } = useUser();
    const [showPostModal, setShowPostModal] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [influencers, setInfluencers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNiche, setSelectedNiche] = useState('All');

    // Applicants Modal State
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Edit Campaign State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [editSaving, setEditSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const [promoRes, userRes] = await Promise.all([
                    fetch(getApiUrl('/api/offers/my'), { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch(getApiUrl('/api/users?role=influencer'), { headers: { Authorization: `Bearer ${user.token}` } }),
                ]);
                const promoData = await promoRes.json();
                if (promoRes.ok) {
                    setPromotions(promoData.map(p => ({
                        ...p,
                        active: p.status === 'active',
                        analytics: { views: Math.floor(Math.random() * 2000), clicks: Math.floor(Math.random() * 500) }
                    })));
                }
                const userData = await userRes.json();
                if (userRes.ok) {
                    setInfluencers(userData.map((u, i) => ({
                        ...u,
                        id: u._id,
                        gradient: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                        followers: u.followers || '1K+',
                        engagement: '5.0%',
                    })));
                }
            } catch (error) {
                console.error(error);
                addToast('Error loading dashboard data', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, addToast]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const uiType = formData.get('type');
            let backendType = 'barter';
            if (uiType === 'Paid Collab') backendType = 'paid';
            const newOffer = {
                title: formData.get('title'),
                type: backendType,
                category: formData.get('category')?.toLowerCase() || 'other',
                targetAudience: formData.get('targetAudience')?.toLowerCase() || 'everyone',
                description: formData.get('description'),
                price: formData.get('price') || 0,
                requirements: []
            };
            const res = await fetch(getApiUrl('/api/offers'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(newOffer)
            });
            const savedOffer = await res.json();
            if (res.ok) {
                setPromotions(prev => [{ ...savedOffer, active: true, analytics: { views: 0, clicks: 0 } }, ...prev]);
                setShowPostModal(false);
                addToast('Promotion posted successfully! 🚀', 'success');
            } else throw new Error(savedOffer.message || 'Failed');
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const handleOpenEditModal = (promo) => {
        setEditingPromo({
            ...promo,
            uiType: promo.type === 'paid' ? 'Paid Collab' : 'Freebie / Perk'
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingPromo) return;
        setEditSaving(true);
        try {
            const formData = new FormData(e.target);
            const uiType = formData.get('type');
            let backendType = 'barter';
            if (uiType === 'Paid Collab') backendType = 'paid';

            const updatedData = {
                title: formData.get('title'),
                type: backendType,
                category: formData.get('category')?.toLowerCase() || 'other',
                targetAudience: formData.get('targetAudience')?.toLowerCase() || 'everyone',
                description: formData.get('description'),
                price: Number(formData.get('price')) || 0
            };

            const promoId = editingPromo._id || editingPromo.id;
            const res = await fetch(getApiUrl(`/api/offers/${promoId}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(updatedData)
            });

            const saved = await res.json();
            if (res.ok) {
                setPromotions(prev => prev.map(p => {
                    if ((p._id || p.id) === promoId) {
                        return { ...p, ...saved };
                    }
                    return p;
                }));
                setShowEditModal(false);
                setEditingPromo(null);
                addToast('Campaign updated successfully! ✨', 'success');
            } else {
                throw new Error(saved.message || 'Failed to update campaign');
            }
        } catch (err) {
            addToast(err.message || 'Error updating campaign', 'error');
        } finally {
            setEditSaving(false);
        }
    };

    const handleDeleteCampaign = async (promo) => {
        const promoId = promo._id || promo.id;
        if (!window.confirm(`Are you sure you want to delete "${promo.title}"?`)) {
            return;
        }

        try {
            const res = await fetch(getApiUrl(`/api/offers/${promoId}`), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (res.ok) {
                setPromotions(prev => prev.filter(p => (p._id || p.id) !== promoId));
                addToast('Campaign deleted successfully', 'success');
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete campaign');
            }
        } catch (err) {
            addToast(err.message || 'Error deleting campaign', 'error');
        }
    };

    const openApplicantsModal = async (promo) => {
        setSelectedPromo(promo);
        setShowApplicantsModal(true);
        setLoadingApplicants(true);
        try {
            const res = await fetch(getApiUrl(`/api/offers/${promo._id || promo.id}/applications`), {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setApplicants(data.applications || []);
            } else {
                throw new Error(data.message || 'Failed to load applicants');
            }
        } catch (err) {
            addToast(err.message, 'error');
            setApplicants([]);
        } finally {
            setLoadingApplicants(false);
        }
    };

    const handleUpdateStatus = async (applicationId, newStatus) => {
        setActionLoadingId(applicationId);
        try {
            const res = await fetch(getApiUrl(`/api/applications/${applicationId}/status`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (res.ok) {
                addToast(`Application marked as ${newStatus}!`, 'success');
                setApplicants(prev => prev.map(app => {
                    if (app._id === applicationId) {
                        return {
                            ...app,
                            status: newStatus,
                            influencer: data.application?.influencer || app.influencer
                        };
                    }
                    return app;
                }));
            } else {
                throw new Error(data.message || 'Failed to update application');
            }
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredInfluencers = influencers.filter(influencer => {
        const matchesSearch = (influencer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (influencer.niche || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNiche = selectedNiche === 'All' || influencer.niche === selectedNiche;
        return matchesSearch && matchesNiche;
    });

    const categories = ['All', ...new Set(influencers.map(i => i.niche).filter(Boolean))];

    // Quick Stats
    const totalViews = promotions.reduce((s, p) => s + (p.analytics?.views || 0), 0);
    const totalClicks = promotions.reduce((s, p) => s + (p.analytics?.clicks || 0), 0);

    return (
        <DashboardLayout role="business">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Welcome Banner ─────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-br from-indigo-600/20 via-brand-600/10 to-slate-900/80 border border-brand-500/20 rounded-2xl p-7 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping-slow" />
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Business Dashboard</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5">
                                Welcome back, {user?.name || 'Business'}! 🏢
                            </h1>
                            <p className="text-slate-400 text-sm font-medium">Manage your promotions and discover your next brand partner.</p>
                        </div>

                        <button
                            onClick={() => setShowPostModal(true)}
                            className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-glow-brand hover:-translate-y-0.5 transition-all duration-300 text-sm shrink-0"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            Create Promotion
                        </button>
                    </div>
                </motion.div>

                {/* ── Stats Cards ─────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Active Promotions', value: promotions.filter(p => p.active).length, icon: <Megaphone size={18} />, color: 'from-brand-500 to-indigo-600' },
                        { label: 'Total Reach', value: `${(totalViews / 1000).toFixed(1)}K`, icon: <Eye size={18} />, color: 'from-accent-400 to-pink-500' },
                        { label: 'Total Clicks', value: totalClicks, icon: <MousePointer size={18} />, color: 'from-orange-400 to-amber-500' },
                        { label: 'Influencer Partners', value: influencers.length, icon: <Users size={18} />, color: 'from-emerald-400 to-teal-500' },
                    ].map(({ label, value, icon, color }) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-5 hover:border-white/15 transition-all duration-300 group"
                        >
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                                {icon}
                            </div>
                            <div className="text-2xl font-black text-white mb-0.5">{value}</div>
                            <div className="text-slate-500 text-xs font-semibold">{label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* ── Left: Promotions + Influencers ──── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Active Promotions */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Megaphone size={18} className="text-brand-400" /> Active Promotions
                                </h2>
                                <button
                                    onClick={() => {
                                        if (promotions.length > 0) openApplicantsModal(promotions[0]);
                                    }}
                                    className="text-brand-400 font-bold text-xs hover:text-brand-300 transition-colors uppercase tracking-wider"
                                >
                                    Review All Applications →
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {isLoading && [...Array(2)].map((_, i) => (
                                    <div key={i} className="bg-slate-900/60 rounded-2xl border border-white/[0.05] h-40 animate-pulse" />
                                ))}
                                {!isLoading && promotions.length === 0 && (
                                    <div className="col-span-2 py-12 text-center bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.08]">
                                        <Megaphone size={28} className="text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-500 font-semibold mb-1">No promotions yet</p>
                                        <p className="text-slate-600 text-sm">Create your first promotion to get started</p>
                                        <button onClick={() => setShowPostModal(true)} className="mt-4 px-5 py-2 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-colors">
                                            + Create Now
                                        </button>
                                    </div>
                                )}
                                {promotions.map((promo) => (
                                    <motion.div
                                        key={promo._id || promo.id}
                                        whileHover={{ y: -3 }}
                                        className="bg-slate-900/60 border border-white/[0.06] hover:border-brand-500/30 rounded-2xl p-5 transition-all duration-300 group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                                    promo.active
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-slate-700/50 text-slate-500 border-slate-700/50'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${promo.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                                    {promo.active ? 'Live' : 'Ended'}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleOpenEditModal(promo)}
                                                        className="text-slate-500 hover:text-amber-400 transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
                                                        title="Edit Campaign"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCampaign(promo)}
                                                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
                                                        title="Delete Campaign"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/promotion/${promo._id || promo.id}`)}
                                                        className="text-slate-600 hover:text-brand-400 transition-colors p-1"
                                                        title="View Public Promotion Page"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-brand-300 transition-colors line-clamp-1">{promo.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium capitalize mb-4">{promo.type} • {promo.category} • {promo.targetAudience}</p>

                                            <div className="flex items-center gap-4 pt-3 border-t border-white/[0.05]">
                                                <div>
                                                    <div className="text-lg font-black text-white">{promo.analytics?.views?.toLocaleString() || 0}</div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-600">Views</div>
                                                </div>
                                                <div className="w-px h-8 bg-white/[0.06]" />
                                                <div>
                                                    <div className="text-lg font-black text-white">{promo.analytics?.clicks?.toLocaleString() || 0}</div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-600">Clicks</div>
                                                </div>
                                                <div className="ml-auto">
                                                    <div className="text-sm font-black text-brand-400">
                                                        {promo.analytics?.views > 0
                                                            ? `${((promo.analytics.clicks / promo.analytics.views) * 100).toFixed(1)}%`
                                                            : '0%'}
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-600">CTR</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* View Applicants Action */}
                                        <button
                                            onClick={() => openApplicantsModal(promo)}
                                            className="mt-4 w-full py-2.5 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 hover:border-brand-500/40 rounded-xl text-xs font-bold text-brand-300 hover:text-white flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Users size={14} className="text-brand-400" />
                                            View Applicants
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Influencer Discovery */}
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users size={18} className="text-accent-400" /> Find Partners
                                </h2>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                                    <input
                                        type="text" value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search influencers..."
                                        className="pl-10 pr-4 py-2.5 w-full md:w-56 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Niche pills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedNiche(cat)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                            selectedNiche === cat
                                                ? 'bg-brand-600 border-brand-600 text-white shadow-glow-brand'
                                                : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Influencer list */}
                            <div className="bg-slate-900/40 rounded-2xl border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden max-h-[500px] overflow-y-auto dark-scrollbar">
                                {filteredInfluencers.length > 0 ? filteredInfluencers.map((inf) => (
                                    <motion.div
                                        key={inf.id}
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        onClick={() => navigate(`/influencer/${inf.id}`)}
                                        className="p-4 flex items-center gap-4 cursor-pointer transition-colors group"
                                    >
                                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${inf.gradient} flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-lg`}>
                                            {inf.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white text-sm truncate group-hover:text-brand-300 transition-colors">{inf.name}</h4>
                                                {inf.verified && (
                                                    <span className="bg-brand-500/20 text-brand-400 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider border border-brand-500/20">Verified</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{inf.niche} • {inf.platform}</p>
                                        </div>
                                        <div className="text-right hidden sm:block px-4">
                                            <div className="font-bold text-white text-sm">{inf.followers}</div>
                                            <div className="text-[10px] text-slate-600 font-medium">Followers</div>
                                        </div>
                                        <button className="px-3 py-1.5 border border-brand-500/30 text-brand-400 font-bold text-xs rounded-lg hover:bg-brand-500/10 hover:border-brand-500/50 transition-all flex-shrink-0">
                                            View
                                        </button>
                                    </motion.div>
                                )) : (
                                    <div className="p-10 text-center">
                                        <Users size={24} className="text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-500 font-semibold text-sm">No influencers found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column ────────────────────────── */}
                    <div className="space-y-5">
                        {/* Total Reach Card */}
                        <div className="relative bg-gradient-to-br from-brand-600/30 via-indigo-600/20 to-slate-900/80 border border-brand-500/25 rounded-2xl p-6 overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
                            <TrendingUp size={18} className="text-brand-400 mb-3" />
                            <h3 className="font-bold text-white mb-1">Total Reach</h3>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 mb-1">
                                {totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews}
                            </div>
                            <div className="text-slate-400 text-sm">Across all active promotions</div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-5">
                            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                <Sparkles size={14} className="text-brand-400" /> Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    {
                                        label: 'Review Applications',
                                        icon: <Tag size={16} className="text-brand-400" />,
                                        onClick: () => {
                                            if (promotions.length > 0) openApplicantsModal(promotions[0]);
                                            else addToast('Create a promotion first to review applications', 'info');
                                        }
                                    },
                                    { label: 'Schedule Content', icon: <Calendar size={16} className="text-accent-400" />, onClick: () => addToast('Opening scheduler...', 'info') },
                                    { label: 'Update Locations', icon: <MapPin size={16} className="text-emerald-400" />, onClick: () => addToast('Opening location manager...', 'info') },
                                ].map(({ label, icon, onClick }) => (
                                    <button
                                        key={label}
                                        onClick={onClick}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-semibold group"
                                    >
                                        {icon}
                                        {label}
                                        <ChevronRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-gradient-to-br from-gold-500/10 to-orange-500/5 border border-gold-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-gold-400" />
                                <span className="text-gold-400 text-xs font-extrabold uppercase tracking-widest">Pro Tip</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Promotions with clear value (e.g. <span className="text-white font-bold">₹5,000 campaign</span>) get <span className="text-gold-400 font-bold">3x more</span> influencer applications.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Applicants Review Modal ─────────────────────── */}
            <AnimatePresence>
                {showApplicantsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowApplicantsModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-[#0F1929] border border-white/[0.08] w-full max-w-2xl rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
                                        <Users size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white">
                                            Applicants: {selectedPromo?.title}
                                        </h2>
                                        <p className="text-xs text-slate-400">
                                            {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'} submitted
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowApplicantsModal(false)}
                                    className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto space-y-4 dark-scrollbar">
                                {loadingApplicants ? (
                                    <div className="py-12 flex justify-center items-center">
                                        <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin" />
                                    </div>
                                ) : applicants.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Users size={32} className="text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-300 font-bold mb-1">No applicants yet</p>
                                        <p className="text-slate-500 text-sm">
                                            Creators will appear here as soon as they submit applications for this promotion.
                                        </p>
                                    </div>
                                ) : (
                                    applicants.map((app) => {
                                        const inf = app.influencer || {};
                                        const isPending = app.status === 'pending';
                                        const isAccepted = app.status === 'accepted';
                                        const isRejected = app.status === 'rejected';

                                        return (
                                            <div
                                                key={app._id}
                                                className={`p-5 rounded-2xl border transition-all ${
                                                    isAccepted
                                                        ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                                                        : isPending
                                                        ? 'bg-white/[0.02] border-white/[0.08]'
                                                        : 'bg-white/[0.01] border-white/[0.04] opacity-75'
                                                }`}
                                            >
                                                {/* Top Row: Influencer Profile info & Status */}
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-sm shrink-0 overflow-hidden">
                                                            {inf.profilePhoto ? (
                                                                <img src={inf.profilePhoto} alt={inf.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                inf.name?.charAt(0) || 'I'
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-white text-sm">{inf.name}</h4>
                                                                <span className="text-[10px] text-slate-500">• {new Date(app.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-400">
                                                                {inf.niche || 'Creator'} • {inf.platform || 'Instagram'} • <span className="text-brand-300 font-semibold">{inf.followers || '1K+'} followers</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                                        isAccepted
                                                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                            : isPending
                                                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                                    }`}>
                                                        {isAccepted && <CheckCircle size={10} />}
                                                        {isPending && <Clock size={10} />}
                                                        {isRejected && <XCircle size={10} />}
                                                        {app.status}
                                                    </span>
                                                </div>

                                                {/* Pitch Message */}
                                                {app.pitchMessage && (
                                                    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] mb-3 text-xs text-slate-300 italic">
                                                        "{app.pitchMessage}"
                                                    </div>
                                                )}

                                                {/* Public metrics */}
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {inf.postReach && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-[10px] text-slate-400 font-medium border border-white/[0.05]">
                                                            Avg Reach: {inf.postReach}
                                                        </span>
                                                    )}
                                                    {inf.engagementRate && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-[10px] text-slate-400 font-medium border border-white/[0.05]">
                                                            Engagement: {inf.engagementRate}
                                                        </span>
                                                    )}
                                                    {inf.city && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-[10px] text-slate-400 font-medium border border-white/[0.05]">
                                                            📍 {inf.city}{inf.country ? `, ${inf.country}` : ''}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Unlocked Contact Details (ONLY if Accepted) */}
                                                {isAccepted && (inf.email || inf.phone || inf.website) && (
                                                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 mb-3 space-y-1.5 text-xs text-emerald-300">
                                                        <div className="font-bold text-emerald-400 text-[10px] uppercase tracking-wider mb-1">
                                                            Unlocked Direct Contact:
                                                        </div>
                                                        {inf.email && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail size={12} className="text-emerald-400 shrink-0" />
                                                                <a href={`mailto:${inf.email}`} className="hover:underline">{inf.email}</a>
                                                            </div>
                                                        )}
                                                        {inf.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone size={12} className="text-emerald-400 shrink-0" />
                                                                <span>{inf.phone}</span>
                                                            </div>
                                                        )}
                                                        {inf.website && (
                                                            <div className="flex items-center gap-2">
                                                                <Globe size={12} className="text-emerald-400 shrink-0" />
                                                                <a href={inf.website.startsWith('http') ? inf.website : `https://${inf.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                                    {inf.website}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Buttons for Pending Applicants */}
                                                {isPending && (
                                                    <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.05]">
                                                        <button
                                                            disabled={actionLoadingId === app._id}
                                                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                                            className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                                                        >
                                                            Decline
                                                        </button>
                                                        <button
                                                            disabled={actionLoadingId === app._id}
                                                            onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                                            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                                        >
                                                            <CheckCircle size={13} />
                                                            {actionLoadingId === app._id ? 'Updating...' : 'Accept & Unlock Contact'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Create Promotion Modal ─────────────────────── */}
            <AnimatePresence>
                {showPostModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPostModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-[#0F1929] border border-white/[0.08] w-full max-w-lg rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
                                        <Plus size={16} className="text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Create New Promotion</h2>
                                </div>
                                <button onClick={() => setShowPostModal(false)} className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleCreatePost} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto dark-scrollbar">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Promotion Title</label>
                                    <input
                                        type="text" name="title" required placeholder="e.g. Summer Staycation for Influencers"
                                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Category', name: 'category', options: ['Hotel', 'Cafe', 'Brand', 'Other'] },
                                        { label: 'Type', name: 'type', options: ['Discount Offer', 'Freebie / Perk', 'Paid Collab', 'Event Invite'] },
                                        { label: 'Target Audience', name: 'targetAudience', options: ['Students', 'Influencers', 'Everyone'] },
                                    ].map(({ label, name, options }) => (
                                        <div key={name} className={name === 'targetAudience' ? 'col-span-2 sm:col-span-1' : ''}>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
                                            <select name={name} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-all appearance-none">
                                                {options.map(o => <option key={o} value={o.toLowerCase()} className="bg-slate-900">{o}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Value / Price (₹)</label>
                                        <input
                                            type="number" name="price" placeholder="0"
                                            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Details & Requirements</label>
                                    <textarea
                                        name="description" required placeholder="Describe what you're offering and what you expect from the creator..."
                                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-all h-28 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button" onClick={() => setShowPostModal(false)}
                                        className="px-5 py-2.5 text-slate-400 font-bold text-sm hover:text-white hover:bg-white/[0.06] rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-glow-brand transition-all hover:-translate-y-0.5"
                                    >
                                        Post Promotion 🚀
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Edit Promotion Modal ───────────────────────── */}
            <AnimatePresence>
                {showEditModal && editingPromo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-[#0F1929] border border-white/[0.08] w-full max-w-lg rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                        <Edit size={16} className="text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Edit Campaign</h2>
                                </div>
                                <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSaveEdit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto dark-scrollbar">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Campaign Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        defaultValue={editingPromo.title}
                                        placeholder="e.g. Summer Staycation for Influencers"
                                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            name="category"
                                            defaultValue={(editingPromo.category || 'other').toLowerCase()}
                                            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all appearance-none"
                                        >
                                            {['Fashion', 'Gaming', 'Hotel', 'Cafe', 'Tech', 'Brand', 'Other'].map(o => (
                                                <option key={o} value={o.toLowerCase()} className="bg-slate-900">{o}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Type</label>
                                        <select
                                            name="type"
                                            defaultValue={editingPromo.type === 'paid' ? 'Paid Collab' : 'Freebie / Perk'}
                                            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all appearance-none"
                                        >
                                            {['Paid Collab', 'Freebie / Perk', 'Discount Offer', 'Event Invite'].map(o => (
                                                <option key={o} value={o} className="bg-slate-900">{o}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Target Audience</label>
                                        <select
                                            name="targetAudience"
                                            defaultValue={(editingPromo.targetAudience || 'everyone').toLowerCase()}
                                            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all appearance-none"
                                        >
                                            {['Students', 'Influencers', 'Everyone'].map(o => (
                                                <option key={o} value={o.toLowerCase()} className="bg-slate-900">{o}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Value / Budget (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            defaultValue={editingPromo.price || 0}
                                            placeholder="0"
                                            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Details & Requirements</label>
                                    <textarea
                                        name="description"
                                        required
                                        defaultValue={editingPromo.description}
                                        placeholder="Describe what you're offering and what you expect from the creator..."
                                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 transition-all h-28 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-5 py-2.5 text-slate-400 font-bold text-sm hover:text-white hover:bg-white/[0.06] rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editSaving}
                                        className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        {editSaving ? 'Saving...' : 'Save Changes ✨'}
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

export default BusinessDashboard;
