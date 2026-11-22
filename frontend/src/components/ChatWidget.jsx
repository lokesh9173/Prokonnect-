import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 I'm the ProKonnect Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Add a temporary typing indicator message
        const typingId = Date.now() + 1;
        setMessages(prev => [...prev, { id: typingId, text: "...", sender: 'bot', isTyping: true }]);

        try {
            // Call the Groq AI backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            });

            const data = await response.json();

            // Replace typing indicator with real response
            setMessages(prev => prev.map(msg => 
                msg.id === typingId 
                ? { id: typingId, text: data.reply || "Sorry, I couldn't understand that.", sender: 'bot' }
                : msg
            ));

        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages(prev => prev.map(msg => 
                msg.id === typingId 
                ? { id: typingId, text: "Sorry, I am having trouble connecting right now. Please try again later.", sender: 'bot' }
                : msg
            ));
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] rounded-3xl overflow-hidden flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-900/80 backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-between border-b border-white/10 shadow-lg">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight tracking-wide">ProKonnect Support</h3>
                                    <p className="text-orange-100 text-xs font-medium flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id} 
                                    className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                                >
                                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                        {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                                    </div>
                                    <div 
                                        className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.sender === 'user' 
                                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-900/50 border-t border-white/10 backdrop-blur-xl">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-slate-800/80 border border-white/10 text-white placeholder:text-slate-400 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                >
                                    <Send size={16} className="ml-1" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.5)] border border-white/20 z-50 overflow-hidden relative group"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:-rotate-12 transition-transform duration-300" />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
