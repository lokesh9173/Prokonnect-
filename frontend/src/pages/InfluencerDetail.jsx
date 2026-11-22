import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Instagram, Youtube, Twitter, CheckCircle, Zap, UserCheck, TrendingUp, Users, Globe, Linkedin } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';

// Mock Data
const INFLUENCERS = [
    { id: 1, name: 'Sarah Jenkins', niche: 'Fashion', data: { followers: '125K', engagement: '4.8%' }, platform: 'Instagram', verified: true, avatar: 'bg-pink-100 text-pink-600', location: 'Los Angeles, USA', bio: 'Fashion enthusiast and lifestyle content creator. I love helping brands tell their story through aesthetic visuals.' },
    { id: 2, name: 'Mike Tech', niche: 'Technology', data: { followers: '450K', engagement: '3.2%' }, platform: 'YouTube', verified: true, avatar: 'bg-red-100 text-red-600', location: 'Austin, TX', bio: 'Tech reviewer covering the latest gadgets, software, and AI tools. Unboxing and deep-dive reviews.' },
    { id: 3, name: 'Yoga with Anna', niche: 'Health & Fitness', data: { followers: '85K', engagement: '6.5%' }, platform: 'Instagram', verified: false, avatar: 'bg-green-100 text-green-600', location: 'Bali, Indonesia', bio: 'Certified Yoga instructor sharing daily flows, wellness tips, and healthy recipes.' },
    { id: 4, name: 'David Design', niche: 'Design', data: { followers: '25K', engagement: '8.1%' }, platform: 'Twitter', verified: true, avatar: 'bg-blue-100 text-blue-600', location: 'Berlin, Germany', bio: 'UI/UX Designer sharing design tips, resources, and career advice for junior designers.' },
    { id: 5, name: 'Travel Tom', niche: 'Travel', data: { followers: '210K', engagement: '5.0%' }, platform: 'Instagram', verified: true, avatar: 'bg-orange-100 text-orange-600', location: 'Nomad / World', bio: 'Full-time traveler capturing the beauty of the world. Available for hotel and tourism board collaborations.' },
];

const InfluencerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user } = useUser();
    const [influencer, setInfluencer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfluencer = async () => {
            // First check if the id is a mock numeric ID
            const numericId = parseInt(id);
            if (!isNaN(numericId) && numericId.toString() === id) {
                const mock = INFLUENCERS.find(i => i.id === numericId);
                if (mock) {
                    setInfluencer(mock);
                    setLoading(false);
                    return;
                }
            }

            // Otherwise, fetch from DB
            try {
                const res = await fetch(`/api/users/${id}`, {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    const colors = ['bg-pink-100 text-pink-600', 'bg-red-100 text-red-600', 'bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600'];
                    const seedIndex = data.name ? data.name.charCodeAt(0) : 0;
                    setInfluencer({
                        ...data,
                        id: data._id,
                        followers: data.followers || '1K+',
                        engagement: '5.0%',
                        avatar: colors[seedIndex % colors.length],
                        data: {
                            followers: data.followers || '1K+',
                            engagement: '5.0%'
                        }
                    });
                } else {
                    throw new Error(data.message || 'Influencer not found');
                }
            } catch (err) {
                addToast(err.message || 'Error loading influencer profile', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchInfluencer();
    }, [id, user, addToast]);

    if (loading) {
        return (
            <DashboardLayout role="business">
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!influencer) {
        return (
            <DashboardLayout role="business">
                <div className="p-10 text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Influencer Not Found</h2>
                    <button onClick={() => navigate('/business-dashboard')} className="mt-4 text-blue-600 hover:underline">Go Back</button>
                </div>
            </DashboardLayout>
        );
    }

    const PlatformIcon = {
        'Instagram': Instagram,
        'YouTube': Youtube,
        'Twitter': Twitter
    }[influencer.platform] || Zap;

    const handleShortlist = () => {
        addToast(`${influencer.name} has been shortlisted!`, 'success');
    };

    const handleContact = () => {
        addToast(`Message sent to ${influencer.name}!`, 'success');
    };

    return (
        <DashboardLayout role="business">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/business-dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-blue-50 to-violet-50"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-6 gap-4">
                            <div className={`w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold uppercase shrink-0 ${influencer.avatar}`}>
                                {influencer.name.charAt(0)}
                            </div>
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleShortlist}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Shortlist
                                </button>
                                {influencer.phone && (
                                    <a
                                        href={`https://wa.me/${influencer.phone.replace(/[^\d]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.284 3.508 8.49-.004 6.66-5.34 11.999-11.95 11.999-2.005-.002-3.975-.496-5.74-1.442L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.12 .94 11.49.94c-5.44 0-9.862 4.371-9.866 9.8-.001 1.77.463 3.5 1.34 5.042L1.87 20.31l4.777-1.156z"/>
                                        </svg>
                                        WhatsApp
                                    </a>
                                )}
                                <button
                                    onClick={handleContact}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
                                >
                                    Contact
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                                {influencer.name}
                                {influencer.verified && <UserCheck size={24} className="text-blue-500" />}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 font-medium mt-1">
                                {influencer.instagram ? (
                                    <a 
                                        href={influencer.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-semibold"
                                    >
                                        <Instagram size={16} /> Instagram
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-1"><PlatformIcon size={16} /> {influencer.platform}</span>
                                )}
                                <span>•</span>
                                <span>{influencer.niche}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <section>
                                    <h3 className="font-bold text-slate-900 mb-2">Bio</h3>
                                    <p className="text-slate-600 leading-relaxed">{influencer.bio || 'No bio provided.'}</p>
                                </section>

                                <section>
                                    <h3 className="font-bold text-slate-900 mb-4">Content Showcase</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 hover:opacity-80 transition-opacity cursor-pointer"></div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                                    {influencer.location && (
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <MapPin size={20} className="text-slate-400" />
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Location</p>
                                                <p className="font-medium">{influencer.location}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Users size={20} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Followers</p>
                                            <p className="font-medium">{influencer.followers}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <TrendingUp size={20} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Engagement</p>
                                            <p className="font-medium">{influencer.data?.engagement || '5.0%'}</p>
                                        </div>
                                    </div>
                                    {influencer.website && (
                                        <div className="flex items-center gap-3 text-slate-700 border-t border-slate-200/60 pt-3">
                                            <Globe size={20} className="text-slate-400" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 font-bold uppercase">Website</p>
                                                <a href={influencer.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline truncate block">
                                                    {influencer.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {influencer.instagram && (
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <Instagram size={20} className="text-slate-400" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 font-bold uppercase">Instagram</p>
                                                <a href={influencer.instagram} target="_blank" rel="noopener noreferrer" className="font-medium text-pink-600 hover:underline truncate block">
                                                    View Profile
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {influencer.linkedin && (
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <Linkedin size={20} className="text-slate-400" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 font-bold uppercase">LinkedIn</p>
                                                <a href={influencer.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline truncate block">
                                                    View Profile
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InfluencerDetail;
