import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useInView } from 'framer-motion';
import {
    ArrowRight, Users, Zap, TrendingUp, CheckCircle, Star,
    ShoppingBag, Coffee, Hotel, Play, X, Instagram,
    Mail, Lock, Eye, EyeOff, Rocket, Sparkles,
    Building2, Globe, Award, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Typewriter from '../components/Typewriter';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { loginAsDemoRole } from '../demo/demoMode.js';

/* ─── Animated Counter ─────────────────────────────────── */
const Counter = ({ to, suffix = '', prefix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 1800;
        const step = to / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= to) { setCount(to); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, to]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ─── 3D Tilt Card ─────────────────────────────────────── */
const TiltCard = ({ icon, title, desc, gradient, accentColor }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [12, -12]), { damping: 18, stiffness: 180 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-12, 12]), { damping: 18, stiffness: 180 });

    function handleMouse(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    }

    return (
        <motion.div
            style={{ rotateX, rotateY, perspective: 1200 }}
            onMouseMove={handleMouse}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="relative group h-full cursor-default"
        >
            {/* Glow behind card */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-3xl -z-10`} />

            <div className="relative h-full bg-slate-900/60 backdrop-blur-xl border border-white/[0.07] group-hover:border-white/20 p-8 rounded-3xl overflow-hidden transition-all duration-500 shadow-card-dark group-hover:shadow-card-dark-hover card-shine">
                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className={`mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
            </div>
        </motion.div>
    );
};

/* ─── User Card ─────────────────────────────────────────── */
const UserCard = ({ icon, title, description, features, onClick, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.5 }}
        className="relative bg-slate-900/60 backdrop-blur-xl border border-white/[0.06] hover:border-brand-500/40 p-8 rounded-3xl group cursor-pointer overflow-hidden transition-all duration-500"
        onClick={onClick}
    >
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

        <div className={`mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center border border-white/10 shadow-lg`}>
            {icon}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 mb-7 leading-relaxed text-sm">{description}</p>

        <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle size={12} className="text-white" />
                    </div>
                    {feature}
                </li>
            ))}
        </ul>

        <div className="flex items-center gap-2 text-sm font-bold text-brand-400 group-hover:gap-3 transition-all duration-300 uppercase tracking-wider">
            Get Started <ArrowRight size={14} />
        </div>
    </motion.div>
);

/* ─── Floating Orb ─────────────────────────────────────── */
const FloatingOrb = ({ size, color, style, delay = 0 }) => (
    <motion.div
        className={`absolute rounded-full pointer-events-none ${color} blur-[80px]`}
        style={{ width: size, height: size, ...style }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
);

/* ─── Stat Card ─────────────────────────────────────────── */
const StatCard = ({ to, suffix, prefix, label, icon, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-slate-900/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 overflow-hidden group hover:border-white/20 transition-all duration-300"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient} mb-1`}>
            <Counter to={to} suffix={suffix} prefix={prefix} />
        </div>
        <div className="text-slate-400 text-sm font-semibold">{label}</div>
    </motion.div>
);

/* ─── Testimonial Card ─────────────────────────────────── */
const TestimonialCard = ({ name, role, text, avatar, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -5 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.06] hover:border-white/15 p-6 rounded-2xl transition-all duration-300"
    >
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-gold-400 fill-gold-400" />)}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${avatar} flex items-center justify-center text-white text-xs font-extrabold`}>
                {name.charAt(0)}
            </div>
            <div>
                <p className="text-white text-sm font-bold">{name}</p>
                <p className="text-slate-500 text-xs">{role}</p>
            </div>
        </div>
    </motion.div>
);

/* ─── Main Component ────────────────────────────────────── */
const Landing = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { login, setUser } = useUser();
    const { isDark } = useTheme();
    const { scrollY } = useScroll();
    const [showDemoVideo, setShowDemoVideo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    const handleDirectDemoLogin = (role) => {
        const authData = loginAsDemoRole(role);
        setUser(authData);
        addToast(`Welcome to ProKonnect Demo as ${role === 'business' ? 'Vogue Apparel (Business)' : 'Alex Rivera (Influencer)'}!`, 'success');
        navigate(role === 'business' ? '/business-dashboard' : '/influencer-dashboard');
    };

    // Theme-aware class helpers
    const bg1 = isDark ? 'bg-[#060913]' : 'bg-gradient-to-br from-slate-50 to-blue-50/40';
    const bg2 = isDark ? 'bg-[#070C1A]' : 'bg-white';
    const cardBg = isDark
        ? 'bg-slate-900/60 backdrop-blur-xl border-white/[0.07]'
        : 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-sm';
    const textPrimary = isDark ? 'text-slate-200' : 'text-slate-900';
    const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const loggedInUser = await login(email, password);
        if (loggedInUser) {
            if (loggedInUser.role === 'business') navigate('/business-dashboard');
            else if (loggedInUser.role === 'influencer') navigate('/influencer-dashboard');
            else navigate('/role-selection');
        }
        setLoginLoading(false);
    };

    const testimonials = [
        { name: 'Priya Sharma', role: 'Fashion Influencer · 45K Followers', text: 'ProKonnect got me 3 hotel collabs in my first week. The platform is incredibly premium!', avatar: 'bg-gradient-to-br from-pink-500 to-rose-500', delay: 0 },
        { name: 'Rahul Mehta', role: 'Cafe Owner · Mumbai', text: 'We doubled our footfall by connecting with 8 local influencers. Best marketing ROI ever.', avatar: 'bg-gradient-to-br from-brand-500 to-indigo-600', delay: 0.1 },
        { name: 'Sneha Patil', role: 'Food Blogger · 22K Followers', text: 'The barter collaboration system is genius. Got 5 free meals this month for my content!', avatar: 'bg-gradient-to-br from-orange-400 to-amber-500', delay: 0.2 },
    ];

    return (
        <div className={`min-h-screen ${textPrimary} font-sans selection:bg-brand-500/40 selection:text-white overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#060913]' : 'bg-slate-50'}`}>
            <Navbar />

            {/* ── HERO SECTION ────────────────────────────────────────── */}
            <section className={`relative min-h-screen flex items-center justify-center pt-16 pb-24 overflow-hidden transition-colors duration-300 ${
                isDark ? 'mesh-bg' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30'
            }`}>
                {/* Animated background orbs */}
                <FloatingOrb size="600px" color={isDark ? 'bg-brand-600/15' : 'bg-brand-500/08'} style={{ top: '-100px', right: '-150px' }} delay={0} />
                <FloatingOrb size="500px" color={isDark ? 'bg-accent-600/10' : 'bg-accent-500/06'} style={{ bottom: '-50px', left: '-100px' }} delay={2} />
                <FloatingOrb size="300px" color={isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/05'} style={{ top: '40%', left: '30%' }} delay={4} />

                {/* Grid pattern */}
                <div className={`absolute inset-0 grid-pattern opacity-100 pointer-events-none ${isDark ? '' : 'opacity-30'}`} />

                {/* Bottom fade */}
                <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t pointer-events-none ${isDark ? 'from-[#060913]' : 'from-slate-50'} to-transparent`} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Hero Text */}
                        <motion.div {...fadeIn} className="text-left">
                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className={`inline-flex items-center gap-2.5 py-2 px-5 rounded-full border backdrop-blur-md text-brand-300 text-xs font-bold mb-10 shadow-glow-brand ${
                                    isDark
                                        ? 'bg-white/[0.06] border-white/10 text-brand-300'
                                        : 'bg-brand-50 border-brand-200 text-brand-600'
                                }`}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                                </span>
                                <Sparkles size={12} className="text-brand-400" />
                                The Future of Brand Collaborations
                            </motion.div>

                            {/* Main headline */}
                            <div className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter mb-8 leading-[1.04]">
                                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-white via-slate-200 to-slate-400' : 'from-slate-900 via-slate-700 to-slate-500'} mb-1`}>
                                    <Typewriter text="Connect. Collab." speed={65} cursor={false} />
                                </div>
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 animate-gradient bg-[length:200%]">
                                    <Typewriter text="Get Discovered." speed={65} cursor />
                                </div>
                            </div>

                            <p className={`text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-light ${textSecondary}`}>
                                Unlock exclusive deals, paid partnerships, and viral opportunities.{' '}
                                <br className="hidden md:block" />
                                The premium ecosystem for{' '}
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Influencers</span>{' '}
                                and{' '}
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Brands</span>.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-base overflow-hidden transition-all duration-300 hover:shadow-glow-brand-lg hover:scale-105"
                                >
                                    <span className="relative flex items-center gap-2">
                                        Start For Free{' '}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </span>
                                </button>

                                <button
                                    onClick={() => setShowDemoVideo(true)}
                                    className={`group px-8 py-4 rounded-full font-bold text-base transition-all duration-300 border backdrop-blur-sm flex items-center gap-3 hover:scale-105 ${
                                        isDark 
                                            ? 'bg-white/[0.06] text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                                        <Play size={12} fill="currentColor" className="ml-0.5" />
                                    </div>
                                    Watch Demo
                                </button>
                            </div>

                            {/* 1-Click Interactive Demo Access */}
                            <div className="mt-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm max-w-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-amber-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Interactive Demo Experience</span>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold">Instant Access • No Signup</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDirectDemoLogin('business')}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 hover:border-amber-400/50 transition-all text-left group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                                                <span>Demo Business</span>
                                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate">Vogue Apparel • Post & review deals</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDirectDemoLogin('influencer')}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 hover:border-purple-400/50 transition-all text-left group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                            <Users size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                                                <span>Demo Influencer</span>
                                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate">Alex Rivera • Browse & apply to deals</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-10 flex items-center gap-6">
                                <div className="flex -space-x-2.5">
                                    {['from-pink-500 to-rose-500', 'from-brand-500 to-indigo-600', 'from-orange-400 to-amber-500', 'from-emerald-400 to-teal-500'].map((g, i) => (
                                        <div key={i} className={`w-9 h-9 rounded-full border-2 ${isDark ? 'border-[#060913]' : 'border-slate-100'} bg-gradient-to-br ${g} flex items-center justify-center text-white text-[10px] font-bold`}>
                                            {['P', 'R', 'S', 'A'][i]}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex gap-0.5 mb-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-gold-400 fill-gold-400" />)}
                                    </div>
                                    <p className={`text-xs font-semibold ${textSecondary}`}>Trusted by <span className={isDark ? 'text-white' : 'text-slate-800'}>500+</span> creators & brands</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Glassmorphism Login Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            {/* Glow halo */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/25 via-accent-500/20 to-indigo-500/25 rounded-[3rem] blur-3xl opacity-60 animate-pulse" />

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                                className={`relative backdrop-blur-2xl border p-10 rounded-[2rem] shadow-card-dark z-10 overflow-hidden ${
                                    isDark
                                        ? 'bg-[#0B1120]/80 border-white/[0.08]'
                                        : 'bg-white/95 border-slate-200 shadow-xl'
                                }`}
                            >
                                {/* Top shimmer line */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

                                <div className="text-center mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-glow-brand">
                                        <Zap size={22} className="text-white fill-white" />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome Back</h3>
                                    <p className={`text-sm ${textSecondary}`}>Sign in to your dashboard</p>
                                </div>

                                <form className="space-y-5" onSubmit={handleLogin}>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                            </div>
                                            <input
                                                type="email" name="email" required placeholder="name@example.com"
                                                className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 outline-none placeholder-slate-600 text-sm transition-all ${
                                                    isDark ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Lock size={16} className="text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'} name="password" required placeholder="••••••••"
                                                className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 outline-none placeholder-slate-600 text-sm transition-all ${
                                                    isDark ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                                                }`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-brand-500 transition-colors">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loginLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-xl font-bold text-white shadow-glow-brand hover:shadow-glow-brand-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide"
                                    >
                                        {loginLoading ? 'Signing In...' : 'Sign In to Dashboard'}
                                    </button>

                                    {/* 1-Click Demo Shortcut */}
                                    <div className="relative my-3 flex items-center">
                                        <div className="flex-grow border-t border-white/10" />
                                        <span className="flex-shrink mx-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">Or Explore Demo Directly</span>
                                        <div className="flex-grow border-t border-white/10" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDirectDemoLogin('business')}
                                            className="px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all text-center"
                                        >
                                            Demo Business
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDirectDemoLogin('influencer')}
                                            className="px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition-all text-center"
                                        >
                                            Demo Influencer
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                        <span onClick={() => navigate('/forgot-password')} className="cursor-pointer hover:text-brand-400 transition-colors font-medium">Forgot password?</span>
                                        <span onClick={() => navigate('/signup')} className="cursor-pointer font-bold text-brand-400 hover:text-brand-300 transition-colors">Create Account →</span>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ────────────────────────────────────────── */}
            <section className={`py-20 relative overflow-hidden border-y transition-colors duration-300 ${
                isDark ? 'bg-[#070C1A] border-white/[0.05]' : 'bg-white border-slate-100'
            }`}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard to={500} suffix="+" label="Active Creators" gradient="from-brand-400 to-indigo-500" />
                        <StatCard to={120} suffix="+" label="Business Partners" gradient="from-accent-400 to-pink-500" />
                        <StatCard to={2500} suffix="+" label="Collabs Completed" gradient="from-orange-400 to-amber-500" />
                        <StatCard to={95} suffix="%" label="Satisfaction Rate" gradient="from-emerald-400 to-teal-500" />
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES SECTION ──────────────────────────────────── */}
            <section className={`py-32 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#060913]' : 'bg-slate-50'}`}>
                <FloatingOrb size="500px" color="bg-brand-600/10" style={{ top: '10%', right: '-100px' }} delay={1} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-6 uppercase tracking-widest">
                            <Sparkles size={12} /> Opportunities
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-black mb-5 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Unlock Exclusive Offers
                        </h2>
                        <p className={`text-xl max-w-2xl mx-auto ${textSecondary}`}>
                            Curated opportunities across every niche and industry.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <TiltCard
                            icon={<Hotel size={28} className="text-brand-400" />}
                            title="Hotel Promotions"
                            desc="Get exclusive staycation deals and complimentary stays in exchange for stunning content and authentic reviews."
                            gradient="from-brand-500/40 to-indigo-500/40"
                        />
                        <TiltCard
                            icon={<Coffee size={28} className="text-orange-400" />}
                            title="Café & Dining"
                            desc="Tasting menus, launch events, and food collabs for food bloggers and local lifestyle influencers."
                            gradient="from-orange-500/40 to-amber-500/40"
                        />
                        <TiltCard
                            icon={<ShoppingBag size={28} className="text-pink-400" />}
                            title="Brand Deals"
                            desc="Paid campaigns and barter collaborations with top fashion, lifestyle, and tech brands."
                            gradient="from-pink-500/40 to-accent-500/40"
                        />
                    </div>
                </div>
            </section>

            {/* ── WHO IS IT FOR ───────────────────────────────────────── */}
            <section className={`py-32 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#070C1A]' : 'bg-white'}`}>
                <div className="absolute inset-0 grid-pattern" />
                <FloatingOrb size="400px" color="bg-accent-600/10" style={{ bottom: '10%', left: '-80px' }} delay={3} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-bold mb-6 uppercase tracking-widest">
                            <Users size={12} /> Who's It For
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-black mb-5 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ProKonnect is Built for You
                        </h2>
                        <p className={`text-xl max-w-2xl mx-auto ${textSecondary}`}>
                            Tailored ecosystems designed for growth and authentic visibility.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <UserCard
                            icon={<Users className="text-brand-400" size={26} />}
                            title="Students"
                            description="Access exclusive student discounts, brand ambassador programs, and internship opportunities."
                            features={['Student Discount Deals', 'Campus Ambassador Roles', 'Portfolio & Resume Building']}
                            gradient="from-brand-500 to-indigo-600"
                            onClick={() => navigate('/signup')}
                        />
                        <UserCard
                            icon={<TrendingUp className="text-accent-400" size={26} />}
                            title="Influencers"
                            description="Connect with hotels, restaurants, and brands for paid or barter collaborations that grow your profile."
                            features={['Paid Collaborations', 'Exclusive VIP Invites', 'Growth Analytics Dashboard']}
                            gradient="from-accent-400 to-pink-500"
                            onClick={() => navigate('/signup')}
                        />
                        <UserCard
                            icon={<Zap className="text-gold-400" size={26} />}
                            title="Businesses"
                            description="Drive footfall and brand visibility by partnering with local creators and student ambassadors."
                            features={['Hyper-local Marketing', 'User Generated Content', 'Viral Social Reach']}
                            gradient="from-gold-500 to-orange-500"
                            onClick={() => navigate('/signup')}
                        />
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ────────────────────────────────────────── */}
            <section className={`py-32 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#060913]' : 'bg-slate-50'}`}>
                <FloatingOrb size="600px" color="bg-brand-600/10" style={{ top: '-100px', left: '30%' }} delay={2} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold mb-6 uppercase tracking-widest">
                            <Star size={12} /> Social Proof
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-black mb-5 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Creators & Brands Love Us
                        </h2>
                        <p className={`text-xl ${textSecondary}`}>Real results from real members of the ProKonnect community.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
                    </div>
                </div>
            </section>

            {/* ── FOUNDER SECTION ───────────────────────────────────────── */}
            <section className={`py-32 relative overflow-hidden border-t transition-colors duration-300 ${
                isDark ? 'bg-[#070C1A] border-white/[0.04]' : 'bg-white border-slate-100'
            }`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/8 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Meet the Founder</h2>
                        <p className={`text-xl ${textSecondary}`}>The visionary driving the ProKonnect revolution.</p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            whileHover={{ y: -6 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={`relative backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-brand-500/20 shadow-card-dark overflow-hidden ${isDark ? 'bg-slate-900/60' : 'bg-white/80'}`}
                        >
                            {/* Inner glow */}
                            <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
                            {/* Top gradient line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

                            <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-brand-500 via-accent-500 to-indigo-500 shadow-glow-brand">
                                        <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-brand-400 to-accent-400 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                                            LS
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-brand-500 to-indigo-600 text-white p-2 rounded-full shadow-glow-brand border-2 border-slate-950">
                                        <Rocket size={16} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left space-y-4">
                                    <div>
                                        <h3 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Lokesh Sharma</h3>
                                        <p className="text-brand-400 font-bold tracking-wider text-xs uppercase mt-1.5 flex items-center gap-2 justify-center md:justify-start">
                                            <Award size={14} />
                                            CEO & Founder of ProKonnect
                                        </p>
                                    </div>
                                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed text-sm font-medium`}>
                                        Lokesh Sharma is the driving force behind ProKonnect. Guided by a passion for building next-generation digital networking spaces, he founded ProKonnect to bridge the collaboration gap between local businesses, students, and digital creators.
                                    </p>

                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                                        <a
                                            href="https://www.instagram.com/lokesh.shaxrma?igsh=bmpocWoxcGFkOG1j"
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-bold rounded-xl text-xs shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
                                        >
                                            <Instagram size={15} /> Instagram
                                        </a>
                                        <a
                                            href="https://wa.me/919173737940"
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg hover:-translate-y-0.5 transition-all"
                                        >
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 16.51c-1.47 0-2.92-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.3.19-.55.07-1.3-.52-2.3-1.02-3.17-2.31-.14-.21-.01-.32.11-.45.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.32-.02-.45-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.86.84-.86 2.05s.89 2.37 1 2.51c.12.15 1.72 2.62 4.15 3.67 1.61.7 2.22.75 3.04.63.81-.13 1.47-.6 1.69-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28z" />
                                            </svg>
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────────── */}
            <section className={`py-24 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#060913]' : 'bg-slate-50'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-[#060913] to-accent-900/20" />
                <FloatingOrb size="500px" color="bg-brand-600/15" style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }} delay={0} />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Ready to Get{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 animate-gradient bg-[length:200%]">
                                Discovered?
                            </span>
                        </h2>
                        <p className={`text-xl mb-10 max-w-xl mx-auto ${textSecondary}`}>
                            Join hundreds of creators and businesses already growing with ProKonnect.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="group px-10 py-4 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-base hover:shadow-glow-brand-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Join ProKonnect Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-10 py-4 rounded-full font-bold text-base transition-all border hover:border-slate-300 ${
                                    isDark 
                                        ? 'bg-white/[0.06] text-white border-white/10 hover:bg-white/10'
                                        : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                Sign In
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────── */}
            <footer className={`py-16 border-t relative overflow-hidden transition-colors duration-300 ${
                isDark
                    ? 'bg-slate-950 text-slate-400 border-white/[0.05]'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-brand">
                            <Zap size={18} className="text-white fill-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-white tracking-tight">
                            Pro<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Konnect</span>
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto">The premium ecosystem connecting influencers and brands.</p>

                    <div className="flex justify-center gap-8 mb-10 flex-wrap">
                        {[{ label: 'About Us', path: '/about' }, { label: 'Features', path: '/features' }].map(({ label, path }) => (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className="text-sm font-semibold hover:text-white transition-colors relative group"
                            >
                                {label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 group-hover:w-full transition-all duration-300 rounded-full" />
                            </button>
                        ))}
                        <button
                            onClick={() => addToast('Privacy Policy coming soon!', 'info')}
                            className="text-sm font-semibold hover:text-white transition-colors relative group"
                        >
                            Privacy
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 group-hover:w-full transition-all duration-300 rounded-full" />
                        </button>
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center items-center gap-4 mb-10">
                        {[
                            { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>, hover: 'hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]' },
                            { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" /></svg>, hover: 'hover:bg-[#229ED9] hover:shadow-[0_0_20px_rgba(34,158,217,0.4)]' },
                            { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 16.51c-1.47 0-2.92-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.3.19-.55.07-1.3-.52-2.3-1.02-3.17-2.31-.14-.21-.01-.32.11-.45.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.32-.02-.45-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.86.84-.86 2.05s.89 2.37 1 2.51c.12.15 1.72 2.62 4.15 3.67 1.61.7 2.22.75 3.04.63.81-.13 1.47-.6 1.69-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28z" /></svg>, hover: 'hover:bg-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]' },
                        ].map((social, i) => (
                            <a key={i} href="#" className={`w-11 h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white ${social.hover} hover:border-transparent transition-all duration-300 hover:-translate-y-1`}>
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />
                    <p className="text-slate-600 text-sm font-medium">© 2026 ProKonnect Inc. Built for the future.</p>
                </div>
            </footer>

            {/* ── DEMO VIDEO MODAL ──────────────────────────────── */}
            <AnimatePresence>
                {showDemoVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
                        onClick={() => setShowDemoVideo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-5xl aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/15"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowDemoVideo(false)}
                                className="absolute top-4 right-4 z-20 p-2.5 bg-black/70 hover:bg-black/90 rounded-full text-white transition-all duration-200 border border-white/20 shadow-lg hover:scale-105"
                                aria-label="Close demo video"
                            >
                                <X size={20} />
                            </button>
                            <iframe
                                src="https://www.loom.com/embed/84bcd4012f824f7f89cfce5e58b350a3?autoplay=1"
                                frameBorder="0"
                                webkitallowfullscreen="true"
                                mozallowfullscreen="true"
                                allowFullScreen
                                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                className="w-full h-full"
                                title="ProKonnect Demo Video"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;
