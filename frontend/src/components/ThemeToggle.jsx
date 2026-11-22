import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ThemeToggle – can appear in Navbar (compact) or Dashboard header.
 * variant: 'pill' (default) | 'icon'
 */
const ThemeToggle = ({ variant = 'pill', className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    if (variant === 'icon') {
        return (
            <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    isDark
                        ? 'text-slate-400 hover:text-yellow-300 hover:bg-white/[0.08]'
                        : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'
                } ${className}`}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="sun"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Sun size={18} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Moon size={18} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        );
    }

    // Pill variant (toggle switch style)
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`relative flex items-center gap-2.5 px-4 py-2 rounded-full font-semibold text-xs transition-all duration-300 border ${
                isDark
                    ? 'bg-white/[0.06] border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700'
            } ${className}`}
        >
            {/* Track */}
            <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${isDark ? 'bg-brand-600' : 'bg-slate-300'}`}>
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md flex items-center justify-center ${
                        isDark ? 'bg-white left-[calc(100%-18px)]' : 'bg-white left-0.5'
                    }`}
                >
                    {isDark
                        ? <Moon size={9} className="text-brand-600" />
                        : <Sun size={9} className="text-amber-500" />
                    }
                </motion.div>
            </div>
            <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
        </motion.button>
    );
};

export default ThemeToggle;
