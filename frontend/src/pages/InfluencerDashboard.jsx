import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { getApiUrl } from '../config/api';
import { Search, Filter, TrendingUp, Tag, ArrowRight, Star, Heart, X, Sparkles, Zap, Coffee, ShoppingBag, Users, CheckCircle, Clock, XCircle, Mail, Phone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OFFER_GRADIENTS = [
    'from-brand-600/30 via-indigo-500/20 to-blue-500/20',
    'from-orange-500/30 via-amber-500/20 to-yellow-500/20',
    'from-pink-500/30 via-rose-500/20 to-red-500/20',
    'from-emerald-500/30 via-teal-500/20 to-cyan-500/20',
    'from-purple-500/30 via-violet-500/20 to-indigo-500/20',
    'from-gold-500/30 via-amber-500/20 to-orange-500/20',
];

const TYPE_BADGE = {
    paid: { label: 'Paid', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
    barter: { label: 'Barter', className: 'bg-brand-500/15 text-brand-400 border-brand-500/20' },
};

const SAMPLE_OFFERS = [
    { _id: 'sample-1', title: 'Summer Hotel Staycation', businessId: { name: 'Grand Hotel' }, type: 'barter', targetAudience: 'influencers', category: 'hotel', price: 0, description: 'Enjoy a 2-night stay at our luxury suite in exchange for 3 stories and 1 post.', business: 'Grand Hotel', logo: 'GH', gradient: OFFER_GRADIENTS[0], discount: 'Barter', for: 'Influencers' },
    { _id: 'sample-2', title: 'Fitness Brand Ambassador', businessId: { name: 'FitLife Gear' }, type: 'paid', targetAudience: 'students', category: 'brand', price: 500, description: 'Looking for fitness enthusiasts to promote our new summer collection.', business: 'FitLife Gear', logo: 'FL', gradient: OFFER_GRADIENTS[1], discount: '₹5,000', for: 'Students' },
    { _id: 'sample-3', title: 'New Cafe Launch Event', businessId: { name: 'Brew & Bean' }, type: 'barter', targetAudience: 'everyone', category: 'cafe', price: 0, description: 'Free coffee and brunch spread for content creators covering our launch.', business: 'Brew & Bean', logo: 'BB', gradient: OFFER_GRADIENTS[2], discount: 'Free Meal', for: 'Everyone' },
    { _id: 'sample-4', title: 'Tech Gadget Review', businessId: { name: 'TechNova' }, type: 'paid', targetAudience: 'influencers', category: 'brand', price: 1200, description: 'Review our latest noise-cancelling headphones on YouTube or Instagram Reels.', business: 'TechNova', logo: 'TN', gradient: OFFER_GRADIENTS[4], discount: '₹12,000', for: 'Influencers' },
    { _id: 'sample-5', title: 'Weekend Brunch Collab', businessId: { name: 'Sky Lounge' }, type: 'barter', targetAudience: 'influencers', category: 'cafe', price: 0, description: 'Premium weekend brunch for a couple in exchange for a styled photoshoot.', business: 'Sky Lounge', logo: 'SL', gradient: OFFER_GRADIENTS[5], discount: 'Free Brunch', for: 'Influencers' },
    { _id: 'sample-6', title: 'Fashion Collection Launch', businessId: { name: 'Luxe Threads' }, type: 'paid', targetAudience: 'influencers', category: 'brand', price: 800, description: 'Promote our exclusive summer collection with styled try-on content.', business: 'Luxe Threads', logo: 'LT', gradient: OFFER_GRADIENTS[3], discount: '₹8,000', for: 'Influencers' },
];

/* ── Skeleton Card ──────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-slate-900/60 rounded-2xl border border-white/[0.05] overflow-hidden animate-pulse">
        <div className="h-36 bg-slate-800/50" />
        <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-800/80 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded-lg w-1/2" />
            <div className="h-8 bg-slate-800/40 rounded-xl mt-4" />
            <div className="h-10 bg-slate-800/50 rounded-xl" />
        </div>
    </div>
);

/* ── Offer Card ─────────────────────────────────────── */
const OfferCard = ({ offer, onNavigate, onSave }) => {
    const badge = TYPE_BADGE[offer.type] || TYPE_BADGE.barter;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            onClick={() => onNavigate(offer._id || offer.id)}
            className="group bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-brand-500/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)]"
        >
            {/* Banner */}
            <div className={`h-36 bg-gradient-to-br ${offer.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${badge.className} backdrop-blur-sm`}>
                    <Tag size={8} />
                    {badge.label}
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onSave(); }}
                    className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-md rounded-full text-white/70 hover:text-red-400 hover:bg-black/50 transition-all duration-200 border border-white/10"
                >
                    <Heart size={14} />
                </button>

                <div className="absolute bottom-3 left-4 w-12 h-12 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white font-extrabold text-sm shadow-lg overflow-hidden">
                    {offer.logo}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 pt-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1 leading-snug">{offer.title}</h3>
                    <div className="flex items-center gap-1 bg-gold-500/10 px-2 py-0.5 rounded-lg border border-gold-500/20 flex-shrink-0">
                        <Star size={10} className="text-gold-400 fill-gold-400" />
                        <span className="text-gold-400 text-[10px] font-extrabold">4.8</span>
                    </div>
                </div>

                <p className="text-slate-500 text-xs font-medium mb-3">
                    {offer.business}
                    <span className="mx-1.5 text-slate-700">•</span>
                    <span className="text-brand-400">{offer.for}</span>
                </p>

                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 mb-4 group-hover:border-brand-500/20 transition-colors">
                    <div className="text-emerald-400 font-extrabold text-sm">{offer.discount}</div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">Limited Time</div>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(offer._id || offer.id); }}
                    className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-glow-brand transition-all duration-300 flex items-center justify-center gap-2 group-hover:-translate-y-0.5"
                >
                    View Details <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

/* ── Stat Badge ─────────────────────────────────────── */
const StatBadge = ({ label, value, color = '' }) => (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] ${color}`}>
        <div className="text-2xl font-black text-white">{value}</div>
        <div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</div>
        </div>
    </div>
);

/* ── Main Dashboard ─────────────────────────────────── */
const InfluencerDashboard = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const { user } = useUser();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [offers, setOffers] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch offers
                let data = [];
                if (user?.token) {
                    const res = await fetch(getApiUrl('/api/offers'), {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (res.ok) data = await res.json();
                }
                if (data.length > 0) {
                    setOffers(data.map((offer, i) => ({
                        ...offer,
                        business: offer.businessId?.name || 'Unknown Business',
                        logo: (offer.businessId?.name || 'B').substring(0, 2).toUpperCase(),
                        gradient: OFFER_GRADIENTS[i % OFFER_GRADIENTS.length],
                        discount: offer.price && offer.price > 0 ? `₹${(offer.price * 83).toLocaleString()}` : (offer.type === 'paid' ? 'Paid' : 'Barter'),
                        for: offer.targetAudience || 'Everyone'
                    })));
                } else {
                    setOffers(SAMPLE_OFFERS);
                }

                // Fetch influencer's applications
                if (user?.token) {
                    const appRes = await fetch(getApiUrl('/api/applications/my'), {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (appRes.ok) {
                        const appData = await appRes.json();
                        setMyApplications(appData.applications || appData || []);
                    }
                }
            } catch {
                setOffers(SAMPLE_OFFERS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const filteredOffers = offers.filter(offer => {
        let matchesCategory = true;
        if (filter === 'For Students') matchesCategory = offer.targetAudience === 'students';
        if (filter === 'Paid Gigs') matchesCategory = offer.type === 'paid';
        if (filter === 'Brand Collabs') matchesCategory = offer.category === 'brand';
        if (filter === 'Hotels & Cafe') matchesCategory = offer.category === 'hotel' || offer.category === 'cafe';
        const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (offer.business || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const FILTER_TABS = [
        { label: 'All', icon: <Sparkles size={12} /> },
        { label: 'My Applications', icon: <CheckCircle size={12} /> },
        { label: 'For Students', icon: <Users size={12} /> },
        { label: 'Paid Gigs', icon: <Zap size={12} /> },
        { label: 'Brand Collabs', icon: <ShoppingBag size={12} /> },
        { label: 'Hotels & Cafe', icon: <Coffee size={12} /> },
    ];

    const activeCollabsCount = myApplications.filter(a => a.status === 'accepted').length;

    return (
        <DashboardLayout role="influencer">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Welcome Banner ───────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-br from-brand-600/20 via-indigo-600/10 to-slate-900/80 border border-brand-500/20 rounded-2xl p-7 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping-slow" />
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Live Opportunities</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5">
                                Hello, {user?.name || 'Creator'}! 👋
                            </h1>
                            <p className="text-slate-400 text-sm font-medium">Discover the best collaborations waiting for you today.</p>
                        </div>

                        <div className="flex gap-4 shrink-0">
                            <StatBadge value={filteredOffers.length} label="Live Offers" />
                            <div className="w-px bg-white/[0.06]" />
                            <StatBadge value={activeCollabsCount} label="Active Collabs" color={activeCollabsCount > 0 ? 'border-emerald-500/30 bg-emerald-500/10' : ''} />
                        </div>
                    </div>
                </motion.div>

                {/* ── Section Content ───────────────────────── */}
                <div className="space-y-5">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                            <TrendingUp size={18} className="text-brand-400" />
                            {filter === 'My Applications' ? 'My Applications & Collaborations' : 'Featured Promotions'}
                        </h2>

                        <div className="flex gap-3">
                            {/* Search */}
                            {filter !== 'My Applications' && (
                                <div className="relative flex-1 md:flex-none">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                                    <input
                                        type="text" value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search offers..."
                                        className="w-full md:w-56 pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 text-white placeholder:text-slate-600 transition-all"
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Filter toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2.5 border rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
                                    showFilters
                                        ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
                                        : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
                                }`}
                            >
                                <Filter size={14} /> Filter Tabs
                                {filter !== 'All' && <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />}
                            </button>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <div className="flex gap-2 flex-wrap pb-2">
                                    {FILTER_TABS.map(({ label, icon }) => (
                                        <button
                                            key={label}
                                            onClick={() => setFilter(label)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                                                filter === label
                                                    ? 'bg-brand-600 border-brand-600 text-white shadow-glow-brand'
                                                    : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white'
                                            }`}
                                        >
                                            {icon} {label}
                                            {label === 'My Applications' && myApplications.length > 0 && (
                                                <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                                                    {myApplications.length}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content View: My Applications vs Offer Grid */}
                    {filter === 'My Applications' ? (
                        <div className="space-y-4">
                            {myApplications.length === 0 ? (
                                <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-white/[0.06] p-8">
                                    <div className="text-4xl mb-4">📬</div>
                                    <p className="text-slate-300 font-bold text-lg mb-1">No Applications Yet</p>
                                    <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                                        Browse the live promotions above and send your pitch to start working with brands.
                                    </p>
                                    <button
                                        onClick={() => setFilter('All')}
                                        className="px-6 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-colors"
                                    >
                                        Browse Promotions
                                    </button>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {myApplications.map((app) => {
                                        const offer = app.offerId || {};
                                        const business = offer.businessId || {};
                                        const isAccepted = app.status === 'accepted';
                                        const isPending = app.status === 'pending';
                                        const isRejected = app.status === 'rejected';

                                        return (
                                            <motion.div
                                                key={app._id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`bg-slate-900/60 backdrop-blur-sm rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                                                    isAccepted
                                                        ? 'border-emerald-500/40 shadow-[0_4px_25px_rgba(16,185,129,0.1)]'
                                                        : isPending
                                                        ? 'border-amber-500/30'
                                                        : 'border-white/[0.06]'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
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

                                                    <h3 className="font-bold text-white text-base mb-1 line-clamp-1">
                                                        {offer.title || 'Campaign Offer'}
                                                    </h3>
                                                    <p className="text-slate-400 text-xs font-medium mb-3">
                                                        {business.name || 'Brand Partner'} • <span className="capitalize">{offer.type || 'collab'}</span>
                                                    </p>

                                                    {app.pitchMessage && (
                                                        <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] mb-4 text-slate-300 text-xs italic">
                                                            "{app.pitchMessage}"
                                                        </div>
                                                    )}

                                                    {/* Unlocked Contact Details for Accepted Collabs */}
                                                    {isAccepted && business && (
                                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-emerald-300">
                                                            <div className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider mb-1">
                                                                Unlocked Contact:
                                                            </div>
                                                            {business.email && (
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <Mail size={12} className="shrink-0 text-emerald-400" />
                                                                    <a href={`mailto:${business.email}`} className="hover:underline truncate">{business.email}</a>
                                                                </div>
                                                            )}
                                                            {business.phone && (
                                                                <div className="flex items-center gap-2">
                                                                    <Phone size={12} className="shrink-0 text-emerald-400" />
                                                                    <span>{business.phone}</span>
                                                                </div>
                                                            )}
                                                            {business.website && (
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <Globe size={12} className="shrink-0 text-emerald-400" />
                                                                    <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                                                        {business.website}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/promotion/${offer._id || offer}`)}
                                                    className="w-full py-2.5 bg-white/[0.05] hover:bg-brand-600/20 border border-white/[0.08] hover:border-brand-500/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all mt-2"
                                                >
                                                    View Campaign <ArrowRight size={13} />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Offer Grid */
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {isLoading && [...Array(6)].map((_, i) => <SkeletonCard key={i} />)}

                            {!isLoading && filteredOffers.length === 0 && (
                                <div className="col-span-full py-16 text-center">
                                    <div className="text-4xl mb-4">🔍</div>
                                    <p className="text-slate-400 font-semibold mb-2">No offers found for "{filter}"</p>
                                    <button onClick={() => { setFilter('All'); setSearchTerm(''); }} className="text-brand-400 text-sm font-bold hover:text-brand-300 transition-colors">
                                        Clear filters →
                                    </button>
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {!isLoading && filteredOffers.map((offer) => (
                                    <OfferCard
                                        key={offer._id || offer.id}
                                        offer={offer}
                                        onNavigate={(id) => navigate(`/promotion/${id}`)}
                                        onSave={() => addToast('Saved to your list!', 'success')}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InfluencerDashboard;
