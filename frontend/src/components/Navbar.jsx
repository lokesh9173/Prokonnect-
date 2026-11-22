import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { role } = useUser();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const isDarkPage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    const getDashboardLink = () => {
        if (role === 'business') return '/business-dashboard';
        if (role === 'influencer') return '/influencer-dashboard';
        return '/login';
    };

    const navLinks = [
        { label: 'Features', path: '/features' },
        { label: 'About', path: '/about' },
    ];

    // On landing page (dark), use dark glass regardless of theme
    const useDarkStyle = isDarkPage ? isDark : !isDark ? false : true;

    const navBg = scrolled || !isDarkPage
        ? isDark
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
        : 'bg-transparent border-b border-transparent';

    const textColor = isDarkPage
        ? 'text-slate-300 hover:text-white'
        : isDark
            ? 'text-slate-300 hover:text-white'
            : 'text-slate-600 hover:text-brand-600';

    const logoTextColor = isDarkPage
        ? 'text-white'
        : isDark
            ? 'text-white'
            : 'text-slate-900';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${navBg}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-brand group-hover:shadow-glow-brand-lg transition-shadow duration-300">
                                <Zap size={16} className="text-white fill-white" />
                            </div>
                            <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${logoTextColor}`}>
                                Pro<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Konnect</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-semibold transition-colors duration-200 relative group ${textColor}`}
                                >
                                    {link.label}
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}

                            {/* Demo Mode Direct Link */}
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
                            >
                                <Sparkles size={12} className="text-amber-400" />
                                <span>Demo Mode</span>
                            </Link>

                            {/* Theme Toggle */}
                            <ThemeToggle variant="pill" />

                            {!role ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className={`text-sm font-semibold transition-colors duration-200 ${textColor}`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="group relative px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-glow-brand hover:scale-105"
                                    >
                                        <span className="relative flex items-center gap-1.5">
                                            Get Started <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to={getDashboardLink()}
                                    className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-bold flex items-center gap-2 hover:shadow-glow-brand hover:scale-105 transition-all duration-300"
                                >
                                    Dashboard <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            )}
                        </div>

                        {/* Mobile: Toggle + Hamburger */}
                        <div className="md:hidden flex items-center gap-2">
                            <ThemeToggle variant="icon" />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`p-2 rounded-xl transition-colors ${
                                    isDark || isDarkPage
                                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className={`fixed top-16 left-4 right-4 z-50 md:hidden rounded-2xl border shadow-2xl overflow-hidden ${
                                isDark
                                    ? 'bg-slate-950/95 backdrop-blur-2xl border-white/10'
                                    : 'bg-white/95 backdrop-blur-2xl border-slate-200'
                            }`}
                        >
                            <div className="p-4 space-y-1.5">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.path}
                                        onClick={() => handleNavClick(link.path)}
                                        className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                                            isDark
                                                ? 'text-slate-300 hover:text-white hover:bg-white/[0.07]'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                ))}

                                <div className={`border-t pt-3 mt-3 space-y-2 ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                                    <button
                                        onClick={() => handleNavClick('/login')}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300"
                                    >
                                        <Sparkles size={14} className="text-amber-400" />
                                        <span>Explore Demo Mode</span>
                                    </button>
                                    {!role ? (
                                        <>
                                            <button
                                                onClick={() => handleNavClick('/login')}
                                                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                                                    isDark ? 'text-slate-300 hover:text-white hover:bg-white/[0.07]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                            >
                                                Login
                                            </button>
                                            <button
                                                onClick={() => handleNavClick('/signup')}
                                                className="block w-full text-center px-4 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-glow-brand hover:shadow-glow-brand-lg transition-all"
                                            >
                                                Get Started — Free
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleNavClick(getDashboardLink())}
                                            className="block w-full text-center px-4 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-glow-brand transition-all"
                                        >
                                            Go to Dashboard
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
