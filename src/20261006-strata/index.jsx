export const meta = {
  title: 'Strata',
  description: 'How it can run a >350GB size model in a gaming GPU',
  tags: ['AI', 'hybrid-offloading', 'gpu'],
};

import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  Layers, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Sliders, 
  Gauge, 
  Server, 
  BrainCircuit, 
  RefreshCw, 
  Play, 
  Check, 
  X, 
  ArrowRight, 
  Database, 
  Sparkles, 
  ShieldAlert,
  Terminal,
  Grid
} from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide navigation dataset
  const slides = [
    { id: 'overview', title: '1. Executive Overview' },
    { id: 'memory-tiering', title: '2. VRAM Memory Placement' },
    { id: 'memory-calculator', title: '3. Interactive Memory Simulator' },
    { id: 'ngram', title: '4. The 51B N-Gram Table' },
    { id: 'cpu-offload', title: '5. Heterogeneous CPU/GPU Execution' },
    { id: 'mtp-simulator', title: '6. MTP Speculative Decoding' },
    { id: 'hardware-tiers', title: '7. Hardware Tiers & Requirements' },
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Strata Engine Architecture
            </h1>
            <p className="text-xs text-slate-400">
              Fitting 125B Qwen3.8-Flash-Next on 12-24 GB Consumer GPUs
            </p>
          </div>
        </div>

        {/* Slide Selector Buttons */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentSlide === idx
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Global Progress */}
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>SLIDE {currentSlide + 1} / {slides.length}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        <div className="my-auto">
          {currentSlide === 0 && <SlideOverview />}
          {currentSlide === 1 && <SlideMemoryPlacement />}
          {currentSlide === 2 && <SlideMemoryCalculator />}
          {currentSlide === 3 && <SlideNGramExplainer />}
          {currentSlide === 4 && <SlideCpuOffload />}
          {currentSlide === 5 && <SlideMtpSimulator />}
          {currentSlide === 6 && <SlideHardwareTiers />}
        </div>

        {/* Navigation Footer Controls */}
        <footer className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentSlide === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-600'
                : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentSlide === slides.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-600'
                : 'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      </main>
    </div>
  );
}

function SlideOverview() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Breakthrough Local AI Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          How Strata Runs a 125B Model on 12 GB GPUs
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          Standard 125-billion-parameter AI models require enterprise data center GPUs with over 250 GB of VRAM. 
          <strong className="text-slate-200"> Strata</strong> splits the workload across GPU VRAM, System RAM, and SSD storage through intelligent hybrid offloading.
        </p>
      </div>

      {/* Core Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HighlightCard 
          icon={<Gauge className="w-6 h-6 text-cyan-400" />}
          title="2-bit & 3-bit Compression"
          desc="Reduces 250+ GB weight footprint down to 35-60 GB using extreme iMatrix quants (IQ2_XS, IQ3_S)."
        />
        <HighlightCard 
          icon={<Grid className="w-6 h-6 text-indigo-400" />}
          title="24,576 Sparse Experts"
          desc="Mixture-of-Experts (MoE) model where only ~10 experts are activated per word during token generation."
        />
        <HighlightCard 
          icon={<Cpu className="w-6 h-6 text-emerald-400" />}
          title="CPU Compute Offload"
          desc="Offloaded experts are calculated directly on the CPU in System RAM, avoiding heavy PCIe transfer delays."
        />
        <HighlightCard 
          icon={<Zap className="w-6 h-6 text-amber-400" />}
          title="MTP Speculative Decoding"
          desc="Built-in multi-token predictor drafts words ahead, giving a 1.6x - 1.8x generation speedup."
        />
      </div>

      {/* Core MoE Architecture Visual */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>The Three-Tier Memory Hierarchy</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-cyan-400">1. GPU VRAM</span>
                <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono">500-1000 GB/s</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores time-critical components: Attention layers, Router, Shared Experts, KV Cache, and "Hot" Expert Cache.
              </p>
            </div>
            <div className="mt-4 text-xs font-mono text-cyan-300/80 bg-cyan-950/40 p-2 rounded">
              High Bandwidth / Low Latency
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-indigo-400">2. System RAM</span>
                <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono">50-100 GB/s</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Holds 20,000+ sparse "routed" experts and the 51B parameter N-Gram lookup table. Computed natively by CPU.
              </p>
            </div>
            <div className="mt-4 text-xs font-mono text-indigo-300/80 bg-indigo-950/40 p-2 rounded">
              Medium Bandwidth / High Capacity
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-amber-400">3. NVMe SSD / Swap</span>
                <span className="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">3.5-7.5 GB/s</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Streams extra large quants via memory mapping (<code className="text-amber-300 font-mono">mmap</code>) or pagefile when physical RAM limit is reached.
              </p>
            </div>
            <div className="mt-4 text-xs font-mono text-amber-300/80 bg-amber-950/40 p-2 rounded">
              Slow Bandwidth / Overflow Buffer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideMemoryPlacement() {
  const [selectedComponent, setSelectedComponent] = useState('hotexperts');
  const [vramSize, setVramSize] = useState(12);
  const [ramSize, setRamSize] = useState(32); // Default to recommended minimum 32GB
  const [quantLevel, setQuantLevel] = useState('IQ2_XS');

  // Quantization preset specs
  const quantMap = {
    'Q2_0': { name: 'Q2_0', size: 36, desc: 'Fastest 2-bit (~36 GB)' },
    'IQ2_XS': { name: 'IQ2_XS', size: 42, desc: 'Recommended (~42 GB)' },
    'IQ3_S': { name: 'IQ3_S', size: 58, desc: 'Smarter 3-bit (~58 GB)' },
    'UD-IQ4_XS': { name: 'UD-IQ4_XS', size: 88, desc: 'High Precision (~88 GB)' },
  };

  const modelGB = quantMap[quantLevel].size;
  const ngramGB = 18; // Static N-gram table size
  const coreVramGB = 8; // Attention (2.0) + Shared (3.5) + Router (0.5) + KV Cache (2.0)
  
  // Calculate allocations
  const extraVram = Math.max(0, vramSize - coreVramGB);
  const hotVramGB = Math.min(extraVram, modelGB * 0.25); // Max ~25% hot experts in VRAM
  
  const offloadNeededGB = (modelGB - hotVramGB) + ngramGB;
  const ramUsableGB = Math.max(0, ramSize - 4); // Reserve 4GB for OS
  const ramUsedGB = Math.min(ramUsableGB, offloadNeededGB);
  const swapUsedGB = Math.max(0, offloadNeededGB - ramUsableGB);

  // Total blocks for expert distribution matrix
  const TOTAL_BLOCKS = 48;
  const hotBlocksCount = Math.max(2, Math.round((hotVramGB / (modelGB + ngramGB)) * TOTAL_BLOCKS));
  const swapBlocksCount = Math.round((swapUsedGB / (modelGB + ngramGB)) * TOTAL_BLOCKS);
  const ramBlocksCount = Math.max(0, TOTAL_BLOCKS - hotBlocksCount - swapBlocksCount);

  // Generate blocks array
  const blocks = Array.from({ length: TOTAL_BLOCKS }, (_, i) => {
    if (i < hotBlocksCount) return 'hot';
    if (i < hotBlocksCount + ramBlocksCount) return 'ram';
    return 'swap';
  });

  const componentDetails = {
    attention: {
      title: 'Dense Self-Attention Layers',
      location: 'GPU VRAM (~2.0 GB)',
      why: 'Evaluates context token relationships. Requires parallel floating-point operations on every token step.',
      impact: 'Must remain in VRAM. Offloading to RAM reduces context processing speed by over 90%.',
      badge: 'Critical GPU Path'
    },
    routing: {
      title: 'MoE Router / Gating Network',
      location: 'GPU VRAM (~0.5 GB)',
      why: 'Evaluates incoming token representations and selects top active experts out of 24,576.',
      impact: 'Instant routing access is necessary before expert computation starts.',
      badge: 'Critical GPU Path'
    },
    shared: {
      title: 'Shared Experts',
      location: 'GPU VRAM (~3.5 GB)',
      why: 'In Qwen architecture, shared experts process 100% of tokens (unlike sparse routed experts).',
      impact: 'Because activation frequency is 100%, keeping them in VRAM guarantees maximum execution efficiency.',
      badge: '100% Activation Rate'
    },
    kvcache: {
      title: 'KV Cache (Context Memory)',
      location: 'GPU VRAM (~2.0 GB)',
      why: 'Stores past Key/Value context vectors so prompts do not need recalculation on every generation step.',
      impact: 'Grows with context length (e.g. 32K context uses ~2-4 GB VRAM).',
      badge: 'Dynamic Memory'
    },
    hotexperts: {
      title: 'Dynamic Hot Expert Cache',
      location: `GPU VRAM (~${hotVramGB.toFixed(1)} GB Allocated)`,
      why: 'Stores the most frequently activated sparse experts directly in GPU VRAM to bypass PCIe transfer overhead.',
      impact: `Currently caching ~${Math.round((hotVramGB / modelGB) * 100)}% of model experts in fast VRAM (${hotBlocksCount} blocks cached).`,
      badge: 'Dynamic Hot Cache'
    },
    routed: {
      title: '24,576 Routed Experts (System RAM)',
      location: `System RAM (~${ramUsedGB.toFixed(1)} GB Allocated)`,
      why: 'Each token activates only ~10 sparse experts out of 24,576. Cold experts sit in System RAM and execute directly on CPU.',
      impact: `Recommended minimum RAM is 32 GB. With ${ramSize} GB system RAM, offloaded experts execute natively on CPU.`,
      badge: 'Hybrid Offload Engine'
    },
    ngram: {
      title: '51B Parameter N-Gram Table',
      location: 'System RAM (~18.0 GB)',
      why: 'Stores static lookup vectors for 20M phrases. Requires zero GPU matrix multiplication math (0 FLOPs).',
      impact: 'Does not waste precious GPU VRAM, running entirely from RAM lookups.',
      badge: 'Zero GPU FLOPs'
    },
    swap: {
      title: 'NVMe SSD Pagefile / Swap Overflow',
      location: swapUsedGB > 0 ? `NVMe SSD Pagefile (~${swapUsedGB.toFixed(1)} GB Active)` : 'Inactive (All weights fit in RAM)',
      why: 'When System RAM (e.g., 32 GB minimum) is smaller than the required model footprint, Strata streams missing experts from NVMe via mmap.',
      impact: swapUsedGB > 0 
        ? `Overflow active: ~${swapUsedGB.toFixed(1)} GB is paged from NVMe SSD. Generates at ~5-12 tokens/sec without crashing.`
        : 'Sufficient System RAM detected. Zero SSD pagefile bottlenecks.',
      badge: swapUsedGB > 0 ? 'SSD Pagefile Active' : 'Buffer Standard'
    }
  };

  const selected = componentDetails[selectedComponent];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Anatomy of Memory Tiering & Scaling
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Adjust the hardware scale below to visualize expert block distribution across VRAM, System RAM, and NVMe SSD Swap.
        </p>
      </div>

      {/* Interactive Scaling Controls Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* VRAM Scaling */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-400 font-semibold">GPU VRAM Target</span>
            <span className="text-white font-bold">{vramSize} GB</span>
          </div>
          <div className="flex space-x-1">
            {[8, 12, 16, 24].map((v) => (
              <button
                key={v}
                onClick={() => setVramSize(v)}
                className={`flex-1 py-1 rounded text-xs font-mono border transition-all ${
                  vramSize === v
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}GB
              </button>
            ))}
          </div>
        </div>

        {/* System RAM Scaling */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-indigo-400 font-semibold">System RAM (Min 32GB)</span>
            <span className="text-white font-bold">{ramSize} GB</span>
          </div>
          <div className="flex space-x-1">
            {[32, 48, 64, 96, 128].map((r) => (
              <button
                key={r}
                onClick={() => setRamSize(r)}
                className={`flex-1 py-1 rounded text-xs font-mono border transition-all ${
                  ramSize === r
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 32 ? '32 (Min)' : `${r}GB`}
              </button>
            ))}
          </div>
        </div>

        {/* Quant Level */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-purple-400 font-semibold">Model Precision / Size</span>
            <span className="text-white font-bold">{modelGB} GB</span>
          </div>
          <div className="flex space-x-1">
            {Object.keys(quantMap).map((q) => (
              <button
                key={q}
                onClick={() => setQuantLevel(q)}
                className={`flex-1 py-1 rounded text-[10px] font-mono border transition-all ${
                  quantLevel === q
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Memory Map */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. GPU VRAM Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Tier 1: GPU VRAM Zone ({vramSize} GB Dedicated)</span>
              </h4>
              <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-500/30">
                100% Ultra Speed
              </span>
            </div>

            {/* VRAM Interactive Component Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedComponent('attention')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedComponent === 'attention'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Self-Attention</div>
                <div className="text-[10px] text-cyan-400 font-mono">~2.0 GB</div>
              </button>

              <button
                onClick={() => setSelectedComponent('routing')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedComponent === 'routing'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">MoE Router</div>
                <div className="text-[10px] text-sky-400 font-mono">~0.5 GB</div>
              </button>

              <button
                onClick={() => setSelectedComponent('shared')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedComponent === 'shared'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Shared Experts</div>
                <div className="text-[10px] text-teal-400 font-mono">~3.5 GB</div>
              </button>

              <button
                onClick={() => setSelectedComponent('kvcache')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedComponent === 'kvcache'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">KV Cache</div>
                <div className="text-[10px] text-blue-400 font-mono">~2.0 GB</div>
              </button>

              {/* Dynamic Hot Expert Cache Card WITH VISUAL BLOCKS */}
              <button
                onClick={() => setSelectedComponent('hotexperts')}
                className={`col-span-2 p-2.5 rounded-xl border text-left transition-all space-y-2 ${
                  selectedComponent === 'hotexperts'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-amber-500/30 text-slate-300 hover:border-amber-500/60'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>🔥 Dynamic Hot Expert Cache</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">~{hotVramGB.toFixed(1)} GB in VRAM</span>
                </div>
                
                {/* Visual Expert Blocks inside Hot Cache */}
                <div className="p-1.5 rounded-lg bg-slate-950/90 border border-amber-500/30 space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-amber-200/80 font-mono">
                    <span>Cached VRAM Blocks:</span>
                    <span className="font-bold text-amber-400">{hotBlocksCount} Hot Blocks Cached</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: hotBlocksCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-2.5 w-3.5 rounded-[2px] bg-amber-400 shadow-sm shadow-amber-400/50 animate-pulse"
                        title={`Hot Expert Block #${idx + 1} cached directly in GPU VRAM`}
                      />
                    ))}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. System RAM Zone Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Tier 2: System RAM Zone ({ramSize} GB System Memory)</span>
              </h4>
              <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono border border-indigo-500/30">
                Recommended Min: 32 GB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 24,576 Routed Experts Box with Unified Block Visualizer */}
              <button
                onClick={() => setSelectedComponent('routed')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedComponent === 'routed'
                    ? 'bg-indigo-500/20 border-indigo-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-indigo-300">24,576 Routed Experts</span>
                  <span className="text-[10px] font-mono text-indigo-400">~{ramUsedGB.toFixed(1)} GB in RAM</span>
                </div>
                
                {/* Visual Expert Blocks Grid for entire architecture */}
                <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/90 border border-slate-800">
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>Overall Expert Placement:</span>
                    <span className="text-slate-200 font-bold">{TOTAL_BLOCKS} Blocks Total</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {blocks.map((type, idx) => (
                      <div
                        key={idx}
                        className={`h-2.5 rounded-[2px] transition-all ${
                          type === 'hot'
                            ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                            : type === 'ram'
                            ? 'bg-indigo-500'
                            : 'bg-rose-500/80 border border-rose-400 shadow-sm shadow-rose-500/30'
                        }`}
                        title={
                          type === 'hot' ? 'Cached in fast VRAM' :
                          type === 'ram' ? 'Offloaded in System RAM' : 'Overflowed to NVMe SSD Pagefile'
                        }
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between text-[8px] font-mono pt-1 text-slate-400 border-t border-slate-800/80">
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1" />VRAM ({hotBlocksCount})</span>
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1" />RAM ({ramBlocksCount})</span>
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" />SSD ({swapBlocksCount})</span>
                  </div>
                </div>
              </button>

              {/* N-Gram Table */}
              <button
                onClick={() => setSelectedComponent('ngram')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedComponent === 'ngram'
                    ? 'bg-purple-500/20 border-purple-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-300">51B N-Gram Table</span>
                    <span className="text-[10px] font-mono text-purple-400">~18.0 GB</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Static phrase lookup vectors stored in System RAM. Zero GPU FLOPs required.
                  </p>
                </div>
                <div className="mt-2 p-1 rounded bg-purple-950/40 border border-purple-500/30 text-[9px] font-mono text-purple-300 text-center">
                  Fits in System RAM
                </div>
              </button>
            </div>
          </div>

          {/* 3. NVMe SSD Swap / Pagefile Overflow Box */}
          <button
            onClick={() => setSelectedComponent('swap')}
            className={`w-full p-4 rounded-2xl border text-left transition-all space-y-2 ${
              selectedComponent === 'swap'
                ? 'bg-rose-950/30 border-rose-400 text-white'
                : swapUsedGB > 0
                ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider flex items-center space-x-2 text-rose-400">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Tier 3: NVMe SSD Pagefile / Swap Overflow</span>
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                swapUsedGB > 0
                  ? 'bg-rose-950 text-rose-300 border-rose-500/40 font-bold'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}>
                {swapUsedGB > 0 ? `Active Overflow: ~${swapUsedGB.toFixed(1)} GB` : 'Inactive (0 GB)'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {swapUsedGB > 0
                ? `System RAM (${ramSize} GB) is smaller than the required ${offloadNeededGB.toFixed(1)} GB footprint. Strata automatically streams ${swapUsedGB.toFixed(1)} GB of experts from NVMe SSD via mmap without crashing.`
                : `For smaller RAM setups (like 32 GB minimum running larger models), NVMe swap acts as a safety overflow buffer.`
              }
            </p>
          </button>

        </div>

        {/* Component Deep-Dive Inspection Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md font-semibold border border-cyan-500/30">
                {selected.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">{selected.location}</span>
            </div>

            <h3 className="text-xl font-bold text-white">{selected.title}</h3>

            <div className="space-y-4 text-sm">
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Architectural Role</h5>
                <p className="text-slate-300 leading-relaxed text-xs">{selected.why}</p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Execution & Throughput Impact</h5>
                <p className="text-slate-300 leading-relaxed text-xs">{selected.impact}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs text-slate-400">
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Click any tier box or element on the left to inspect its behavior.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideMemoryCalculator() {
  const [vram, setVram] = useState(12);
  const [ram, setRam] = useState(64);
  const [quantLevel, setQuantLevel] = useState('IQ2_XS');

  // Quant sizes in GB
  const quantSizes = {
    'Q2_0': { totalSize: 36, quality: 'Fastest (~36GB)' },
    'IQ2_XS': { totalSize: 42, quality: 'Recommended (~42GB)' },
    'IQ3_S': { totalSize: 58, quality: 'Smarter (~58GB)' },
    'UD-IQ4_XS': { totalSize: 88, quality: 'High Quality (~88GB)' }
  };

  const modelSize = quantSizes[quantLevel].totalSize;
  const ngramSize = 18; // 51B N-gram lookup table footprint (~18GB)
  
  // Mandatory VRAM requirements
  const coreVram = 6.0; // Attention (2GB) + Shared Experts (3.5GB) + Router (0.5GB)
  const kvCacheVram = 2.0;
  const totalBaseVram = coreVram + kvCacheVram; // 8.0 GB

  // Hot Expert Cache in VRAM if space permits
  const extraVram = Math.max(0, vram - totalBaseVram);
  const vramHotExperts = Math.min(extraVram, modelSize * 0.25);

  // Remainder needed in RAM
  const modelInRam = Math.max(0, modelSize - vramHotExperts);
  const totalRamNeeded = modelInRam + ngramSize + 4.0; // +4GB for OS overhead

  // SSD Pagefile active check
  const ramDeficit = Math.max(0, totalRamNeeded - ram);
  const isSsdPaging = ramDeficit > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Interactive Memory Allocation Calculator
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Adjust your hardware specs below to calculate how Strata partitions model weights across VRAM, RAM, and SSD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Hardware Configuration</span>
          </h3>

          {/* VRAM Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-300">GPU VRAM</span>
              <span className="text-cyan-400 font-mono font-bold">{vram} GB</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              step="4"
              value={vram}
              onChange={(e) => setVram(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8 GB</span>
              <span>12 GB</span>
              <span>16 GB</span>
              <span>24 GB</span>
            </div>
          </div>

          {/* System RAM Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-300">System RAM</span>
              <span className="text-indigo-400 font-mono font-bold">{ram} GB</span>
            </div>
            <input
              type="range"
              min="32"
              max="128"
              step="16"
              value={ram}
              onChange={(e) => setRam(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>32 GB</span>
              <span>64 GB</span>
              <span>96 GB</span>
              <span>128 GB</span>
            </div>
          </div>

          {/* Model Quant Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Model Quantization</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(quantSizes).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantLevel(q)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                    quantLevel === q
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-mono">{q}</div>
                  <div className="text-[10px] font-normal opacity-80">{quantSizes[q].quality}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Allocation Output */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Calculated Memory Partitioning</span>
            </h3>

            {/* VRAM Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-400 font-semibold">VRAM Usage ({totalBaseVram + vramHotExperts} / {vram} GB)</span>
                <span className="text-slate-400">{Math.round(((totalBaseVram + vramHotExperts) / vram) * 100)}%</span>
              </div>
              <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
                <div 
                  className="bg-cyan-500 h-full rounded-l-full" 
                  style={{ width: `${Math.min(100, ((totalBaseVram) / vram) * 100)}%` }} 
                  title="Core + KV Cache"
                />
                <div 
                  className="bg-sky-400 h-full" 
                  style={{ width: `${Math.min(100, (vramHotExperts / vram) * 100)}%` }} 
                  title="Hot Experts Cache"
                />
              </div>
              <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-500 mr-1.5" />Core/KV Cache ({totalBaseVram}GB)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-sky-400 mr-1.5" />Hot Experts ({vramHotExperts.toFixed(1)}GB)</span>
              </div>
            </div>

            {/* System RAM Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-indigo-400 font-semibold">System RAM Usage ({Math.min(ram, totalRamNeeded.toFixed(1))} / {ram} GB)</span>
                <span className="text-slate-400">{Math.round((totalRamNeeded / ram) * 100)}%</span>
              </div>
              <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
                <div 
                  className="bg-indigo-500 h-full rounded-l-full" 
                  style={{ width: `${Math.min(100, (modelInRam / ram) * 100)}%` }} 
                  title="Offloaded Experts"
                />
                <div 
                  className="bg-purple-500 h-full" 
                  style={{ width: `${Math.min(100, (ngramSize / ram) * 100)}%` }} 
                  title="51B N-Gram Lookup Table"
                />
              </div>
              <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5" />Offloaded Experts ({modelInRam.toFixed(1)}GB)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5" />N-Gram Table ({ngramSize}GB)</span>
              </div>
            </div>

            {/* Status Alert Badge */}
            {isSsdPaging ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-amber-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">SSD Pagefile Streaming Active</h5>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    System RAM falls short by <strong className="font-mono text-white">{ramDeficit.toFixed(1)} GB</strong>. Strata will stream missing expert weights directly from your NVMe SSD via <code className="font-mono">mmap</code>. Generation speed will drop to ~5-8 tokens/sec.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start space-x-3 text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Optimal RAM Fit</h5>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    All offloaded experts fit natively into System RAM! Generates text at full CPU/GPU hybrid speeds without SSD bottlenecks.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideNGramExplainer() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Database className="w-3.5 h-3.5" />
          <span>Layer 2 Memory Injection</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          The 51B Parameter N-Gram Lookup Matrix
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Qwen3.8-Flash-Next contains a massive 51-billion-parameter static memory table. Instead of using GPU compute math, it performs array lookups to retrieve phrases instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step Breakdown */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-xs border border-cyan-500/40">1</span>
              <span>Sequence Pattern Match</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              When a sequence of words (e.g. <span className="font-mono text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">"San Francisco"</span>) enters the model, the tokenizer hashes the bigram/trigram IDs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-950 flex items-center justify-center text-xs border border-indigo-500/40">2</span>
              <span>Zero-FLOP Array Lookup</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              Instead of running floating-point matrix multiplications (FLOPs) through deep neural network layers, it performs a quick memory address lookup into a 20-million entry table in System RAM.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-950 flex items-center justify-center text-xs border border-purple-500/40">3</span>
              <span>Activation Vector Injection</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              The retrieved embedding vector is injected directly into Layer 2 of the model, injecting static linguistic knowledge instantly.
            </p>
          </div>
        </div>

        {/* Visual Lookup Flow */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-6">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            RAM Lookup vs GPU VRAM Execution
          </h4>

          <div className="space-y-4">
            {/* Diagram */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Input Prompt:</span>
                <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">"United States of..."</span>
              </div>
              <div className="flex justify-center my-1 text-slate-600">↓</div>
              <div className="p-3 rounded-lg bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 flex justify-between items-center">
                <span>RAM Address Read: 0x8F31A...</span>
                <span className="text-[10px] bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded font-bold">0 GPU FLOPs</span>
              </div>
              <div className="flex justify-center my-1 text-slate-600">↓</div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Injected Vector Output:</span>
                <span className="text-emerald-400 font-bold">"America" (Vector #90123)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 space-y-1">
              <strong className="text-purple-300 block font-bold">Why this matters for consumer PCs:</strong>
              <p className="text-purple-200/80 leading-relaxed text-[11px]">
                Because N-gram lookups require simple memory fetches rather than dense GPU compute, storing this 51B parameter chunk in System RAM or SSD adds zero workload to your GPU!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideCpuOffload() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Heterogeneous Computing (CPU + GPU Parallel Execution)
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Traditional offloading engines suffer severe bottlenecks by constantly transferring missing weights across the PCIe slot. Strata avoids this entirely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Naive / Traditional approach */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-red-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-red-400">Standard Offloading Strategy</h3>
            <span className="text-xs bg-red-950 text-red-300 px-2.5 py-1 rounded-md border border-red-500/30 font-mono">Slow (PCIe Bottleneck)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>1. Missing expert needed during token step.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>2. Transfer gigabytes of weights from RAM to VRAM across PCIe bus.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>3. GPU pauses and waits for weight transfer to complete.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-950/20 text-red-300 text-xs font-mono">
            ⚠️️ Transferring weights over PCIe Gen4 (31.5 GB/s) limits token speed to under 10 tokens/sec.
          </div>
        </div>

        {/* Strata Approach */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-emerald-400">Strata Heterogeneous Execution</h3>
            <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 font-mono">Fast (Parallel Compute)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>1. GPU calculates Attention layers & VRAM "hot" experts.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>2. Missing experts are computed <strong>natively on the CPU</strong> directly in RAM.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>3. Only tiny output activation numbers (~KBs) pass back over PCIe.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 text-emerald-300 text-xs font-mono">
            ⚡ Zero weight copying! CPU vectors AVX-512/AVX2 instruction sets for maximum execution speed.
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideMtpSimulator() {
  const [step, setStep] = useState(0); // 0: Idle, 1: Drafting, 2: Verified
  const [mtpSuccess, setMtpSuccess] = useState(true);

  const resetSimulator = () => {
    setStep(0);
  };

  const runDrafting = () => {
    setStep(1);
  };

  const runVerification = () => {
    setStep(2);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Self-Speculative Decoding</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Multi-Token Prediction (MTP) Sandbox
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          MTP uses a small auxiliary drafting head to guess the next 3 tokens ahead. The heavy 125B model then validates all 3 in a single forward pass, providing a 1.6x - 1.8x speedup.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-mono">MTP Prediction Mode:</span>
            <button
              onClick={() => setMtpSuccess(!mtpSuccess)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                mtpSuccess 
                  ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300' 
                  : 'bg-amber-950 border-amber-500/40 text-amber-300'
              }`}
            >
              {mtpSuccess ? '100% Draft Match (3 Tokens Accepted)' : 'Partial Match (Token #2 Mismatch)'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetSimulator}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {step === 0 && (
              <button
                onClick={runDrafting}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>1. Draft Next 3 Tokens</span>
              </button>
            )}
            {step === 1 && (
              <button
                onClick={runVerification}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>2. Verify via 125B Pass</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation Display */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400">Context Prompt: <span className="text-white">"The weather in Paris today is"</span></div>

          {/* Tokens Visual Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Token 1 */}
            <div className={`p-4 rounded-xl border transition-all ${
              step === 0 ? 'bg-slate-950 border-slate-800 text-slate-600' :
              step === 1 ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' :
              'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            }`}>
              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                <span>DRAFT #1</span>
                {step === 2 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-base font-bold font-mono">"sunny"</div>
              <div className="text-[10px] opacity-75 mt-2">MTP Draft: Confidence 96%</div>
            </div>

            {/* Token 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              step === 0 ? 'bg-slate-950 border-slate-800 text-slate-600' :
              step === 1 ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' :
              mtpSuccess ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                <span>DRAFT #2</span>
                {step === 2 && (mtpSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />)}
              </div>
              <div className="text-base font-bold font-mono">
                {step === 2 && !mtpSuccess ? <s>"and"</s> : '"and"'}
                {step === 2 && !mtpSuccess && <span className="text-emerald-400 ml-2">"with"</span>}
              </div>
              <div className="text-[10px] opacity-75 mt-2">MTP Draft: Confidence {mtpSuccess ? '91%' : '42%'}</div>
            </div>

            {/* Token 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              step === 0 ? 'bg-slate-950 border-slate-800 text-slate-600' :
              step === 1 ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' :
              mtpSuccess ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}>
              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                <span>DRAFT #3</span>
                {step === 2 && mtpSuccess && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-base font-bold font-mono">
                {step === 2 && !mtpSuccess ? <span className="text-slate-600">(Discarded)</span> : '"clear"'}
              </div>
              <div className="text-[10px] opacity-75 mt-2">MTP Draft: Confidence 88%</div>
            </div>
          </div>

          {/* Outcome Status Box */}
          {step === 2 && (
            <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
              mtpSuccess 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            }`}>
              <div className="font-bold flex items-center space-x-2">
                {mtpSuccess ? <Sparkles className="w-4 h-4 text-emerald-400" /> : <Info className="w-4 h-4 text-amber-400" />}
                <span>{mtpSuccess ? 'MTP Parallel Hit: 3 Tokens emitted in 1 step!' : 'Partial Match: Token #1 & corrected Token #2 emitted.'}</span>
              </div>
              <p className="opacity-80 text-[11px] leading-relaxed">
                {mtpSuccess 
                  ? 'The main 125B model validated all three tokens in a single parallel forward pass. Effective throughput: 3x tokens per RAM read cycle.' 
                  : 'Token #2 differed from the main model. Strata accepted Token #1, corrected Token #2 to "with", discarded Token #3, and continues without wasting time.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SlideHardwareTiers() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          System Requirements & Hardware Tiers
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Because Strata splits memory dynamically, your system RAM size dictates which quantization level runs best.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded">32 GB RAM Tier</span>
              <span className="text-xs text-cyan-400 font-mono">12 GB VRAM</span>
            </div>
            <h3 className="text-lg font-bold text-white">Coder / Q2_0 Variant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fits the coding-specialized version with half the experts pruned, or the lightweight 2-bit standard model.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Speed: ~60-90 tokens/sec</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fits fully in physical RAM</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Ideal for budget gaming PCs
          </div>
        </div>

        {/* Tier 2 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 flex flex-col justify-between shadow-lg shadow-cyan-500/5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30">64 GB RAM Tier</span>
              <span className="text-xs text-cyan-400 font-mono">12-16 GB VRAM</span>
            </div>
            <h3 className="text-lg font-bold text-white">IQ2_XS / IQ3_S (Sweet Spot)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Runs the full 24,576 expert model at 2.5-bit or 3-bit precision with no quality loss.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Speed: ~50-60 tokens/sec</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero SSD swap bottlenecks</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold">
            Recommended Configuration
          </div>
        </div>

        {/* Tier 3 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">96 GB+ RAM Tier</span>
              <span className="text-xs text-indigo-400 font-mono">16-24 GB VRAM</span>
            </div>
            <h3 className="text-lg font-bold text-white">UD-IQ4_XS (~4-bit)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maximum intelligence near FP16 precision. Unsloth's ~4-bit quantization.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Near data-center reasoning quality</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Requires ~88 GB working RAM</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            For power workstation setups
          </div>
        </div>
      </div>
    </div>
  );
}

function HighlightCard({ icon, title, desc }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
      <div className="p-2.5 rounded-xl bg-slate-950 w-fit border border-slate-800">
        {icon}
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
