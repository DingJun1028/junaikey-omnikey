"use client";

import React from 'react';
import AITableSyncDashboard from '../../components/admin/AITableSyncDashboard';
import AITableConflictManager from '../../components/admin/AITableConflictManager';
import AITableDataMapper from '../../components/admin/AITableDataMapper';
import OmniLogAuditor from '../../components/admin/OmniLogAuditor';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AITableAdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
           <ChevronLeft size={16} /> Back to Academy
        </Link>
        
        <header className="mb-12">
           <span className="text-wangdao-red font-bold text-[10px] tracking-[0.4em] uppercase mb-2 block">System Governance</span>
           <h1 className="text-4xl md:text-5xl font-serif text-primary">AITable Data Trust Center</h1>
           <p className="text-slate-500 mt-4 max-w-2xl font-light italic">
              ESGss JunAiKey Beta 數據治理中心。管理本地 InfoOne 資料庫與 OmniTable NoSQL 雲端節點間的雙向同步、衝突解決與欄位映射。
           </p>
        </header>

        <div className="space-y-12">
           <section>
              <AITableSyncDashboard />
           </section>
           
           <div className="grid lg:grid-cols-2 gap-8">
              <section>
                 <AITableConflictManager />
              </section>
              <section>
                 <AITableDataMapper />
              </section>
           </div>
        </div>

        <footer className="mt-20 pt-12 border-t border-slate-200 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
           OmniTable Integration Engine V1.0 • ESG Sunshine Digital Arsenal
        </footer>
      </div>
    </div>
  );
}
ng-[0.4em]">
           OmniTable Integration Engine V1.0 • ESG Sunshine Digital Arsenal
        </footer>
      </div>
    </div>
  );
}
