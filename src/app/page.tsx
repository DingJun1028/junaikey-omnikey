"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, MessageSquare, X, 
  ArrowUpRight, Menu, CheckCircle2, Globe, Users, 
  PlayCircle, BookOpen, Lightbulb, Scale, Sprout,
  Search, Box, Clock, BarChart3
} from 'lucide-react';
import OmniCoreChat from './components/OmniCoreChat';
import ESGHealthCheck from './components/ESGHealthCheck';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeDimension, setActiveDimension] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // --- Data Definitions ---
  const dimensions = [
    { n: '有形 Tangible', d: '如財務報表、資產設備，是企業生存的基礎實力。', icon: <Box className="w-6 h-6"/> },
    { n: '無形 Intangible', d: '品牌信譽、企業文化、研發專利與關鍵人才。', icon: <Users className="w-6 h-6"/> },
    { n: '直接 Direct', d: '即時的營業收入、成本控制與客戶直接回饋。', icon: <ArrowUpRight className="w-6 h-6"/> },
    { n: '間接 Indirect', d: '社會影響力、產業生態系的共榮感與潛在品牌價值。', icon: <Globe className="w-6 h-6"/> },
    { n: '現在 Present', d: '當下的經營效率、市場佔有率與現金流健康度。', icon: <CheckCircle2 className="w-6 h-6"/> },
    { n: '未來 Future', d: '長期的永續經營能力、ESG 承諾與接班人計畫。', icon: <Sprout className="w-6 h-6"/> }
  ];

  const qnaItems = [
    { q: "什麼是「六面向總價值」？", a: "打破傳統只看財務報表的侷限，平衡有形、無形、現在、未來、直接、間接六大維度。", tag: "核心理念" },
    { q: "Stan 哥如何定義王道？", a: "王道是「創造價值、利益平衡、永續經營」。重點在於長期的共榮而非短期獲利。", tag: "品牌思想" },
    { q: "AI 時代下領導者的挑戰？", a: "在技術奇點下，領導者更需具備人文底蘊，利用 AI 轉譯智慧，維持利益關係人的平衡。", tag: "科技趨勢" }
  ];

  const partners = ["Acer", "TSMC", "ASUS", "BenQ", "Trend Micro", "Foxconn", "MediaTek"];

  // --- Interaction Logic ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll
      const sections = ['home', 'philosophy', 'courses', 'insights', 'ai'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % qnaItems.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : qnaItems.length - 1));

  return (
    <div className="min-h-[100vh] bg-void-stark text-slate-200 font-body-md selection:bg-cyan-core/30 antialiased overflow-x-hidden relative">
      
      {/* Liquid Glass Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-core/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-soul/10 rounded-full blur-[150px]"></div>
      </div>
      
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-xl p-12 flex flex-col items-center"
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white" onClick={() => setIsSearchOpen(false)}><X size={48}/></button>
            <div className="max-w-4xl w-full mt-32">
              <span className="text-classic-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-8 block">Global Search</span>
              <div className="flex items-center gap-6 border-b-2 border-white/20 pb-4 mb-12 focus-within:border-classic-gold transition-colors">
                <Search size={40} className="text-white/30" />
                <input type="text" placeholder="尋找王道智慧..." className="w-full bg-transparent text-white text-3xl md:text-6xl outline-none font-serif placeholder:text-white/5" autoFocus />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`fixed top-0 z-[100] w-full transition-all duration-700 ${scrolled ? 'bg-surface/95 backdrop-blur-md h-16 border-b border-outline-variant' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-wangdao-red rounded-full flex items-center justify-center text-white font-serif text-xl shadow-lg transition-all group-hover:scale-110">王</div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-display-calligraphy text-primary tracking-tighter">王道經營學堂</span>
              <div className="hidden md:flex items-center gap-2 mt-0.5">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">5T Data Trust: Synchronized</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-10 items-center">
            {[
              { id: 'philosophy', l: '王道理念' },
              { id: 'courses', l: '課程體系' },
              { id: 'insights', l: '最新洞察' },
              { id: 'ai', l: 'AI專區' }
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className={`text-[12px] font-bold tracking-[0.2em] uppercase transition-all relative py-2 ${activeSection === item.id ? 'text-wangdao-red' : 'text-slate-400 hover:text-primary'}`}
              >
                {item.l}
                <span className={`absolute bottom-0 left-0 h-[1px] bg-wangdao-red transition-all duration-500 ${activeSection === item.id ? 'w-full' : 'w-0'}`}></span>
              </a>
            ))}
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-400 hover:text-primary transition-colors ml-4"><Search size={18}/></button>
            <button className="bg-primary text-white px-10 py-2.5 ml-6 hover:bg-wangdao-red transition-all text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-xl shadow-black/5">
              立即加入
            </button>
          </nav>

          <button className="lg:hidden p-2 text-primary" onClick={() => setIsMenuOpen(true)}>
             <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed inset-0 z-[110] bg-surface p-12 flex flex-col items-center justify-center gap-12">
            <button className="absolute top-8 right-8 text-primary" onClick={() => setIsMenuOpen(false)}><X size={48}/></button>
            {['Home', 'Philosophy', 'Courses', 'Insights', 'AI Zone'].map((item) => (
              <a key={item} href="#" className="font-serif text-5xl text-primary hover:text-wangdao-red" onClick={() => setIsMenuOpen(false)}>{item}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* SECTION 1: Hero Section */}
        <section id="home" className="relative min-h-[100svh] flex items-center justify-center bg-white dragon-mask pt-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-surface/50 pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 border border-slate-100 rounded-full mb-10 shadow-sm animate-fade-in">
               <span className="w-2 h-2 bg-wangdao-red rounded-full animate-pulse"></span>
               <span className="text-slate-400 text-[10px] font-bold tracking-[0.4em] uppercase">V3.1 Elite Leadership Platform</span>
            </div>
            <h1 className="font-display-calligraphy text-7xl sm:text-9xl lg:text-[11rem] text-primary mb-12 leading-[0.9] tracking-tighter animate-reveal">
              王道領導學<br/>
              <span className="text-slate-200 font-serif italic font-light block mt-4 text-5xl sm:text-8xl lg:text-9xl">創造價值 × 利益平衡</span>
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed italic mb-16 opacity-0 animate-fade-up [animation-delay:600ms] [animation-fill-mode:forwards]">
              「利他即是最好的利己。」<br/>
              為新一代企業家建構在 AI 浪潮中不被取代的人文底蘊。
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 opacity-0 animate-fade-up [animation-delay:900ms] [animation-fill-mode:forwards]">
              <button className="group relative bg-wangdao-red text-white px-16 py-6 text-xs font-bold uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-wangdao-red/20">
                <span className="relative z-10">探索王道精髓</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </button>
              <button className="text-primary font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-4 group transition-all">
                <span>查看課程體系</span>
                <div className="w-12 h-[1px] bg-primary group-hover:w-20 transition-all"></div>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: Trust Stats */}
        <section className="py-24 bg-white border-y border-outline-variant px-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { n: '120+', l: '學堂場次' },
              { n: '500+', l: '合作企業' },
              { n: '15k+', l: '學員總數' },
              { n: '1.2M', l: '影片觀看' }
            ].map((stat, i) => (
              <div key={i} className="group cursor-default border-r last:border-r-0 border-outline-variant px-4">
                <div className="text-5xl lg:text-7xl font-serif text-primary mb-4 group-hover:text-wangdao-red transition-all duration-700">{stat.n}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{stat.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Partners */}
        <section className="py-20 bg-surface px-12 border-b border-outline-variant">
           <div className="max-w-7xl mx-auto text-center">
              <span className="text-classic-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-12 block">Trusted by Global Giants</span>
              <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                 {partners.map(p => (
                   <span key={p} className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-primary">{p}</span>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 4: Six-Dimensional Value Model */}
        <section id="philosophy" className="py-40 md:py-56 px-6 bg-white overflow-hidden border-b border-outline-variant">
           <div className="max-w-7xl mx-auto px-gutter grid lg:grid-cols-2 gap-32 items-center">
              <div className="reveal-on-scroll">
                 <span className="text-wangdao-red font-bold text-[11px] tracking-[0.5em] mb-4 block uppercase border-l-2 border-wangdao-red pl-4">Digital Identity</span>
                 <h2 className="font-serif text-6xl md:text-8xl text-primary mb-12 tracking-tighter leading-none">六面向價值模型</h2>
                 <p className="text-xl text-on-surface-variant mb-16 leading-relaxed font-light italic max-w-lg">「看見看不見的價值。」王道經營的真諦在於平衡六大維度。</p>
                 <div className="grid grid-cols-2 gap-3">
                    {dimensions.map((dim, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveDimension(i)}
                        className={`p-6 border text-left transition-all duration-500 relative overflow-hidden group ${activeDimension === i ? 'bg-primary text-white border-primary shadow-2xl' : 'bg-surface text-primary border-outline-variant hover:border-classic-gold'}`}
                      >
                         <h4 className="font-serif text-lg relative z-10">{dim.n}</h4>
                         {activeDimension === i && <motion.div layoutId="dim-bg" className="absolute inset-0 bg-primary -z-0" />}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="bg-surface p-12 md:p-20 border border-outline-variant shadow-sm relative min-h-[500px] flex flex-col justify-center">
                 <AnimatePresence mode="wait">
                    <motion.div key={activeDimension} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                       <div className="text-wangdao-red mb-10">{dimensions[activeDimension].icon}</div>
                       <h3 className="font-serif text-4xl md:text-5xl text-primary mb-8">{dimensions[activeDimension].n}</h3>
                       <p className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed italic mb-12">{dimensions[activeDimension].d}</p>
                       <button className="text-wangdao-red font-bold text-[11px] uppercase tracking-[0.4em] flex items-center gap-6 group">
                          <span>Explore This Core Concept</span>
                          <div className="w-12 h-[1px] bg-wangdao-red group-hover:w-20 transition-all origin-left"></div>
                       </button>
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </section>

        {/* SECTION 5: Course System */}
        <section id="courses" className="py-40 bg-surface">
           <div className="max-w-7xl mx-auto px-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-8">
                 <div>
                    <h2 className="font-serif text-5xl md:text-7xl text-primary mb-8 tracking-tighter">核心課程體系</h2>
                    <div className="w-24 h-1 bg-wangdao-red"></div>
                 </div>
                 <button className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-400 hover:text-wangdao-red transition-all pb-2 border-b border-transparent hover:border-wangdao-red">All Academy Paths</button>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                 {[
                   { t: '王道領導學', l: 'Expert', h: '12h', level: '高階主管', tag: 'Leadership' },
                   { t: '創新創業創值', i: 'Master', h: '18h', level: '創業家', tag: 'Innovation' },
                   { t: '王道論壇', f: 'Elite', h: '4h', level: '決策者', tag: 'Executive' }
                 ].map((c, i) => (
                   <div key={i} className="group bg-white border border-outline-variant p-12 transition-all duration-700 hover:border-classic-gold hover:shadow-2xl">
                      <div className="flex justify-between items-start mb-10 pb-6 border-b border-outline-variant/30">
                         <div className="text-[10px] font-bold text-classic-gold uppercase tracking-[0.5em]">{c.tag}</div>
                         <div className="flex items-center gap-4 text-slate-300">
                            <div className="flex items-center gap-1"><Clock size={14}/><span className="text-[10px] font-bold">{c.h}</span></div>
                            <div className="flex items-center gap-1"><BarChart3 size={14}/><span className="text-[10px] font-bold">{c.level}</span></div>
                         </div>
                      </div>
                      <h4 className="font-serif text-3xl md:text-4xl text-primary mb-8 group-hover:text-wangdao-red transition-colors leading-tight">{c.t}</h4>
                      <p className="text-on-surface-variant font-light mb-14 text-base leading-relaxed">建立永續經營的價值底層與決策邏輯，在 AI 浪潮中保持領先。</p>
                      <button className="w-full py-5 border border-primary text-[10px] font-bold uppercase tracking-[0.4em] group-hover:bg-primary group-hover:text-white transition-all">Details ⟶</button>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 6: Q&A Carousel */}
        <section id="insights" className="py-40 bg-primary text-white overflow-hidden relative border-y border-white/5">
           <div className="max-w-7xl mx-auto px-12 relative z-10">
              <div className="flex justify-between items-end mb-32">
                 <h2 className="font-serif text-5xl md:text-8xl tracking-tight leading-none">王道百問<br/><span className="text-white/10 italic">Insight Lab</span></h2>
                 <div className="flex gap-6">
                    <button onClick={prevSlide} className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all backdrop-blur-sm"><ChevronLeft size={24}/></button>
                    <button onClick={nextSlide} className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all backdrop-blur-sm"><ChevronRight size={24}/></button>
                 </div>
              </div>
              <div className="relative h-[450px]">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={carouselIndex} 
                      initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98 }} 
                      transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                       <span className="text-classic-gold font-bold text-[11px] tracking-[0.6em] uppercase mb-10 border-l-2 border-classic-gold pl-6">{qnaItems[carouselIndex].tag}</span>
                       <h3 className="font-serif text-5xl md:text-8xl mb-12 leading-[1.1] max-w-5xl tracking-tighter">{qnaItems[carouselIndex].q}</h3>
                       <p className="text-white/40 text-xl md:text-3xl font-light italic leading-relaxed max-w-2xl">{qnaItems[carouselIndex].a}</p>
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>
           {/* Subtle progress bar */}
           <div className="absolute bottom-0 left-0 h-1.5 bg-wangdao-red transition-all duration-1000 ease-out" style={{ width: `${((carouselIndex + 1) / qnaItems.length) * 100}%` }}></div>
        </section>

        {/* SECTION 8: AI Zone & 5T Governance */}
        <section id="ai" className="py-48 bg-white relative overflow-hidden">
           <div className="max-w-7xl mx-auto px-12 grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="reveal-on-scroll">
                 <div className="inline-block px-5 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold tracking-[0.5em] uppercase mb-12 rounded-full">Future Intelligence & 5T Trust</div>
                 <h2 className="font-serif text-6xl md:text-[7rem] text-primary mb-12 leading-[0.8] tracking-tighter">AI 治理<br/><span className="text-slate-200">雙核心引擎</span></h2>
                 <p className="text-xl text-slate-500 font-light leading-relaxed mb-16 italic max-w-lg">
                    王道智慧引擎「阿丹」具備雙核心設計。透過 5T 數據信託架構，我們確保了決策的透明度與可追溯性，平衡封閉強模型與開源透明的優勢。
                 </p>
                 <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {['文化智囊', '價值診斷', '平衡預測', '轉譯引擎'].map(f => (
                      <div key={f} className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-primary border-b border-outline-variant pb-4 hover:text-wangdao-red hover:border-wangdao-red cursor-help transition-all">
                        <div className="w-1.5 h-1.5 bg-classic-gold rounded-full group-hover:scale-150 transition-transform"></div> {f}
                      </div>
                    ))}
                 </div>
              </div>
              
              {/* 5T Trust Dashboard */}
              <div className="bg-surface border border-outline-variant shadow-2xl p-10 flex flex-col gap-8 relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-wangdao-red/5 blur-3xl rounded-full"></div>
                 <h3 className="font-serif text-2xl text-primary flex items-center justify-between border-b border-outline-variant pb-6">
                    <span>5T 信任中心面板</span>
                    <span className="text-[9px] uppercase tracking-[0.3em] bg-green-100 text-green-700 px-3 py-1 rounded-full animate-pulse">Live Sync Active</span>
                 </h3>
                 
                 <div className="space-y-6">
                    {/* Gemini / Straico Core */}
                    <div className="p-6 bg-white border border-outline-variant hover:border-blue-200 transition-colors group">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-1">Primary Engine</div>
                             <div className="font-serif text-xl text-primary group-hover:text-blue-600 transition-colors">Gemini 2.0 Flash</div>
                          </div>
                          <div className="text-[9px] text-slate-400 bg-slate-50 px-2 py-1 uppercase tracking-wider">via Straico Agent</div>
                       </div>
                       <div className="flex justify-between text-xs text-slate-500">
                          <span>Sigil Status: <span className="text-green-600 font-bold">Secured</span></span>
                          <span>Tangibility: <span className="text-primary font-bold">High</span></span>
                       </div>
                    </div>

                    {/* OpenCode Core */}
                    <div className="p-6 bg-white border border-outline-variant hover:border-classic-gold/50 transition-colors group">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <div className="text-[10px] text-classic-gold font-bold tracking-widest uppercase mb-1">Transparency Engine</div>
                             <div className="font-serif text-xl text-primary group-hover:text-classic-gold transition-colors">Kimi K2.5 (Open Weights)</div>
                          </div>
                          <div className="text-[9px] text-slate-400 bg-slate-50 px-2 py-1 uppercase tracking-wider">via OpenCode API</div>
                       </div>
                       <div className="flex justify-between text-xs text-slate-500">
                          <span>Hash Lock: <span className="text-green-600 font-bold">Verified</span></span>
                          <span>Transparency: <span className="text-primary font-bold">Maximum</span></span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-4 pt-6 border-t border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Last Audit: Just now</span>
                    <button className="text-wangdao-red hover:underline">View OmniLog</button>
                 </div>
              </div>
           </div>
        </section>
        {/* SECTION 9: Seminar Registration (Lead Capture) */}
        <section id="enroll" className="py-40 bg-surface border-t border-outline-variant relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wangdao-red/20 to-transparent"></div>
           <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <span className="text-wangdao-red font-bold text-[11px] tracking-[0.5em] mb-6 block uppercase">Join the Elite</span>
              <h2 className="font-serif text-5xl md:text-7xl text-primary mb-8 tracking-tighter">六月王道經營實體講座</h2>
              <p className="text-xl text-on-surface-variant font-light leading-relaxed italic mb-16">
                 「在 AI 時代重新定義領導力。」席次有限，僅開放給具備永續願景的企業決策者。
              </p>
              
              <div className="bg-white border border-outline-variant p-10 md:p-16 shadow-2xl text-left">
                 <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">姓名 Full Name</label>
                          <input type="text" className="w-full bg-slate-50 border-b border-slate-200 py-3 outline-none focus:border-wangdao-red transition-colors font-serif text-xl" placeholder="您的姓名" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">公司/職稱 Organization</label>
                          <input type="text" className="w-full bg-slate-50 border-b border-slate-200 py-3 outline-none focus:border-wangdao-red transition-colors font-serif text-xl" placeholder="公司名稱" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">電子郵件 Email Address</label>
                       <input type="email" className="w-full bg-slate-50 border-b border-slate-200 py-3 outline-none focus:border-wangdao-red transition-colors font-serif text-xl" placeholder="example@email.com" />
                    </div>
                    <button className="w-full bg-primary text-white py-8 text-xs font-bold uppercase tracking-[0.5em] hover:bg-wangdao-red transition-all shadow-xl active:scale-[0.98]">
                       提交報名申請 ⟶
                    </button>
                 </form>
                 <div className="mt-8 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Data encrypted via 5T Trust Protocol</span>
                 </div>
              </div>
           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-surface py-40 px-12 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-32">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-2xl">王</div>
              <span className="text-4xl font-display-calligraphy tracking-tighter">王道經營學堂</span>
            </div>
            <p className="text-on-surface-variant text-xl font-light leading-relaxed max-w-md italic">
              AI 時代企業永續的數位中心。傳播東方領導智慧，助力企業接班與永續經營。
            </p>
          </div>
          <div>
            <h5 className="font-bold text-[11px] uppercase tracking-[0.5em] text-classic-gold mb-12">Management</h5>
            <div className="space-y-8">
              <div>
                <p className="text-2xl font-serif text-primary mb-2">金國華 Johnson King</p>
                <p className="text-[11px] text-slate-400 tracking-widest uppercase italic font-medium">CEO / Executive Director</p>
              </div>
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest space-y-2">
                <p className="hover:text-wangdao-red transition-colors">johnsonking7@gmail.com</p>
                <p>0922-267-393</p>
              </div>
            </div>
          </div>
          <div>
             <h5 className="font-bold text-[11px] uppercase tracking-[0.5em] text-classic-gold mb-12">HQ Location</h5>
             <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
               Taipei, Taiwan<br/>
               Wangdao Academy 2026
             </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-40 pt-12 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.6em]">
            <p>© 2026 Wangdao Management Institute. The Way of Kings.</p>
            <div className="flex gap-16">
               <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
            </div>
        </div>
      </footer>

      {/* AI Adan Floating */}
      <div className="fixed bottom-12 right-12 z-[150]">
        <button 
          onClick={() => setIsAiOpen(true)} 
          className="w-20 h-20 bg-wangdao-red text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        >
           <MessageSquare size={32} className="relative z-10"/>
           <div className="absolute inset-0 bg-primary scale-0 group-hover:scale-100 rounded-full transition-transform duration-700 opacity-20"></div>
        </button>
      </div>

      {/* OmniCore v4.0 Chat Interface */}
      <OmniCoreChat isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Studio Mode Toggle */}
      <StudioMode />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;600;700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #9E1B21; }

        @keyframes reveal {
          from { opacity: 0; transform: scale(1.05) translateY(40px); filter: blur(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-reveal { animation: reveal 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        .dragon-mask::after {
          content: '王';
          position: absolute;
          font-family: 'Newsreader', serif;
          font-size: 60vw;
          color: #000;
          opacity: 0.015;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }
        
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
font-family: 'Newsreader', serif;
          font-size: 60vw;
          color: #000;
          opacity: 0.015;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }
        
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
