export const meta = {
  title: 'OpenCV 5 Highlights',
  description: 'What is new with OpenCV 5',
  tags: ['OpenCV', 'Apache 2'],
};
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, X, GitBranch, Cpu, Layers, ArrowDown, RotateCw, Sparkles, Languages } from 'lucide-react';

const translations = {
  en: {
    title: "OpenCV 5 Highlights",
    prev: "Previous",
    next: "Next",
    whatIsOnnx: "What is ONNX?",
    slides: [
      { title: "OpenCV 5: A New Era", subtitle: "Architectural Overhaul & Modernization", points: ["The most significant library overhaul since 2018.", "Focus on modern C++17 standards.", "Removal of legacy C-API technical debt.", "Strategic shift to the Apache 2.0 license."] },
      { title: "New DNN Graph Engine", subtitle: "From Sequential Layers to Topological Graphs", points: [] },
      { title: "Generative AI & VLM", subtitle: "Native Captioning & Reasoning", points: ["Native support for Vision-Language Models (PaliGemma, Qwen, etc.).", "Built-in Tokenizers, Attention Layers, and KV-Cache.", "End-to-end image captioning without external runtimes.", "Efficient support for Mixture of Experts (MoE) architectures."] },
      { title: "Advanced Data Types", subtitle: "Mathematical Modernization", points: ["True 0D (scalars) and 1D arrays implemented.", "Native support for FP16 (Half) and BF16 (Bfloat16).", "Automatic N-ary elementwise broadcasting semantics.", "Native CV_Bool type for clean masking."] }
    ],
    onnx: {
      title: "The ONNX Ecosystem",
      desc: "ONNX (Open Neural Network Exchange) functions as a universal translator. Frameworks like PyTorch and TensorFlow can export models to ONNX, while tools like OpenCV 5 can import them directly for optimized execution."
    }
  },
  'zh-HK': {
    title: "OpenCV 5 重點簡介",
    prev: "上一頁",
    next: "下一頁",
    whatIsOnnx: "什麼是 ONNX? ",
    slides: [
      { title: "OpenCV 5: 新紀元", subtitle: "架構改革與現代化", points: ["自 2018 年以來最重大的程式庫改革。", "專注於現代 C++17 標準 (Modern C++17 Standards)。", "移除舊版 C-API 的技術債 (Technical Debt)。", "策略性轉移至 Apache 2.0 授權 (Apache 2.0 License)。"] },
      { title: "全新 DNN 圖引擎 (DNN Graph Engine)", subtitle: "從線性層 (Sequential Layers) 到拓撲圖 (Topological Graphs)", points: [] },
      { title: "生成式 AI 與 VLM (Generative AI & VLM)", subtitle: "原生字幕生成與推理 (Native Captioning & Reasoning)", points: ["原生支援視覺語言模型 (Vision-Language Models)，如 PaliGemma, Qwen 等。", "內建分詞器 (Tokenizers)、注意力層 (Attention Layers) 與 KV 快取 (KV-Cache)。", "無需外部執行環境的端到端圖像字幕生成 (End-to-end Image Captioning)。", "高效支援專家混合架構 (Mixture of Experts - MoE)。"] },
      { title: "進階數據類型 (Advanced Data Types)", subtitle: "數學現代化 (Mathematical Modernization)", points: ["實作真正的 0D (標量) 與 1D 陣列。", "原生支援 FP16 (半精度) 與 BF16 (Bfloat16)。", "自動 N 元元素廣播語義 (Automatic N-ary Broadcasting Semantics)。", "用於簡潔遮罩 (Masking) 的原生 CV_Bool 類型。"] }
    ],
    onnx: {
      title: "ONNX 生態系統 (ONNX Ecosystem)",
      desc: "ONNX (Open Neural Network Exchange) 作為一種通用轉換器。PyTorch 和 TensorFlow 等框架可以將模型匯出 (Export) 至 ONNX，而 OpenCV 5 等工具可以直接匯入 (Import) 它們以進行最佳化執行。"
    }
  }
};

const ONNXModal = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = translations[lang].onnx;
  
  const frameworks = [
    { name: "PyTorch", color: "#ee4c2c" },
    { name: "TensorFlow", color: "#ff6f00" },
    { name: "Keras", color: "#d00000" },
    { name: "JAX", color: "#222" }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t.title}</h2>
        
        <div className="my-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <svg viewBox="0 0 700 350" className="w-full h-auto min-w-[600px]">
            <circle cx="350" cy="175" r="50" fill="#3b82f6" />
            <text x="350" y="175" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">ONNX</text>

            {frameworks.map((node, i) => {
                const y = 60 + i * 70;
                return (
                    <g key={`node-${i}`}>
                        <rect x="50" y={y - 20} width="110" height="40" rx="6" fill={node.color} />
                        <text x="105" y={y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{node.name}</text>
                        <path d={`M 160 ${y} L 300 175`} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead)" />
                        
                        <rect x="540" y={y - 20} width="110" height="40" rx="6" fill={node.color} />
                        <text x="595" y={y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{node.name}</text>
                        <path d={`M 400 175 L 540 ${y}`} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead)" />
                    </g>
                )
            })}

            <rect x="540" y="300" width="110" height="40" rx="6" fill="#10b981" stroke="#064e3b" strokeWidth="3" />
            <text x="595" y="325" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OpenCV 5</text>
            <path d={`M 400 175 L 540 320`} stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead2)" />

            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
              <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
            </defs>
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{t.desc}</p>
      </div>
    </div>
  );
};

const DNNVisualizer = () => (
  <div className="grid grid-cols-2 gap-8 w-full h-full">
    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-semibold text-slate-500 mb-6 flex items-center gap-2"><Layers size={16}/> OpenCV 4 (Linear)</h4>
      <div className="flex flex-col items-center gap-2">
        {[1, 2, 3].map(i => (
          <React.Fragment key={i}>
            <div className="w-32 h-10 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded flex items-center justify-center font-mono text-xs">Layer {i}</div>
            {i < 3 && <ArrowDown size={14} className="text-slate-400" />}
          </React.Fragment>
        ))}
      </div>
    </div>

    <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
      <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-2"><GitBranch size={16}/> OpenCV 5 (Graph)</h4>
      <svg viewBox="0 0 200 220" className="w-48 h-52">
          <line x1="100" y1="10" x2="100" y2="40" stroke="#3b82f6" strokeWidth="2" />
          <path d="M 100 40 Q 40 70, 40 100" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <path d="M 100 40 Q 160 70, 160 100" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <circle cx="40" cy="100" r="8" fill="#f59e0b" />
          <circle cx="160" cy="100" r="8" fill="#f59e0b" />
          <path d="M 40 100 Q 40 130, 100 160" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <path d="M 160 100 Q 160 130, 100 160" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <path d="M 160 100 A 30 30 0 1 0 160 140" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4" />
          <line x1="100" y1="160" x2="100" y2="190" stroke="#3b82f6" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang][key] || key;
  const slide = translations[lang].slides[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev === translations[lang].slides.length - 1 ? prev : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1));

  return (
    <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-hidden">
      <ONNXModal isOpen={showModal} onClose={() => setShowModal(false)} lang={lang} />
      
      <header className="p-6 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {t('title')}
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'zh-HK' : 'en')} className="flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs">
            <Languages size={14} /> {lang === 'en' ? 'EN' : 'ZH'}
          </button>
          <span className="text-sm font-medium px-4 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {currentSlide + 1} / {translations[lang].slides.length}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-6xl h-full flex flex-col justify-center animate-in fade-in duration-700">
          {currentSlide === 1 ? (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-extrabold mb-4">{slide.title}</h2>
                <h3 className="text-xl text-blue-600 font-medium mb-8">{slide.subtitle}</h3>
                <button onClick={() => setShowModal(true)} className="mt-8 flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                  <Info size={20} /> {t('whatIsOnnx')}
                </button>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                <DNNVisualizer />
              </div>
            </div>
          ) : (
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-6xl font-extrabold mb-4">{slide.title}</h2>
              <h3 className="text-2xl text-blue-600 font-medium mb-12">{slide.subtitle}</h3>
              {slide.points.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 text-left">
                    {slide.points.map((point, index) => (
                        <div key={index} className="flex items-start bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <Sparkles className="text-indigo-500 shrink-0 mt-1 mr-4" size={24} />
                            <span className="text-lg text-slate-700 dark:text-slate-300">{point}</span>
                        </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${currentSlide === 0 ? 'bg-slate-50 text-slate-300 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
          <ChevronLeft /> {t('prev')}
        </button>
        <button 
          onClick={nextSlide} 
          disabled={currentSlide === translations[lang].slides.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition shadow-lg ${currentSlide === translations[lang].slides.length - 1 ? 'bg-blue-300 text-blue-50 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {t('next')} <ChevronRight />
        </button>
      </footer>
    </div>
  );
}
