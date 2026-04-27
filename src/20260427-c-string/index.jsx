export const meta = {
  title: 'C String Memory Visualizer',
  description: 'Visualize how strcpy, strncpy, and memcpy handle null-terminated strings in C — and why buffer overflows happen.',
  tags: ['c', 'memory', 'security', 'strings'],
};

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ArrowRight, 
  Info, 
  AlertCircle, 
  Cpu, 
  Copy,
  Zap,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

const App = () => {
  const [sourceText, setSourceText] = useState("Hello");
  const [bufferSize, setBufferSize] = useState(10);
  const [activeFunc, setActiveFunc] = useState('strcpy');
  
  // Memory states
  const [sourceMemory, setSourceMemory] = useState([]);
  const [destMemory, setDestMemory] = useState([]);

  // Function descriptions and logic data
  const functions = {
    strcpy: {
      name: 'strcpy(dest, src)',
      desc: 'Copies the source string including the null terminator (\\0) to destination. It keeps copying until it encounters the first \\0 in the source.',
      risk: 'CRITICAL: No bounds checking. If source length + 1 > buffer size, it will overwrite adjacent memory (Buffer Overflow).',
      behavior: 'Copies until \\0 is found.'
    },
    strncpy: {
      name: 'strncpy(dest, src, n)',
      desc: 'Copies at most "n" characters. If the source is shorter than "n", the remainder of the buffer is filled with \\0. If the source is "n" or longer, the result is NOT null-terminated.',
      risk: 'WARNING: If source is longer than n, the destination string will lack a null terminator, causing crashes in subsequent string operations.',
      behavior: 'Copies n bytes; pads with \\0 if source is short.'
    },
    memcpy: {
      name: 'memcpy(dest, src, n)',
      desc: 'Copies exactly "n" bytes from source to destination. It is completely agnostic to null terminators or data types.',
      risk: 'NEUTRAL: Pure memory move. Up to the programmer to ensure destination has a null terminator if treated as a string later.',
      behavior: 'Moves raw bytes; ignores \\0 content.'
    }
  };

  useEffect(() => {
    // 1. Setup Source Memory (Read-only representation)
    const src = sourceText.split('').map(char => ({
      val: char,
      hex: char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'),
      type: 'char'
    }));
    // Explicitly add null terminator to source
    src.push({ val: '\\0', hex: '00', type: 'null' });
    setSourceMemory(src);

    // 2. Run Simulation for Destination
    runSimulation(sourceText, bufferSize, activeFunc);
  }, [sourceText, bufferSize, activeFunc]);

  const runSimulation = (text, size, func) => {
    // Initialize buffer with "garbage" values (simulated by ?)
    let newDest = Array(size).fill(null).map(() => ({ val: '?', hex: '??', type: 'uninit' }));
    const chars = text.split('');
    
    if (func === 'strcpy') {
      // strcpy: copy until \0
      for (let i = 0; i <= chars.length; i++) {
        if (i < size) {
          if (i === chars.length) {
            newDest[i] = { val: '\\0', hex: '00', type: 'null' };
          } else {
            newDest[i] = { val: chars[i], hex: chars[i].charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'), type: 'char' };
          }
        } else {
          // In a real C program, we would be writing past the array here
          // We'll visually indicate overflow by stopping at the UI boundary but marking the last index
        }
      }
    } else if (func === 'strncpy') {
      // strncpy: copy exactly 'size' (n) bytes
      for (let i = 0; i < size; i++) {
        if (i < chars.length) {
          newDest[i] = { val: chars[i], hex: chars[i].charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'), type: 'char' };
        } else if (i === chars.length) {
          newDest[i] = { val: '\\0', hex: '00', type: 'null' };
        } else {
          // strncpy pads remaining space with zeros
          newDest[i] = { val: '\\0', hex: '00', type: 'null' };
        }
      }
    } else if (func === 'memcpy') {
      // memcpy: copy exactly 'size' bytes based on whatever is in memory
      for (let i = 0; i < size; i++) {
        if (i < chars.length) {
          newDest[i] = { val: chars[i], hex: chars[i].charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'), type: 'char' };
        } else if (i === chars.length) {
          // it picks up the source's null terminator if it's within the count
          newDest[i] = { val: '\\0', hex: '00', type: 'null' };
        } else {
          // If copying beyond source + null, memcpy would pick up whatever is next in memory
          newDest[i] = { val: '?', hex: '??', type: 'uninit' };
        }
      }
    }
    setDestMemory(newDest);
  };

  const MemoryCell = ({ data, index }) => {
    const bgColor = {
      char: 'bg-blue-50 border-blue-200 text-blue-700',
      null: 'bg-red-100 border-red-300 text-red-700 font-bold',
      uninit: 'bg-slate-100 border-slate-200 text-slate-400'
    }[data.type];

    return (
      <div className="flex flex-col items-center gap-1 group">
        <span className="text-[10px] text-slate-400 font-mono">0x{index.toString(16).toUpperCase().padStart(2, '0')}</span>
        <div className={`w-12 h-16 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${bgColor} shadow-sm group-hover:scale-105`}>
          <span className="text-sm font-bold font-mono">{data.val}</span>
          <span className="text-[10px] opacity-60">0x{data.hex}</span>
        </div>
      </div>
    );
  };

  const isOverflow = activeFunc === 'strcpy' && sourceText.length >= bufferSize;
  const isUnterminated = activeFunc === 'strncpy' && sourceText.length >= bufferSize;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Title Block */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Cpu size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              C String Memory Visualizer
            </h1>
          </div>
          <p className="text-slate-600">
            Understand how <strong>Null-Terminated Strings</strong> work and why function choice matters for security.
          </p>
        </div>

        {/* Interaction Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-slate-700">
              <Database size={18} /> Buffer Config
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Source String Content</label>
                <input 
                  type="text" 
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value.substring(0, 19))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                  placeholder="Type here..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex justify-between">
                  <span>Destination Buffer Size</span>
                  <span>{bufferSize} Bytes</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={bufferSize}
                  onChange={(e) => setBufferSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold mb-4 text-slate-700 flex items-center gap-2">
              <Zap size={18} /> Execution Logic
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.keys(functions).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveFunc(key)}
                  className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
                    activeFunc === key 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-bold font-mono text-sm mb-1">{functions[key].name}</div>
                  <div className="text-[10px] opacity-70 leading-tight">{functions[key].behavior}</div>
                  {activeFunc === key && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer Screens */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Source Memory Map
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-mono">char src[] = "{sourceText}"</span>
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {sourceMemory.map((cell, idx) => (
                <MemoryCell key={`src-${idx}`} data={cell} index={idx} />
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-indigo-600 text-white px-4 py-1 rounded-full shadow-lg text-xs font-bold animate-pulse">
              {activeFunc}
            </div>
          </div>

          <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-colors ${
            isOverflow || isUnterminated ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Dest Buffer Memory Map
              </h3>
              <div className="flex gap-2">
                {isOverflow && (
                  <div className="flex items-center gap-1 text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold">
                    <ShieldAlert size={12} /> OVERFLOW
                  </div>
                )}
                {isUnterminated && (
                  <div className="flex items-center gap-1 text-[10px] bg-amber-600 text-white px-2 py-1 rounded font-bold">
                    <AlertCircle size={12} /> UNTERMINATED
                  </div>
                )}
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono">char dest[{bufferSize}]</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {destMemory.map((cell, idx) => (
                <MemoryCell key={`dest-${idx}`} data={cell} index={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Info size={18} className="text-indigo-600" /> 
              Why this happens
            </h4>
            <div className="prose prose-sm text-slate-600 leading-relaxed space-y-3">
              <p>{functions[activeFunc].desc}</p>
              <div className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800">
                {activeFunc === 'strcpy' && `// Loop: while(*src) *dest++ = *src++;\n// *dest = '\\0'; // Appends terminal zero`}
                {activeFunc === 'strncpy' && `// Loop: for(i=0; i<n; i++) {\n//   if(i < len) dest[i] = src[i];\n//   else dest[i] = '\\0';\n// }`}
                {activeFunc === 'memcpy' && `// Fast block move:\n// while(n--) *dest++ = *src++;`}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-slate-300 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Copy size={18} className="text-indigo-400" />
              The Summary
            </h4>
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded bg-slate-800/50 border-l-4 border-indigo-500">
                <p className="font-bold text-indigo-300 mb-1">STRCPY</p>
                Copies until 0x00. Simple but deadly if the destination is too small.
              </div>
              <div className="p-3 rounded bg-slate-800/50 border-l-4 border-emerald-500">
                <p className="font-bold text-emerald-300 mb-1">STRNCPY</p>
                Safely stops at "n", but fails to add 0x00 if "n" is too small. Always manually null-terminate the last byte.
              </div>
              <div className="p-3 rounded bg-slate-800/50 border-l-4 border-amber-500">
                <p className="font-bold text-amber-300 mb-1">MEMCPY</p>
                The fastest. Moves raw data. Doesn't care about strings at all.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;