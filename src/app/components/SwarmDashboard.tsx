"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, LayoutDashboard, ClipboardList, Inbox, 
    Play, Plus, MoreVertical, CheckCircle2, AlertCircle, 
    ArrowRight, MessageSquare, Terminal, Zap, ShieldCheck
} from 'lucide-react';
import { Mission, WorkerProfile, GatewayStatus } from '../../omni/shared/types';

type ViewMode = 'roster' | 'reports' | 'inbox' | 'kanban' | 'conductor';

export default function SwarmDashboard() {
    const [view, setView] = useState<ViewMode>('roster');
    
    // Capability Gate State (Simulated)
    const [gatewayStatus] = useState<GatewayStatus>({
        available: ['chat', 'models', 'streaming', 'swarm', 'conductor'],
        missing: ['memory-browser', 'skills-marketplace'],
        mode: 'enhanced'
    });

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
        <div className="bg-void-stark/40 border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-[750px] backdrop-blur-3xl">
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
                                { id: 'kanban', l: 'Board', i: <LayoutDashboard size={12}/> },
                                { id: 'conductor', l: 'Conductor', i: <Play size={12}/> }
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
                                        <button className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-bold text-slate-300 uppercase tracking-widest hover:bg-white/10 flex items-center justify-center gap-2"><Terminal size={12}/> Attach TUI</button>
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
                            {['Backlog', 'Ready', 'Running', 'Review', 'Blocked', 'Done'].map(lane => (
                                <div key={lane} className="flex-shrink-0 w-64 flex flex-col gap-4">
                                    <div className="flex justify-between items-center px-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                lane === 'Running' ? 'bg-cyan-core animate-pulse' : 
                                                lane === 'Review' ? 'bg-amber-500' : 
                                                lane === 'Done' ? 'bg-emerald-soul' : 'bg-slate-700'
                                            }`}></div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lane}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-slate-700">{lane === 'Done' ? '1' : '0'}</span>
                                    </div>
                                    <div className="flex-1 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl p-4 flex flex-col gap-4 min-h-[400px]">
                                        {lane === 'Done' && (
                                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-soul/30 transition-all group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="text-[9px] font-bold text-emerald-soul uppercase tracking-tighter">mission-001</div>
                                                    <CheckCircle2 size={12} className="text-emerald-soul"/>
                                                </div>
                                                <div className="text-[11px] text-slate-300 mb-4 font-medium leading-relaxed">Docs smoke test complete. Checkpoint verified.</div>
                                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                                    <span className="text-[8px] text-slate-500 font-bold uppercase">Hermes-3 8B</span>
                                                    <span className="text-[8px] text-slate-600 italic">2m ago</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {view === 'conductor' && (
                        <motion.div 
                            key="conductor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-white font-serif text-3xl mb-2">Mission Control</h3>
                                        <p className="text-slate-500 text-sm italic">Decompose high-level goals into autonomous agent workflows.</p>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-cyan-core/10 rounded-xl">
                                        <div className="w-1.5 h-1.5 bg-cyan-core rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-bold text-cyan-core uppercase tracking-widest">Conductor Active</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 mb-12">
                                    <input type="text" placeholder="Enter high-level mission goal (e.g. 'Audit project X for 5T compliance')" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-core/50 transition-all text-sm" />
                                    <button className="px-8 py-4 bg-primary text-white border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-core hover:text-void-stark transition-all">Decompose ⟶</button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { s: 'Researching 5T Metrics', r: 'Sage', st: 'completed' },
                                        { s: 'Generating Audit Log', r: 'Builder', st: 'running' },
                                        { s: 'Final Verification', r: 'Reviewer', st: 'pending' }
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] ${step.st === 'completed' ? 'bg-emerald-soul/20 text-emerald-soul' : step.st === 'running' ? 'bg-cyan-core/20 text-cyan-core' : 'bg-slate-800 text-slate-500'}`}>{i+1}</div>
                                                <div>
                                                    <div className="text-[11px] text-white font-medium">{step.s}</div>
                                                    <div className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Assigned to: <span className="text-slate-400">{step.r}</span></div>
                                                </div>
                                            </div>
                                            <div className="text-[8px] font-bold uppercase tracking-widest">
                                                {step.st === 'completed' ? <span className="text-emerald-soul">Land Checkpoint</span> : step.st === 'running' ? <span className="text-cyan-core animate-pulse">In Progress</span> : <span className="text-slate-600">Queued</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Status */}
            <div className="p-6 bg-void-stark/60 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-8">
                    <div className="flex flex-col">
                        <span className="text-[7px] text-slate-500 uppercase font-bold mb-1">System Status</span>
                        <span className="flex items-center gap-2 text-[9px] font-bold text-emerald-soul uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 bg-emerald-soul rounded-full animate-pulse"></div> 
                            Swarm Sync Active
                        </span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-8">
                        <span className="text-[7px] text-slate-500 uppercase font-bold mb-1">Worker Profiles</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">2/2 Detected in ~/.hermes/</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[7px] text-slate-500 uppercase font-bold mb-1">Safety Boundary</span>
                        <span className="text-[9px] font-bold text-cyan-core uppercase tracking-[0.2em]">Greenlight Gate: Enabled</span>
                    </div>
                    <div className="w-12 h-6 bg-cyan-core/10 rounded-full p-1 border border-cyan-core/30 cursor-pointer relative group">
                        <div className="w-4 h-4 bg-cyan-core rounded-full shadow-lg shadow-cyan-core/50 transition-transform translate-x-6"></div>
                        <div className="absolute -top-10 right-0 bg-primary border border-white/10 p-2 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Requires Human Approval for Commits/Merges
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
