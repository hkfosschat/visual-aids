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
          
          <div className="flex flex-col gap-2 my-8 font-medium w-full">
            
            {/* ROW 1: APPS & PROMPTERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 w-full">
              {/* LEFT */}
              <div className="flex flex-col items-center justify-end">
                <div className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-wide">
                  Client Applications
                </div>
                <div className="flex flex-col gap-3 w-full max-w-[300px]">
                  <div className="p-4 rounded-lg text-center text-white shadow-sm bg-indigo-500">
                    Web Browser <span className="text-xs opacity-90 block mt-1 font-normal">(e.g. Firefox)</span>
                  </div>
                  <div className="p-4 rounded-lg text-center text-white shadow-sm bg-purple-500">
                    Email Client <span className="text-xs opacity-90 block mt-1 font-normal">(e.g. Thunderbird)</span>
                  </div>
                  <div className="p-4 rounded-lg text-center text-white shadow-sm bg-fuchsia-500">
                    Chat App <span className="text-xs opacity-90 block mt-1 font-normal">(e.g. Element / Flatpak)</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-center justify-end h-full">
                <div className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-wide">
                  Desktop Shell / UI
                </div>
                <div className="flex flex-col gap-3 w-full max-w-[300px]">
                  <div className="p-4 rounded-lg text-center text-white shadow-sm bg-blue-800">
                    GNOME Prompter <span className="text-xs opacity-90 block mt-1 font-normal">Native GTK Dialogs</span>
                  </div>
                  <div className="text-slate-400 text-xs text-center font-bold">OR</div>
                  <div className="p-4 rounded-lg text-center text-white shadow-sm bg-emerald-700">
                    KDE Prompter <span className="text-xs opacity-90 block mt-1 font-normal">Native Qt Dialogs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: ARROWS App <-> DBus <-> Prompter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 w-full mt-4">
              {/* LEFT ARROWS */}
              <div className="flex justify-center gap-12 font-bold text-2xl">
                <div className="flex flex-col items-center text-blue-500" title="Request from App">
                  <span>↓</span><span className="text-[0.65rem] uppercase mt-1">Req</span>
                </div>
                <div className="flex flex-col items-center text-emerald-500" title="Response back to App">
                  <span>↑</span><span className="text-[0.65rem] uppercase mt-1">Res</span>
                </div>
              </div>
              {/* RIGHT ARROWS */}
              <div className="flex justify-center gap-12 font-bold text-2xl">
                <div className="flex flex-col items-center text-blue-500" title="Request to Prompter">
                  <span>↑</span><span className="text-[0.65rem] uppercase mt-1">Req</span>
                </div>
                <div className="flex flex-col items-center text-emerald-500" title="Response from Prompter">
                  <span>↓</span><span className="text-[0.65rem] uppercase mt-1">Res</span>
                </div>
              </div>
            </div>

            {/* ROW 3: SHARED D-BUS (NOW CONTAINING APIs) */}
            <div className="w-full relative py-8 border-y-4 border-slate-300 bg-slate-100/50 my-2 shadow-inner flex flex-col items-center gap-6">
              <div className="absolute left-4 top-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                D-Bus Session Bus
              </div>
              
              <div className="text-sm text-slate-600 bg-white px-4 py-2 rounded-full text-center font-semibold shadow-sm border border-slate-300 z-10 flex gap-4 items-center mt-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                Centralized Message Routing & IPC
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>

              {/* APIs INSIDE D-BUS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 w-full px-4">
                {/* LEFT API */}
                <div className="flex flex-col items-center w-full">
                  <div className="p-4 rounded-lg text-center text-white shadow-sm relative bg-pink-500 w-full max-w-[350px]">
                    org.freedesktop.Secrets
                    <span className="text-xs opacity-90 block mt-1 font-normal">Secret Service API</span>
                  </div>
                </div>
                {/* RIGHT API */}
                <div className="flex flex-col items-center w-full">
                  <div className="p-4 rounded-lg text-center text-white shadow-sm relative bg-teal-600 w-full max-w-[350px]">
                    org.freedesktop.impl.portal.Secret
                    <span className="text-xs opacity-90 block mt-1 font-normal">UI Delegation Portal API</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: ARROWS APIs <-> Daemon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 w-full mt-4">
              <div className="flex justify-center gap-12 font-bold text-2xl">
                <span className="text-blue-500">↓</span>
                <span className="text-emerald-500">↑</span>
              </div>
              <div className="flex justify-center gap-12 font-bold text-2xl">
                <span className="text-blue-500">↑</span>
                <span className="text-emerald-500">↓</span>
              </div>
            </div>

            {/* ROW 7: HEADLESS PROVIDER BOX */}
            <div className="border-2 border-dashed border-orange-400 p-6 md:p-8 rounded-xl flex flex-col items-center bg-slate-50 w-full box-border mt-2 relative">
              <div className="text-orange-600 text-sm font-bold mb-6 uppercase tracking-wide">
                The Headless Provider
              </div>
              
              <div className="p-6 rounded-lg text-center text-white shadow-sm relative bg-orange-500 w-full max-w-[600px]">
                Oo7 Daemon
                <span className="text-xs opacity-90 block mt-2 font-normal">Modern Rust Backend (No UI Toolkits inside!)</span>
              </div>
              
              <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-2xl mt-6 mb-2">
                ↓
                <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded text-center mt-1 font-normal border border-slate-200">
                  Encrypts & Saves
                </span>
              </div>
              
              <div className="p-4 rounded-lg text-center text-white shadow-sm relative bg-slate-600 w-full max-w-[400px]">
                Unified Keyring File
                <span className="text-xs opacity-90 block mt-2 font-normal">Shared encrypted database</span>
              </div>
            </div>

          </div>

          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-r-lg mt-8 text-sm text-slate-800">
            <strong>The Solution:</strong> 
            <ul className="list-disc ml-5 mt-3 space-y-2 mb-0">
              <li>
                <strong>Universal IPC (D-Bus):</strong> All applications—regardless of their toolkit or sandboxing (Flatpak)—communicate securely over the centralized D-Bus message bus to request secrets.
              </li>
              <li>
                <strong>Decoupling:</strong> The <code className="bg-sky-200/50 text-sky-900 font-mono px-1.5 py-0.5 rounded text-[0.8rem]">oo7-daemon</code> acts as the single provider for the <code className="bg-sky-200/50 text-sky-900 font-mono px-1.5 py-0.5 rounded text-[0.8rem]">org.freedesktop.Secrets</code> API, and it is completely "headless" (contains no GTK or Qt code).
              </li>
              <li>
                <strong>Native Looks:</strong> When a vault needs unlocking, Oo7 delegates via D-Bus to a native prompter. Plasma will launch a tiny, native KDE dialog. GNOME will launch a native GNOME dialog.
              </li>
              <li>
                <strong>No Fragmentation:</strong> Developers only maintain one highly secure Rust backend. Users get one unified password vault that works beautifully regardless of which desktop environment they log into.
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LinuxSecretManagement;
