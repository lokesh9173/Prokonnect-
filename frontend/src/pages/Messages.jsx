import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { Search, MoreVertical, Send, Paperclip, Phone, Video, Smile, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Contacts with UNIQUE conversation IDs or just unique messages mapping
const CONTACTS = [
    { id: 1, name: 'Sarah Jenkins', role: 'Influencer', avatar: 'bg-accent-100 text-accent-600', status: 'online', time: '2m ago' },
    { id: 2, name: 'TechFlow Systems', role: 'Business (Verified)', avatar: 'bg-brand-100 text-brand-600', status: 'offline', time: '1h ago' },
    { id: 3, name: 'Mike Tech', role: 'Influencer', avatar: 'bg-red-100 text-red-600', status: 'online', time: '3h ago' },
    { id: 4, name: 'EcoLuxe Fashion', role: 'Business', avatar: 'bg-green-100 text-green-600', status: 'offline', time: '1d ago' },
    { id: 5, name: 'David Design', role: 'Influencer', avatar: 'bg-orange-100 text-orange-600', status: 'offline', time: '2d ago' },
];

// Initial Message Store (Unique per ID)
const INITIAL_MESSAGES = {
    1: [
        { id: 1, sender: 'them', text: 'Hey there! I saw your new promotion for the Summer Collection.', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Hi Sarah! Yes, we are looking for fashion influencers.', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'I would love to collaborate. My engagement rate is 5.2%.', time: '10:33 AM' },
    ],
    2: [
        { id: 1, sender: 'them', text: 'Here is the contract for the SaaS review video.', time: 'Yesterday' },
        { id: 2, sender: 'me', text: 'Thanks! I will review it by tonight.', time: 'Yesterday' },
    ],
    3: [
        { id: 1, sender: 'me', text: 'Hey Mike, do you do unboxing videos for tech gadgets?', time: 'Mon' },
        { id: 2, sender: 'them', text: 'Absolutely! Send me the details.', time: 'Mon' },
    ],
    4: [
        { id: 1, sender: 'them', text: 'Your reel hit 50k views! Great job.', time: 'Sunday' },
    ],
    5: [
        { id: 1, sender: 'me', text: 'Love your portfolio David.', time: 'Last Week' },
    ]
};

const Messages = () => {
    const { role } = useUser();
    const { addToast } = useToast();
    const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
    const [messageInput, setMessageInput] = useState('');

    // State to hold all conversations
    const [conversations, setConversations] = useState(INITIAL_MESSAGES);

    // Get current chat history based on selected contact
    const currentChat = conversations[selectedContact.id] || [];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Update conversation state only for this contact
        setConversations(prev => ({
            ...prev,
            [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
        }));

        setMessageInput('');

        // Simulate reply
        setTimeout(() => {
            const replyMsg = {
                id: Date.now() + 1,
                sender: 'them',
                text: getDummyReply(selectedContact.role),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setConversations(prev => ({
                ...prev,
                [selectedContact.id]: [...prev[selectedContact.id], replyMsg]
            }));
            addToast(`New message from ${selectedContact.name}`, 'info');
        }, 1500);
    };

    const getDummyReply = (role) => {
        if (role.toLowerCase().includes('business')) return "That sounds perfect. Let's send over the creative brief.";
        return "Awesome! I'll get started on the content right away.";
    };

    const getLastMessage = (contactId) => {
        const msgs = conversations[contactId];
        if (!msgs || msgs.length === 0) return 'Start a conversation...';
        return msgs[msgs.length - 1].text;
    };

    return (
        <DashboardLayout role={role || 'influencer'}>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden h-[calc(100vh-140px)] flex">

                {/* Sidebar List */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <h2 className="text-lg font-bold text-slate-900 mb-3 px-1">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search conversations"
                                className="w-full pl-9 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {CONTACTS.map((contact) => (
                            <motion.div
                                key={contact.id}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                                onClick={() => setSelectedContact(contact)}
                                className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${selectedContact?.id === contact.id ? 'bg-white border-l-4 border-l-brand-600 shadow-sm' : 'border-l-4 border-l-transparent hover:bg-white'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white ${contact.avatar}`}>
                                        {contact.name.charAt(0)}
                                    </div>
                                    {contact.status === 'online' && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm font-bold truncate ${selectedContact?.id === contact.id ? 'text-brand-900' : 'text-slate-900'}`}>
                                            {contact.name}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-medium">{contact.time}</span>
                                    </div>
                                    <p className={`text-xs truncate ${selectedContact?.id === contact.id ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                                        {getLastMessage(contact.id)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50/30 relative">
                    {/* Chat Header */}
                    <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${selectedContact.avatar.replace('text-', 'bg-').split(' ')[0].replace('100', '500')}`}>
                                {selectedContact.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 leading-tight">{selectedContact.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${selectedContact.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                    <span className="text-xs text-slate-500 capitalize font-medium">{selectedContact.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <button onClick={() => addToast('Starting voice call (Simulated)...', 'info')} className="hover:text-brand-600 transition-colors p-2 hover:bg-slate-50 rounded-full"><Phone size={20} /></button>
                            <button onClick={() => addToast('Starting video call (Simulated)...', 'info')} className="hover:text-brand-600 transition-colors p-2 hover:bg-slate-50 rounded-full"><Video size={20} /></button>
                            <button className="hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
                        <AnimatePresence>
                            {currentChat.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm relative group ${msg.sender === 'me'
                                            ? 'bg-brand-600 text-white rounded-br-none'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="leading-relaxed text-[15px]">{msg.text}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-brand-100' : 'text-slate-400'}`}>
                                            <span className="text-[10px]">{msg.time}</span>
                                            {msg.sender === 'me' && <Check size={12} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {currentChat.length === 0 && (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                No messages yet. Start the conversation!
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="flex gap-4 items-end max-w-4xl mx-auto">
                            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center gap-2 px-4 py-3 border border-transparent focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
                                <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors"><Smile size={20} /></button>
                                <textarea
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="bg-transparent w-full focus:outline-none text-sm resize-none h-5 max-h-24 py-1 text-slate-700 placeholder:text-slate-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                ></textarea>
                                <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors"><Paperclip size={20} /></button>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={!messageInput.trim()}
                                className="p-3.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20 transition-all"
                            >
                                <Send size={20} className={messageInput.trim() ? 'translate-x-0.5' : ''} />
                            </motion.button>
                        </form>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Messages;
