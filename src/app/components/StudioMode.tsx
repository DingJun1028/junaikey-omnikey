"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Monitor, Play, EyeOff, LayoutTemplate, Sparkles } from 'lucide-react';

export default function StudioMode() {
    const [isStudioOn, setStudio] = useState(false);
    const [status, setStatus] = useState("Ready to Record");

    const toggleStudio = () => {
        setStudio(!isStudioOn);
        if (!isStudioOn) {
            document.body.classList.add('studio-active');
            setStatus("Studio Mode: Optimized");
        } else {
            document.body.classList.remove('studio-active');
            setStatus("Ready to Record");
        }
    };

    const runSequence = () => {
        setStatus("Running Demo Sequence...");
        // This would trigger various UI states in page.tsx via global state or context
        setTimeout(() => setStatus("Step 1: ESG Health Check Activated"), 1000);
        setTimeout(() => setStatus("Step 2: 5T Logic Gate Verifying..."), 3000);
        setTimeout(() => setStatus("Step 3: BoostBody Executing Sync"), 5000);
        setTimeout(() => setStatus("Step 4: Ares Security Seal Issued"), 7000);
        setTimeout(() => setStatus("Demo Sequence Complete"), 9000);
    };

    return (
        <div className="fixed top-28 right-12 z-[200]">
            <div className={`glass-panel p-4 rounded-2xl border border-white/10 shadow-xl transition-all ${isStudioOn ? 'bg-cyan-core/20 border-cyan-core/50' : ''}`}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleStudio}
                        className={`p-3 rounded-xl transition-all ${isStudioOn ? 'bg-cyan-core text-void-stark shadow-lg shadow-cyan-core/50' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                        title="Toggle Studio Mode"
                    >
                        <Video size={20} />
                    </button>
                    
                    <AnimatePresence>
                        {isStudioOn && (
                            <motion.div 
                                initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                                className="flex items-center gap-4 overflow-hidden"
                            >
                                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                                <button 
                                    onClick={runSequence}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-soul text-void-stark rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    <Play size={12} fill="currentColor" /> Run Demo
                                </button>
                                <div className="flex flex-col min-w-[150px]">
                                    <span className="text-[8px] font-bold text-cyan-core uppercase tracking-widest animate-pulse">{status}</span>
                                    <span className="text-[7px] text-slate-500 uppercase tracking-tighter">Bitrate: 15Mbps • 4K Native</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isStudioOn && (
                        <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Demo Recording</span>
                            <span className="text-[10px] text-slate-300 font-serif">Studio Off</span>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .studio-active header,
                .studio-active .fixed.bottom-12,
                .studio-active .scroll-indicator {
                    opacity: 0.1 !important;
                    pointer-events: none !important;
                    transition: opacity 1s ease;
                }
                .studio-active .glass-panel {
                    border-color: rgba(6, 182, 212, 0.3) !important;
                    box-shadow: 0 0 40px rgba(6, 182, 212, 0.1) !important;
                }
                .studio-active body {
                    cursor: crosshair;
                }
            `}</style>
        </div>
    );
}
