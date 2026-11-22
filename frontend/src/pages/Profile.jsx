import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Globe, Award, BookOpen,
    Github, Linkedin, Twitter, Edit2, Plus, Share2, Instagram
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { getApiUrl } from '../config/api';
import VerificationPreviewItem from '../components/VerificationPreviewItem';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('portfolio');
    const { addToast } = useToast();
    const { user, setUser } = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', bio: '' });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch(getApiUrl('/api/users/profile'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (res.ok) setProfile(data);
                else throw new Error(data.message);
            } catch (err) {
                addToast(err.message || 'Failed to fetch profile', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, addToast]);

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return addToast('Profile photo must be less than 5MB', 'error');
        }

        const formDataFile = new FormData();
        formDataFile.append('image', file);

        setUploading(true);
        try {
            const res = await fetch(getApiUrl('/api/upload/avatar'), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` },
                body: formDataFile
            });
            const data = await res.json();
            if (res.ok) {
                // Instantly update UI and global context
                setUser(prev => ({ ...prev, profilePhoto: data.image }));
                setProfile(prev => ({ ...prev, profilePhoto: data.image }));
                addToast('Profile photo updated successfully!', 'success');
            } else {
                throw new Error(data.message || 'Error uploading photo');
            }
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(getApiUrl('/api/users/profile'), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(prev => ({ ...prev, ...data }));
                setProfile(prev => ({ ...prev, ...data }));
                addToast('Profile updated successfully!', 'success');
                setIsEditModalOpen(false);
            } else {
                addToast(data.message || 'Failed to update profile', 'error');
            }
        } catch (err) {
            addToast('An error occurred during update', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleShareProfile = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast('Profile link copied to clipboard!', 'success');
    };

    const handleAddSkill = () => {
        addToast('Add Skill feature coming soon!', 'info');
    };

    const handleAddProject = () => {
        addToast('Add Project feature coming soon!', 'info');
    };

    return (
        <DashboardLayout role={user?.role || 'influencer'}>
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div></div>
                ) : profile ? (
                    <>
                        {/* Profile Header Card */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-150/80 overflow-hidden mb-8">
                            {/* Cover Image */}
                            <div className="h-56 w-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
                                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
                                <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-accent-500/10 blur-2xl pointer-events-none"></div>
                                <button
                                    onClick={handleEditProfile}
                                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all shadow-lg hover:scale-105 border border-white/10"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>

                            <div className="px-8 pb-8">
                                <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-20 mb-8 gap-6 text-center md:text-left">
                                    {/* Profile Image */}
                                    <div className="relative shrink-0">
                                        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-brand-500 via-indigo-500 to-accent-500 p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full rounded-full bg-white border-2 border-white overflow-hidden flex items-center justify-center">
                                                {profile.profilePhoto ? (
                                                    <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || 'Felix'}`}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleEditProfile}
                                            className="absolute bottom-1 right-2 p-2 bg-brand-600 rounded-full text-white border-4 border-white cursor-pointer hover:bg-brand-700 transition-all hover:scale-110 shadow-lg"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Name & Title */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h1>
                                        <p className="text-base text-indigo-600 font-semibold tracking-wide mt-1 uppercase">{profile.title || 'Welcome to ProKonnect'}</p>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500 font-medium">
                                            {profile.location && <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><MapPin size={15} className="text-slate-400" /> {profile.location}</span>}
                                            {profile.website && (
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                    <Globe size={15} className="text-slate-400" /> 
                                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
                                                        {profile.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mb-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                                        <button
                                            onClick={handleEditProfile}
                                            className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transform hover:-translate-y-0.5"
                                        >
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={handleShareProfile}
                                            className="px-3.5 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-slate-600 transition-all hover:scale-105"
                                            title="Share Profile"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Tags / Skills */}
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    {(profile.skills && profile.skills.length > 0 ? profile.skills : []).map((skill, index) => (
                                        <span key={index} className="px-3.5 py-1.5 bg-brand-50/50 text-brand-700 rounded-full text-xs font-bold border border-brand-100/60 shadow-sm hover:scale-105 transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                    <button
                                        onClick={handleAddSkill}
                                        className="px-3.5 py-1.5 border border-dashed border-slate-300 text-slate-400 rounded-full text-xs font-bold hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50/20 transition-all"
                                    >
                                        + Add Skill
                                    </button>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4 border-t border-slate-100 pt-6 justify-center md:justify-start">
                                    {profile.instagram && (
                                        <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-all shadow-sm hover:scale-110">
                                            <Instagram size={20} />
                                        </a>
                                    )}
                                    {profile.linkedin && (
                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all shadow-sm hover:scale-110">
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all shadow-sm hover:scale-110">
                                            <Globe size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Left Column (Stats & About) */}
                            <div className="lg:w-1/3 space-y-6">

                                {/* About Section */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">About Me</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                                        {profile.bio || 'No bio provided yet.'}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Mail size={18} className="text-slate-400" />
                                            <span>{profile.email}</span>
                                        </div>
                                        {profile.phone && (
                                            <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-50 pt-2">
                                                <div className="flex items-center gap-3">
                                                    <Phone size={18} className="text-slate-400" />
                                                    <span>{profile.phone}</span>
                                                </div>
                                                <a 
                                                    href={`https://wa.me/${profile.phone.replace(/[^\d]/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                                                >
                                                    <svg className="w-4.5 h-4.5 fill-emerald-600" viewBox="0 0 24 24">
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.284 3.508 8.49-.004 6.66-5.34 11.999-11.95 11.999-2.005-.002-3.975-.496-5.74-1.442L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.12 .94 11.49.94c-5.44 0-9.862 4.371-9.866 9.8-.001 1.77.463 3.5 1.34 5.042L1.87 20.31l4.777-1.156z"/>
                                                    </svg>
                                                    Connect
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Badges / Stats */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Achievements</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Award size={20} /></div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-sm">Top 5% Developer</h4>
                                                <p className="text-xs text-slate-500">HackerRank 2024</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={20} /></div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-sm">50+ Open Source Commits</h4>
                                                <p className="text-xs text-slate-500">GitHub Contribution</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column (Portfolio/Experience) */}
                            <div className="lg:w-2/3">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                                    {/* Tabs Header */}
                                    <div className="flex border-b border-slate-200/80 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl mb-6">
                                        {(profile.role === 'influencer' 
                                            ? ['Portfolio', 'Audience & Reach', 'Experience', 'Education'] 
                                            : ['Portfolio', 'Experience', 'Education']
                                        ).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab.toLowerCase())}
                                                className={`flex-1 py-3 text-xs md:text-sm font-bold relative transition-all rounded-xl ${activeTab === tab.toLowerCase()
                                                    ? 'text-brand-600 bg-white shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/50'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-6">
                                        {activeTab === 'portfolio' && (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {[1, 2, 3].map((item) => (
                                                    <div key={item} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group cursor-pointer" onClick={() => addToast('Project details coming soon', 'info')}>
                                                        <div className="h-44 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200/50 relative">
                                                            <div className="w-full h-full bg-slate-200 group-hover:scale-105 transition-transform duration-500" />
                                                        </div>
                                                        <h4 className="font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors text-base">E-Commerce Dashboard</h4>
                                                        <p className="text-xs text-slate-500 mt-1 font-medium">React, Tailwind, Recharts</p>
                                                    </div>
                                                ))}
                                                <div
                                                    onClick={handleAddProject}
                                                    className="h-full min-h-[240px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/15 transition-all cursor-pointer p-6"
                                                >
                                                    <Plus size={32} className="mb-2" />
                                                    <span className="font-bold text-sm">Add Project</span>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'audience & reach' && (
                                            <div className="space-y-6 text-slate-700">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Niche</div>
                                                        <div className="text-lg font-extrabold text-slate-800 mt-1">{profile.niche || 'General'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Followers</div>
                                                        <div className="text-lg font-extrabold text-slate-800 mt-1">{profile.followers || '0'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engagement Rate</div>
                                                        <div className="text-lg font-extrabold text-slate-800 mt-1">{profile.engagementRate || '0%'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Post Reach</div>
                                                        <div className="text-lg font-extrabold text-slate-800 mt-1">{profile.postReach || '0'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Story Views</div>
                                                        <div className="text-lg font-extrabold text-slate-800 mt-1">{profile.storyViews || '0'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Visits</div>
                                                        <div className="text-lg font-extrabold text-slate-800 mt-1">{profile.profileVisits || '0'}</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top Country</div>
                                                        <div className="text-base font-extrabold text-slate-800 mt-1">{profile.country || 'N/A'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top City</div>
                                                        <div className="text-base font-extrabold text-slate-800 mt-1">{profile.city || 'N/A'}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Age Group</div>
                                                        <div className="text-base font-extrabold text-slate-800 mt-1">{profile.ageGroup || 'N/A'}</div>
                                                    </div>
                                                </div>

                                                {profile.verificationScreenshots && profile.verificationScreenshots.length > 0 && (
                                                    <div className="space-y-3 pt-6 border-t border-slate-100">
                                                        <h4 className="text-sm font-bold text-slate-800">Verification screenshots / Proof</h4>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                            {profile.verificationScreenshots.map((url, idx) => (
                                                                <VerificationPreviewItem
                                                                    key={`${url}-${idx}`}
                                                                    url={url}
                                                                    token={user?.token}
                                                                    alt={`Verification proof ${idx + 1}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'experience' && (
                                            <div className="space-y-6">
                                                <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 py-2">
                                                    {[1, 2].map((i) => (
                                                        <div key={i} className="relative">
                                                            <span className="absolute -left-[37px] top-1 h-4 w-4 rounded-full bg-white border-4 border-blue-600 ring-4 ring-blue-100" />
                                                            <h4 className="font-bold text-slate-900 text-lg">Frontend Intern</h4>
                                                            <p className="text-blue-600 font-medium text-sm mb-1">TechStartup Inc • Remote</p>
                                                            <span className="text-xs text-slate-400 block mb-3">June 2024 - Aug 2024</span>
                                                            <p className="text-sm text-slate-600">
                                                                Developed and maintained user-facing features using React.js. Collaborated with designers to implement responsive UI components.
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'education' && (
                                            <div className="text-center py-10 text-slate-500">
                                                <p>Education details go here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500">Failed to load profile.</div>
                )}
            </div>


        </DashboardLayout>
    );
};

export default Profile;
