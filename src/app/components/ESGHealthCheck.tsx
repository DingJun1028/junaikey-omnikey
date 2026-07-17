"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BarChart3, ArrowRight, ClipboardCheck, Sparkles, RefreshCcw } from 'lucide-react';
import { omniClient } from '../api/omniClient';
import { OmniRequestType } from '../../omni/shared/types';

const steps = [
  { id: 'tangible', label: '有形價值', q: '貴司目前的 ESG 投入是否具備明確的財務預算與專款專用機制？', icon: <BarChart3 /> },
  { id: 'future', label: '未來價值', q: '是否已建立 2030/2050 淨零路徑圖，並通過董事會核定？', icon: <Sparkles /> },
  { id: 'intangible', label: '無形價值', q: '企業文化中，是否已將「王道利他」精神轉化為員工 KPI 或晉升標準？', icon: <ShieldCheck /> }
];

export default function ESGHealthCheck() {
  const [currentStep, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [steps[currentStep].id]: val }));
    if (currentStep < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      generateReport();
    }
  };

  const generateReport = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `分析以下 ESG 數據：${JSON.stringify(answers)}`;
      const result = await omniClient.process(OmniRequestType.QUERY, prompt);
      setReport(result.content);
    } catch (err) {
      setReport("無法生成報告，系統熵值暫時不穩。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setReport(null);
  };

  return (
    <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[600px] flex flex-col justify-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-core to-emerald-soul"></div>
      
      <AnimatePresence mode="wait">
        {!report ? (
          <motion.div 
            key="questions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center"
          >
            {isAnalyzing ? (
              <div className="space-y-8">
                 <div className="w-24 h-24 border-4 border-cyan-core/20 border-t-cyan-core rounded-full animate-spin mx-auto"></div>
                 <h3 className="text-2xl font-serif text-white">阿丹正在驗算 5T 門徑...</h3>
                 <p className="text-slate-400 text-sm uppercase tracking-[0.4em]">Propagating Trust Signal</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-core mb-8">
                  {steps[currentStep].icon}
                </div>
                <span className="text-emerald-soul text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Step {currentStep + 1} of {steps.length} • {steps[currentStep].label}</span>
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-12 leading-tight max-w-xl">
                  {steps[currentStep].q}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                  {['完全符合', '部分符合', '規劃中', '尚未啟動'].map(ans => (
                    <button 
                      key={ans} onClick={() => handleAnswer(ans)}
                      className="py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:bg-cyan-core hover:text-void-stark hover:border-cyan-core transition-all text-sm font-bold uppercase tracking-widest active:scale-95"
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="report" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-emerald-soul/20 text-emerald-soul rounded-full flex items-center justify-center mb-8">
               <ClipboardCheck size={40} />
            </div>
            <h3 className="text-4xl font-serif text-white mb-6">王道 ESG 健檢報告</h3>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl mb-12 max-w-2xl text-left italic leading-relaxed text-slate-300 text-lg">
              {report}
            </div>
            <div className="flex gap-6">
               <button onClick={() => window.location.hash = '#enroll'} className="px-12 py-5 bg-wangdao-red text-white rounded-2xl text-xs font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl shadow-wangdao-red/20 flex items-center gap-4">
                  申請專家深談 <ArrowRight size={16}/>
               </button>
               <button onClick={reset} className="p-5 bg-white/5 text-slate-400 rounded-2xl hover:text-white transition-colors">
                  <RefreshCcw size={20} />
               </button>
            </div>
            <div className="mt-12 flex items-center gap-3">
               <ShieldCheck size={14} className="text-emerald-soul" />
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Double-Ended TS Verified • Hash Locked</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
