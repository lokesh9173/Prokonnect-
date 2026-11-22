import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, DollarSign, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';

// Mock Data (Shared with Detail page for consistency in a real app, typically fetched)
const OPPORTUNITIES = [
    {
        id: 1,
        title: 'Frontend Developer Intern',
        company: 'TechFlow Systems',
        logo: 'bg-blue-100 text-blue-600',
        type: 'Internship',
        location: 'Remote',
        salary: '₹15,000/mo',
        posted: '2 days ago',
        tags: ['React', 'Tailwind', 'Frontend'],
        description: 'We are looking for a passionate frontend intern to help build our core product components.'
    },
    {
        id: 2,
        title: 'Content Creator - Tech',
        company: 'GadgetZone',
        logo: 'bg-violet-100 text-violet-600',
        type: 'Contract',
        location: 'Bangalore',
        salary: '₹50,000/video',
        posted: '1 day ago',
        tags: ['Video', 'Tech Review', 'Social Media'],
        description: 'Seeking a charismatic tech reviewer for our YouTube channel. Must have camera presence.'
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        company: 'Creative Minds',
        logo: 'bg-pink-100 text-pink-600',
        type: 'Full-time',
        location: 'Mumbai (Hybrid)',
        salary: '₹4-6 LPA',
        posted: 'Just now',
        tags: ['Figma', 'Prototyping', 'Mobile Design'],
        description: 'Design beautiful interfaces for our mobile apps. Experience with Figma is a must.'
    },
    {
        id: 4,
        title: 'Social Media Manager',
        company: 'GrowthHacker',
        logo: 'bg-green-100 text-green-600',
        type: 'Part-time',
        location: 'Remote',
        salary: '₹20,000/mo',
        posted: '3 days ago',
        tags: ['Instagram', 'LinkedIn', 'Copywriting'],
        description: 'Manage our social media presence and grow our community engagement.'
    },
    {
        id: 5,
        title: 'Backend Developer (Node.js)',
        company: 'ServerSide',
        logo: 'bg-orange-100 text-orange-600',
        type: 'Internship',
        location: 'Delhi',
        salary: '₹12,000/mo',
        posted: '5 days ago',
        tags: ['Node.js', 'MongoDB', 'API'],
        description: 'Help us scale our backend infrastructure. Great learning opportunity for students.'
    }
];

const Opportunities = () => {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { addToast } = useToast();

    const filteredOpportunities = OPPORTUNITIES.filter(job => {
        const matchesFilter = filter === 'All' || job.type === filter;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handlePostOpportunity = () => {
        addToast('Post Opportunity feature coming soon!', 'info');
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
                        <p className="text-slate-500">Find the perfect project, internship, or collaboration.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePostOpportunity}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
                    >
                        Post Opportunity
                    </motion.button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, skill, or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Internship', 'Full-time', 'Contract', 'Part-time'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === type
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Opportunity List */}
                <div className="space-y-4">
                    {filteredOpportunities.length > 0 ? (
                        filteredOpportunities.map((job) => (
                            <OpportunityCard key={job.id} job={job} onClick={() => navigate(`/opportunities/${job.id}`)} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-slate-500">No opportunities found</h3>
                            <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
};

const OpportunityCard = ({ job, onClick }) => {
    const { addToast } = useToast();

    const handleApply = (e) => {
        e.stopPropagation();
        addToast('Application submitted successfully!', 'success');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold uppercase shrink-0 ${job.logo}`}>
                    {job.company.charAt(0)}
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            {job.posted}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1"><Building size={16} /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700"><DollarSign size={16} /> {job.salary}</span>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {job.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div className="flex gap-2">
                            {job.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-100">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Opportunities;
