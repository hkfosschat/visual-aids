export const meta = {
  title: 'Linux - flatpak proposed appd (systemd-appd)',
  description: 'How to appd help with flatpak',
  tags: ['linux', 'desktop', 'flatpak', 'systemd', 'appd'],
};

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Layers, 
  Terminal, 
  Lock, 
  ArrowRight, 
  ArrowLeftRight,
  Box,
  Server,
  Key,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Volume2,
  RefreshCw,
  Play,
  Pause,
  Globe
} from 'lucide-react';

const translations = {
  en: {
    title: "Flatpak Architecture Explorer: D-Bus & Audio",
    subtitle: "Comparing current proxy overhead vs. proposed systemd-appd integration (including round-trip traces).",
    tabCurrent: "1. Current State (Proxy Overhead)",
    tabAppd: "2. Proposed State (With systemd-appd)",
    protocolLabel: "Protocol:",
    dbusProto: "🔌 D-Bus Interception",
    audioProto: "🔊 PulseAudio / PipeWire",
    activeStep: "Active Trace Step",
    outbound: "➡️ Outbound Request",
    returnTrip: "⬅️ Return Trip",
    pause: "Pause",
    autoplay: "Autoplay",
    nextStep: "Next Trace Step",
    sandbox: "Sandbox",
    container: "Container",
    sandboxedApp: "Sandboxed App",
    sandboxedAppDescDbus: "Emits D-Bus messages assuming direct access to session bus.",
    sandboxedAppDescAudio: "Requests audio streams via local socket connection.",
    pidIsolated: "PID / Namespace Isolated",
    intermediary: "Intermediary",
    overhead: "Overhead",
    proxyTitleDbus: "xdg-dbus-proxy",
    proxyTitleAudio: "Socket / Audio Intermediary",
    proxyDescDbus: "Every single app spawns its own background proxy process to parse whitelists and filter messages.",
    proxyDescAudio: "Relies on coarse socket sharing or workarounds because identities are difficult to verify.",
    requiredPerAppProxy: "Required per-app proxy",
    hostOS: "Host OS",
    sessionStack: "Session Stack",
    hostServiceDbus: "Host Session D-Bus",
    hostServiceAudio: "PulseAudio / PipeWire",
    hostDescDbus: "Receives filtered messages from proxy daemons.",
    hostDescAudio: "Manages hardware audio streams for the desktop.",
    privilegedHostLayer: "Privileged Host Layer",
    registered: "Registered",
    sandboxedAppTitle: "Sandboxed Application",
    sandboxedAppAppdDesc: "App makes direct requests without any custom proxy daemons in between.",
    directPath: "✨ Direct Communication Path",
    hostServicesRow: "Host OS Services",
    row1: "Row 1",
    hostServiceAppdDbus: "System D-Bus Service",
    hostServiceAppdAudio: "PulseAudio / PipeWire Server",
    hostServiceAppdDesc: "Receives the client request directly and instantly inspects the process cgroup.",
    centralRegistry: "Central Registry",
    row2: "Row 2",
    appdTitle: "systemd-appd Subsystem",
    appdDesc: "Acts as the unified, trusted source of truth. System services query appd instantly to check app identity and live permissions.",
    whyCurrentComplex: "Why Current Proxy Overhead is Complex",
    howAppdStreamlines: "How systemd-appd Streamlines Architecture",
    currentExplanationDbus: "Because the host session bus cannot natively verify container identities, Flatpak is forced to inject separate background proxy processes (xdg-dbus-proxy) for every single sandboxed app. This introduces memory overhead, process clutter, and duplicated filtering code for both outbound calls and return trips.",
    currentExplanationAudio: "Without centralized app tracking, audio servers struggle to verify who is calling, leading to coarse permissions rather than clean separation between microphones and speakers.",
    appdExplanationDbus: "With systemd-appd anchoring application identity to systemd cgroups, apps can talk directly to host services. System services simply query appd to verify permissions, completely eliminating the need for intermediate proxy daemons on both requests and return trips.",
    appdExplanationAudio: "System services can cleanly query app entitlements from appd in real-time, enabling precise audio permissions without messy socket workarounds.",
    // Dynamic Step Titles & Descs - Current D-Bus
    curDbus1Title: "1. App Sends D-Bus Message (Outbound)",
    curDbus1Desc: "The sandboxed app emits a message on its private local socket, assuming direct access.",
    curDbus2Title: "2. Intercepted by xdg-dbus-proxy",
    curDbus2Desc: "A dedicated background proxy instance catches the raw message outside the container.",
    curDbus3Title: "3. Manifest Filtering Check",
    curDbus3Desc: "The proxy parses the message against whitelist rules defined in the app manifest.",
    curDbus4Title: "4. Forwarded to Host D-Bus",
    curDbus4Desc: "The clean message reaches the Host Session D-Bus and is processed by the target service.",
    curDbus5Title: "5. Response / Result Return Trip",
    curDbus5Desc: "The response travels back through Host Session D-Bus, through xdg-dbus-proxy, back to the sandboxed app.",
    // Dynamic Step Titles & Descs - Current Audio
    curAudio1Title: "1. App Requests Audio Stream (Outbound)",
    curAudio1Desc: "The app attempts to open a recording or playback stream via the audio socket.",
    curAudio2Title: "2. Socket Intermediary & Mapping",
    curAudio2Desc: "Without native app identity, audio servers rely on socket-level mapping or portal prompts.",
    curAudio3Title: "3. Blanket Permission Check",
    curAudio3Desc: "Audio daemon applies coarse permission checks since individual process lineage is obscured.",
    curAudio4Title: "4. Host Audio Stream Opened",
    curAudio4Desc: "PipeWire/PulseAudio establishes the connection on the host hardware stack.",
    curAudio5Title: "5. Stream Data / Confirmation Return Trip",
    curAudio5Desc: "Audio buffers and stream status flow back through Host services, through the intermediary, to the app.",
    // Dynamic Step Titles & Descs - appd D-Bus
    appdDbus1Title: "1. App Direct D-Bus Call (Outbound)",
    appdDbus1Desc: "App sends request directly to the system service without any intermediate proxy daemons.",
    appdDbus2Title: "2. System Service Reads Cgroup",
    appdDbus2Desc: "The system service receives the request and inspects the client's cgroup attributes.",
    appdDbus3Title: "3. Instant Query to systemd-appd",
    appdDbus3Desc: "The service queries systemd-appd to instantly verify the app's real identity and permissions.",
    appdDbus4Title: "4. Secure Authorization Confirmed",
    appdDbus4Desc: "Permission validated instantly at the kernel/system layer with zero proxy overhead.",
    appdDbus5Title: "5. Direct Response Trip Back",
    appdDbus5Desc: "The response travels from System Service directly back to the sandboxed app with high performance.",
    // Dynamic Step Titles & Descs - appd Audio
    appdAudio1Title: "1. App Direct Audio Request (Outbound)",
    appdAudio1Desc: "App calls the audio service directly over the socket.",
    appdAudio2Title: "2. System Service Cgroup Check",
    appdAudio2Desc: "Audio server checks process cgroup metadata immediately.",
    appdAudio3Title: "3. Query systemd-appd for Entitlements",
    appdAudio3Desc: "Audio server asks systemd-appd if this specific app is entitled to mic vs speaker access.",
    appdAudio4Title: "4. Fine-Grained Audio Granted",
    appdAudio4Desc: "Precise permissions verified cleanly via systemd registry.",
    appdAudio5Title: "5. Audio Stream / Response Trip Back",
    appdAudio5Desc: "Audio stream packets and success status return from System Service directly to the app."
  },
  zh: {
    title: "Flatpak 架構探索器：D-Bus 與音訊",
    subtitle: "比較目前的 Proxy 額外負擔與提議的 systemd-appd 整合（包含來回往返軌跡）。",
    tabCurrent: "1. 目前狀態（Proxy 負擔）",
    tabAppd: "2. 提議狀態（結合 systemd-appd）",
    protocolLabel: "通訊協定：",
    dbusProto: "🔌 D-Bus 攔截",
    audioProto: "🔊 PulseAudio / PipeWire",
    activeStep: "當前軌跡步驟",
    outbound: "➡️ 出站請求 (Outbound)",
    returnTrip: "⬅️ 返程往返 (Return Trip)",
    pause: "暫停",
    autoplay: "自動播放",
    nextStep: "下一步軌跡",
    sandbox: "沙盒",
    container: "容器",
    sandboxedApp: "沙盒化應用程式",
    sandboxedAppDescDbus: "發送 D-Bus 訊息，假設擁有對 Session Bus 的直接存取權。",
    sandboxedAppDescAudio: "透過本地 Socket 連線請求音訊串流。",
    pidIsolated: "PID / 命名空間隔離",
    intermediary: "中介層",
    overhead: "額外開銷",
    proxyTitleDbus: "xdg-dbus-proxy",
    proxyTitleAudio: "Socket / 音訊中介層",
    proxyDescDbus: "每個應用程式都會產生獨立的背景 Proxy 程序，用來解析白名單並過濾訊息。",
    proxyDescAudio: "由於難以驗證身分，依賴粗粒度的 Socket 共享或變通方案。",
    requiredPerAppProxy: "每個 App 均需獨立 Proxy",
    hostOS: "主機作業系統",
    sessionStack: "Session 堆疊",
    hostServiceDbus: "Host Session D-Bus",
    hostServiceAudio: "PulseAudio / PipeWire",
    hostDescDbus: "接收來自 Proxy Daemon 過濾後的訊息。",
    hostDescAudio: "管理桌面環境的硬體音訊串流。",
    privilegedHostLayer: "特權主機層",
    registered: "已註冊",
    sandboxedAppTitle: "沙盒化應用程式",
    sandboxedAppAppdDesc: "應用程式直接發送請求，無需中間任何自訂 Proxy Daemon。",
    directPath: "✨ 直接通訊路徑",
    hostServicesRow: "主機系統服務",
    row1: "第 1 列",
    hostServiceAppdDbus: "System D-Bus 服務",
    hostServiceAppdAudio: "PulseAudio / PipeWire 伺服器",
    hostServiceAppdDesc: "直接接收用戶端請求，並即時檢查程序的 cgroup 屬性。",
    centralRegistry: "中央註冊表",
    row2: "第 2 列",
    appdTitle: "systemd-appd 子系統",
    appdDesc: "作為統一、可信的單一真實來源。系統服務可即時查詢 appd 以確認 App 身分與即時權限。",
    whyCurrentComplex: "為何目前的 Proxy 額外開銷相當複雜",
    howAppdStreamlines: "systemd-appd 如何精簡架構",
    currentExplanationDbus: "由於 Host Session Bus 原生無法驗證容器身分，Flatpak 被迫為每個沙盒化 App 注入獨立的背景 Proxy 程序 (xdg-dbus-proxy)。這會在出站呼叫與返程往返中帶來記憶體開銷、程序雜亂及重複過濾程式碼的問題。",
    currentExplanationAudio: "在缺乏中央 App 追蹤的情況下，音訊伺服器難以確認呼叫者身分，導致只能採用粗粒度權限，無法做到麥克風與揚聲器的乾淨分離。",
    appdExplanationDbus: "透過 systemd-appd 將應用程式身分定錨於 systemd cgroup，App 可以直接與主機服務溝通。系統服務只需查詢 appd 來驗證權限，完全消除了出站與返程對中間 Proxy Daemon 的需求。",
    appdExplanationAudio: "系統服務可即時向 appd 乾淨地查詢 App 授權，無需複雜的 Socket 變通方案即可實現精細的音訊權限管理。",
    // Dynamic Step Titles & Descs - Current D-Bus
    curDbus1Title: "1. App 發送 D-Bus 訊息（出站）",
    curDbus1Desc: "沙盒化 App 在其私有本地 Socket 發送訊息，假設擁有直接存取權。",
    curDbus2Title: "2. 被 xdg-dbus-proxy 攔截",
    curDbus2Desc: "專屬的背景 Proxy 實例在容器外部擷取原始訊息。",
    curDbus3Title: "3. Manifest 過濾檢查",
    curDbus3Desc: "Proxy 根據 App Manifest 中定義的白名單規則解析並過濾訊息。",
    curDbus4Title: "4. 轉發至 Host D-Bus",
    curDbus4Desc: "通過過濾的訊息抵達 Host Session D-Bus，並由目標服務處理。",
    curDbus5Title: "5. 回應 / 結果返程往返",
    curDbus5Desc: "回應從 Host Session D-Bus 經由 xdg-dbus-proxy Daemon，一路返回至沙盒化 App。",
    // Dynamic Step Titles & Descs - Current Audio
    curAudio1Title: "1. App 請求音訊串流（出站）",
    curAudio1Desc: "App 嘗試透過音訊 Socket 建立錄音或播放串流。",
    curAudio2Title: "2. Socket 中介與映射",
    curAudio2Desc: "在缺乏原生 App 身分的情況下，音訊伺服器依賴 Socket 層級映射或 Portal 提示。",
    curAudio3Title: "3. 粗粒度權限檢查",
    curAudio3Desc: "由於個別程序的血統關係被遮蔽，音訊 Daemon 僅能套用粗粒度的權限檢查。",
    curAudio4Title: "4. 建立主機音訊串流",
    curAudio4Desc: "PipeWire/PulseAudio 在主機硬體堆疊上建立連線。",
    curAudio5Title: "5. 串流資料 / 確認返程往返",
    curAudio5Desc: "音訊緩衝區與串流狀態經由主機服務與中介層，順暢返回至 App。",
    // Dynamic Step Titles & Descs - appd D-Bus
    appdDbus1Title: "1. App 直接 D-Bus 呼叫（出站）",
    appdDbus1Desc: "App 直接向系統服務發送請求，無需中間任何 Proxy Daemon。",
    appdDbus2Title: "2. 系統服務讀取 Cgroup",
    appdDbus2Desc: "系統服務接收請求並檢查用戶端的 cgroup 屬性。",
    appdDbus3Title: "3. 即時查詢 systemd-appd",
    appdDbus3Desc: "服務查詢 systemd-appd 以即時驗證 App 的真實身分與權限。",
    appdDbus4Title: "4. 安全授權確認",
    appdDbus4Desc: "權限直接在 Kernel/System 層級完成驗證，完全零 Proxy 額外開銷。",
    appdDbus5Title: "5. 直接回應返程",
    appdDbus5Desc: "回應直接從系統服務高效返回至沙盒化 App。",
    // Dynamic Step Titles & Descs - appd Audio
    appdAudio1Title: "1. App 直接音訊請求（出站）",
    appdAudio1Desc: "App 透過 Socket 直接呼叫音訊服務。",
    appdAudio2Title: "2. 系統服務 Cgroup 檢查",
    appdAudio2Desc: "音訊伺服器立即檢查程序的 cgroup 元資料。",
    appdAudio3Title: "3. 向 systemd-appd 查詢授權",
    appdAudio3Desc: "音訊伺服器詢問 systemd-appd 該特定 App 是否具備麥克風與揚聲器存取權。",
    appdAudio4Title: "4. 授予精細音訊權限",
    appdAudio4Desc: "透過 systemd 註冊表乾淨利落地完成精細權限驗證。",
    appdAudio5Title: "5. 音訊串流 / 回應返程",
    appdAudio5Desc: "音訊封包與成功狀態直接從系統服務返回至 App。"
  }
};

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'zh'
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'appd'
  const [protocol, setProtocol] = useState('dbus'); // 'dbus' or 'audio'
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const t = translations[lang];

  // Helper to toggle language
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const currentSteps = protocol === 'dbus' ? [
    { 
      title: t.curDbus1Title, 
      desc: t.curDbus1Desc, 
      activeCol: 'app',
      direction: 'out' 
    },
    { 
      title: t.curDbus2Title, 
      desc: t.curDbus2Desc, 
      activeCol: 'proxy',
      direction: 'out' 
    },
    { 
      title: t.curDbus3Title, 
      desc: t.curDbus3Desc, 
      activeCol: 'proxy',
      direction: 'out' 
    },
    { 
      title: t.curDbus4Title, 
      desc: t.curDbus4Desc, 
      activeCol: 'host',
      direction: 'out' 
    },
    { 
      title: t.curDbus5Title, 
      desc: t.curDbus5Desc, 
      activeCol: 'host-proxy-app',
      direction: 'back' 
    }
  ] : [
    { 
      title: t.curAudio1Title, 
      desc: t.curAudio1Desc, 
      activeCol: 'app',
      direction: 'out' 
    },
    { 
      title: t.curAudio2Title, 
      desc: t.curAudio2Desc, 
      activeCol: 'proxy',
      direction: 'out' 
    },
    { 
      title: t.curAudio3Title, 
      desc: t.curAudio3Desc, 
      activeCol: 'proxy',
      direction: 'out' 
    },
    { 
      title: t.curAudio4Title, 
      desc: t.curAudio4Desc, 
      activeCol: 'host',
      direction: 'out' 
    },
    { 
      title: t.curAudio5Title, 
      desc: t.curAudio5Desc, 
      activeCol: 'host-proxy-app',
      direction: 'back' 
    }
  ];

  const appdSteps = protocol === 'dbus' ? [
    { 
      title: t.appdDbus1Title, 
      desc: t.appdDbus1Desc, 
      activeCol: 'app',
      direction: 'out' 
    },
    { 
      title: t.appdDbus2Title, 
      desc: t.appdDbus2Desc, 
      activeCol: 'service',
      direction: 'out' 
    },
    { 
      title: t.appdDbus3Title, 
      desc: t.appdDbus3Desc, 
      activeCol: 'appd',
      direction: 'out' 
    },
    { 
      title: t.appdDbus4Title, 
      desc: t.appdDbus4Desc, 
      activeCol: 'service',
      direction: 'out' 
    },
    { 
      title: t.appdDbus5Title, 
      desc: t.appdDbus5Desc, 
      activeCol: 'return',
      direction: 'back' 
    }
  ] : [
    { 
      title: t.appdAudio1Title, 
      desc: t.appdAudio1Desc, 
      activeCol: 'app',
      direction: 'out' 
    },
    { 
      title: t.appdAudio2Title, 
      desc: t.appdAudio2Desc, 
      activeCol: 'service',
      direction: 'out' 
    },
    { 
      title: t.appdAudio3Title, 
      desc: t.appdAudio3Desc, 
      activeCol: 'appd',
      direction: 'out' 
    },
    { 
      title: t.appdAudio4Title, 
      desc: t.appdAudio4Desc, 
      activeCol: 'service',
      direction: 'out' 
    },
    { 
      title: t.appdAudio5Title, 
      desc: t.appdAudio5Desc, 
      activeCol: 'return',
      direction: 'back' 
    }
  ];

  const activeSteps = activeTab === 'current' ? currentSteps : appdSteps;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => (prev < activeSteps.length - 1 ? prev + 1 : 0));
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeSteps.length]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStep(0);
    setIsPlaying(false);
  };

  const handleProtocolChange = (p) => {
    setProtocol(p);
    setStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (step < activeSteps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-8 border-b border-slate-800 pb-6">
        {/* Row 1: Language Toggle */}
        <div className="flex justify-end mb-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-200 transition"
            title="Toggle Language / 切換語言"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">{lang === 'en' ? '中文' : 'Eng'}</span>
          </button>
        </div>

        {/* Row 2: Title and Main Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30">
              <Box className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Main Tab Switcher */}
            <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => handleTabChange('current')}
                className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition ${
                  activeTab === 'current'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.tabCurrent}
              </button>
              <button
                onClick={() => handleTabChange('appd')}
                className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition ${
                  activeTab === 'appd'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.tabAppd}
              </button>
            </div>
          </div>
        </div>

        {/* Protocol Selector */}
        <div className="flex items-center gap-2 mt-6">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.protocolLabel}</span>
          <button
            onClick={() => handleProtocolChange('dbus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              protocol === 'dbus'
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t.dbusProto}
          </button>
          <button
            onClick={() => handleProtocolChange('audio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              protocol === 'audio'
                ? 'bg-slate-800 text-rose-400 border border-slate-700'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t.audioProto}
          </button>
        </div>
      </header>

      {}
      <main className="max-w-5xl mx-auto space-y-6">

        {/* Controller / Step Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                {t.activeStep} ({step + 1}/{activeSteps.length})
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                activeSteps[step].direction === 'out' 
                  ? 'bg-blue-950 text-blue-300 border border-blue-800/50' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
              }`}>
                {activeSteps[step].direction === 'out' ? t.outbound : t.returnTrip}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-200">{activeSteps[step].title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{activeSteps[step].desc}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition border ${
                isPlaying
                  ? 'bg-amber-600/20 text-amber-300 border-amber-500/40 hover:bg-amber-600/30'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? t.pause : t.autoplay}</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            >
              <span>{t.nextStep}</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>

        {}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            
            {/* Column 1: Sandboxed Application */}
            <div className={`bg-slate-900/90 border rounded-2xl p-5 space-y-3 transition-all ${
              activeSteps[step].activeCol === 'app' || activeSteps[step].activeCol === 'return' || activeSteps[step].activeCol === 'host-proxy-app'
                ? 'border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]'
                : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> {t.sandbox}</span>
                <span>{t.container}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">{t.sandboxedApp}</h3>
              <p className="text-xs text-slate-400">
                {protocol === 'dbus' ? t.sandboxedAppDescDbus : t.sandboxedAppDescAudio}
              </p>
              <div className="pt-2">
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-mono block text-center">
                  {t.pidIsolated}
                </span>
              </div>
            </div>

            {/* Column 2: Intermediary Proxy Layer */}
            <div className={`bg-slate-900/90 border rounded-2xl p-5 space-y-3 transition-all ${
              activeSteps[step].activeCol === 'proxy' || activeSteps[step].activeCol === 'host-proxy-app'
                ? 'border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.02]'
                : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> {t.intermediary}</span>
                <span>{t.overhead}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                {protocol === 'dbus' ? t.proxyTitleDbus : t.proxyTitleAudio}
              </h3>
              <p className="text-xs text-slate-400">
                {protocol === 'dbus' ? t.proxyDescDbus : t.proxyDescAudio}
              </p>
              <div className="pt-2">
                <span className="text-[10px] bg-amber-950/60 border border-amber-800/40 px-2 py-1 rounded text-amber-300 font-mono block text-center">
                  {t.requiredPerAppProxy}
                </span>
              </div>
            </div>

            {/* Column 3: Host Services */}
            <div className={`bg-slate-900/90 border rounded-2xl p-5 space-y-3 transition-all ${
              activeSteps[step].activeCol === 'host' || activeSteps[step].activeCol === 'host-proxy-app'
                ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> {t.hostOS}</span>
                <span>{t.sessionStack}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                {protocol === 'dbus' ? t.hostServiceDbus : t.hostServiceAudio}
              </h3>
              <p className="text-xs text-slate-400">
                {protocol === 'dbus' ? t.hostDescDbus : t.hostDescAudio}
              </p>
              <div className="pt-2">
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-mono block text-center">
                  {t.privilegedHostLayer}
                </span>
              </div>
            </div>

          </div>
        )}

        {}
        {activeTab === 'appd' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-fadeIn">
            
            {/* Column 1: Isolated App (Width 4/12) */}
            <div className={`md:col-span-4 bg-slate-900/90 border rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between ${
              activeSteps[step].activeCol === 'app' || activeSteps[step].activeCol === 'return'
                ? 'border-purple-500 shadow-xl shadow-purple-500/10 scale-[1.02]'
                : 'border-slate-800 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> {t.sandbox}</span>
                  <span>{t.registered}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-200">{t.sandboxedAppTitle}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.sandboxedAppAppdDesc}
                </p>
              </div>
              <div className="bg-purple-950/30 border border-purple-500/30 p-2.5 rounded-xl text-[11px] text-purple-200 font-mono">
                {t.directPath}
              </div>
            </div>

            {/* Column 2: Host OS with System Services & appd stacked in 2 rows (Width 8/12) */}
            <div className="md:col-span-8 space-y-4">
              
              {/* Host OS Row 1: System Services */}
              <div className={`bg-slate-900/90 border rounded-2xl p-5 space-y-2 transition-all ${
                activeSteps[step].activeCol === 'service'
                  ? 'border-purple-500 shadow-xl shadow-purple-500/10 scale-[1.01]'
                  : 'border-slate-800 opacity-90'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                  <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> {t.hostServicesRow}</span>
                  <span>{t.row1}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-200">
                  {protocol === 'dbus' ? t.hostServiceAppdDbus : t.hostServiceAppdAudio}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.hostServiceAppdDesc}
                </p>
              </div>

              {/* Host OS Row 2: systemd-appd */}
              <div className={`bg-purple-950/40 border rounded-2xl p-5 space-y-2 transition-all ${
                activeSteps[step].activeCol === 'appd'
                  ? 'border-purple-400 shadow-xl shadow-purple-500/25 scale-[1.01]'
                  : 'border-purple-500/40 opacity-90'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                  <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {t.centralRegistry}</span>
                  <span>{t.row2}</span>
                </div>
                <h3 className="text-sm font-bold text-purple-200">{t.appdTitle}</h3>
                <p className="text-xs text-slate-300">
                  {t.appdDesc}
                </p>
              </div>

            </div>

          </div>
        )}

        {}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            {activeTab === 'current' ? (
              <>
                <XCircle className="w-4 h-4 text-amber-400" /> {t.whyCurrentComplex}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> {t.howAppdStreamlines}
              </>
            )}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeTab === 'current' ? (
              protocol === 'dbus' ? t.currentExplanationDbus : t.currentExplanationAudio
            ) : (
              protocol === 'dbus' ? t.appdExplanationDbus : t.appdExplanationAudio
            )}
          </p>
        </div>

      </main>
    </div>
  );
}
