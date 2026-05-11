export const meta = {
  title: 'Python - Classical GC vs Incremental GC in 3.14',
  description: 'Visualize how GC works before and after 3.14 GC changes',
  tags: ['python', 'memory', 'gc', 'performance'],
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Zap, Layers, Activity, Languages } from 'lucide-react';

const HEAP_SIZE = 60;
const TICK_RATE = 80;

const App = () => {
  // --- State ---
  const [strategy, setStrategy] = useState('classic'); // 'classic' | 'incremental'
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heap, setHeap] = useState(Array.from({ length: HEAP_SIZE }, () => ({ type: 'free' })));
  const [gcActive, setGcActive] = useState(false);
  const [gcSubStep, setGcSubStep] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [lang, setLang] = useState('en'); // 'en' | 'zh'
  
  const stateRef = useRef({ strategy, isRunning, progress, heap, gcActive, gcSubStep });

  useEffect(() => {
    stateRef.current = { strategy, isRunning, progress, heap, gcActive, gcSubStep };
  }, [strategy, isRunning, progress, heap, gcActive, gcSubStep]);

  // --- Translations ---
  const t = {
    en: {
      title: "Python 3.14 GC Internals",
      subtitle: "Visualizing why Incremental GC reduces latency but increases memory pressure.",
      strategyLabel: "Collector Strategy",
      classic: "Classic (Generational)",
      incremental: "Incremental (3.14)",
      pause: "Pause",
      run: "Run Simulation",
      heapTitle: "Memory Heap",
      slots: "Slots Available",
      live: "Live",
      dead: "Dead Cycle",
      available: "Available",
      pressure: "Heap Pressure",
      liveObj: "Live Objects",
      floating: "Floating Garbage",
      trace: "Real-time Execution Trace",
      entry: "Program Entry",
      mutator: "Mutator (Logic)",
      collector: "Collector (GC)",
      currentT: "Current T",
      status: "System State",
      spike: "LATENCY SPIKE DETECTED",
      lowLat: "LOW LATENCY EXECUTION",
      descClassic: "Classic GC uses 'Stop-the-World'. When memory fills up, the red bar consumes the timeline, meaning your web server cannot respond to requests during that window.",
      descIncr: "Incremental GC interleaves GC work. Notice the timeline is a blend of blue and red—no single long pause, keeping the app responsive.",
      whyRevert: "Why the Revert?",
      problem: "The Problem",
      probDesc: <>In <span className="text-blue-400 font-bold">Incremental</span> mode, objects that die *after* the scanner passes them become <span className="text-orange-400 font-bold">Floating Garbage</span>.</>,
      impact: "The Impact",
      impactDesc: "On busy servers, this garbage builds up faster than the scanner can finish a lap. Memory pressure hits 100% even though the app 'looks' fine on the timeline.",
      note: "The incremental GC implementation in 3.14 alpha showed 2-3x memory growth on production-like workloads (Django/HTTPX). We have reverted to the Generational model for 3.14 stable."
    },
    zh: {
      title: "Python 3.14 GC 內部原理",
      subtitle: "視覺化展示為何 Incremental GC 能降低延遲卻會增加記憶體壓力。",
      strategyLabel: "Collector 策略",
      classic: "Classic (Generational)",
      incremental: "Incremental (3.14)",
      pause: "暫停",
      run: "執行 Simulation",
      heapTitle: "Memory Heap",
      slots: "可用 Slots",
      live: "Live",
      dead: "Dead Cycle",
      available: "Available",
      pressure: "Heap 壓力",
      liveObj: "Live Objects 數量",
      floating: "Floating Garbage 數量",
      trace: "即時執行追蹤 (Trace)",
      entry: "程式進入點",
      mutator: "Mutator (邏輯)",
      collector: "Collector (GC)",
      currentT: "當前時間 T",
      status: "系統狀態",
      spike: "偵測到 Latency 峰值",
      lowLat: "低 Latency 執行中",
      descClassic: "Classic GC 使用 'Stop-the-World' 機制。當記憶體填滿時，紅色區塊會佔據時間軸，這意味著您的伺服器在該窗口期內無法回應請求。",
      descIncr: "Incremental GC 交錯執行 GC 工作。請注意時間軸是藍色與紅色的混合——沒有長效的暫停，保持應用程式即時回應。",
      whyRevert: "為何撤回該功能？",
      problem: "核心問題",
      probDesc: <>在 <span className="text-blue-400 font-bold">Incremental</span> 模式下，在 Scanner 掃描過後才死亡的物件會變成 <span className="text-orange-400 font-bold">Floating Garbage</span>。</>,
      impact: "造成影響",
      impactDesc: "在繁忙的伺服器上，這些垃圾累積的速度超過了 Scanner 完成一輪掃描的速度。即使時間軸看起來正常，Heap 壓力仍會達到 100%。",
      note: "3.14 alpha 的 Incremental GC 實作在生產環境工作負載（如 Django/HTTPX）中顯示出 2-3 倍的記憶體增長。因此 3.14 穩定版已撤回至 Generational 模型。"
    }
  }[lang];

  // --- Actions ---
  
  const resetSim = () => {
    setIsRunning(false);
    setProgress(0);
    setGcActive(false);
    setGcSubStep(0);
    setTimeline([]);
    setHeap(Array.from({ length: HEAP_SIZE }, () => ({ type: 'free' })));
  };

  const tick = () => {
    const s = stateRef.current;
    if (!s.isRunning) return;

    const newProgress = s.progress + 0.4;
    if (newProgress >= 100) {
      setIsRunning(false);
      return;
    }

    let nextHeap = [...s.heap];
    let nextGcActive = s.gcActive;
    let nextGcSubStep = s.gcSubStep;
    let tasksThisTick = [];

    if (s.strategy === 'classic') {
      const activeCount = nextHeap.filter(c => c.type === 'active' || c.type === 'garbage').length;
      if (!nextGcActive && activeCount > HEAP_SIZE * 0.75) {
        nextGcActive = true;
        nextGcSubStep = 0;
      }

      if (nextGcActive) {
        tasksThisTick.push('gc');
        let processed = 0;
        while (processed < 5 && nextGcSubStep < HEAP_SIZE) {
          if (nextHeap[nextGcSubStep].type === 'garbage') {
            nextHeap[nextGcSubStep] = { type: 'free' };
          }
          nextGcSubStep++;
          processed++;
        }
        if (nextGcSubStep >= HEAP_SIZE) nextGcActive = false;
      } else {
        tasksThisTick.push('app');
        if (Math.random() > 0.3) {
          const freeIdx = nextHeap.findIndex(c => c.type === 'free');
          if (freeIdx !== -1) {
            nextHeap[freeIdx] = { type: Math.random() > 0.7 ? 'garbage' : 'active' };
          }
        }
      }
    } else {
      tasksThisTick.push('app');
      tasksThisTick.push('gc');
      if (Math.random() > 0.3) {
        const freeIdx = nextHeap.findIndex(c => c.type === 'free');
        if (freeIdx !== -1) {
          nextHeap[freeIdx] = { type: Math.random() > 0.7 ? 'garbage' : 'active' };
        }
      }
      const scanSize = 2;
      for (let i = 0; i < scanSize; i++) {
        const idx = (nextGcSubStep + i) % HEAP_SIZE;
        if (nextHeap[idx].type === 'garbage') {
          nextHeap[idx] = { type: 'free' };
        }
      }
      nextGcSubStep = (nextGcSubStep + scanSize) % HEAP_SIZE;
    }

    setHeap(nextHeap);
    setGcActive(nextGcActive);
    setGcSubStep(nextGcSubStep);
    setProgress(newProgress);
    
    const newPoints = tasksThisTick.map((t, i) => ({
      type: t,
      pos: newProgress + (i * 0.1)
    }));
    setTimeline(prev => [...prev, ...newPoints]);
  };

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(tick, TICK_RATE);
    return () => clearInterval(interval);
  }, [isRunning]);

  const stats = useMemo(() => {
    const garbage = heap.filter(c => c.type === 'garbage').length;
    const active = heap.filter(c => c.type === 'active').length;
    const pressure = Math.round(((garbage + active) / HEAP_SIZE) * 100);
    return { garbage, active, pressure };
  }, [heap]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{t.title}</h1>
              <p className="text-slate-600 text-sm md:text-base">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm self-start md:self-center"
          >
            <Languages size={18} />
            {lang === 'en' ? '繁體中文' : 'English'}
          </button>
        </header>

        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{t.strategyLabel}</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setStrategy('classic'); resetSim(); }}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${strategy === 'classic' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.classic}
              </button>
              <button
                onClick={() => { setStrategy('incremental'); resetSim(); }}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${strategy === 'incremental' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.incremental}
              </button>
            </div>
          </div>

          <div className="h-12 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isRunning ? 'bg-amber-100 text-amber-700' : 'bg-slate-900 text-white'}`}
            >
              {isRunning ? <><Pause size={20} /> {t.pause}</> : <><Play size={20} /> {t.run}</>}
            </button>
            <button onClick={resetSim} className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:shadow-sm transition-all">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Heap View */}
            <div className={`bg-white p-8 rounded-3xl border-2 transition-all duration-700 ${gcActive ? 'border-red-500 bg-red-50 shadow-2xl' : 'border-transparent shadow-sm'}`}>
              <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.heapTitle}</h2>
                    <p className="text-sm text-slate-500">{HEAP_SIZE} {t.slots}</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold uppercase text-slate-400 tracking-tighter">
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> {t.live}</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> {t.dead}</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-100 rounded-sm"></div> {t.available}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 mb-10">
                {heap.map((cell, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border border-black/5 transition-all duration-500 relative ${
                      cell.type === 'free' ? 'bg-slate-50' :
                      cell.type === 'active' ? 'bg-blue-500 shadow-lg' : 'bg-orange-500 shadow-lg'
                    } ${i === gcSubStep ? 'ring-4 ring-red-500 ring-offset-2 scale-110 z-20 animate-pulse' : ''}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                        <span>{t.pressure}</span>
                        <span className={stats.pressure > 85 ? 'text-red-600' : 'text-slate-600'}>{stats.pressure}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-0.5">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${stats.pressure > 85 ? 'bg-red-500' : stats.pressure > 60 ? 'bg-amber-500' : 'bg-blue-600'}`}
                            style={{ width: `${stats.pressure}%` }}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 bg-blue-50 rounded-2xl p-3 border border-blue-100 text-center">
                        <div className="text-xl font-black text-blue-700">{stats.active}</div>
                        <div className="text-[10px] font-bold text-blue-500 uppercase">{t.liveObj}</div>
                    </div>
                    <div className="flex-1 bg-orange-50 rounded-2xl p-3 border border-orange-100 text-center">
                        <div className="text-xl font-black text-orange-700">{stats.garbage}</div>
                        <div className="text-[10px] font-bold text-orange-500 uppercase">{t.floating}</div>
                    </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">{t.trace}</h2>
              <div className="relative h-24 bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden">
                {timeline.map((t, i) => (
                  <div
                    key={i}
                    className={`absolute top-0 bottom-0 w-[0.4%] ${t.type === 'app' ? 'bg-blue-300' : 'bg-red-500'}`}
                    style={{ left: `${t.pos}%` }}
                  />
                ))}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-slate-900 z-30 shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                  style={{ left: `${progress}%`, transition: 'left 80ms linear' }} 
                />
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                <span>{t.entry}</span>
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-300 rounded-sm"></div> {t.mutator}</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> {t.collector}</span>
                </div>
                <span>{t.currentT}</span>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border transition-all duration-500 ${gcActive ? 'bg-red-600 text-white border-red-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-black uppercase tracking-tight mb-2 ${gcActive ? 'text-white' : 'text-slate-800'}`}>{t.status}</h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black mb-4 inline-flex ${gcActive ? 'bg-white text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                    {gcActive ? t.spike : t.lowLat}
                </div>
                <p className={`text-sm leading-relaxed ${gcActive ? 'text-red-50' : 'text-slate-600'}`}>
                    {strategy === 'classic' ? t.descClassic : t.descIncr}
                </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                <h3 className="font-black uppercase tracking-tight text-amber-400 mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} /> {t.whyRevert}
                </h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.problem}</span>
                        <p className="text-sm text-slate-300">{t.probDesc}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.impact}</span>
                        <p className="text-sm text-slate-300">{t.impactDesc}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
                <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    <Zap size={14} className="inline mr-1 mb-1" />
                    <strong>CPython Team Note:</strong> {t.note}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;