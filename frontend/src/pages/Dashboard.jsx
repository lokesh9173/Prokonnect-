import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Users, ArrowUpRight, DollarSign } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

// Mock Data
const studentData = {
    applied: 12,
    interviews: 3,
    profileViews: 45,
    recommended: [
        { id: 1, role: 'Frontend Developer Intern', company: 'TechCorp', location: 'Remote', type: 'Paid' },
        { id: 2, role: 'UI/UX Designer', company: 'CreativeStudio', location: 'Bangalore', type: 'Paid' },
        { id: 3, role: 'Marketing Intern', company: 'GrowthX', location: 'Mumbai', type: 'Unpaid' },
    ]
};

const creatorData = {
    earnings: '₹45,000',
    collaborations: 8,
    reach: '125K',
    activeDeals: [
        { id: 1, brand: 'FashionNova', campaign: 'Summer Collection', status: 'Pending', amount: '₹15,000' },
        { id: 2, brand: 'TechGear', campaign: 'Unboxing Video', status: 'Active', amount: '₹10,000' },
    ]
};

const Dashboard = () => {
    // Can be 'student', 'creator', or 'company'
    const [role, setRole] = useState('student');
    const { addToast } = useToast();

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        addToast(`Switched to ${newRole} view`, 'info');
    };

    return (
        <DashboardLayout role={role}>
            {/* Role Switcher for Demo - Remove in production */}
            <div className="mb-8 flex gap-2">
                {['student', 'creator', 'company'].map((r) => (
                    <button
                        key={r}
                        onClick={() => handleRoleSwitch(r)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${role === r ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                    >
                        view as {r}
                    </button>
                ))}
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, here's what's happening with your account.</p>
                </div>

                {role === 'student' && <StudentDashboard />}
                {role === 'creator' && <CreatorDashboard />}
                {role === 'company' && <CompanyDashboard />}
            </div>
        </DashboardLayout>
    );
};

const StudentDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Applied Jobs"
                    value={studentData.applied}
                    icon={<Briefcase className="text-blue-600" size={24} />}
                    trend="+2 this week"
                    onClick={() => navigate('/opportunities')}
                />
                <StatCard
                    title="Interviews"
                    value={studentData.interviews}
                    icon={<Users className="text-violet-600" size={24} />}
                    trend="1 upcoming"
                    onClick={() => navigate('/messages')}
                />
                <StatCard
                    title="Profile Views"
                    value={studentData.profileViews}
                    icon={<TrendingUp className="text-emerald-600" size={24} />}
                    trend="+14% vs last week"
                    onClick={() => navigate('/profile')}
                />
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recommended for You</h2>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {studentData.recommended.map((job, idx) => (
                        <div
                            key={job.id}
                            onClick={() => navigate(`/opportunities/${job.id}`)}
                            className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${idx !== studentData.recommended.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            <div>
                                <h3 className="font-semibold text-slate-900">{job.role}</h3>
                                <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{job.type}</span>
                                <button className="p-2 text-slate-400 hover:text-blue-600">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CreatorDashboard = () => {
    const { addToast } = useToast();
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Earnings"
                    value={creatorData.earnings}
                    icon={<DollarSign className="text-green-600" size={24} />}
                    trend="+12% this month"
                    onClick={() => addToast('Earnings details coming soon', 'info')}
                />
                <StatCard
                    title="Active Collabs"
                    value={creatorData.collaborations}
                    icon={<Briefcase className="text-purple-600" size={24} />}
                    trend="2 new requests"
                    onClick={() => addToast('Collaborations details coming soon', 'info')}
                />
                <StatCard
                    title="Total Reach"
                    value={creatorData.reach}
                    icon={<TrendingUp className="text-blue-600" size={24} />}
                    trend="+5K followers"
                    onClick={() => addToast('Analytics dashboard coming soon', 'info')}
                />
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Active Brand Deals</h2>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {creatorData.activeDeals.map((deal, idx) => (
                        <div
                            key={deal.id}
                            onClick={() => addToast(`Opening details for ${deal.brand}`, 'info')}
                            className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${idx !== creatorData.activeDeals.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            <div>
                                <h3 className="font-semibold text-slate-900">{deal.brand}</h3>
                                <p className="text-sm text-slate-500">{deal.campaign}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-900">{deal.amount}</div>
                                <span className={`text-xs font-medium ${deal.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {deal.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CompanyDashboard = () => (
    <div className="p-8 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center">
        <h3 className="text-lg font-medium text-slate-500">Company Dashboard Coming Soon</h3>
        <p className="text-slate-400 text-sm mt-1">We are building tools for you to hire and collaborate.</p>
    </div>
);

const StatCard = ({ title, value, icon, trend, onClick }) => (
    <motion.div
        whileHover={{ y: -2 }}
        onClick={onClick}
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm text-slate-500">{title}</p>
    </motion.div>
);

export default Dashboard;
