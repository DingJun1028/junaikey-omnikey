"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Cpu, Database, ShieldCheck, Zap } from 'lucide-react';
import { 
    OmniRequestType, 
    OmniResponseStatus, 
    Message, 
    ApiResponse 
} from '../../omni/shared/types';

interface OmniCoreChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OmniCoreChat({ isOpen, onClose }: OmniCoreChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: 'adan', 
            content: '🌌 萬能心核已喚醒。我是 AI 阿丹，您的王道智慧代理。今日需處理哪項 5T 事務？', 
            timestamp: Date.now() 
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const userMsg: Message = { role: 'user', content: inputValue, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsThinking(true);

        try {
            // Simulated implementation of the process logic
            // In the "Ultimate Version", this would call the server/proxy
            setTimeout(() => {
                const response: ApiResponse = {
                    id: Math.random().toString(36).substr(2, 9),
                    status: OmniResponseStatus.SUCCESS,
                    content: `針對「${userMsg.content}」的王道 5T 分析已完成。數據已進行 Hash Lock，狀態：Trustworthy。`,
                    latency: 450
                };
                setMessages(prev => [...prev, { 
                    role: 'adan', 
                    content: response.content, 
                    status: response.status,
                    timestamp: Date.now() 
                }]);
                setIsThinking(false);
            }, 1500);
        } catch (err) {
            setIsThinking(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="fixed bottom-12 right-12 z-[200] w-[500px] h-[700px] flex flex-col overflow-hidden glass-panel rounded-3xl shadow-2xl border border-white/10"
                >
                    {/* Header */}
                    <div className="p-8 bg-void-stark/80 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-core to-emerald-soul rounded-full flex items-center justify-center shadow-lg shadow-cyan-core/20">
                                <Cpu className="text-white" size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl text-white tracking-widest">OmniCore v4.0</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-soul rounded-full animate-pulse"></span>
                                    <span className="text-[9px] text-cyan-core font-bold uppercase tracking-widest">Double-Ended TS Active</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X size={24}/></button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-void-stark/40">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-6 max-w-[85%] rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-cyan-core/20 text-cyan-core border border-cyan-core/30' 
                                    : 'bg-white/5 text-slate-300 border border-white/10 italic'
                                }`}>
                                    {msg.content}
                                </div>
                                <div className="mt-2 text-[8px] text-slate-500 uppercase tracking-widest flex gap-3">
                                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    {msg.status === OmniResponseStatus.SUCCESS && <span className="text-emerald-soul flex items-center gap-1"><ShieldCheck size={10}/> Hash Locked</span>}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex items-center gap-3 text-cyan-core animate-pulse">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-cyan-core rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-cyan-core rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-1 bg-cyan-core rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">阿丹正在深思 5T 門徑...</span>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-void-stark/60 grid grid-cols-4 gap-2 border-t border-white/5">
                        {[
                            { label: '5T Audit', icon: <Zap size={14}/> },
                            { label: 'RAG Sync', icon: <Database size={14}/> },
                            { label: 'Strategy', icon: <ShieldCheck size={14}/> },
                            { label: 'Optimize', icon: <Cpu size={14}/> }
                        ].map(btn => (
                            <button key={btn.label} className="flex flex-col items-center justify-center py-3 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all group">
                                <span className="text-slate-400 group-hover:text-cyan-core mb-1">{btn.icon}</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{btn.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-8 bg-void-stark/80 border-t border-white/10 flex gap-4">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="輸入指令或經營難題..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-core/50 transition-all text-sm font-light"
                        />
                        <button 
                            onClick={handleSend}
                            className="w-14 h-14 bg-cyan-core text-void-stark rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-core/20"
                        >
                            <Send size={24} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
