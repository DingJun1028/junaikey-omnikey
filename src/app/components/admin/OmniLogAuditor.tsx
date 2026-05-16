"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck, Activity, Lock, Database, Search } from 'lucide-react';
import { OmniResponseStatus } from '../../../omni/shared/types';

interface LogEntry {
    id: string;
    timestamp: number;
    type: 'INPUT' | 'AUDIT' | 'LOCK' | 'SYNC';
    message: string;
    status: 'pending' | 'success' | 'verified';
    gate?: string;
}

export default function OmniLogAuditor() {
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: '1', timestamp: Date.now() - 5000, type: 'INPUT', message: '收到 ESG 健檢原始數據', status: 'verified' },
        { id: '2', timestamp: Date.now() - 4000, type: 'AUDIT', message: '通過 Tangible 可感知門徑校驗', status: 'success', gate: 'T1' },
        { id: '3', timestamp: Date.now() - 3000, type: 'AUDIT', message: 'Traceable 溯源標記已植入', status: 'success', gate: 'T2' },
        { id: '4', timestamp: Date.now() - 2000, type: 'LOCK', message: '執行 Hash Lock (SHA-256)', status: 'verified' }
    ]);

    // Simulate real-time event stream
    useEffect(() => {
        const messages = [
            { type: 'INPUT', msg: '偵測到 AITable 同步請求' },
            { type: 'AUDIT', msg: 'Transparent 公式驗算中...', gate: 'T4' },
            { type: 'SYNC', msg: '數據已同步至 OmniTable 雲端節點' },
            { type: 'LOCK', msg: '狀態變更：Trustworthy (不可篡改)' }
        ];

        const interval = setInterval(() => {
            const pick = messages[Math.floor(Math.random() * messages.length)];
            const newLog: LogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                type: pick.type as any,
                message: pick.msg,
                status: 'success',
                gate: pick.gate
            };
            setLogs(prev => [newLog, ...prev].slice(0, 15));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-void-stark border border-white/5 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Terminal className="text-cyan-core" size={20} />
                    <h3 className="font-serif text-lg text-white">OmniLog Auditor</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-soul/10 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-soul rounded-full animate-pulse"></div>
                        <span className="text-[8px] font-bold text-emerald-soul uppercase tracking-widest">GPL Live Stream</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4 font-mono">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/5 transition-all"
                        >
                            <div className="mt-1">
                                {log.type === 'INPUT' && <Search size={14} className="text-blue-400" />}
                                {log.type === 'AUDIT' && <Activity size={14} className="text-cyan-core" />}
                                {log.type === 'LOCK' && <Lock size={14} className="text-emerald-soul" />}
                                {log.type === 'SYNC' && <Database size={14} className="text-classic-gold" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-tighter ${
                                        log.type === 'LOCK' ? 'text-emerald-soul' : 'text-slate-500'
                                    }`}>
                                        [{log.type}] {log.gate && `• Gate ${log.gate}`}
                                    </span>
                                    <span className="text-[8px] text-slate-600 italic">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{log.message}</p>
                            </div>
                            <div className="flex items-center">
                                {log.status === 'verified' && <ShieldCheck size={14} className="text-emerald-soul" />}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Memory Recall: 95.4%</span>
                <span>Entropy Status: Stable (-0.04%)</span>
            </div>
        </div>
    );
}
