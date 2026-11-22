import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    User,
    Settings as SettingsIcon,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    Building2,
    Users,
    ChevronRight,
    Zap,
    Sparkles,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const DashboardLayout = ({ children, role: propsRole }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { role: contextRole, user, logout } = useUser();
    const { isDark } = useTheme();

    const currentRole = propsRole || contextRole || 'influencer';

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Opportunity', text: 'FitLogic Gym posted a new campaign for influencers.', time: '2m ago', read: false, icon: '🎯' },
        { id: 2, title: 'Message Received', text: 'Sarah from Grand Hotel sent you a message.', time: '1h ago', read: false, icon: '💬' },
        { id: 3, title: 'Application Viewed', text: 'Your application for Summer Staycation was viewed.', time: '3h ago', read: true, icon: '👁' },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    useEffect(() => {
        function handleClickOutside(e) {
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <LayoutDashboard size={18} />,
            path: currentRole === 'business' ? '/business-dashboard' : '/influencer-dashboard'
        },
        {
            title: currentRole === 'business' ? 'Find Influencers' : 'Find Businesses',
            icon: currentRole === 'business' ? <Users size={18} /> : <Building2 size={18} />,
            path: currentRole === 'business' ? '/business-dashboard' : '/influencer-dashboard'
        },
        { title: 'Messages', icon: <MessageSquare size={18} />, path: '/messages' },
        { title: 'Profile', icon: <User size={18} />, path: '/profile' },
        { title: 'Settings', icon: <SettingsIcon size={18} />, path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

    return (
        <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* ─── SIDEBAR ─────────────────────────────────────── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-all duration-300 ease-in-out md:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${
                    isDark
                        ? 'bg-[#0A0F1E] border-white/[0.05]'
                        : 'bg-white border-slate-200 shadow-xl'
                }`}
            >
                <div className="h-full flex flex-col">

                    {/* Logo */}
                    <div className={`h-16 flex items-center px-6 border-b ${isDark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-brand">
                                <Zap size={14} className="text-white fill-white" />
                            </div>
                            <span className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Pro<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Konnect</span>
                            </span>
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-extrabold uppercase tracking-widest">
                            <Sparkles size={9} />
                            {currentRole} Workspace
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className={`flex-1 px-3 py-4 space-y-1 overflow-y-auto ${isDark ? 'dark-scrollbar' : 'custom-scrollbar'}`}>
                        {menuItems.map((item) => (
                            <NavLink
                                key={`${item.path}-${item.title}`}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-brand-600/90 to-indigo-600/90 text-white shadow-glow-brand'
                                            : isDark
                                                ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.title}</span>
                                        {isActive && <ChevronRight size={14} className="ml-auto opacity-60" />}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className={`p-4 border-t space-y-3 ${isDark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                        {/* User Info */}
                        <button
                            onClick={() => navigate('/profile')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-50'}`}
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0 shadow-glow-brand overflow-hidden">
                                {user?.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : userInitial}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'Guest User'}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{user?.role || currentRole}</p>
                            </div>
                            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-400 bg-red-500/[0.06] hover:bg-red-500/10 rounded-xl border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ────────────────────────────────── */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

                {/* Top Header */}
                <header className={`h-16 backdrop-blur-xl border-b sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-300 ${isDark ? 'bg-[#0A0F1E]/95 border-white/[0.05]' : 'bg-white/95 border-slate-200 shadow-sm'}`}>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={15} />
                            <input
                                type="text"
                                placeholder="Search opportunities, people..."
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all ${isDark ? 'bg-white/[0.04] border-white/[0.06] text-slate-200 placeholder:text-slate-600 focus:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white'}`}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 ml-auto" ref={notificationRef}>
                        {/* Theme Toggle */}
                        <ThemeToggle variant="icon" />

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                className={`relative p-2.5 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0F1E] animate-pulse" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        className={`absolute top-12 right-0 w-80 rounded-2xl overflow-hidden z-50 origin-top-right ${isDark ? 'bg-[#0F1929] shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/[0.08]' : 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-200'}`}
                                    >
                                        <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-white/[0.05]' : 'border-slate-100 bg-slate-50/50'}`}>
                                            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                <Bell size={14} className="text-brand-400" />
                                                Notifications
                                                {unreadCount > 0 && (
                                                    <span className="px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-extrabold">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </h3>
                                            {unreadCount > 0 && (
                                                <button onClick={handleMarkAllRead} className="text-xs text-brand-400 font-bold hover:text-brand-300 transition-colors">
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className={`max-h-72 overflow-y-auto ${isDark ? 'dark-scrollbar' : 'custom-scrollbar'}`}>
                                            {notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    className={`p-4 border-b transition-colors cursor-pointer ${isDark ? `border-white/[0.04] hover:bg-white/[0.04] ${!n.read ? 'bg-brand-500/[0.04]' : ''}` : `border-slate-50 hover:bg-slate-50 ${!n.read ? 'bg-brand-50/50' : ''}`}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <span className="text-lg">{n.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className={`text-xs font-bold ${!n.read ? 'text-brand-600' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>{n.title}</h4>
                                                                <span className="text-[10px] text-slate-600 shrink-0 ml-2">{n.time}</span>
                                                            </div>
                                                            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{n.text}</p>
                                                        </div>
                                                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1 shrink-0" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`p-3 text-center border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                            <button className={`text-xs font-bold transition-colors hover:text-brand-500 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                View All Notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Avatar */}
                        <button
                            onClick={() => navigate('/profile')}
                            className="md:hidden w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white text-sm font-extrabold shadow-glow-brand overflow-hidden"
                        >
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : userInitial}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
