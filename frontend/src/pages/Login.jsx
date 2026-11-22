import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, ArrowLeft, AlertCircle, Building2, UserCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/ThemeToggle';

const DEMO_ACCOUNTS = [
    {
        role: 'influencer',
        label: 'Demo Influencer',
        icon: UserCircle,
        email: 'sarah@influencer.com',
        password: 'password123',
        tag: 'Creator Profile'
    },
    {
        role: 'business',
        label: 'Demo Business',
        icon: Building2,
        email: 'info@grandhotel.com',
        password: 'password123',
        tag: 'Brand & Dealmaker'
    }
];

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();
    const { isDark } = useTheme();
    const { addToast } = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setErrorMessage('');
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFillDemo = (acc, autoSubmit = false) => {
        setErrorMessage('');
        setFormData({ email: acc.email, password: acc.password });
        if (autoSubmit) {
            handleLoginSubmit(acc.email, acc.password);
        }
    };

    const handleLoginSubmit = async (email, password) => {
        setErrorMessage('');

        if (!email.trim()) {
            setErrorMessage('Please enter your email address');
            addToast('Please enter your email address', 'error');
            return;
        }

        if (!password) {
            setErrorMessage('Please enter your password');
            addToast('Please enter your password', 'error');
            return;
        }

        setLoading(true);
        const user = await login(email.trim(), password);
        if (user) {
            const redirectPath = location.state?.from?.pathname;
            if (redirectPath) {
                navigate(redirectPath, { replace: true });
            } else if (user.role === 'business') {
                navigate('/business-dashboard', { replace: true });
            } else if (user.role === 'influencer') {
                navigate('/influencer-dashboard', { replace: true });
            } else {
                navigate('/role-selection', { replace: true });
            }
        } else {
            setErrorMessage('Invalid email or password. Please verify your credentials or use a Demo account below.');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLoginSubmit(formData.email, formData.password);
    };

    return (
        <div className={`min-h-screen flex flex-col justify-between relative overflow-hidden font-sans py-6 px-4 transition-colors duration-300 ${
            isDark ? 'bg-[#060913]' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'
        }`}>

            {/* Ambient Background Orbs */}
            <motion.div
                className="absolute top-[-140px] right-[-140px] w-[550px] h-[550px] rounded-full bg-brand-600/15 blur-[130px] pointer-events-none"
                animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full bg-accent-600/12 blur-[110px] pointer-events-none"
                animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
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

            {/* Main Content Card */}
            <div className="flex items-center justify-center relative z-10 my-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md relative"
                >
                    {/* Glowing card border aura */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/30 via-accent-500/25 to-indigo-500/30 rounded-[2.2rem] blur-xl opacity-80" />

                    <div className={`relative backdrop-blur-2xl border p-7 sm:p-9 rounded-[2rem] shadow-2xl overflow-hidden ${
                        isDark
                            ? 'bg-[#0B1120]/90 border-white/[0.1] shadow-[0_30px_90px_rgba(0,0,0,0.8)]'
                            : 'bg-white/95 border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
                    }`}>

                        {/* Top Gradient Shimmer */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-accent-500" />

                        {/* Header */}
                        <div className="text-center mb-7">
                            <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-brand group-hover:scale-105 transition-transform duration-200">
                                    <Zap size={19} className="text-white fill-white" />
                                </div>
                                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Pro<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Konnect</span>
                                </span>
                            </Link>
                            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Welcome back
                            </h1>
                            <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Sign in to access your dashboard & opportunities
                            </p>
                        </div>

                        {/* Inline Error Alert */}
                        <AnimatePresence>
                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    className="mb-5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 flex items-start gap-2.5 text-xs font-medium"
                                >
                                    <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-rose-300">Sign In Failed</p>
                                        <p className="mt-0.5 text-rose-400/90 leading-relaxed">{errorMessage}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Quick Demo Logins */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2.5 px-0.5">
                                <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                    isDark ? 'text-amber-400' : 'text-amber-600'
                                }`}>
                                    <Zap size={13} className="fill-amber-400 text-amber-400" />
                                    <span>Quick Demo Sign-In</span>
                                </span>
                                <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    1-click instant fill
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                {DEMO_ACCOUNTS.map((acc) => {
                                    const IconComponent = acc.icon;
                                    const isSelected = formData.email === acc.email;
                                    return (
                                        <button
                                            key={acc.role}
                                            type="button"
                                            onClick={() => handleFillDemo(acc, false)}
                                            className={`group text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                                                isSelected
                                                    ? isDark
                                                        ? 'bg-brand-500/20 border-brand-500/60 ring-1 ring-brand-500/40'
                                                        : 'bg-brand-50 border-brand-300 ring-1 ring-brand-300'
                                                    : isDark
                                                        ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20'
                                                        : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`p-1 rounded-lg ${
                                                    acc.role === 'influencer'
                                                        ? 'bg-orange-500/20 text-orange-400'
                                                        : 'bg-indigo-500/20 text-indigo-400'
                                                }`}>
                                                    <IconComponent size={14} />
                                                </div>
                                                <span className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {acc.label}
                                                </span>
                                            </div>
                                            <p className={`text-[10px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {acc.email}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
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
                                        placeholder="name@prokonnect.com"
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
                                <div className="flex justify-between items-center ml-1">
                                    <label className={`block text-[11px] font-bold uppercase tracking-wider ${
                                        isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-[11px] font-bold text-brand-500 hover:text-brand-400 transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
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
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
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
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.01, y: -1 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 shadow-glow-brand hover:shadow-glow-brand-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3 text-sm tracking-wide"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Sign In to Dashboard</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'}`} />
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                New to ProKonnect?
                            </span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'}`} />
                        </div>

                        {/* Create Account Link */}
                        <Link
                            to="/signup"
                            className={`block w-full text-center py-3 rounded-xl font-bold text-sm tracking-wide transition-all border ${
                                isDark
                                    ? 'border-brand-500/30 text-brand-400 hover:bg-brand-500/10 hover:border-brand-500/60'
                                    : 'border-brand-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300'
                            }`}
                        >
                            Create a Free Account →
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Footer Notice */}
            <footer className="w-full text-center z-10 py-2">
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    © 2026 ProKonnect Inc. Secure login with encrypted sessions.
                </p>
            </footer>
        </div>
    );
};

export default Login;
