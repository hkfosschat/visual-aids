export const meta = {
  title: 'Linux - SecretService and Oo7',
  description: 'Visualize how SecretService API and Oo7',
  tags: ['linux', 'desktop', 'security', 'privacy'],
};

import React from 'react';

const LinuxSecretManagement = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans bg-slate-50 text-slate-900 leading-relaxed">
      
      {/* Header section */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          The Evolution of Linux Credential Management
        </h1>
        <p className="text-center text-slate-500">
          Visualizing the transition from fragmented desktop silos to a unified standard.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        
        {/* ================= LEGACY STATE ================= */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-2">
            Current / Legacy State: Fragmented Silos
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            Each desktop uses its own custom daemon, UI toolkit, and storage format.
          </p>
          
          <div className="flex flex-col items-center gap-4 my-8 font-medium w-full">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 w-full">
              
              {/* GNOME SIDE */}
              <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl flex flex-col items-center bg-slate-100 w-full box-border">
                <div className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-wide">
                  GNOME Ecosystem
                </div>
                
                <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative w-full md:w-auto bg-violet-500">
                  GNOME Apps
                </div>
                
                <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2">
                  ↓
                  <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded text-center mt-1 font-normal border border-slate-200">
                    libsecret
                  </span>
                </div>
                
                <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative w-full md:w-auto bg-blue-500">
                  GNOME Keyring Daemon
                  <span className="text-xs opacity-90 block mt-2 font-normal">Coupled C Backend + GTK UI Prompts</span>
                </div>
                
                <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2">
                  ↓
                </div>
                
                <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative w-full md:w-auto bg-slate-600">
                  ~/.local/share/keyrings
                </div>
              </div>

              {/* KDE SIDE */}
              <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl flex flex-col items-center bg-slate-100 w-full box-border">
                <div className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-wide">
                  KDE Plasma Ecosystem
                </div>
                
                <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative w-full md:w-auto bg-violet-500">
                  KDE Apps
                </div>
                
                <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2">
                  ↓
                  <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded text-center mt-1 font-normal border border-slate-200">
                    KWallet API
                  </span>
                </div>
                
                <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative w-full md:w-auto bg-emerald-500">
                  KWallet Daemon
                  <span className="text-xs opacity-90 block mt-2 font-normal">Coupled C++ Backend + Qt UI Prompts</span>
                </div>
                
                <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2">
                  ↓
                </div>
                
                <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative w-full md:w-auto bg-slate-600">
                  ~/.local/share/kwalletd
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-r-lg mt-8 text-sm text-slate-800">
            <strong>The Problem:</strong> If you run a KDE app on GNOME, or vice versa, the password prompts look alien (GTK prompts on Plasma, or Qt prompts on GNOME). Both older backends lack strong Flatpak sandbox isolation.
          </div>
        </section>

        {/* ================= ENVISIONED FUTURE ================= */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-2">
            The Envisioned Future: Unified Standard via Oo7
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            A shared cross-desktop backend that delegates native UI rendering to the host OS.
          </p>
          
          <div className="flex flex-col items-center gap-4 my-8 font-medium w-full">
            
            {/* ALL APPS */}
            <div className="flex gap-8 justify-center w-full">
              <div className="p-4 rounded-lg text-center text-white shadow-sm relative bg-violet-500 w-full max-w-[250px]">
                Any App
                <span className="text-xs opacity-90 block mt-2 font-normal">(GNOME, KDE, or Flatpak)</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2">
              ↓
              <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded text-center mt-1 font-normal border border-slate-200">
                Standardized Secret Service D-Bus API
              </span>
            </div>
            
            {/* API LAYER */}
            <div className="p-4 rounded-lg text-center text-white shadow-sm relative bg-pink-500 w-full max-w-[450px]">
              org.freedesktop.Secrets
              <span className="text-xs opacity-90 block mt-2 font-normal">Unified Cross-Desktop Protocol</span>
            </div>
            
            <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2">
              ↓
            </div>
            
            {/* OO7 DAEMON LAYER */}
            <div className="border-2 border-dashed border-orange-400 p-6 md:p-8 rounded-xl flex flex-col items-center bg-slate-50 w-full box-border">
              <div className="text-orange-600 text-sm font-bold mb-6 uppercase tracking-wide">
                The Headless Provider
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center w-full items-center">
                
                {/* UI DELEGATION */}
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative bg-blue-800">
                    GNOME Prompter
                    <span className="text-xs opacity-90 block mt-2 font-normal">Native GTK Dialogs</span>
                  </div>
                  <div className="text-slate-400 text-xs text-center font-bold">OR</div>
                  <div className="p-4 rounded-lg text-center text-white min-w-[150px] shadow-sm relative bg-emerald-700">
                    KDE Prompter
                    <span className="text-xs opacity-90 block mt-2 font-normal">Native Qt Dialogs</span>
                  </div>
                </div>

                {/* ARROW: DAEMON -> PROMPTERS */}
                <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl my-2 md:my-0">
                  <span className="hidden md:block">⟵</span>
                  <span className="block md:hidden">↑</span>
                  <span className="text-[0.75rem] text-slate-500 bg-white px-2 py-1 rounded text-center mt-1 font-normal leading-tight shadow-sm border border-slate-200">
                    Delegates UI calls<br className="hidden md:block"/>via D-Bus
                  </span>
                </div>

                {/* OO7 DAEMON */}
                <div className="p-6 md:p-8 rounded-lg text-center text-white shadow-sm relative bg-orange-500 w-full md:w-auto">
                  Oo7 Daemon
                  <span className="text-xs opacity-90 block mt-2 font-normal">Modern Rust Backend<br/>(No UI Toolkits inside!)</span>
                </div>

              </div>
              
              <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl mt-8 mb-2">
                ↓
                <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded text-center mt-1 font-normal border border-slate-200">
                  Encrypts & Saves
                </span>
              </div>
              
              {/* UNIFIED STORAGE */}
              <div className="p-4 rounded-lg text-center text-white shadow-sm relative bg-slate-600 w-full md:w-4/5">
                Unified Keyring File
                <span className="text-xs opacity-90 block mt-2 font-normal">Shared database accessible natively on any Desktop Environment</span>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-r-lg mt-8 text-sm text-slate-800">
            <strong>The Solution:</strong> 
            <ul className="list-disc ml-5 mt-3 space-y-2 mb-0">
              <li>
                <strong>Decoupling:</strong> The <code className="bg-sky-200/50 text-sky-900 font-mono px-1.5 py-0.5 rounded text-[0.8rem]">oo7-daemon</code> is completely "headless" (it contains no GTK or Qt code).
              </li>
              <li>
                <strong>Native Looks:</strong> When a vault needs unlocking, Oo7 sends a message to the OS. Plasma will launch a tiny, native KDE dialog. GNOME will launch a native GNOME dialog.
              </li>
              <li>
                <strong>No Fragmentation:</strong> Developers only maintain one highly secure Rust library. Users get one unified password vault that works beautifully regardless of which desktop environment they log into.
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LinuxSecretManagement;
