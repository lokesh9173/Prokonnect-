import React from 'react';
import { isDemoMode, setDemoMode, loginAsDemoRole, resetAllDemoData } from '../demo/demoMode.js';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, RefreshCw, LogOut, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoBanner = () => {
    const active = isDemoMode();
    const { user, setUser, role, logout } = useUser();
    const { addToast } = useToast();
    const navigate = useNavigate();

    if (!active) {
        return null;
    }

    const handleSwitchRole = (newRole) => {
        const authData = loginAsDemoRole(newRole);
        setUser(authData);
        addToast(`Switched to Demo ${newRole === 'business' ? 'Business (Vogue Apparel)' : 'Influencer (Alex Rivera)'}`, 'success');
        navigate(newRole === 'business' ? '/business-dashboard' : '/influencer-dashboard');
    };

    const handleReset = () => {
        if (window.confirm('Reset all demo data back to default pre-seeded state?')) {
            resetAllDemoData();
            addToast('Demo data restored to initial state!', 'info');
            window.location.reload();
        }
    };

    const handleExitDemo = () => {
        if (window.confirm('Exit Demo Mode and return to standard live mode?')) {
            setDemoMode(false);
            logout();
            window.location.href = '/login';
        }
    };

    return (
        <div className="relative z-[9999] select-none bg-slate-950/95 dark:bg-slate-950/95 text-slate-200 border-b border-amber-500/30 backdrop-blur-md shadow-lg transition-all">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-3 text-xs">
                {/* Left: Indicator & Status */}
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm flex-shrink-0">
                        <Sparkles size={11} className="text-amber-400 animate-pulse" />
                        Demo Mode
                    </span>

                    <span className="hidden md:inline text-slate-400 text-[11px] truncate">
                        Local in-browser simulation • No server required
                    </span>

                    {user && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300 font-medium border-l border-white/10 pl-2.5 ml-1">
                            Active: <strong className="text-white font-bold">{user.name}</strong> 
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-brand-300 uppercase font-semibold">
                                {role || user.role}
                            </span>
                        </span>
                    )}
                </div>

                {/* Right: Quick Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    {/* Role Switcher */}
                    {role === 'business' ? (
                        <button
                            onClick={() => handleSwitchRole('influencer')}
                            className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 hover:text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all text-[11px]"
                            title="Switch to Demo Influencer (Alex Rivera)"
                        >
                            <Repeat size={12} />
                            <span className="hidden xs:inline">Switch to</span> Influencer
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSwitchRole('business')}
                            className="px-2.5 py-1 bg-brand-600/30 hover:bg-brand-600/50 border border-brand-500/40 text-brand-200 hover:text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all text-[11px]"
                            title="Switch to Demo Business (Vogue Apparel)"
                        >
                            <Repeat size={12} />
                            <span className="hidden xs:inline">Switch to</span> Business
                        </button>
                    )}

                    {/* Reset Store */}
                    <button
                        onClick={handleReset}
                        className="px-2 py-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white rounded-lg font-medium flex items-center gap-1 transition-all text-[11px]"
                        title="Restore pre-seeded campaigns and applications"
                    >
                        <RefreshCw size={11} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    {/* Exit Demo */}
                    <button
                        onClick={handleExitDemo}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-100 rounded-lg font-medium flex items-center gap-1 transition-all text-[11px]"
                        title="Exit demo mode"
                    >
                        <LogOut size={11} />
                        <span className="hidden md:inline">Exit</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoBanner;
