export const meta = {
  title: 'Intel Xe driver debug',
  description: 'What was the Linux driver bug that Linus Torvalds would use AI to help fixing for',
  tags: ['c', 'memory', 'Linux', 'driver', 'GPU'],
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Terminal, 
  Power, 
  FileCode2, 
  Brain, 
  Monitor, 
  Ghost, 
  Bug, 
  Ruler, 
  Shuffle, 
  RotateCcw,
  Sparkles,
  Layers,
  Lock,
  Globe
} from 'lucide-react';

const TOTAL_CELLS = 16;
const HAZARD_INDEX = 11; // Index 11 represents the overlapping 2 KiB page boundary

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'zh'
  const [mode, setMode] = useState('round_up'); // 'round_up' | 'round_down'
  const [bootState, setBootState] = useState('idle'); // 'idle' | 'booting' | 'crashed' | 'success'
  const [logs, setLogs] = useState([]);
  const [allocatedCells, setAllocatedCells] = useState({});
  
  const logContainerRef = useRef(null);

  // Helper function for bilingual strings
  const t = (enText, zhText) => (lang === 'zh' ? zhText : enText);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const resetSimulation = () => {
    setBootState('idle');
    setAllocatedCells({});
    setLogs([
      {
        text: t("[ 0.000000] System standing by...", "[ 0.000000] 系統就緒，等待啟動指令..."),
        color: "text-slate-500"
      }
    ]);
  };

  useEffect(() => {
    resetSimulation();
  }, [mode, lang]);

  const runBootSimulation = () => {
    setBootState('booting');
    setAllocatedCells({});
    setLogs([
      {
        text: t("[ 0.000000] Linux booting kernel 6.11-rc...", "[ 0.000000] Linux 系統核心 6.11 正在啟動..."),
        color: "text-blue-400 font-semibold"
      }
    ]);

    // Step 1: Initialize Xe driver & allocate app buffers
    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        {
          text: t("[ 0.104212] drm/xe: Initializing Intel Xe graphics...", "[ 0.104212] drm/xe: 正在初始化 Intel Xe 顯示卡驅動程式..."),
          color: "text-slate-300"
        }
      ]);
      setAllocatedCells(prev => ({
        ...prev,
        2: { label: t("App Buffer", "應用程式緩衝區"), type: "app" },
        3: { label: t("App Buffer", "應用程式緩衝區"), type: "app" }
      }));
    }, 600);

    // Step 2: Mesa requests L3 page table allocation
    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        {
          text: t("[ 0.320110] Mesa: Requesting L3 Page Table VRAM...", "[ 0.320110] Mesa 驅動程式: 正在申請 L3 分頁表 (Page Table) 顯示記憶體..."),
          color: "text-amber-300 font-medium"
        }
      ]);

      if (mode === 'round_up') {
        // Buggy mode: Mesa L3 Page Table lands on the HAZARD index!
        setAllocatedCells(prev => ({
          ...prev,
          [HAZARD_INDEX]: { label: t("Mesa L3 Page Table", "Mesa L3 分頁表"), type: "table" }
        }));

        // Step 3: Hardware overwrite occurs
        setTimeout(() => {
          setLogs(prev => [
            ...prev,
            {
              text: t("[ 0.450000] Flat CCS Hardware Compression Engine active...", "[ 0.450000] Flat CCS 硬件壓縮引擎啟動運行..."),
              color: "text-purple-400"
            },
            {
              text: t("[ 0.512000] CRITICAL: Page Table entry corrupted at 0x3FAFFEC00!", "[ 0.512000] 嚴重錯誤: 0x3FAFFEC00 處的分頁表項目被硬件覆寫破壞!"),
              color: "text-red-400 font-bold"
            },
            {
              text: t("[ 0.520000] gdm.service: Display compositor batch-buffer fault!", "[ 0.520000] gdm.service: 顯示合成器批次緩衝區遭遇區段錯誤 (Segmentation Fault)!"),
              color: "text-red-400"
            }
          ]);

          setAllocatedCells(prev => ({
            ...prev,
            [HAZARD_INDEX]: { label: t("CORRUPTED!", "記憶體受損!"), type: "corrupted" }
          }));

          setBootState('crashed');
        }, 800);

      } else {
        // Fixed mode: Mesa L3 Page Table lands safely in VRAM
        setAllocatedCells(prev => ({
          ...prev,
          8: { label: t("Mesa L3 Page Table", "Mesa L3 分頁表"), type: "table_safe" }
        }));

        setTimeout(() => {
          setLogs(prev => [
            ...prev,
            {
              text: t("[ 0.450000] Flat CCS Hardware Compression Engine active...", "[ 0.450000] Flat CCS 硬件壓縮引擎啟動運行..."),
              color: "text-purple-400"
            },
            {
              text: t("[ 0.600000] gdm.service: GNOME Display Manager started.", "[ 0.600000] gdm.service: GNOME 桌面服務啟動成功。"),
              color: "text-emerald-400 font-semibold"
            }
          ]);

          setBootState('success');
        }, 800);
      }
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans antialiased flex flex-col">
      {}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <span>{t("Intel Xe Kernel Bug Visualizer", "Intel Xe 系統核心 (Kernel) Bug 視覺化分析工具")}</span>
                <span className="text-xs bg-slate-800 text-blue-400 border border-blue-500/30 font-mono px-2 py-0.5 rounded-full">
                  Commit #818beb
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {t("How a 1-line math error broke Linus Torvalds' Linux desktop", "一行數學計算錯誤如何致使 Linus Torvalds 的 Linux 桌面崩潰")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold transition-all ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold transition-all ${
                  lang === 'zh' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                繁體中文
              </button>
            </div>

            <span className="bg-purple-950/60 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>{t("Core CS Concepts", "電腦科學核心概念 (Core CS Concepts)")}</span>
            </span>
          </div>
        </div>
      </header>

      {}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Story Overview Banner */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t("Real-World Bug Analysis", "真實漏洞分析 (Real-World Bug Analysis)")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('The 24-Patch, 18-Reboot "Debug Session From Hell"', '24 個修復檔與 18 次重新開機的「地獄級除錯過程」')}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t(
                  "In August 2026, Linux creator Linus Torvalds experienced random black screen boot crashes on his personal PC powered by an Intel Battlemage graphics card. After 18 system reboots and 24 instrumented debug patches, he found that a single 2,048-byte slice of memory was being silently overwritten by the GPU hardware.",
                  "2026 年 8 月，Linux 創始人 Linus Torvalds 在搭載 Intel Battlemage 顯示卡的個人電腦上遭遇了隨機黑屏開機崩潰。經過 18 次系統重新開機和 24 個診斷修復檔 (Debug Patch) 的排查，他發現一塊僅有 2,048 位元組 (2 KiB) 的顯示記憶體 (VRAM) 被 GPU 硬件靜默覆寫 (Silent Overwrite)。"
                )}
              </p>
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 italic border-l-4 border-l-blue-500">
                "<span className="text-blue-400 font-bold">Linus Torvalds:</span>{" "}
                {t(
                  "This was a debug session from hell, enormously helped by an AI doing much of the grunt-work... This is basically a one-liner fixing a bogus round_up() to a round_down().",
                  "這是一場來自地獄的除錯過程，AI 協助處理了大量繁瑣的工作... 這本質上是一個單行修復，將錯誤的 round_up() 改為了 round_down()。"
                )}"
              </div>
            </div>

            {/* At a glance stats card */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                {t("At A Glance", "速覽概覽 (At A Glance)")}
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("Hardware Affected:", "受影響硬件 (Hardware):")}</span>
                  <span className="font-medium text-slate-200">{t("Intel Arc & Battlemage GPUs", "Intel Arc & Battlemage 獨立顯示卡")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("Component:", "核心元件 (Component):")}</span>
                  <span className="font-mono text-purple-400">{t("Flat CCS (Hardware Compression)", "Flat CCS 硬件壓縮引擎 (Flat CCS)")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("The Flaw:", "邏輯缺陷 (The Flaw):")}</span>
                  <span className="font-mono text-amber-400">round_up() vs round_down()</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("Corrupted Memory:", "受損記憶體 (Corrupted):")}</span>
                  <span className="font-medium text-red-400">{t("Just 2 KiB out of 16 GiB!", "16 GiB 顯示記憶體中僅 2 KiB！")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">1</span>
            <div>
              <h3 className="text-xl font-bold text-white">{t("Understand the Problem: The Fence Analogy", "理解問題：圍欄比喻 (The Fence Analogy)")}</h3>
              <p className="text-xs text-slate-400">{t("How a misplaced boundary ruins everything", "錯位的邊界如何導致全面崩潰")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buggy Analogy */}
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded border border-red-500/30">
                  BUGGY: round_up()
                </span>
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <h4 className="font-bold text-slate-100 mb-2">{t("Building the Fence INSIDE the Lawn Mower's Yard", "將圍欄建到了割草機器人的領地內")}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {t(
                  "Imagine your house is next to an automated lawn mower yard. The fence boundary was rounded UP into the mower's area. You put your valuable patio furniture on what you think is your lawn, but the robot mower drives over and shreds it!",
                  "假設你的房子緊挨著自動割草機器人的停放區。圍欄邊界被向上取整 (round_up) 劃入了機器人的工作區。你把你珍貴的庭院家具放在了你以為是自家草坪的地方，結果割草機器人開過來直接碾碎了它！"
                )}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-red-300 border border-slate-800">
                {t("Result: GPU Hardware silently overwrites Linux system memory.", "後果: GPU 硬件直接靜默覆寫 Linux 系統記憶體 (System Memory)。")}
              </div>
            </div>

            {/* Fixed Analogy */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                  FIXED: round_down()
                </span>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="font-bold text-slate-100 mb-2">{t("Safe Boundary: Sacrificing a Tiny Sliver", "安全邊界：犧牲極小的一條緩衝區")}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {t(
                  "By rounding DOWN, you move the fence back slightly into your own yard. You leave a tiny unused strip of land untouched, ensuring your patio furniture is 100% safe from the robot lawn mower.",
                  "通過向下取整 (round_down)，你將圍欄稍微向自家院子後退了一點點。雖然留下一小塊未使用的土地，但確保了庭院家具 100% 不會被割草機器人毀壞。"
                )}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800">
                {t("Result: System memory is guaranteed to be outside hardware write zones.", "結果: 保證系統記憶體永遠處於硬件寫入區之外。")}
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">2</span>
              <div>
                <h3 className="text-xl font-bold text-white">{t("Interactive VRAM Boundary Mapper", "互動式顯示記憶體 (VRAM) 邊界對映器")}</h3>
                <p className="text-xs text-slate-400">
                  {t("Toggle between round_up() and round_down() to see where memory is placed.", "在 round_up() 和 round_down() 之間切換，觀察記憶體邊界劃分。")}
                </p>
              </div>
            </div>

            {/* Mode Toggle Buttons */}
            <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
              <button
                onClick={() => setMode('round_up')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-2 ${
                  mode === 'round_up'
                    ? 'bg-red-600/20 text-red-300 border border-red-500/40 shadow-lg shadow-red-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bug className="w-3.5 h-3.5" /> round_up() [{t("Buggy", "缺陷模式")}]
              </button>
              <button
                onClick={() => setMode('round_down')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-2 ${
                  mode === 'round_down'
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> round_down() [{t("Fixed", "修復模式")}]
              </button>
            </div>
          </div>

          {/* Dynamic Memory Bar Visualizer */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs font-mono text-slate-400 gap-1">
              <span>{t("Usable VRAM Start (0x0000)", "可用顯示記憶體起點 (0x0000)")}</span>
              <span className={mode === 'round_up' ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {mode === 'round_up'
                  ? t("Usable Boundary Offset: 0x3FB000000 (Rounded UP)", "可用顯示記憶體邊界偏移量: 0x3FB000000 (向上取整 round_up)")
                  : t("Usable Boundary Offset: 0x3FAFE0000 (Rounded DOWN)", "可用顯示記憶體邊界偏移量: 0x3FAFE0000 (向下取整 round_down)")}
              </span>
              <span>{t("Flat CCS Hardware End (16 GiB)", "CCS 硬件空間終點 (16 GiB)")}</span>
            </div>

            {/* Visual Bar Representation */}
            <div className="h-16 w-full bg-slate-950 rounded-xl border border-slate-800 p-1.5 flex gap-1 relative overflow-hidden">
              <div
                className="h-full bg-sky-600/30 border border-sky-500/40 rounded-lg transition-all duration-500 flex items-center justify-center relative"
                style={{ width: mode === 'round_up' ? '72%' : '68%' }}
              >
                <span className="text-xs font-mono font-bold text-sky-200 truncate px-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> {t("Usable VRAM Pool", "可用顯示記憶體池 (Usable VRAM)")}
                </span>
              </div>

              {mode === 'round_up' && (
                <div
                  className="h-full bg-red-600/80 border border-red-400 rounded-lg transition-all duration-500 flex items-center justify-center animate-pulse"
                  style={{ width: '6%' }}
                >
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-tighter truncate px-1">
                    ⚠️ {t("CORRUPTION ZONE (2 KiB)", "記憶體受損重疊區 (2 KiB)")}
                  </span>
                </div>
              )}

              <div className="h-full bg-purple-900/40 border border-purple-500/40 rounded-lg transition-all duration-500 flex-1 flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-purple-300 truncate px-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> {t("Flat CCS Storage (Hardware Only)", "Flat CCS 硬件儲存區 (Flat CCS)")}
                </span>
              </div>
            </div>

            {/* Math Explanation Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
              {mode === 'round_up' ? (
                <>
                  <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {t(
                      "BUGGY CALCULATION: round_up(0x3FAFFEC00, 128 KiB) = 0x3FB000000",
                      "錯誤計算 (Buggy Calculation): round_up(0x3FAFFEC00, 128 KiB) = 0x3FB000000"
                    )}
                  </div>
                  <div className="text-slate-300">
                    {t(
                      "The raw Flat CCS start is 0x3FAFFEC00 (unaligned). Rounding UP pushes usable VRAM boundary up to 0x3FB000000.",
                      "原始 Flat CCS 起始位址為 0x3FAFFEC00（未對齊）。向上取整 (Rounding UP) 將可用顯示記憶體 (VRAM) 邊界推高至 0x3FB000000。"
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] border-t border-slate-800 pt-1.5 mt-1">
                    👉 <strong className="text-red-400">{t("The Flaw:", "缺陷所在 (The Flaw):")}</strong>{" "}
                    {t(
                      "The last 2 KiB slice is claimed as 'Usable VRAM', but it actually belongs to the GPU Flat CCS Compression Engine!",
                      "最後的 2 KiB 切片被誤標記為「可用顯示記憶體 (Usable VRAM)」，但它實際上屬於 GPU 的 Flat CCS 硬件壓縮引擎 (Flat CCS Engine)！"
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    {t(
                      "FIXED CALCULATION: round_down(0x3FAFFEC00, 128 KiB) = 0x3FAFE0000",
                      "正確計算 (Fixed Calculation): round_down(0x3FAFFEC00, 128 KiB) = 0x3FAFE0000"
                    )}
                  </div>
                  <div className="text-slate-300">
                    {t(
                      "Rounding DOWN pulls usable VRAM boundary back to 0x3FAFE0000.",
                      "向下取整 (Rounding DOWN) 將可用顯示記憶體 (VRAM) 邊界安全拉回至 0x3FAFE0000。"
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] border-t border-slate-800 pt-1.5 mt-1">
                    👉 <strong className="text-emerald-400">{t("The Fix:", "修復機制 (The Fix):")}</strong>{" "}
                    {t(
                      "Sacrifices a tiny strip of memory to ensure system allocations NEVER overlap with Flat CCS hardware storage.",
                      "犧牲極小的一條顯示記憶體空間，確保系統配置器 (Allocator) 絕不會與 Flat CCS 硬件儲存 (Flat CCS Storage) 產生重疊。"
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">3</span>
              <div>
                <h3 className="text-xl font-bold text-white">{t("Cold Boot Simulation", "冷開機 (Cold Boot) 過程模擬")}</h3>
                <p className="text-xs text-slate-400">
                  {t("See what happens when Mesa allocates GPU page tables on system boot.", "觀察系統開機時 Mesa 驅動程式申請 GPU 分頁表 (Page Table) 記憶體的真實過程。")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runBootSimulation}
                disabled={bootState === 'booting'}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Power className="w-4 h-4" />
                <span>{bootState === 'booting' ? t("Booting...", "開機中...") : t("Simulate Cold Boot", "模擬冷開機 (Cold Boot)")}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Memory Grid Visualization */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono flex-wrap gap-2">
                <span>{t("VRAM Memory Pages", "顯示記憶體分頁 (VRAM Pages)")}</span>
                <span className="flex items-center gap-3 text-[11px] flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700" />
                    <span>{t("Free", "空閒 (Free)")}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Mesa L3 {t("Page Table", "分頁表 (Page Table)")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Flat CCS {t("Engine", "硬件引擎 (Engine)")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> {t("Corrupted", "記憶體受損 (Corrupted)")}
                  </span>
                </span>
              </div>

              {/* 16 Memory Cells Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
                {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
                  const alloc = allocatedCells[i];
                  let cellClass = "h-14 rounded-lg border border-slate-800 bg-slate-900/80 flex flex-col items-center justify-center p-1 font-mono text-[10px] transition-all";
                  let cellText = t(`Page ${i}`, `記憶體分頁 ${i}`);
                  let subText = t("RAM", "系統記憶體");

                  if (i >= 12) {
                    cellClass = "h-14 rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-300 flex flex-col items-center justify-center p-1 font-mono text-[10px]";
                    cellText = t("CCS HW", "CCS 硬件區");
                    subText = t("Hardware", "硬件實體區");
                  } else if (i === HAZARD_INDEX && mode === 'round_up' && !alloc) {
                    cellClass = "h-14 rounded-lg border border-amber-500/50 bg-amber-950/20 text-amber-300 flex flex-col items-center justify-center p-1 font-mono text-[10px]";
                    cellText = t("Overlap", "重疊隱患區");
                    subText = t("Hazard", "隱患區");
                  }

                  if (alloc) {
                    if (alloc.type === 'app') {
                      cellClass = "h-14 rounded-lg border border-sky-500/40 bg-sky-900/40 text-sky-200 flex flex-col items-center justify-center p-1 font-mono text-[10px]";
                      cellText = alloc.label;
                    } else if (alloc.type === 'table' || alloc.type === 'table_safe') {
                      cellClass = "h-14 rounded-lg border border-sky-400 bg-sky-500 text-slate-950 font-bold flex flex-col items-center justify-center p-1 font-mono text-[10px]";
                      cellText = alloc.label;
                    } else if (alloc.type === 'corrupted') {
                      cellClass = "h-14 rounded-lg border-2 border-red-500 bg-red-600 text-white font-bold flex flex-col items-center justify-center p-1 font-mono text-[10px] animate-pulse shadow-lg shadow-red-500/40";
                      cellText = alloc.label;
                      subText = t("HW Overwrite", "硬件覆寫");
                    }
                  }

                  return (
                    <div key={i} className={cellClass}>
                      <span className="font-bold truncate max-w-full px-1">{cellText}</span>
                      <span className="text-[8px] opacity-70">{subText}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Virtual Screen Output */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>{t("Display Output", "顯示器輸出 (Display)")}</span>
                  {bootState === 'crashed' && (
                    <span className="text-red-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      {t("SYSTEM CRASH", "系統崩潰 (CRASH)")}
                    </span>
                  )}
                  {bootState === 'success' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {t("ONLINE", "連線中 (ONLINE)")}
                    </span>
                  )}
                  {bootState === 'idle' && (
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      {t("Idle", "就緒 (Idle)")}
                    </span>
                  )}
                  {bootState === 'booting' && (
                    <span className="text-blue-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      {t("Booting...", "開機中...")}
                    </span>
                  )}
                </div>

                <div
                  className={`h-36 rounded-lg border flex flex-col items-center justify-center p-4 text-center transition-all duration-500 ${
                    bootState === 'crashed'
                      ? 'bg-red-950/80 border-red-500 text-red-200 shadow-lg shadow-red-500/20'
                      : bootState === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {bootState === 'crashed' ? (
                    <>
                      <AlertTriangle className="w-8 h-8 text-red-400 mb-2 animate-bounce" />
                      <div className="text-xs font-mono font-bold">{t("BLACK SCREEN / GDM CRASH", "黑屏 / GDM 桌面管理器崩潰")}</div>
                      <div className="text-[10px] text-red-300 mt-1">{t("GNOME Display Manager stuck in restart loop", "GNOME 桌面管理器陷入無限重新開機迴圈")}</div>
                    </>
                  ) : bootState === 'success' ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                      <div className="text-xs font-mono font-bold">{t("Boot Successful!", "開機成功！")}</div>
                      <div className="text-[10px] text-emerald-300 mt-1">{t("Desktop rendered cleanly with round_down()", "桌面使用 round_down() 正常繪製")}</div>
                    </>
                  ) : (
                    <>
                      <Monitor className="w-8 h-8 text-blue-400 mb-2" />
                      <div className="text-xs font-mono font-bold">{t("Ready to Boot", "等待冷開機模擬")}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{t("Click 'Simulate Cold Boot' above", "點擊上方「模擬冷開機」按鈕")}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Live Kernel Logs */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-bold flex items-center justify-between">
                  <span>{t("Kernel Log Output", "核心日誌輸出 (Kernel Log)")}</span>
                  <Terminal className="w-3 h-3 text-slate-500" />
                </div>
                <div
                  ref={logContainerRef}
                  className="h-24 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 font-mono text-[11px] overflow-y-auto space-y-1"
                >
                  {logs.map((log, index) => (
                    <div key={index} className={log.color}>
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">4</span>
            <div>
              <h3 className="text-xl font-bold text-white">{t("The Patch: 1 Line Changed", "核心修復檔 (Patch)：僅修改了 1 行程式碼")}</h3>
              <p className="text-xs text-slate-400">
                File: <code className="text-slate-300 font-mono">drivers/gpu/drm/xe/xe_res_cursor.h</code>
              </p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs sm:text-sm">
            <div className="bg-slate-900/80 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex justify-between items-center">
              <span>@@ -128,7 +128,7 @@ u64 get_flat_ccs_offset(...) @@</span>
              <span className="text-slate-500">C Language</span>
            </div>
            <div className="p-4 space-y-1 overflow-x-auto">
              <div className="text-slate-500 select-none">  /* Calculate top boundary of usable VRAM */</div>
              <div className="text-slate-400">  ccs_size = xe_device_ccs_size(xe);</div>
              <div className="bg-red-950/50 text-red-300 border-l-2 border-red-500 px-2 py-1 my-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold select-none">-</span>
                  <span>ccs_offset = round_up(vram_size - ccs_size, SZ_128K);</span>
                </div>
                <span className="text-[10px] bg-red-900/80 text-red-200 px-1.5 py-0.5 rounded shrink-0">
                  {t("BUGGY (Exposes CCS memory)", "存在漏洞 (暴露 CCS 硬件顯示記憶體)")}
                </span>
              </div>
              <div className="bg-emerald-950/50 text-emerald-300 border-l-2 border-emerald-500 px-2 py-1 my-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold select-none">+</span>
                  <span>ccs_offset = round_down(vram_size - ccs_size, SZ_128K);</span>
                </div>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                  {t("FIXED (Conservative safety)", "修復成功 (保守安全邊界)")}
                </span>
              </div>
              <div className="text-slate-400">  return ccs_offset;</div>
            </div>
          </div>
        </section>

        {}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">5</span>
            <div>
              <h3 className="text-xl font-bold text-white">{t("How Linus Tracked Down the Bug", "Linus 如何追蹤並定位 Bug")}</h3>
              <p className="text-xs text-slate-400">
                {t("18 reboots, 24 debug patches, and human-AI collaboration", "18 次系統重新開機、24 個診斷修復檔與人類-AI 協同排查")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-amber-400 font-bold font-mono flex items-center gap-2">
                <Ghost className="w-4 h-4" />
                <span>{t("1. Phantom Crashes", "1. 幽靈崩潰 (Phantom Crashes)")}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t(
                  "Linus experienced random black screens on cold boot on his main PC. Because hardware wrote directly to RAM without triggering MMU faults, standard kernel logs showed no crash stack traces.",
                  "Linus 在個人 PC 上遇到冷開機隨機黑屏。因為 GPU 硬件是直接寫入實體記憶體，並沒有觸發記憶體管理單元 (MMU) 報錯，因此常規系統核心日誌中没有任何崩潰堆疊 (Stack Trace)。"
                )}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-blue-400 font-bold font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>{t("2. 24 Debug Patches", "2. 24 個診斷修復檔 (24 Debug Patches)")}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t(
                  "To pinpoint where memory was being modified, Linus authored 24 instrumented diagnostic patches and rebooted his PC 18 times, step-by-step narrowing down the memory region.",
                  "為了精準定位哪塊記憶體被篡改，Linus 親自編寫了 24 個帶有印出工具的診斷修復檔，並重新開機 18 次，一步步縮小被破壞記憶體區域的範圍。"
                )}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-purple-400 font-bold font-mono flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>{t("3. Human + AI Pair", "3. 人類與 AI 結對除錯 (Human + AI)")}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t(
                  "Linus used an AI model to assist with log parsing and patch generation. Even when the AI stated the problem was 'impossible and unsolvable' and urged giving up, Linus pushed forward.",
                  "Linus 使用 AI 模型協助解析日誌和產生修復程式碼。即便 AI 多次認為該問題「不可能且無解」並勸說放棄，Linus 依然堅持推進排查。"
                )}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-emerald-400 font-bold font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("4. The 1-Line Fix", "4. 最終單行修復 (1-Line Fix)")}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t(
                  "Once the 2,048-byte overwrite on page 0x3fafff000 was isolated, Linus changed round_up() to round_down() and let the AI write the official commit text.",
                  "當確定是記憶體分頁 0x3fafff000 上 2,048 位元組的覆寫問題後，Linus 將 round_up() 改為 round_down()，並讓 AI 撰寫了最終提交訊息 (Commit Message)。"
                )}
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{t("Core Computing Takeaways", "核心電腦科學概念總結 (Core Takeaways)")}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-blue-400 font-bold text-sm flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span>{t("1. Memory Alignment", "1. 記憶體對齊 (Memory Alignment)")}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  "Hardware components work in fixed block sizes (like 128 KiB chunks). When software boundaries don't align perfectly with hardware limits, rounding errors can create dangerous 'overlap zones'.",
                  "硬件元件按固定區塊大小 (如 128 KiB 區塊) 執行。當軟體指定的邊界與硬件實體限制未精確對齊時，取整誤差 (Rounding Error) 會產生危險的「重疊區 (Overlap Zone)」。"
                )}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-purple-400 font-bold text-sm flex items-center gap-2">
                <Ghost className="w-4 h-4" />
                <span>{t("2. 'Silent' Hardware Overwrites", "2. 硬件靜默覆寫 (Silent Hardware Overwrite)")}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  "Unlike software, GPU hardware units like Flat CCS write directly to memory without asking operating system permission or throwing error popups. Memory corruption can be totally invisible until critical data lands there.",
                  "與常規軟體不同，GPU 硬件單元 (如 Flat CCS) 直接對實體顯示記憶體進行讀寫，無需向作業系統申請許可，也不會拋出錯誤快顯視窗。直到關鍵資料 (如分頁表) 恰好落入該區域時系統才會崩潰。"
                )}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                <span>{t("3. Intermittent Bugs", "3. 偶發性 Bug (Intermittent Bugs)")}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  "This bug existed for almost 2 years without breaking every computer because it required page tables to land on an exact 2 KiB slice. Timing changes in user applications finally exposed the flaw!",
                  "該 Bug 在系統核心中潛伏了將近 2 年，因為只有當關鍵資料正好落入那 2 KiB 的實體顯示記憶體碎片時才會發作。最近使用者態程式的時序變化才讓這個隱患被徹底暴露！"
                )}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
          <p>
            {t(
              "Educational interactive demo explaining Linux Kernel Patch Commit",
              "用於解析 Linux 系統核心提交 (Kernel Commit)"
            )}{" "}
            <code className="text-slate-400 font-mono">818bebeb63dd6bf5f4e07e145f6cdbace520a34c</code>.
          </p>
        </div>
      </footer>
    </div>
  );
}
