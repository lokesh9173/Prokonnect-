import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe, CheckCircle, Briefcase, Mail, Star, Users, ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { getApiUrl } from '../config/api';

// Mock Data Synced with InfluencerDashboard OFFERS
const BUSINESSES = [
    { id: 1, name: 'Grand Hotel', category: 'Hospitality', type: 'Stay', opportunities: 3, verified: true, desc: 'Luxury hotel chain offering premium staycations for influencers.', logo: 'bg-blue-100 text-blue-600', location: 'London, UK', website: 'grandhotel.com', employees: '500+' },
    { id: 2, name: 'Bistro 55', category: 'Food & Beverage', type: 'Dining', opportunities: 1, verified: true, desc: 'Authentic gourmet dining experience.', logo: 'bg-orange-100 text-orange-600', location: 'Paris, France', website: 'bistro55.fr', employees: '10-50' },
    { id: 3, name: 'FitLogic', category: 'Health & Fitness', type: 'Gym', opportunities: 5, verified: true, desc: 'Helping you achieve your fitness goals with state-of-the-art equipment.', logo: 'bg-red-100 text-red-600', location: 'New York, USA', website: 'fitlogic.com', employees: '50-200' },
    { id: 4, name: 'GadgetZone', category: 'Technology', type: 'Retail', opportunities: 2, verified: true, desc: 'The latest tech gadgets and reviews.', logo: 'bg-slate-200 text-slate-600', location: 'San Francisco, CA', website: 'gadgetzone.io', employees: '100+' },
    { id: 5, name: 'StyleCo', category: 'Fashion', type: 'Brand', opportunities: 4, verified: true, desc: 'Define your style with our exclusive collections.', logo: 'bg-purple-100 text-purple-600', location: 'Milan, Italy', website: 'styleco.it', employees: '200+' },
    { id: 6, name: 'CodeNow', category: 'Education', type: 'Bootcamp', opportunities: 2, verified: false, desc: 'Learn to code in 12 weeks.', logo: 'bg-indigo-100 text-indigo-600', location: 'Remote', website: 'codenow.edu', employees: '10-50' },
    { id: 7, name: 'Club Zenith', category: 'Entertainment', type: 'Nightclub', opportunities: 1, verified: true, desc: 'Premier nightlife destination.', logo: 'bg-pink-100 text-pink-600', location: 'Miami, USA', website: 'clubzenith.com', employees: '50-100' },
    { id: 8, name: 'GlowUp', category: 'Beauty', type: 'Cosmetics', opportunities: 3, verified: true, desc: 'Clean beauty for everyone.', logo: 'bg-rose-100 text-rose-600', location: 'Seoul, South Korea', website: 'glowup.kr', employees: '100+' },
];

const BusinessDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user } = useUser();

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusiness = async () => {
            // First check if the id is a mock numeric ID
            const numericId = parseInt(id, 10);
            if (!isNaN(numericId) && numericId.toString() === id) {
                const mock = BUSINESSES.find(b => b.id === numericId);
                if (mock) {
                    setBusiness(mock);
                    setLoading(false);
                    return;
                }
            }

            // Otherwise, fetch from live backend API
            try {
                const res = await fetch(getApiUrl(`/api/users/${id}`), {
                    headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
                });
                const data = await res.json();
                if (res.ok && data) {
                    const colors = [
                        'bg-blue-100 text-blue-600',
                        'bg-orange-100 text-orange-600',
                        'bg-purple-100 text-purple-600',
                        'bg-emerald-100 text-emerald-600',
                        'bg-indigo-100 text-indigo-600'
                    ];
                    const seedIndex = data.name ? data.name.charCodeAt(0) : 0;
                    setBusiness({
                        id: data._id,
                        name: data.name,
                        category: data.niche || 'Business',
                        type: data.title || 'Brand',
                        verified: true,
                        desc: data.bio || 'Collaborating with authentic voices to create impactful brand experiences.',
                        logo: colors[seedIndex % colors.length],
                        profilePhoto: data.profilePhoto || '',
                        location: data.location || 'Location Not Specified',
                        website: data.website || '',
                        employees: 'Verified Partner'
                    });
                } else {
                    setBusiness(null);
                }
            } catch (err) {
                setBusiness(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBusiness();
    }, [id, user?.token]);

    if (loading) {
        return (
            <DashboardLayout role={user?.role || 'influencer'}>
                <div className="flex justify-center items-center py-20 min-h-[50vh]">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-brand-600 animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!business) {
        return (
            <DashboardLayout role={user?.role || 'influencer'}>
                <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh]">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <ArrowLeft size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Business Not Found</h2>
                    <p className="text-slate-500 mb-6">The business you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate(-1)} className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors">Go Back</button>
                </div>
            </DashboardLayout>
        );
    }

    const handleConnect = () => {
        addToast(`Connection request sent to ${business.name}!`, 'success');
    };

    return (
        <DashboardLayout role={user?.role || 'influencer'}>
            <div className="max-w-5xl mx-auto pb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className={`h-48 bg-gradient-to-r ${business.logo.includes('bg-') ? business.logo.replace('text-', 'from-white/10 to-').replace('100', '500') : 'from-slate-700 to-slate-900'}`}>
                        <div className="w-full h-full bg-black/10"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-8 gap-4">
                            <div className="flex items-end gap-6">
                                <div className={`w-32 h-32 rounded-3xl border-8 border-white shadow-xl flex items-center justify-center text-5xl font-bold uppercase ${business.logo} shrink-0 overflow-hidden`}>
                                    {business.profilePhoto ? (
                                        <img src={business.profilePhoto} alt={business.name} className="w-full h-full object-cover" />
                                    ) : (
                                        business.name.charAt(0)
                                    )}
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-2">
                                        {business.name}
                                        {business.verified && <CheckCircle size={28} className="text-blue-500 fill-white" />}
                                    </h1>
                                    <p className="text-slate-500 text-lg font-medium">{business.category} • {business.type}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-2 w-full md:w-auto">
                                <button
                                    onClick={() => navigate('/messages')}
                                    className="flex-1 md:flex-none px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Message
                                </button>
                                <button
                                    onClick={handleConnect}
                                    className="flex-1 md:flex-none px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
                                >
                                    Connect
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">About {business.name}</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg">{business.desc}</p>
                                    <p className="text-slate-600 leading-relaxed mt-4">
                                        We are committed to excellence and providing top-tier experiences.
                                        Collaborating with authentic voices is key to our strategy.
                                        Join us to create something amazing.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Star className="text-gold-500 fill-gold-500" /> Active Opportunities
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-5 border border-slate-200 rounded-2xl hover:border-brand-300 hover:shadow-md cursor-pointer transition-all bg-white group">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors">Brand Ambassador</h4>
                                                    <p className="text-slate-500">Long-term Partnership • Paid Campaign</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">Company Info</h4>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <MapPin size={18} className="text-slate-400" />
                                        <span>{business.location}</span>
                                    </div>
                                    {business.website && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Globe size={18} className="text-slate-400" />
                                            <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
                                                {business.website}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Users size={18} className="text-slate-400" />
                                        <span>{business.employees || 'Verified Company'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BusinessDetail;
