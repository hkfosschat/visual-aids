export const meta = {
  title: 'Python - Classical GC vs Incremental GC in 3.14',
  description: 'Visualize how GC works before and after 3.14 GC changes',
  tags: ['python', 'memory', 'gc', 'performance'],
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Activity, 
  AlertTriangle, Zap, Languages, Maximize, 
  BarChart2, Clock, Info, Grid, Ghost, ShieldCheck
} from 'lucide-react';


// --- Shared i18n Dictionary ---
const translations = {
  en: {
    title: "Python 3.14 GC: The Complete Trade-off",
    subtitle: "Exploring Latency, Throughput, and Memory-Level mechanics.",
    toggleLang: "繁體中文",
    mode1: "Micro: Latency",
    mode2: "Macro: Bloat",
    mode3: "Memory: Wavefront",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    classic: "Classic GC (Generational)",
    incr: "Incremental GC (3.14)",
    // Mode 1
    m1Title: "The Latency Problem (Microseconds)",
    m1Desc: "Watch the moving block. Classic GC uses 'Stop-The-World', halting the app completely to clean memory. Incremental GC does the work in tiny background slices, keeping the app perfectly smooth.",
    frozen: "STW PAUSE (FROZEN)",
    smooth: "Smooth Execution",
    catchingUp: "Catching Up...",
    // Mode 2
    m2Title: "The Memory Bloat Problem (Minutes)",
    m2Desc: "Simulating a high-churn web server. Because Incremental GC doesn't stop the world, objects that die after being scanned become 'Floating Garbage' (Ghosts), severely bloating memory before the next cycle clears them.",
    liveMem: "Live Objects",
    reservedMem: "Reserved Memory",
    oom: "OOM Warning!",
    // Mode 3
    m3Title: "The Anatomy of a Leak (Memory Blocks)",
    m3Desc: "Watch the scanner line. If an object is deleted behind the line (already marked 'Black'), it becomes a Ghost. This is the exact mechanism of the 3.14 memory bloat.",
    wavefront: "Scanner Wavefront",
    ghosts: "Floating Garbage (Ghosts)",
    activity: "Execution Trace (Latency vs. Throughput)",
    bloat: "Memory Bloat Gap",
    legendApp: "App Work (Mutator)",
    legendGC: "GC Work (Collector)",
    phase: "Phase",
  },
  zh: {
    title: "Python 3.14 GC: 完整的效能權衡",
    subtitle: "深入探索延遲、吞吐量與記憶體底層機制的相互影響。",
    toggleLang: "English",
    mode1: "微觀: 延遲",
    mode2: "宏觀: 膨脹",
    mode3: "記憶體: 波前",
    play: "播放",
    pause: "暫停",
    reset: "重置",
    classic: "Classic GC (傳統分代)",
    incr: "Incremental GC (3.14 實驗性)",
    // Mode 1
    m1Title: "Latency (延遲) 問題",
    m1Desc: "觀察移動的方塊。Classic GC 採用 'Stop-The-World'，會完全凍結應用程式來清理記憶體。Incremental GC 則在背景切片執行，保持應用程式絕對流暢。",
    frozen: "STW 暫停 (凍結)",
    smooth: "流暢執行中",
    catchingUp: "加速追趕中...",
    // Mode 2
    m2Title: "Memory Bloat (記憶體膨脹) 問題",
    m2Desc: "模擬高負載的網頁伺服器。因為 Incremental GC 不會停機，掃描過後才死亡的物件會變成「幽靈 (Floating Garbage)」，在下一次循環清空前，會導致記憶體嚴重膨脹。",
    liveMem: "存活物件 (Live)",
    reservedMem: "佔用記憶體 (Reserved)",
    oom: "記憶體不足警告 (OOM)!",
    // Mode 3
    m3Title: "記憶體洩漏剖析 (記憶體層級)",
    m3Desc: "觀察掃描線。如果在掃描線後方（已標記為 Black）刪除物件，它會變成幽靈。這就是 3.14 記憶體膨脹的確切機制。",
    wavefront: "掃描波前 (Wavefront)",
    ghosts: "浮動垃圾 (幽靈物件)",
    activity: "執行追蹤 (延遲 vs 吞吐量)",
    bloat: "記憶體膨脹缺口",
    legendApp: "應用程式執行 (Mutator)",
    legendGC: "回收器執行 (Collector)",
    phase: "階段",
  }
};

const App = () => {
  const [lang, setLang] = useState('en');
  const [mode, setMode] = useState('memory'); // 'micro', 'macro', or 'memory'
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans selection:bg-blue-500/30 pb-12">
      {/* Top Navigation */}
      <nav className="bg-[#161b22] border-b border-slate-800 p-4 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-100">{t.title}</h1>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-[#0d1117] p-1.5 rounded-xl border border-slate-800">
            <button 
              onClick={() => setMode('memory')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'memory' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Grid size={16} /> <span className="hidden sm:inline">{t.mode3}</span>
            </button>
            <button 
              onClick={() => setMode('micro')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'micro' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Clock size={16} /> <span className="hidden sm:inline">{t.mode1}</span>
            </button>
            <button 
              onClick={() => setMode('macro')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'macro' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BarChart2 size={16} /> <span className="hidden sm:inline">{t.mode2}</span>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1" />
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              <Languages size={16} /> {t.toggleLang}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto mt-8 px-4">
        {mode === 'micro' && <MicroScaleView t={t} />}
        {mode === 'macro' && <MacroScaleView t={t} />}
        {mode === 'memory' && <MemoryScaleView t={t} />}
      </main>
    </div>
  );
};

/* ==========================================================================
   MODE 1: MICRO-SCALE (LATENCY & STW)
   ========================================================================== */
const MicroScaleView = ({ t }) => {
  const [isRunning, setIsRunning] = useState(false);
  
  const [classicState, setClassicState] = useState({ renderedX: 0, isFrozen: false, freezeTimer: 0, isCatchingUp: false });
  const [incrState, setIncrState] = useState({ renderedX: 0, barrierFlashes: [] });

  const requestRef = useRef();
  const timeRef = useRef(0);

  const updatePhysics = () => {
    timeRef.current += 1;
    const tVal = timeRef.current;
    
    // Sine wave motion
    const targetX = (Math.sin(tVal * 0.05) + 1) * 50; 

    setClassicState(prev => {
      let next = { ...prev };
      if (tVal % 180 === 0) {
        next.isFrozen = true;
        next.freezeTimer = 60; 
      }

      if (next.isFrozen) {
        next.freezeTimer--;
        if (next.freezeTimer <= 0) {
          next.isFrozen = false;
          next.isCatchingUp = true;
        }
      } else if (next.isCatchingUp) {
        const diff = targetX - next.renderedX;
        next.renderedX += diff * 0.2; 
        if (Math.abs(diff) < 1) next.isCatchingUp = false;
      } else {
        next.renderedX = targetX;
      }
      return next;
    });

    setIncrState(prev => {
      let next = { ...prev };
      next.renderedX = targetX; 
      if (Math.random() < 0.05) next.barrierFlashes.push(tVal);
      next.barrierFlashes = next.barrierFlashes.filter(f => tVal - f < 10); 
      return next;
    });

    if (isRunning) requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    if (isRunning) requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-start bg-[#161b22] p-6 rounded-2xl border border-slate-800">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black text-slate-100 mb-2 flex items-center gap-2">
            <Maximize className="text-blue-500" /> {t.m1Title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">{t.m1Desc}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isRunning ? 'bg-slate-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
            {isRunning ? <Pause size={16}/> : <Play size={16}/>} {isRunning ? t.pause : t.play}
          </button>
          <button onClick={() => { setIsRunning(false); timeRef.current = 0; setClassicState({renderedX: 50, isFrozen: false, freezeTimer: 0, isCatchingUp: false}); setIncrState({renderedX: 50, barrierFlashes: []}); }} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white"><RotateCcw size={18}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLASSIC VIEW */}
        <div className={`p-8 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden ${classicState.isFrozen ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-[#161b22] border-slate-800'}`}>
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-lg font-black text-white">{t.classic}</h3>
            {classicState.isFrozen && <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse uppercase">{t.frozen}</span>}
            {classicState.isCatchingUp && <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full uppercase">{t.catchingUp}</span>}
          </div>

          <div className="h-16 w-full bg-[#0d1117] rounded-full border border-slate-800 relative flex items-center p-2 shadow-inner">
            <div 
              className={`h-full aspect-square rounded-full flex items-center justify-center shadow-lg transition-transform ${classicState.isFrozen ? 'bg-red-500 scale-90' : classicState.isCatchingUp ? 'bg-amber-400 blur-[1px]' : 'bg-blue-500'}`}
              style={{ transform: `translateX(calc(${classicState.renderedX} * (100cqw - 100%) / 100))` }}
            >
              <Activity size={20} className={classicState.isFrozen ? 'text-white opacity-50' : 'text-white'} />
            </div>
            {classicState.isFrozen && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] bg-red-950/20 rounded-full z-10">
                <AlertTriangle className="text-red-500 animate-bounce" size={24} />
              </div>
            )}
          </div>
        </div>

        {/* INCREMENTAL VIEW */}
        <div className="p-8 rounded-[2rem] bg-[#161b22] border-2 border-slate-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-lg font-black text-white">{t.incr}</h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase">{t.smooth}</span>
          </div>

          <div className="h-16 w-full bg-[#0d1117] rounded-full border border-slate-800 relative flex items-center p-2 shadow-inner">
            <div 
              className="h-full aspect-square rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
              style={{ transform: `translateX(calc(${incrState.renderedX} * (100cqw - 100%) / 100))` }}
            >
              <Activity size={20} className="text-white" />
            </div>
            {incrState.barrierFlashes.length > 0 && (
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/50 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   MODE 2: MACRO-SCALE (THROUGHPUT & BLOAT)
   ========================================================================== */
const MacroScaleView = ({ t }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  
  const stateRef = useRef({ tick: 0, liveMem: 20, classicReserved: 20, incrReserved: 20, ghosts: 0, incrCycleTimer: 0 });

  const updateData = () => {
    const s = stateRef.current;
    s.tick += 1;

    const baseTrend = 20 + (s.tick * 0.1);
    const wave = Math.sin(s.tick * 0.1) * 10;
    const noise = (Math.random() - 0.5) * 5;
    let newLive = Math.max(5, baseTrend + wave + noise);
    if (newLive > 80) newLive = 80; 
    
    const deathRate = Math.max(0, s.liveMem - newLive);
    s.liveMem = newLive;

    if (s.tick % 40 === 0) s.classicReserved = s.liveMem; 
    else s.classicReserved = Math.max(s.classicReserved, s.liveMem + noise); 

    s.ghosts += deathRate * 0.8; 
    s.incrReserved = s.liveMem + s.ghosts;
    s.incrCycleTimer++;
    
    if (s.incrCycleTimer >= 100) {
      s.ghosts *= 0.2; 
      s.incrCycleTimer = 0;
    }

    setHistory(prev => {
      const next = [...prev, { tick: s.tick, live: s.liveMem, classic: s.classicReserved, incr: s.incrReserved, ghosts: s.ghosts }];
      if (next.length > 100) return next.slice(1);
      return next;
    });
  };

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(updateData, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const currentData = history[history.length - 1] || { live: 0, classic: 0, incr: 0, ghosts: 0 };
  const isOOM = currentData.incr > 90;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-start bg-[#161b22] p-6 rounded-2xl border border-slate-800">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black text-slate-100 mb-2 flex items-center gap-2">
            <BarChart2 className="text-amber-500" /> {t.m2Title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">{t.m2Desc}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isRunning ? 'bg-slate-700 text-white' : 'bg-amber-600 text-white hover:bg-amber-500'}`}>
            {isRunning ? <Pause size={16}/> : <Play size={16}/>} {isRunning ? t.pause : t.play}
          </button>
          <button onClick={() => { setIsRunning(false); stateRef.current = { tick: 0, liveMem: 20, classicReserved: 20, incrReserved: 20, ghosts: 0, incrCycleTimer: 0 }; setHistory([]); }} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white"><RotateCcw size={18}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLASSIC CHART */}
        <div className="p-8 rounded-[2rem] bg-[#161b22] border-2 border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-white">{t.classic}</h3>
            <div className="text-right">
              <div className="text-2xl font-mono text-blue-400">{Math.round(currentData.classic)} MB</div>
            </div>
          </div>
          <div className="flex-1 bg-[#0d1117] rounded-2xl border border-slate-800 p-4 relative min-h-[250px]">
            <LineChart data={history} lineKey="classic" color="#3b82f6" liveColor="#10b981" />
          </div>
        </div>

        {/* INCREMENTAL CHART */}
        <div className={`p-8 rounded-[2rem] border-2 flex flex-col transition-colors duration-500 ${isOOM ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-[#161b22] border-slate-800'}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-white flex items-center gap-3">
              {t.incr}
              {isOOM && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] uppercase rounded-md animate-pulse">{t.oom}</span>}
            </h3>
            <div className="text-right">
              <div className={`text-2xl font-mono ${isOOM ? 'text-red-400' : 'text-amber-400'}`}>{Math.round(currentData.incr)} MB</div>
            </div>
          </div>
          <div className="flex-1 bg-[#0d1117] rounded-2xl border border-slate-800 p-4 relative min-h-[250px]">
            <LineChart data={history} lineKey="incr" color={isOOM ? "#ef4444" : "#f59e0b"} liveColor="#10b981" />
            <div className="absolute top-4 left-4 right-4 flex justify-end pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center gap-4">
                <div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">{t.ghosts}</div>
                   <div className="text-xl font-mono text-red-400">+{Math.round(currentData.ghosts)} MB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LineChart = ({ data, lineKey, color, liveColor }) => {
  if (data.length === 0) return <div className="w-full h-full flex items-center justify-center text-sm text-slate-700">Awaiting Data...</div>;
  const mapY = (val) => 100 - (val / 100) * 100;
  const mapX = (idx) => (idx / 100) * 100;
  const livePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i)} ${mapY(d.live)}`).join(' ');
  const reservedPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i)} ${mapY(d[lineKey])}`).join(' ');
  const areaPath = [...data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i)} ${mapY(d[lineKey])}`), ...data.slice().reverse().map((d, i) => `L ${mapX(data.length - 1 - i)} ${mapY(d.live)}`), 'Z'].join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
      <line x1="0" y1="25" x2="100" y2="25" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2" />
      <path d={areaPath} fill="rgba(239, 68, 68, 0.15)" stroke="none" />
      <path d={livePath} fill="none" stroke={liveColor} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={reservedPath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

/* ==========================================================================
   MODE 3: MEMORY-SCALE (WAVEFRONT & GHOSTS)
   ========================================================================== */
const HEAP_SIZE = 48;
const MAX_TICKS = 1000;

// Deterministic Instruction Stream
const generateInstructions = () => {
  const stream = [];
  for (let i = 0; i < MAX_TICKS; i++) {
    const r = Math.random();
    if (r < 0.15) stream.push({ type: 'ALLOC', id: Math.floor(Math.random() * HEAP_SIZE) });
    else if (r < 0.27) stream.push({ type: 'KILL', id: Math.floor(Math.random() * HEAP_SIZE) });
    else stream.push({ type: 'WORK' }); 
  }
  return stream;
};

const MemoryScaleView = ({ t }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tick, setTick] = useState(0);

  // Engine States
  const [classic, setClassic] = useState({ 
    heap: Array.from({ length: HEAP_SIZE }, () => ({ status: 'empty' })), 
    phase: 'IDLE', 
    history: [] 
  });
  const [incr, setIncr] = useState({ 
    heap: Array.from({ length: HEAP_SIZE }, () => ({ status: 'empty', scanned: false })), 
    scanPtr: -1, 
    phase: 'IDLE', 
    history: [] 
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTick(prevTick => {
        // --- MUTATOR ACTION (Random Allocation/Death) ---
        const mutatorId = Math.floor(Math.random() * HEAP_SIZE);
        const rand = Math.random();

        // 1. Update Classic GC
        setClassic(prev => {
          let next = { ...prev };
          let work = { app: 1, gc: 0 };
          
          if (next.phase === 'STW') {
            work = { app: 0, gc: 2 };
            // Instant cleanup
            next.heap = next.heap.map(obj => obj.status === 'live' ? obj : { status: 'empty' });
            next.phase = 'IDLE';
          } else {
            // Normal App Behavior
            if (rand > 0.85 && next.heap[mutatorId].status === 'empty') next.heap[mutatorId] = { status: 'live' };
            if (rand < 0.15 && next.heap[mutatorId].status === 'live') next.heap[mutatorId] = { status: 'dead' };
            
            // Trigger threshold
            const deadCount = next.heap.filter(o => o.status === 'dead').length;
            if (deadCount > 8) next.phase = 'STW';
          }
          next.history = [...next.history, work].slice(-60);
          return next;
        });

        // 2. Update Incremental GC
        setIncr(prev => {
          let next = { ...prev };
          let work = { app: 0.9, gc: 0.15 };

          // Mutator Logic
          if (rand > 0.85 && next.heap[mutatorId].status === 'empty') {
             // If we allocate ahead of the scanner, it's unscanned (white). 
             // If we allocate behind, we must mark it scanned immediately (Blue/Black) to prevent it dying too soon.
             const isBehind = mutatorId < next.scanPtr;
             next.heap[mutatorId] = { status: 'live', scanned: isBehind };
          }
          if (rand < 0.15 && next.heap[mutatorId].status === 'live') {
            const isBehind = mutatorId < next.scanPtr;
            if (next.heap[mutatorId].scanned && isBehind) {
              // THE GHOST MECHANISM:
              // It was scanned (Blue), it is behind the line, and it just died.
              // It cannot be reclaimed this cycle.
              next.heap[mutatorId].status = 'ghost';
            } else {
              next.heap[mutatorId].status = 'dead';
            }
          }

          // GC Logic
          if (next.phase === 'IDLE') {
            if (next.heap.filter(o => o.status !== 'empty').length > 15) {
              next.phase = 'SCANNING';
              next.scanPtr = 0;
            }
          } else if (next.phase === 'SCANNING') {
            const step = 2;
            for(let i=0; i<step; i++) {
              const idx = next.scanPtr + i;
              if (idx < HEAP_SIZE) {
                if (next.heap[idx].status === 'live') next.heap[idx].scanned = true;
              }
            }
            next.scanPtr += step;
            if (next.scanPtr >= HEAP_SIZE) next.phase = 'SWEEPING';
          } else if (next.phase === 'SWEEPING') {
            next.heap = next.heap.map(obj => 
              (obj.status === 'dead') ? { status: 'empty', scanned: false } : { ...obj, scanned: false, status: obj.status === 'ghost' ? 'dead' : obj.status }
            );
            next.scanPtr = -1;
            next.phase = 'IDLE';
          }

          next.history = [...next.history, work].slice(-60);
          return next;
        });

        return prevTick + 1;
      });
    }, 150 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const reset = () => {
    setIsRunning(false);
    setTick(0);
    const emptyHeap = () => Array.from({ length: HEAP_SIZE }, () => ({ status: 'empty', scanned: false }));
    setClassic({ heap: emptyHeap(), phase: 'IDLE', history: [] });
    setIncr({ heap: emptyHeap(), scanPtr: -1, phase: 'IDLE', history: [] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start bg-[#161b22] p-6 rounded-[2rem] border border-slate-800 gap-6 shadow-2xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black text-slate-100 mb-2 flex items-center gap-2">
            <Grid className="text-indigo-500" /> {t.m1Title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">{t.m1Desc}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-[#0d1117] px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
             <span className="text-[10px] font-black uppercase text-slate-500">Sim Speed</span>
             <input type="range" min="0.5" max="5" step="0.5" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="accent-indigo-500 w-24" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isRunning ? 'bg-slate-700 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
              {isRunning ? <Pause size={18}/> : <Play size={18}/>} {isRunning ? t.pause : t.play}
            </button>
            <button onClick={reset} className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-slate-700"><RotateCcw size={20}/></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ENGINE 1: CLASSIC */}
        <div className={`relative bg-[#161b22] border-2 rounded-[2.5rem] p-8 transition-all duration-500 overflow-hidden ${classic.phase === 'STW' ? 'border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.2)] bg-red-950/10' : 'border-slate-800 shadow-xl'}`}>
          {classic.phase === 'STW' && (
             <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                <AlertTriangle size={64} className="text-red-500 animate-bounce mb-4" />
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">{t.stwAlert}</h3>
             </div>
          )}
          
          <EngineHeader title={t.classic} phase={classic.phase} />
          
          <div className="grid grid-cols-8 gap-3 mb-10">
            {classic.heap.map((obj, i) => (
              <MemoryBlock key={i} status={obj.status} />
            ))}
          </div>
          
          <Legend t={t} />
          <div className="mt-8">
            <ExecutionGraph history={classic.history} labels={t} />
          </div>
        </div>

        {/* ENGINE 2: INCREMENTAL */}
        <div className="bg-[#161b22] border-2 border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl">
          <EngineHeader title={t.incr} phase={incr.phase} accent="indigo" />

          <div className="grid grid-cols-8 gap-3 mb-10 relative">
            {/* Wavefront Scanner Line */}
            {incr.scanPtr !== -1 && (
              <div 
                className="absolute z-10 pointer-events-none transition-all duration-300 ease-linear"
                style={{ 
                  left: `${((incr.scanPtr % 8) / 8) * 100}%`, 
                  top: `${Math.floor(incr.scanPtr / 8) * 16.6}%`, 
                  height: '14%', 
                  width: '3px', 
                  backgroundColor: '#6366f1', 
                  boxShadow: '0 0 15px #6366f1, 0 0 30px #6366f1' 
                }}
              />
            )}
            
            {incr.heap.map((obj, i) => (
              <MemoryBlock 
                key={i} 
                status={obj.status} 
                scanned={obj.scanned} 
                isScanning={i === incr.scanPtr} 
              />
            ))}
          </div>

          <Legend t={t} showGhost />
          <div className="mt-8">
            <ExecutionGraph history={incr.history} labels={t} />
          </div>
        </div>

      </div>
    </div>
  );
};

const EngineHeader = ({ title, phase, accent = "slate" }) => (
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-lg font-black text-white flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${accent === 'indigo' ? 'bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]' : 'bg-slate-500'}`} /> 
      {title}
    </h2>
    <div className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${accent === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
      {phase}
    </div>
  </div>
);

const MemoryBlock = ({ status, scanned, isScanning }) => {
  const base = "aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center relative";
  
  if (status === 'empty') return <div className={`${base} bg-[#0a0c10] border-slate-900`} />;
  
  let styles = "";
  let icon = null;

  if (status === 'ghost') {
    styles = "bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10";
    icon = <Ghost size={16} className="text-red-500 animate-pulse" />;
  } else if (scanned) {
    styles = "bg-indigo-900/40 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]";
    icon = <ShieldCheck size={16} className="text-indigo-400" />;
  } else if (status === 'dead') {
    styles = "bg-red-500 border-red-400";
  } else if (status === 'live') {
    styles = "bg-white border-slate-200";
  }

  return (
    <div className={`${base} ${styles} ${isScanning ? 'scale-110 ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#161b22]' : ''}`}>
      {icon}
    </div>
  );
};

const Legend = ({ t, showGhost }) => (
  <div className="flex flex-wrap gap-4 px-2 py-3 bg-[#0d1117] rounded-2xl border border-slate-800/50">
    <LegendItem color="bg-white" label={t.legendLive} />
    <LegendItem color="bg-red-500" label={t.legendDead} />
    <LegendItem color="bg-indigo-900/40 border-indigo-500" label={t.legendScanned} icon={<ShieldCheck size={10} />} />
    {showGhost && <LegendItem color="bg-red-950 border-red-500" label={t.legendGhost} icon={<Ghost size={10} />} />}
  </div>
);

const LegendItem = ({ color, label, icon }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-md ${color} border flex items-center justify-center text-[8px] text-white`}>{icon}</div>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
  </div>
);

const ExecutionGraph = ({ history, labels }) => (
  <div className="space-y-3">
    <h4 className="text-[10px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2 px-1">
      <BarChart2 size={12} /> {labels.activity}
    </h4>
    <div className="h-20 w-full bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden flex items-end relative">
      <div className="absolute top-2 right-3 flex gap-3 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 
          <span className="text-[8px] font-black text-slate-500 uppercase">{labels.legendApp}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 
          <span className="text-[8px] font-black text-slate-500 uppercase">{labels.legendGC}</span>
        </div>
      </div>
      <div className="flex-1 flex items-end h-full px-1 gap-[1px]">
        {history.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <div className="w-full bg-red-500/60" style={{ height: `${h.gc * 30}%` }} />
            <div className="w-full bg-indigo-500/60" style={{ height: `${h.app * 30}%` }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/*
const ExecutionGraph = ({ history, labels }) => (
  <div className="space-y-3">
    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
      <BarChart2 size={12} /> {labels.activity}
    </h4>
    <div className="h-24 w-full bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden flex items-end relative">
      <div className="absolute top-2 left-3 flex gap-4 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-blue-500 rounded-sm" /> 
          <span className="text-[8px] font-black text-slate-400 uppercase">{labels.legendApp}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-sm" /> 
          <span className="text-[8px] font-black text-slate-400 uppercase">{labels.legendGC}</span>
        </div>
      </div>
      <div className="flex-1 flex items-end h-full px-1 gap-[1px]">
        {history.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <div className="w-full bg-red-500/80 transition-all duration-300" style={{ height: `${h.gc * 40}%` }} />
            <div className="w-full bg-blue-500/80 transition-all duration-300" style={{ height: `${h.app * 40}%` }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
*/

export default App;