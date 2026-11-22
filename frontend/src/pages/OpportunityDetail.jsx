import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, MapPin, Briefcase, DollarSign, Share2, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';

// Mock data store (ideally this would be in a context or API)
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
        description: 'We are looking for a passionate frontend intern to help build our core product components. You will work directly with our CTO and senior engineers to implement new features.'
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
        description: 'Seeking a charismatic tech reviewer for our YouTube channel. Must have camera presence and editing skills.'
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

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const job = OPPORTUNITIES.find(o => o.id === parseInt(id));

    if (!job) {
        return (
            <DashboardLayout>
                <div className="p-10 text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Opportunity Not Found</h2>
                    <button onClick={() => navigate('/opportunities')} className="mt-4 text-blue-600 hover:underline">Go Back</button>
                </div>
            </DashboardLayout>
        );
    }

    const handleApply = () => {
        addToast('Application submitted successfully!', 'success');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast('Link copied to clipboard!', 'info');
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/opportunities')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Opportunities
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold uppercase ${job.logo}`}>
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                                    <div className="flex items-center gap-2 text-slate-600 mt-1">
                                        <span className="font-medium">{job.company}</span>
                                        <span>•</span>
                                        <span className="text-sm">{job.posted}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleShare} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                                    <Share2 size={20} />
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {job.description}
                                </p>
                                <p className="text-slate-600 leading-relaxed mt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Requirements</h3>
                                <ul className="space-y-3">
                                    {['Proficiency in required tech stack', 'Good communication skills', 'Ability to work in a team', 'Problem-solving mindset'].map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">Job Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Briefcase size={20} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Type</p>
                                            <p className="font-medium">{job.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <MapPin size={20} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
                                            <p className="font-medium">{job.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <DollarSign size={20} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Salary / Rate</p>
                                            <p className="font-medium">{job.salary}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Building size={20} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Company Size</p>
                                            <p className="font-medium">10-50 Employees</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default OpportunityDetail;
