import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-white pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6"
                    >
                        We’re Building the <span className="text-blue-600">Future of Work</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        ProKonnect is on a mission to democratize opportunities for students, creators, and professionals by building the world's most inclusive connection platform.
                    </motion.p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                            <p>
                                It started with a simple observation: Talent is everywhere, but opportunity is not. Students struggle to find meaningful internships. Micro-influencers find it hard to connect with brands. Small businesses can't afford expensive recruitment agencies.
                            </p>
                            <p>
                                We realized that the traditional "job board" model was broken. It was too transactional, too cold, and too focused on just the "top 1%".
                            </p>
                            <p>
                                <span className="font-bold text-slate-900">ProKonnect</span> was born to bridge this gap. We wanted to create a platform that feels like a community—where a student's portfolio is valued as much as a professional's resume, and where a creator's creativity is currency.
                            </p>
                            <p>
                                Today, we are building a holistic ecosystem where anyone—regardless of their background—can find their next big break.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Values */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
                        <p className="text-slate-600">The principles that guide everything we do.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ValueCard
                            title="Inclusivity First"
                            desc="We believe opportunities should be accessible to everyone, not just those with connections."
                        />
                        <ValueCard
                            title="Transparency"
                            desc="No hidden algorithms or shadow bans. We believe in open and honest communication."
                        />
                        <ValueCard
                            title="User Obsession"
                            desc="We build what our users need, not just what's trendy. Your feedback shapes our roadmap."
                        />
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Meet the Team</h2>
                    <p className="text-xl text-blue-600 font-bold mb-12 uppercase tracking-widest">Team ProKonnect</p>

                    <div className="grid md:grid-cols-5 gap-6">
                        {[
                            { name: "Vishesh Jain", role: "Team Member" },
                            { name: "Chinmay Panchal", role: "Team Member" },
                            { name: "Lokesh Sharma", role: "Team Leader" },
                            { name: "Ajaypal Singh", role: "Team Member" },
                            { name: "Hritik Suthar", role: "Team Member" }
                        ].map((member, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                                    👾
                                </div>
                                <h3 className="font-bold text-slate-900">{member.name}</h3>
                                <p className="text-sm text-blue-600 mb-4">{member.role}</p>
                                <div className="flex justify-center gap-3 text-slate-400">
                                    <Linkedin size={18} className="hover:text-blue-700 cursor-pointer" />
                                    <Twitter size={18} className="hover:text-blue-400 cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                        ProKonnect <Heart className="text-red-500 fill-current" size={24} />
                    </div>
                    <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                        Made with love for the builders, the dreamers, and the doers.
                    </p>
                    <div className="flex justify-center gap-8 mb-8">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 ProKonnect Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const ValueCard = ({ title, desc }) => (
    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600">{desc}</p>
    </div>
);

export default About;
