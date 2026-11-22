import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, Globe, Smartphone, BarChart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Features = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Header */}
            <section className="pt-20 pb-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform translate-x-20" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Powerful Features for <span className="text-blue-600">Everyone</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                            Whether you're a student building a career, a creator growing your brand, or a company hiring talent, ProKonnect has the tools you need.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={<Zap className="text-yellow-500" size={32} />}
                            title="Instant Matching"
                            description="Our AI-driven algorithm connects you with the right opportunities instantly based on your skills and preferences."
                        />
                        <FeatureCard
                            icon={<Shield className="text-green-500" size={32} />}
                            title="Verified Profiles"
                            description="Trust is everything. We verify students, professionals, and companies to ensure a safe ecosystem."
                        />
                        <FeatureCard
                            icon={<Users className="text-blue-500" size={32} />}
                            title="Community & Networking"
                            description="Join vibrant communities, attend virtual events, and network with like-minded individuals."
                        />
                        <FeatureCard
                            icon={<Globe className="text-violet-500" size={32} />}
                            title="Global Opportunities"
                            description="Access remote internships, freelance gigs, and brand deals from companies around the world."
                        />
                        <FeatureCard
                            icon={<Smartphone className="text-pink-500" size={32} />}
                            title="Mobile First Design"
                            description="Stay connected on the go with our fully responsive and optimized mobile experience."
                        />
                        <FeatureCard
                            icon={<BarChart className="text-orange-500" size={32} />}
                            title="Advanced Analytics"
                            description="Creators and Companies get detailed insights into profile views, engagement, and campaign performance."
                        />
                    </motion.div>
                </div>
            </section>

            {/* Role Specific Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Tailored to Your Role</h2>
                    </div>

                    <div className="space-y-20">
                        {/* Student */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={24} /></span>
                                    For Students
                                </h3>
                                <ul className="space-y-4">
                                    <ListItem text="Find internships that match your major" />
                                    <ListItem text="Get mentorship from industry pros" />
                                    <ListItem text="Showcase academic projects in portfolio" />
                                    <ListItem text="Earn certificates and badges" />
                                </ul>
                            </div>
                            <div className="flex-1 bg-blue-50 rounded-2xl p-8 h-64 flex items-center justify-center border border-blue-100">
                                <p className="text-blue-300 font-bold text-xl">Student Dashboard Preview</p>
                            </div>
                        </div>

                        {/* Creator */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="bg-violet-100 p-2 rounded-lg text-violet-600"><Smartphone size={24} /></span>
                                    For Creators
                                </h3>
                                <ul className="space-y-4">
                                    <ListItem text="Direct access to brand sponsorship deals" />
                                    <ListItem text="Collaboration tools for group content" />
                                    <ListItem text="Monetization analytics and tracking" />
                                    <ListItem text="Verified creator badge status" />
                                </ul>
                            </div>
                            <div className="flex-1 bg-violet-50 rounded-2xl p-8 h-64 flex items-center justify-center border border-violet-100">
                                <p className="text-violet-300 font-bold text-xl">Creator Dashboard Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience these features yourself</h2>
                    <p className="text-xl text-slate-400 mb-10">Join ProKonnect today and unlock your potential.</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-blue-600 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50"
                    >
                        Get Started Free
                    </button>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
        <div className="mb-6 p-3 bg-slate-50 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const ListItem = ({ text }) => (
    <li className="flex items-center gap-3 text-slate-700">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        {text}
    </li>
);

export default Features;
