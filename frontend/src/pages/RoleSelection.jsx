import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video, Building2, Check, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

// Background images for dynamic crossfading
const backgrounds = {
    default: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2560&auto=format&fit=crop", // Abstract tech/networking
    business: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2560&auto=format&fit=crop", // Professional corporate/business
    influencer: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2560&auto=format&fit=crop" // Social media icons (IG, FB, Twitter) neon
};

const roles = [
    {
        id: 'business',
        title: 'Business',
        icon: <Building2 size={36} />,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/40 hover:border-indigo-400',
        activeRing: 'ring-indigo-500',
        description: 'Hire talent, post jobs, and find creators for your campaigns.'
    },
    {
        id: 'influencer',
        title: 'Influencer',
        icon: <Video size={36} />,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/40 hover:border-orange-400',
        activeRing: 'ring-orange-500',
        description: 'Collaborate with brands, showcase your portfolio, and get hired.'
    }
];

const RoleSelection = () => {
    const navigate = useNavigate();
    const { selectRole } = useUser();
    const { addToast } = useToast();
    const [selectedRole, setSelectedRole] = useState(null);
    const [hoveredRole, setHoveredRole] = useState(null);

    const handleContinue = async () => {
        if (selectedRole) {
            await selectRole(selectedRole);
            addToast(`Welcome! You selected ${selectedRole.toUpperCase()}`, 'success');

            // Navigate based on role
            if (selectedRole === 'business') {
                navigate('/business-dashboard');
            } else {
                navigate('/influencer-dashboard');
            }
        }
    };

    const activeBackground = hoveredRole || selectedRole || 'default';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans bg-slate-950 px-4 py-12 transition-colors duration-500">
            
            {/* Dynamic Background Images Layer */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence>
                    <motion.img
                        key={activeBackground}
                        src={backgrounds[activeBackground]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Background"
                    />
                </AnimatePresence>
                {/* Heavy dark gradient overlay to ensure UI legibility and premium look */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 backdrop-blur-[6px]"></div>
            </div>

            <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg"
                >
                    Choose Your Role
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-lg text-slate-300 font-medium drop-shadow-md"
                >
                    Who are you in the ProKonnect ecosystem?
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full mb-12 relative z-10">
                {roles.map((role, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole(role.id)}
                        onMouseEnter={() => setHoveredRole(role.id)}
                        onMouseLeave={() => setHoveredRole(null)}
                        className={`cursor-pointer p-8 rounded-3xl border transition-all duration-300 backdrop-blur-2xl flex flex-col items-center text-center gap-5 overflow-hidden relative ${
                            selectedRole === role.id 
                            ? `bg-white/10 ${role.border} ring-1 ${role.activeRing} shadow-[0_0_50px_rgba(0,0,0,0.6)]` 
                            : 'bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.08] shadow-[0_0_30px_rgba(0,0,0,0.4)]'
                        }`}
                    >
                        {/* Decorative Social Icons specifically for Influencer */}
                        {role.id === 'influencer' && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity">
                                {/* Insta */}
                                <svg className="absolute top-4 left-4 w-12 h-12 text-pink-500 transform -rotate-12 blur-[1px]" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                                {/* Facebook */}
                                <svg className="absolute bottom-4 right-4 w-14 h-14 text-blue-500 transform rotate-12 blur-[2px]" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                                {/* Twitter */}
                                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-sky-400 opacity-20 blur-[4px]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                            </div>
                        )}

                        <div className={`relative p-5 rounded-2xl ${role.bg} ${role.color} mb-2 shadow-inner border border-white/[0.05] z-10`}>
                            {role.icon}
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex justify-center items-center gap-3 mb-3">
                                <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">{role.title}</h3>
                                {selectedRole === role.id && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <Check className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={24} />
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-slate-300 leading-relaxed text-base font-medium">{role.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`relative z-10 px-10 py-4 rounded-2xl font-bold text-[15px] uppercase tracking-wide flex items-center gap-3 transition-all ${
                    selectedRole
                    ? 'bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] transform hover:-translate-y-1'
                    : 'bg-white/[0.05] text-slate-500 cursor-not-allowed border border-white/[0.05]'
                }`}
            >
                Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'} 
                <ArrowRight size={18} />
            </motion.button>
        </div>
    );
};

export default RoleSelection;
