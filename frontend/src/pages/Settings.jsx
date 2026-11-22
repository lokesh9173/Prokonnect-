import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Bell, Lock, User, Eye, Moon, Globe, LogOut, Check, X, Shield, Key } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { addToast } = useToast();
    const { logout, role, user, appearance, setAppearance } = useUser();
    const navigate = useNavigate();

    // Default settings
    const defaultNotifications = {
        email: true,
        push: true,
        newsletter: false
    };

    const defaultPrivacy = {
        publicProfile: true,
        showEmail: false,
        searchable: true
    };

    // Initialize from localStorage or defaults
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('settings_notifications');
        return saved ? JSON.parse(saved) : defaultNotifications;
    });

    const [privacy, setPrivacy] = useState(() => {
        const saved = localStorage.getItem('settings_privacy');
        return saved ? JSON.parse(saved) : defaultPrivacy;
    });

    // Global Settings are now handled by UserContext

    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTwoExModal, setShowTwoExModal] = useState(false);

    // Save to localStorage whenever specific settings change (auto-persistence simulation)
    useEffect(() => {
        localStorage.setItem('settings_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('settings_privacy', JSON.stringify(privacy));
    }, [privacy]);


    const handleToggle = (setter, key, currentState) => {
        setter(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            return newState;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (user?.token) {
                const res = await fetch('/api/users/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(appearance)
                });
                if (!res.ok) throw new Error("Failed to save settings to server");
            }
            addToast('Settings saved successfully!', 'success');
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTheme = () => {
        setAppearance(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    };

    const toggleLanguage = () => {
        addToast('Language switch coming soon. English only for now.', 'info');
    };

    const handleLogout = () => {
        logout();
        addToast('Logged out successfully', 'success');
        navigate('/');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        addToast('Account scheduled for deletion (30 days).', 'warning');
        setTimeout(() => {
            logout();
            navigate('/');
        }, 2000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        setShowPasswordModal(false);
        addToast('Password updated successfully.', 'success');
    };

    const handleEnable2FA = () => {
        setShowTwoExModal(false);
        addToast('Two-factor authentication enabled.', 'success');
    };

    return (
        <DashboardLayout role={role || 'influencer'}>
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and privacy.</p>
                    </div>
                    {user && (
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                    )}
                </div>

                {/* Account Section */}
                <Section title="Account" icon={<User className="text-brand-600" />}>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <h4 className="font-bold text-slate-900">Delete Account</h4>
                            <p className="text-sm text-slate-500">Permanently remove your account and data.</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold text-sm transition-colors border border-red-100">
                            Delete
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                        <div>
                            <h4 className="font-bold text-slate-900">Sign Out</h4>
                            <p className="text-sm text-slate-500">Log out of your active session.</p>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </Section>

                {/* Notifications */}
                <Section title="Notifications" icon={<Bell className="text-accent-600" />}>
                    <ToggleRow
                        label="Email Notifications"
                        desc="Receive updates about new opportunities via email."
                        checked={notifications.email}
                        onChange={() => handleToggle(setNotifications, 'email')}
                    />
                    <ToggleRow
                        label="Push Notifications"
                        desc="Get real-time alerts on your device."
                        checked={notifications.push}
                        onChange={() => handleToggle(setNotifications, 'push')}
                    />
                    <ToggleRow
                        label="Marketing Newsletter"
                        desc="Receive tips, trends, and platform updates."
                        checked={notifications.newsletter}
                        onChange={() => handleToggle(setNotifications, 'newsletter')}
                    />
                </Section>

                {/* Privacy */}
                <Section title="Privacy & Security" icon={<Lock className="text-green-600" />}>
                    <ToggleRow
                        label="Public Profile"
                        desc="Allow everyone to see your full profile."
                        checked={privacy.publicProfile}
                        onChange={() => handleToggle(setPrivacy, 'publicProfile')}
                    />
                    <ToggleRow
                        label="Show Email Address"
                        desc="Display your contact email on your public profile."
                        checked={privacy.showEmail}
                        onChange={() => handleToggle(setPrivacy, 'showEmail')}
                    />
                    <div className="p-4 flex gap-6 mt-4 border-t border-slate-100 pt-6">
                        <button onClick={() => setShowPasswordModal(true)} className="text-brand-600 font-bold hover:underline text-sm flex items-center gap-2">
                            <Key size={16} /> Change Password
                        </button>
                        <button onClick={() => setShowTwoExModal(true)} className="text-brand-600 font-bold hover:underline text-sm flex items-center gap-2">
                            <Shield size={16} /> Enable 2FA
                        </button>
                    </div>
                </Section>

                {/* Appearance */}
                <Section title="Appearance" icon={<Eye className="text-orange-600" />}>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Moon size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-900">Dark Mode</h4>
                                <p className="text-xs text-slate-500">Switch between light and dark themes.</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${appearance.theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                            {appearance.theme === 'dark' ? 'Dark' : 'Light'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Globe size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-900">Language</h4>
                                <p className="text-xs text-slate-500">Change the platform language.</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors hover:bg-slate-200"
                        >
                            {/* Using static 'English' per user request */}
                            English
                        </button>
                    </div>
                </Section>

                <div className="flex justify-end pt-6">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/30 flex items-center gap-2 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>Saving...</>
                        ) : (
                            <><Save size={20} /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                                <button onClick={() => setShowPasswordModal(false)}><X size={24} className="text-slate-400" /></button>
                            </div>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                                    <input type="password" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                                    <input type="password" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500" />
                                </div>
                                <div className="pt-2 flex justify-end gap-2">
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-slate-600 font-bold">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Update</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
                            <p className="text-slate-500 mb-6">This action cannot be undone. Your account will be permanently deleted.</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50">Cancel</button>
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Yes, Delete Account</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 2FA Modal */}
            <AnimatePresence>
                {showTwoExModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enable 2FA</h3>
                            <p className="text-slate-500 mb-6 flex-1">Scan the QR code below with your authenticator app to enable Two-Factor Authentication.</p>
                            <div className="w-32 h-32 bg-slate-200 mx-auto mb-6 rounded-lg flex items-center justify-center text-xs text-slate-400 font-mono">
                                [QR CODE PLACEHOLDER]
                            </div>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setShowTwoExModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50">Cancel</button>
                                <button onClick={handleEnable2FA} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Verify & Enable</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </DashboardLayout>
    );
};

const Section = ({ title, icon, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden"
    >
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
        <div className="p-4">
            {children}
        </div>
    </motion.div>
);

const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer" onClick={onChange}>
        <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">{label}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
        <button
            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${checked ? 'bg-brand-600' : 'bg-slate-200'}`}
        >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${checked ? 'translate-x-6' : 'translate-x-0'}`}>
                {checked && <Check size={12} className="text-brand-600" />}
            </div>
        </button>
    </div>
);

export default Settings;
