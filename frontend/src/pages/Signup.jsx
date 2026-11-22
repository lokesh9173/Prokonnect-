import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Zap, CheckCircle2, XCircle, ArrowLeft, ShieldCheck, Sparkles, Users, Building2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/ThemeToggle';
import { loginAsDemoRole, setDemoMode, isDemoMode } from '../demo/demoMode.js';

const Signup = () => {
    const navigate = useNavigate();
    const { register, setUser } = useUser();
    const { isDark } = useTheme();
    const { addToast } = useToast();

    const handleDemoQuickAccess = (role) => {
        setDemoMode(true);
        const authData = loginAsDemoRole(role);
        setUser(authData);
        addToast(`Exploring as Demo ${role === 'business' ? 'Business (Vogue Apparel)' : 'Influencer (Alex Rivera)'}!`, 'success');
        navigate(role === 'business' ? '/business-dashboard' : '/influencer-dashboard');
    };

    const [role, setRole] = useState('influencer');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Password strength calculation
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
        let score = 0;
        if (pwd.length >= 6) score += 1;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
        if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
        if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
    };

    const strength = getPasswordStrength(formData.password);

    const hasConfirmValue = formData.confirmPassword.length > 0;
    const passwordsMatch = formData.password === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            addToast('Please enter your full name', 'error');
            return;
        }

        if (!formData.email.trim()) {
            addToast('Please enter your email address', 'error');
            return;
        }

        if (formData.password.length < 6) {
            addToast('Password must be at least 6 characters long', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            addToast('Passwords do not match! Please check and try again.', 'error');
            return;
        }

        setLoading(true);
        const cleanEmail = formData.email.trim();
        const isDemo = isDemoMode() || cleanEmail.endsWith('.demo') || cleanEmail.includes('demo');
        if (isDemo) {
            setDemoMode(true);
        }

        const success = await register(formData.name.trim(), cleanEmail, formData.password, role);
        if (success) {
            addToast(`Welcome to ProKonnect, ${formData.name}!`, 'success');
            if (role === 'business') {
                navigate('/business-dashboard', { replace: true });
            } else {
                navigate('/influencer-dashboard', { replace: true });
            }
        }
        setLoading(false);
    };

    const perks = [
        'Free to join — no credit card required',
        'Direct access to 100+ verified brand deals',
        'AI-driven matching & instant messaging'
    ];

    return (
        <div className={`min-h-screen flex flex-col justify-between relative overflow-hidden font-sans py-6 px-4 transition-colors duration-300 ${
            isDark ? 'bg-[#060913]' : 'bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20'
        }`}>

            {/* Ambient Animated Orbs */}
            <motion.div
                className="absolute top-[-120px] left-[-120px] w-[550px] h-[550px] rounded-full bg-accent-600/15 blur-[130px] pointer-events-none"
                animate={{ scale: [1, 1.1, 1], y: [0, 25, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-[-140px] right-[-140px] w-[550px] h-[550px] rounded-full bg-brand-600/15 blur-[120px] pointer-events-none"
                animate={{ scale: [1, 1.15, 1], x: [0, -25, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            {/* Grid Pattern Overlay */}
            <div className={`absolute inset-0 pointer-events-none ${
                isDark
                    ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]'
                    : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
            } bg-[size:36px_36px]`} />

            {/* Top Navigation Bar */}
            <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 mb-4">
                <Link
                    to="/"
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-200 ${
                        isDark
                            ? 'bg-white/[0.05] border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                            : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm'
                    }`}
                >
                    <ArrowLeft size={14} />
                    <span>Back to Home</span>
                </Link>

                <div className="flex items-center gap-2">
                    <ThemeToggle variant="icon" />
                </div>
            </header>

            {/* Main Content Card Container */}
            <div className="flex items-center justify-center relative z-10 my-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-lg relative"
                >
                    {/* Glowing card border aura */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-500/30 via-brand-500/25 to-indigo-500/30 rounded-[2.2rem] blur-xl opacity-80" />

                    <div className={`relative backdrop-blur-2xl border p-7 sm:p-9 rounded-[2rem] shadow-2xl overflow-hidden ${
                        isDark
                            ? 'bg-[#0B1120]/90 border-white/[0.1] shadow-[0_30px_90px_rgba(0,0,0,0.8)]'
                            : 'bg-white/95 border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
                    }`}>

                        {/* Top Gradient Shimmer */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-accent-500" />

                        {/* Header */}
                        <div className="text-center mb-6">
                            <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-brand group-hover:scale-105 transition-transform duration-200">
                                    <Zap size={19} className="text-white fill-white" />
                                </div>
                                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Pro<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Konnect</span>
                                </span>
                            </Link>
                            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Create your account
                            </h1>
                            <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Join the premier network for creators and brands
                            </p>
                        </div>

                        {/* Quick Benefits Pill Box */}
                        <div className={`border rounded-2xl p-3.5 mb-6 transition-colors ${
                            isDark
                                ? 'bg-brand-500/[0.06] border-brand-500/20'
                                : 'bg-gradient-to-r from-brand-50/80 to-indigo-50/50 border-brand-100'
                        }`}>
                            <div className="space-y-1.5">
                                {perks.map((perk, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <CheckCircle2 size={14} className="text-brand-500 flex-shrink-0" />
                                        <span>{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Demo Mode Access */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-2 px-0.5">
                                <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                    isDark ? 'text-amber-400' : 'text-amber-600'
                                }`}>
                                    <Zap size={13} className="fill-amber-400 text-amber-400" />
                                    <span>Or Explore Immediately</span>
                                </span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    Demo Mode
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDemoQuickAccess('business')}
                                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${
                                        isDark
                                            ? 'bg-brand-500/10 border-brand-500/30 hover:bg-brand-500/20'
                                            : 'bg-brand-50 border-brand-200 hover:bg-brand-100'
                                    }`}
                                >
                                    <div className="text-xs font-bold text-brand-400">Demo Business</div>
                                    <div className={`text-[10px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Vogue Apparel
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDemoQuickAccess('influencer')}
                                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${
                                        isDark
                                            ? 'bg-accent-500/10 border-accent-500/30 hover:bg-accent-500/20'
                                            : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                                    }`}
                                >
                                    <div className="text-xs font-bold text-accent-400">Demo Influencer</div>
                                    <div className={`text-[10px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Alex Rivera
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Signup Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role Selector: Creator vs Brand */}
                            <div className="space-y-1.5">
                                <label className={`block text-[11px] font-bold uppercase tracking-wider ml-1 ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    Join As
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setRole('influencer')}
                                        className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                            role === 'influencer'
                                                ? isDark
                                                    ? 'bg-brand-500/20 border-brand-500/70 ring-1 ring-brand-500/50'
                                                    : 'bg-brand-50 border-brand-400 ring-1 ring-brand-400/50 shadow-sm'
                                                : isDark
                                                    ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                                                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`p-1.5 rounded-lg ${role === 'influencer' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                <Users size={16} />
                                            </div>
                                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Creator / Influencer</span>
                                        </div>
                                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Monetize content & find brand gigs</p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRole('business')}
                                        className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                            role === 'business'
                                                ? isDark
                                                    ? 'bg-brand-500/20 border-brand-500/70 ring-1 ring-brand-500/50'
                                                    : 'bg-brand-50 border-brand-400 ring-1 ring-brand-400/50 shadow-sm'
                                                : isDark
                                                    ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                                                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`p-1.5 rounded-lg ${role === 'business' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                <Building2 size={16} />
                                            </div>
                                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Brand / Business</span>
                                        </div>
                                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hire creators & post campaigns</p>
                                    </button>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className={`block text-[11px] font-bold uppercase tracking-wider ml-1 ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User size={17} className={`transition-colors duration-200 ${
                                            isDark ? 'text-slate-500 group-focus-within:text-brand-400' : 'text-slate-400 group-focus-within:text-brand-600'
                                        }`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="e.g. Alex Morgan"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        className={`block w-full pl-10 pr-4 py-3 border rounded-xl font-medium text-sm transition-all duration-200 outline-none ${
                                            isDark
                                                ? 'bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
                                                : 'bg-slate-50/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1.5">
                                <label className={`block text-[11px] font-bold uppercase tracking-wider ml-1 ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail size={17} className={`transition-colors duration-200 ${
                                            isDark ? 'text-slate-500 group-focus-within:text-brand-400' : 'text-slate-400 group-focus-within:text-brand-600'
                                        }`} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="alex@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        className={`block w-full pl-10 pr-4 py-3 border rounded-xl font-medium text-sm transition-all duration-200 outline-none ${
                                            isDark
                                                ? 'bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
                                                : 'bg-slate-50/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className={`block text-[11px] font-bold uppercase tracking-wider ${
                                        isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                        Password
                                    </label>
                                    {formData.password && (
                                        <span className={`text-[11px] font-semibold ${strength.text}`}>
                                            {strength.label}
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock size={17} className={`transition-colors duration-200 ${
                                            isDark ? 'text-slate-500 group-focus-within:text-brand-400' : 'text-slate-400 group-focus-within:text-brand-600'
                                        }`} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        placeholder="Min. 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        className={`block w-full pl-10 pr-11 py-3 border rounded-xl font-medium text-sm transition-all duration-200 outline-none ${
                                            isDark
                                                ? 'bg-white/[0.04] border-white/[0.1] text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
                                                : 'bg-slate-50/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors ${
                                            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>

                                {/* Password Strength Visual Bar */}
                                {formData.password && (
                                    <div className="flex items-center gap-1.5 mt-1.5 px-0.5">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                    strength.score >= step
                                                        ? strength.color
                                                        : isDark ? 'bg-white/10' : 'bg-slate-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className={`block text-[11px] font-bold uppercase tracking-wider ${
                                        isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                        Confirm Password
                                    </label>

                                    {/* Live Matching Status Badge */}
                                    {hasConfirmValue && (
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold transition-all ${
                                            passwordsMatch
                                                ? 'text-emerald-500'
                                                : 'text-rose-500'
                                        }`}>
                                            {passwordsMatch ? (
                                                <>
                                                    <CheckCircle2 size={12} />
                                                    <span>Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={12} />
                                                    <span>Passwords don't match</span>
                                                </>
                                            )}
                                        </span>
                                    )}
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <ShieldCheck size={17} className={`transition-colors duration-200 ${
                                            hasConfirmValue
                                                ? passwordsMatch
                                                    ? 'text-emerald-500'
                                                    : 'text-rose-500'
                                                : isDark ? 'text-slate-500 group-focus-within:text-brand-400' : 'text-slate-400 group-focus-within:text-brand-600'
                                        }`} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        className={`block w-full pl-10 pr-11 py-3 border rounded-xl font-medium text-sm transition-all duration-200 outline-none ${
                                            isDark
                                                ? `bg-white/[0.04] text-white placeholder:text-slate-600 focus:bg-white/[0.08] ${
                                                    hasConfirmValue
                                                        ? passwordsMatch
                                                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                                            : 'border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                                        : 'border-white/[0.1] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
                                                }`
                                                : `bg-slate-50/90 text-slate-900 placeholder:text-slate-400 focus:bg-white ${
                                                    hasConfirmValue
                                                        ? passwordsMatch
                                                            ? 'border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                                            : 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                                                }`
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                        className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors ${
                                            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                    >
                                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.01, y: -1 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading || (hasConfirmValue && !passwordsMatch)}
                                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 shadow-glow-brand hover:shadow-glow-brand-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3 text-sm tracking-wide"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Create Free Account</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Sign In Link Divider */}
                        <div className={`mt-6 text-center border-t pt-5 ${isDark ? 'border-white/[0.08]' : 'border-slate-100'}`}>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-brand-500 hover:text-brand-400 font-bold transition-colors inline-flex items-center gap-1 group"
                                >
                                    <span>Sign in</span>
                                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Notice */}
            <footer className="w-full text-center z-10 py-2">
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    By signing up, you agree to ProKonnect's Terms of Service & Privacy Policy.
                </p>
            </footer>
        </div>
    );
};

export default Signup;
