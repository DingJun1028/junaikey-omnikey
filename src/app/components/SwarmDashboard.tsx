"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, LayoutDashboard, ClipboardList, Inbox, 
    Play, Plus, MoreVertical, CheckCircle2, AlertCircle, 
    ArrowRight, MessageSquare, Terminal
} from 'lucide-react';
import { Mission, WorkerProfile } from '../../omni/shared/types';

type ViewMode = 'roster' | 'reports' | 'inbox' | 'kanban';

export default function SwarmDashboard() {
    const [view, setView] = useState<ViewMode>('roster');
    
    const [workers] = useState<WorkerProfile[]>([
        { workerId: 'swarm7', displayName: 'Scribe', role: 'Scribe', model: 'Hermes-3 8B', specialty: 'Docs & Handoff', mission: 'Smoke test docs', skills: ['read', 'audit'], status: 'online' },
        { workerId: 'builder1', displayName: 'Architect', role: 'Builder', model: 'Gemini 2.0 Flash', specialty: 'System Core', mission: 'Gryphon Plan Refactor', skills: ['write', 'refactor'], status: 'busy' }
    ]);

    const [missions] = useState<Mission[]>([
        { 
            missionId: 'mission-001', title: 'Docs smoke test', status: 'completed', startTime: Date.now() - 100000,
            assignments: [{ workerId: 'swarm7', task: 'Review docs/swarm/README.md' }],
            results: [{ workerId: 'swarm7', ok: true, delivery: 'tmux', checkpointStatus: 'checkpointed' }]
        }
    ]);

    return (
        <div className="bg-void-stark/40 border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-[700px] backdrop-blur-3xl">
            {/* Header / Nav */}
            <div className="p-8 bg-void-stark/80 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-emerald-soul/20 rounded-2xl flex items-center justify-center text-emerald-soul shadow-lg shadow-emerald-soul/10">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl text-white tracking-widest">Swarm Mode</h2>
                        <div className="flex gap-4 mt-2">
                            {[
                                { id: 'roster', l: 'Roster', i: <Users size={12}/> },
                                { id: 'reports', l: 'Reports', i: <ClipboardList size={12}/> },
                                { id: 'inbox', l: 'Inbox', i: <Inbox size={12}/> },
                                { id: 'kanban', l: 'Board', i: <LayoutDashboard size={12}/> }
                            ].map(tab => (
                                <button 
                                    key={tab.id} onClick={() => setView(tab.id as any)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${view === tab.id ? 'bg-cyan-core text-void-stark' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {tab.i} {tab.l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button className="flex items-center gap-3 px-6 py-3 bg-cyan-core/10 border border-cyan-core/20 text-cyan-core rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-core hover:text-void-stark transition-all">
                    <Plus size={16} /> Add Swarm
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {view === 'roster' && (
                        <motion.div 
                            key="roster" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {workers.map(w => (
                                <div key={w.workerId} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-core/30 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-mono text-xs">{w.workerId.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <h3 className="text-white font-serif text-lg">{w.displayName}</h3>
                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{w.role} • {w.model}</span>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${w.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div className="text-[10px] text-slate-400 leading-relaxed"><span className="text-cyan-core font-bold">Mission:</span> {w.mission}</div>
                                        <div className="flex flex-wrap gap-2">
                                            {w.skills.map(s => <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-[8px] text-slate-500 font-bold uppercase">{s}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-white/5">
                                        <button className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-bold text-slate-300 uppercase tracking-widest hover:bg-white/10 flex items-center justify-center gap-2"><Terminal size={12}/> Attach</button>
                                        <button className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><MoreVertical size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {view === 'reports' && (
                        <motion.div 
                            key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {missions.map(m => (
                                <div key={m.missionId} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-serif text-white">{m.title}</span>
                                            <span className="text-[8px] px-2 py-0.5 bg-emerald-soul/20 text-emerald-soul rounded-full uppercase font-bold tracking-widest">Completed</span>
                                        </div>
                                        <span className="text-[8px] text-slate-500 uppercase">{new Date(m.startTime).toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {m.results.map(r => (
                                            <div key={r.workerId} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 size={14} className="text-emerald-soul" />
                                                    <span className="text-[10px] text-slate-300 font-bold">{r.workerId}</span>
                                                </div>
                                                <span className="text-[9px] text-slate-500 uppercase tracking-widest">{r.checkpointStatus}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {view === 'inbox' && (
                        <motion.div 
                            key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center py-20"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-700 mb-6">
                                <Inbox size={32} />
                            </div>
                            <h3 className="text-white font-serif text-xl mb-2">Inbox is Clear</h3>
                            <p className="text-slate-500 text-sm italic">The swarm hasn't asked for any judgment yet.</p>
                        </motion.div>
                    )}

                    {view === 'kanban' && (
                        <motion.div 
                            key="kanban" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar"
                        >
                            {['Ready', 'Running', 'Review', 'Done'].map(lane => (
                                <div key={lane} className="flex-shrink-0 w-64 flex flex-col gap-4">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lane}</span>
                                        <span className="text-[8px] font-mono text-slate-700">0</span>
                                    </div>
                                    <div className="flex-1 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl p-4 flex flex-col gap-4">
                                        {lane === 'Done' && (
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <div className="text-[9px] font-bold text-emerald-soul uppercase mb-2">mission-001</div>
                                                <div className="text-[10px] text-slate-300 mb-4 font-medium">Docs smoke test complete.</div>
                                                <div className="flex justify-between items-center text-[8px] text-slate-500">
                                                    <span>8B Model</span>
                                                    <CheckCircle2 size={12}/>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Status */}
            <div className="p-4 bg-void-stark/60 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-soul rounded-full"></div> Swarm Sync Active</span>
                    <span>Profiles: 2/2 Detected</span>
                </div>
                <span>Greenlight Gate: Enabled</span>
            </div>
        </div>
    );
}
