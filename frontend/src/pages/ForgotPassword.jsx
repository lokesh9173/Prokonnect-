import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                addToast('Password reset link sent! Check your email.', 'success');
                setSubmitted(true);
            } else {
                throw new Error(data.message || 'Failed to send reset link');
            }
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans bg-slate-900 selection:bg-purple-500/30 selection:text-white">

            <div className="absolute inset-0 bg-[#0f172a]">
                <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[100px] mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 backdrop-blur-[4px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/10 mx-4 relative z-10"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 rounded-t-3xl opacity-80"></div>

                <div className="mb-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-sm text-slate-400 tracking-wide">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {submitted ? (
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Mail size={32} className="text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                        <p className="text-slate-400 text-sm">We've sent a password reset link to <strong className="text-white">{email}</strong>.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-white placeholder:text-slate-600 backdrop-blur-sm"
                                    placeholder="name@prokonnect.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full relative overflow-hidden py-4 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl font-bold text-white hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="z-10">{loading ? 'Sending...' : 'Send Reset Link'}</span>
                            {!loading && <ArrowRight size={20} className="z-10 group-hover:translate-x-1 transition-transform" />}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
