import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, User, MapPin, Globe, Mail, Phone, Briefcase, Instagram, Linkedin, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { getApiUrl } from '../config/api';
import VerificationPreviewItem from '../components/VerificationPreviewItem';

const EditProfile = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user, setUser, role } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        location: '',
        website: '',
        email: '',
        phone: '',
        instagram: '',
        linkedin: '',
        niche: '',
        followers: '',
        postReach: '',
        storyViews: '',
        engagementRate: '',
        profileVisits: '',
        country: '',
        city: '',
        ageGroup: '',
        verificationScreenshots: [],
        skills: '',
        currentPassword: '',
        newPassword: '',
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadingScreenshots, setUploadingScreenshots] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch(getApiUrl('/api/users/profile'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        name: data.name || '',
                        title: data.title || '',
                        bio: data.bio || '',
                        location: data.location || '',
                        website: data.website || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        instagram: data.instagram || '',
                        linkedin: data.linkedin || '',
                        niche: data.niche || '',
                        followers: data.followers || '',
                        postReach: data.postReach || '',
                        storyViews: data.storyViews || '',
                        engagementRate: data.engagementRate || '',
                        profileVisits: data.profileVisits || '',
                        country: data.country || '',
                        city: data.city || '',
                        ageGroup: data.ageGroup || '',
                        verificationScreenshots: data.verificationScreenshots || [],
                        skills: data.skills ? data.skills.join(', ') : '',
                        currentPassword: '',
                        newPassword: '',
                    });
                }
            } catch (err) {
                addToast('Failed to load profile data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, addToast]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formDataFile
            });
            const data = await res.json();
            if (res.ok) {
                // Instantly update UI avatar
                setUser(prev => ({ ...prev, profilePhoto: data.image }));
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

    const handleScreenshotUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                return addToast(`File "${file.name}" exceeds the 5MB limit`, 'error');
            }
        }

        setUploadingScreenshots(true);
        try {
            const newUrls = [];
            for (const file of files) {
                const formDataFile = new FormData();
                formDataFile.append('image', file);
                const res = await fetch(getApiUrl('/api/upload/verification'), {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${user.token}` },
                    body: formDataFile
                });
                const data = await res.json();
                if (res.ok) {
                    newUrls.push(data.image);
                } else {
                    throw new Error(data.message || 'Error uploading screenshot');
                }
            }
            setFormData(prev => ({
                ...prev,
                verificationScreenshots: [...(prev.verificationScreenshots || []), ...newUrls]
            }));
            addToast('Screenshots uploaded successfully!', 'success');
        } catch (error) {
            addToast(error.message || 'Error uploading file', 'error');
        } finally {
            setUploadingScreenshots(false);
        }
    };

    const removeScreenshot = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            verificationScreenshots: prev.verificationScreenshots.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Custom Regex Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return addToast("Invalid email address", "error");
        }

        const payload = {
            ...formData,
            skills: typeof formData.skills === 'string'
                ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
                : formData.skills
        };

        // Password handling: Only include password fields if user typed a new password
        if (formData.newPassword && formData.newPassword.trim().length > 0) {
            if (!formData.currentPassword || formData.currentPassword.trim().length === 0) {
                return addToast("Current password is required to change password", "error");
            }
            if (formData.newPassword.length < 6) {
                return addToast("New password must be at least 6 characters", "error");
            }
            payload.currentPassword = formData.currentPassword;
            payload.newPassword = formData.newPassword;
        } else {
            delete payload.currentPassword;
            delete payload.newPassword;
            delete payload.password;
        }

        try {
            const res = await fetch(getApiUrl('/api/users/profile'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(prev => ({ ...prev, ...data }));
                addToast('Profile updated successfully!', 'success');
                navigate('/profile');
            } else {
                addToast(data.message || 'Failed to update profile', 'error');
            }
        } catch (err) {
            addToast('An error occurred during update', 'error');
        }
    };

    return (
        <DashboardLayout role={role || 'influencer'}>
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Profile
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div></div>
                    ) : (

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Photo Upload */}
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center shadow shadow-slate-200 justify-center text-slate-400 overflow-hidden">
                                    {user?.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} />
                                    )}
                                </div>
                                <div className="relative overflow-hidden w-fit">
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        <Upload size={16} /> {uploading ? 'Uploading...' : 'Change Photo'}
                                    </button>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleFileUpload}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size 2MB</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Headline / Title</label>
                                    <div className="relative">
                                        <Briefcase size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Website</label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Phone / WhatsApp</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="+91 9999999999"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Instagram Link</label>
                                    <div className="relative">
                                        <Instagram size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="https://instagram.com/username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">LinkedIn Link</label>
                                    <div className="relative">
                                        <Linkedin size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {user?.role === 'influencer' && (
                                    <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Audience & Verification Analytics</h3>
                                            <p className="text-sm text-slate-500">Provide stats and proof screenshots to verify your creator reach.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Primary Niche</label>
                                                <select
                                                    name="niche"
                                                    value={formData.niche}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                                                >
                                                    <option value="" disabled className="bg-slate-900 text-white">Select Niche</option>
                                                    {['Fashion', 'Fitness', 'Tech', 'Food', 'Gaming', 'Travel', 'Education', 'Lifestyle', 'Business', 'Other'].map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Total Followers / Subscribers</label>
                                                <input
                                                    type="text"
                                                    name="followers"
                                                    value={formData.followers}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 150K"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Average Post Reach</label>
                                                <input
                                                    type="text"
                                                    name="postReach"
                                                    value={formData.postReach}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 45K"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Average Story Views</label>
                                                <input
                                                    type="text"
                                                    name="storyViews"
                                                    value={formData.storyViews}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 15K"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Average Engagement Rate (%)</label>
                                                <input
                                                    type="text"
                                                    name="engagementRate"
                                                    value={formData.engagementRate}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 4.5%"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Monthly Profile Visits</label>
                                                <input
                                                    type="text"
                                                    name="profileVisits"
                                                    value={formData.profileVisits}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 100K"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Top Audience Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    placeholder="e.g. United States"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Top Audience City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="e.g. New York"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Main Age Group</label>
                                                <input
                                                    type="text"
                                                    name="ageGroup"
                                                    value={formData.ageGroup}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 18-24"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Analytics Proof Upload */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-slate-700 block">Analytics Proof (Upload Screenshots)</label>
                                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 hover:border-blue-500/50 transition-all cursor-pointer relative group">
                                                <input 
                                                    type="file" 
                                                    multiple 
                                                    accept="image/*"
                                                    onChange={handleScreenshotUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                <Upload size={32} className="mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                                <h4 className="font-bold text-slate-700 text-sm mb-0.5">Drag & drop your screenshots here</h4>
                                                <p className="text-slate-400 text-xs">{uploadingScreenshots ? 'Uploading...' : 'or click to browse'}</p>
                                            </div>

                                            {formData.verificationScreenshots && formData.verificationScreenshots.length > 0 && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                                                    {formData.verificationScreenshots.map((url, idx) => (
                                                        <VerificationPreviewItem
                                                            key={`${url}-${idx}`}
                                                            url={url}
                                                            token={user?.token}
                                                            onRemove={() => removeScreenshot(idx)}
                                                            alt={`Verification proof ${idx + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            placeholder="Required to change password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">New Password (Leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            placeholder="Min 6 characters"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/profile')}
                                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EditProfile;
