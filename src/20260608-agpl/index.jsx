export const meta = {
  title: 'Navigating AGPL',
  description: 'Illustrate what AGPL is about',
  tags: ['AGPL', 'GPL', 'AGPLv3', 'GPLv3'],
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Copyright, 
  XCircle, 
  Lock, 
  Unlock,
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileCode2, 
  Server, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Cloud, 
  Download, 
  Shield, 
  AlertOctagon, 
  Link2, 
  AppWindow, 
  Database, 
  ListChecks, 
  FileText, 
  Code2, 
  Info,
  HelpCircle,
  Laptop
} from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex space-x-1 bg-white p-2 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const CopyrightVsAGPL = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Scale className="w-8 h-8 mr-3 text-blue-500" />
        Standard Copyright vs. AGPL v3
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Standard Copyright */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
            <Copyright className="w-5 h-5 mr-2" /> Standard Copyright
          </h3>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            The default state of creation. "All Rights Reserved." Only the creator decides who can use, modify, or share the work.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Cannot legally copy or distribute without explicit permission.</span>
            </li>
            <li className="flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Cannot view or modify the source code (usually closed-source).</span>
            </li>
            <li className="flex items-start">
              <Lock className="w-5 h-5 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
              <span>Goal: Control and monetize the intellectual property directly.</span>
            </li>
          </ul>
        </div>

        {/* AGPL */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
            <Share2 className="w-5 h-5 mr-2" /> AGPL v3 (Copyleft)
          </h3>
          <p className="text-blue-700 mb-4 text-sm leading-relaxed">
            A license built *on top* of copyright to ensure freedom. "All Rights Reversed." Grants permission to use, modify, and share, *but* with conditions.
          </p>
          <ul className="space-y-3 text-sm text-blue-900">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Anyone can freely use, modify, and share the code.</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="font-medium">Condition: If you modify and share (or run on a server), you MUST share your modifications under the same license.</span>
            </li>
            <li className="flex items-start">
              <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Goal: Ensure the software and its derivatives remain free and open for everyone.</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const GPLvsAGPL = () => {
  const [comparisonMode, setComparisonMode] = useState('distribution'); // 'distribution' or 'network'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
        <FileCode2 className="w-8 h-8 mr-3 text-green-500" />
        The Evolution: GPL vs. AGPL
      </h2>
      <p className="text-slate-600 mb-6">
        Standard GPL v3 works perfectly for downloaded files, but cloud hosting created a loophole. See how both licenses handle physical delivery vs. cloud access.
      </p>
      
      {/* Interactive Mode Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-lg mb-8 max-w-xl mx-auto">
        <button 
          onClick={() => setComparisonMode('distribution')}
          className={`flex-1 py-3 text-xs md:text-sm font-semibold rounded-md transition-colors flex items-center justify-center space-x-2 ${comparisonMode === 'distribution' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Laptop className="w-4 h-4" />
          <span>1. Offline Distribution (Identical)</span>
        </button>
        <button 
          onClick={() => setComparisonMode('network')}
          className={`flex-1 py-3 text-xs md:text-sm font-semibold rounded-md transition-colors flex items-center justify-center space-x-2 ${comparisonMode === 'network' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Cloud className="w-4 h-4" />
          <span>2. Cloud / Network Access (Different)</span>
        </button>
      </div>

      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* COMPARISON MODE 1: OFFLINE BINARY DISTRIBUTION */}
          {comparisonMode === 'distribution' && (
            <motion.div 
              key="distribution"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex items-start">
                <Info className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <p>
                  <strong>No Difference Here:</strong> When you physically compile and distribute binary software to a user (e.g., an installer, application, or binary script), both <strong>GPL v3</strong> and <strong>AGPL v3</strong> operate exactly the same. Delivering a file triggers the standard copyleft obligation.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Creator */}
                  <div className="flex-1 text-center w-full">
                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center mx-auto mb-3">
                      <Code2 className="w-8 h-8 text-slate-600" />
                    </div>
                    <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full uppercase">Developer</span>
                    <p className="text-xs text-slate-500 mt-2">Modifies GPL v3 or AGPL v3 project</p>
                  </div>

                  {/* Distribution Wire */}
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full mb-2">
                      Conveying Binary File (.dmg, .exe)
                    </span>
                    <div className="w-full h-1 bg-blue-300 relative rounded-full">
                      <motion.div 
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full -top-1"
                      />
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="flex-1 text-center w-full">
                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center mx-auto mb-3">
                      <Laptop className="w-8 h-8 text-slate-600" />
                    </div>
                    <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full uppercase">End User</span>
                    <p className="text-xs text-slate-500 mt-2">Runs software locally on machine</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Under GPL v3</span>
                      <div className="flex items-center space-x-2 text-green-600 font-bold text-sm mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Source Code Triggered</span>
                      </div>
                      <p className="text-xs text-slate-600">The act of physical binary distribution requires providing the complete corresponding source code to the recipient.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wide block mb-1">Under AGPL v3</span>
                      <div className="flex items-center space-x-2 text-green-600 font-bold text-sm mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Source Code Triggered</span>
                      </div>
                      <p className="text-xs text-slate-600">Behaves identically to GPL v3 in this scenario. Users downloading the program have legal rights to the source code.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPARISON MODE 2: CLOUD & NETWORK ACCESS */}
          {comparisonMode === 'network' && (
            <motion.div 
              key="network"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-800 flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <p>
                  <strong>Where They Diverge:</strong> When the software is hosted on a cloud server and accessed only through browser interactions or APIs, standard GPL v3 does not require releasing your code modifications. AGPL v3 specifically closes this SaaS loophole.
                </p>
              </div>

              {/* Symmetrical Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* GPL v3 Cloud Setup */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-200 px-2 py-1 rounded">GPL v3 (SaaS Loophole)</span>
                      <span className="text-xs font-bold text-red-600 flex items-center bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3.5 h-3.5 mr-1" /> Source Stays Secret
                      </span>
                    </div>

                    {/* Symmetrical Diagram */}
                    <div className="flex items-center justify-between py-4 border-b border-slate-200 mb-4 bg-white px-4 rounded-lg">
                      {/* Server node */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <Server className="w-6 h-6 text-slate-500" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">SaaS Server</span>
                      </div>

                      {/* Connection wire */}
                      <div className="flex-1 px-3 relative">
                        <div className="w-full h-0.5 bg-slate-300 relative rounded-full">
                          <motion.div 
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                            className="absolute w-2 h-2 bg-slate-400 rounded-full -top-0.5"
                          />
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 block text-center mt-1">Network API</span>
                      </div>

                      {/* User node */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <User className="w-6 h-6 text-slate-500" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">End User</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Why this happens:</strong> In standard GPL, copyleft is only triggered if you "convey" (distribute) the compiled files. Since users are only sending data back and forth to your cloud server over an IP network, you never send them files. You do not have to share your proprietary backend modifications.
                  </p>
                </div>

                {/* AGPL v3 Cloud Setup */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded">AGPL v3 (Loophole Closed)</span>
                      <span className="text-xs font-bold text-green-700 flex items-center bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                        <Unlock className="w-3.5 h-3.5 mr-1" /> Must Share Source
                      </span>
                    </div>

                    {/* Symmetrical Diagram (Look & Feel Unified) */}
                    <div className="flex items-center justify-between py-4 border-b border-blue-200 mb-4 bg-white px-4 rounded-lg">
                      {/* Server node */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <Server className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-semibold text-blue-800">SaaS Server</span>
                      </div>

                      {/* Connection wire */}
                      <div className="flex-1 px-3 relative">
                        <div className="w-full h-0.5 bg-blue-300 relative rounded-full">
                          <motion.div 
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                            className="absolute w-2 h-2 bg-blue-600 rounded-full -top-0.5"
                          />
                        </div>
                        <span className="text-[8px] font-mono text-blue-500 block text-center mt-1">Network API</span>
                      </div>

                      {/* User node */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <User className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-semibold text-blue-800">End User</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Why this happens:</strong> AGPL v3's Section 13 states that if the program is modified and interacts remotely over a network, you must offer the complete source code to all network users. They must be able to download a zip or pull from a repository at no charge.
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Boundaries = () => {
  const [view, setView] = useState('linking'); // 'linking' or 'database'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
        <Shield className="w-8 h-8 mr-3 text-purple-500" />
        The Architecture Boundary Test
      </h2>
      <p className="text-slate-600 mb-8">How you connect your proprietary code to AGPL code determines your legal obligations.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Selector Menu */}
        <div className="flex flex-col space-y-3 lg:w-1/3">
          <button 
            onClick={() => setView('linking')}
            className={`text-left p-4 rounded-xl border-2 transition-all ${view === 'linking' ? 'border-red-400 bg-red-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold ${view === 'linking' ? 'text-red-700' : 'text-slate-700'}`}>Direct Linking</h3>
              {view === 'linking' && <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Triggers AGPL</span>}
            </div>
            <p className="text-xs text-slate-500">Importing an AGPL library directly into your codebase.</p>
          </button>

          <button 
            onClick={() => setView('database')}
            className={`text-left p-4 rounded-xl border-2 transition-all ${view === 'database' ? 'border-emerald-400 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold ${view === 'database' ? 'text-emerald-700' : 'text-slate-700'}`}>Calling as a Backend</h3>
              {view === 'database' && <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Usually Safe</span>}
            </div>
            <p className="text-xs text-slate-500">Communicating with an unmodified AGPL service via network APIs (like a database).</p>
          </button>
        </div>

        {/* Visualization Area */}
        <div className="lg:w-2/3 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-center min-h-[400px] overflow-hidden">
          <AnimatePresence mode="wait">
            
            {view === 'linking' && (
              <motion.div 
                key="linking"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-red-600 mb-1 flex items-center justify-center">
                    <AlertOctagon className="w-6 h-6 mr-2" /> Creates a Single Derivative Work
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">They share memory space and are compiled/interpreted together. No boundary exists.</p>
                </div>

                {/* The Blob */}
                <div className="relative w-72 h-72">
                  {/* Outer container representing the unified process */}
                  <div className="absolute inset-0 bg-red-100 border-4 border-red-300 rounded-[3rem] shadow-lg animate-pulse"></div>
                  <div className="absolute inset-0 flex flex-col p-6 h-full justify-between z-10">
                    <div className="bg-white p-3 rounded-xl shadow border border-slate-200 text-center flex-1 mb-2 flex flex-col justify-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Proprietary Code</span>
                      <div className="bg-slate-100 p-2 rounded text-[10px] font-mono text-left">
                        <span className="text-purple-600">import</span> agpl_lib;<br/>
                        data = <span className="text-blue-600">agpl_lib.process</span>(input);
                      </div>
                    </div>
                    
                    {/* Linking visual */}
                    <div className="flex justify-center -my-3 z-20">
                      <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                        <Link2 className="w-5 h-5 text-white font-bold" />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl shadow border border-blue-200 text-center flex-1 mt-2 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 opacity-10">
                        <FileCode2 className="w-16 h-16 text-blue-900" />
                      </div>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">AGPL v3 Library</span>
                      <div className="bg-white p-2 rounded text-[10px] font-mono text-left opacity-80 border border-blue-100">
                        <span className="text-purple-600">def</span> <span className="text-blue-600">process</span>(x):<br/>
                        &nbsp;&nbsp;return x * 2;
                      </div>
                    </div>
                  </div>
                  {/* Infection Arrow */}
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap transform translate-x-[90%] md:translate-x-full">
                    <ArrowLeft className="w-4 h-4 mr-1 inline" />
                    Entire app becomes AGPL
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'database' && (
              <motion.div 
                key="database"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-emerald-600 mb-1 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 mr-2" /> Arm's Length Communication
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">Two separate programs communicating via standard network protocols. The boundary holds.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-lg mt-4 gap-4 md:gap-0">
                  
                  {/* Proprietary App */}
                  <div className="bg-white border-2 border-slate-300 rounded-2xl w-40 h-48 flex flex-col shadow-md relative shrink-0">
                    <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 rounded-t-xl text-center">
                      <span className="text-xs font-bold text-slate-600 uppercase">Process A (Node.js)</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                      <AppWindow className="w-10 h-10 text-slate-400 mb-2" />
                      <span className="text-sm font-bold text-slate-800">Your Proprietary App</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full mt-2">Closed Source</span>
                    </div>
                  </div>

                  {/* Network API Boundary (With fully traversing animated network node) */}
                  <div className="flex-1 w-full md:w-auto h-32 md:h-auto flex flex-col items-center justify-center relative px-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded mb-4 text-center shadow-sm z-10 relative hidden md:block">TCP/IP (REST, SQL)</span>
                    
                    {/* The Connection Wire */}
                    <div className="w-1 h-full md:w-full md:h-1 bg-emerald-400 rounded relative z-0">
                      {/* Animated packet crossing boundaries: desktop (horizontally) and mobile (vertically) */}
                      <motion.div 
                        animate={{ 
                          left: ["0%", "100%"],
                          top: ["50%", "50%"]
                        }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute w-4 h-4 bg-white border-[3px] border-emerald-600 rounded-full shadow-md z-20 hidden md:block"
                        style={{ marginLeft: "-8px", marginTop: "-8px" }}
                      />
                      <motion.div 
                        animate={{ 
                          top: ["0%", "100%"],
                          left: ["50%", "50%"]
                        }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute w-4 h-4 bg-white border-[3px] border-emerald-600 rounded-full shadow-md z-20 md:hidden"
                        style={{ marginLeft: "-8px", marginTop: "-8px" }}
                      />
                    </div>
                    
                    {/* The Boundary Wall */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 border-t-4 border-dashed border-slate-400 opacity-60 z-10 md:w-1 md:h-32 md:border-t-0 md:border-l-4"></div>
                    <span className="absolute bottom-2 md:-bottom-8 text-[10px] font-bold text-slate-500 tracking-widest uppercase bg-slate-50 px-2 z-10">Boundary</span>
                  </div>

                  {/* AGPL Database */}
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl w-40 h-48 flex flex-col shadow-md relative shrink-0">
                    <div className="bg-blue-200 px-3 py-2 border-b border-blue-300 rounded-t-xl text-center">
                      <span className="text-xs font-bold text-blue-800 uppercase">Process B (Container)</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                      <Database className="w-10 h-10 text-blue-500 mb-2" />
                      <span className="text-sm font-bold text-blue-900">Unmodified AGPL DB</span>
                      <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full mt-2">AGPL v3</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const DerivativeDuties = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
        <ListChecks className="w-8 h-8 mr-3 text-amber-500" />
        Your Duty: Creating a Derivative Work
      </h2>
      <p className="text-slate-600 mb-8 text-lg">If you modify AGPL code or link it into your proprietary app, you have created a "Derivative Work." Here is what you are legally obligated to do.</p>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Duty 1 - Relicense the Whole (Modified for narrow screen compliance) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
          {/* Symmetrical stacked layout preventing crop on narrow displays */}
          <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-slate-100 shadow-inner h-32 mb-6">
            <div className="flex flex-col items-center space-y-1 w-full">
              <div className="flex space-x-2 w-full justify-center">
                <div className="bg-slate-700 text-white text-[10px] py-1 px-1.5 rounded text-center truncate max-w-[70px]">Proprietary</div>
                <div className="text-amber-500 font-bold text-xs flex items-center">+</div>
                <div className="bg-blue-600 text-white text-[10px] py-1 px-1.5 rounded text-center truncate max-w-[70px]">AGPL</div>
              </div>
              <div className="w-0.5 h-3 bg-slate-300"></div>
              <div className="bg-blue-500 border border-blue-400 text-white text-[10px] py-1 px-2 rounded-lg font-bold w-full max-w-[120px] text-center">
                100% AGPL
              </div>
            </div>
          </div>
          <h3 className="font-bold text-slate-800 mb-2 flex items-center">
            <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2 shrink-0">1</span>
            Relicense the Whole
          </h3>
          <p className="text-sm text-slate-600 flex-1 leading-relaxed">
            Your entire merged application must now be licensed under the AGPL v3. You cannot keep your "part" proprietary while leaving their "part" open.
          </p>
        </div>

        {/* Duty 2 - Provide Source Code */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-center space-x-4 mb-6 bg-white p-4 rounded-lg border border-slate-100 shadow-inner h-32">
            <div className="flex flex-col items-center">
               <Server className="w-8 h-8 text-slate-600 mb-1" />
               <span className="text-[9px] text-slate-500 font-bold uppercase">Your App</span>
            </div>
            <div className="flex flex-col items-center relative w-16">
                <motion.div 
                  animate={{ x: [0, 40], opacity: [0, 1, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
                  className="absolute -top-4 left-0 bg-blue-100 p-1 rounded-full shadow-sm border border-blue-200"
                >
                    <Code2 className="w-4 h-4 text-blue-600" />
                </motion.div>
                <div className="w-full h-0.5 bg-dashed border-t-2 border-dashed border-slate-300"></div>
            </div>
            <div className="flex flex-col items-center">
               <User className="w-8 h-8 text-blue-600 mb-1" />
               <span className="text-[9px] text-blue-600 font-bold uppercase bg-blue-50 px-2 rounded">User</span>
            </div>
          </div>
          <h3 className="font-bold text-slate-800 mb-2 flex items-center">
            <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2 shrink-0">2</span>
            Provide Source Code
          </h3>
          <p className="text-sm text-slate-600 flex-1 leading-relaxed">
            You must make the complete source code available to anyone who uses the software over a network. This usually means providing a clear download link in the app's UI.
          </p>
        </div>

        {/* Duty 3 - Retain Notices */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-center mb-6 bg-white p-4 rounded-lg border border-slate-100 shadow-inner h-32">
             <div className="bg-slate-50 border border-slate-300 rounded p-3 w-full max-w-[140px] shadow-sm relative">
                <div className="flex items-center text-green-600 mb-2 border-b border-slate-200 pb-1">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    <span className="text-[9px] font-bold uppercase">Copyright (c) 2026</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-slate-300 rounded"></div>
                  <div className="w-5/6 h-1.5 bg-slate-300 rounded"></div>
                  <div className="w-4/6 h-1.5 bg-slate-300 rounded"></div>
                </div>
                <div className="absolute -right-3 -bottom-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                    <Lock className="w-4 h-4" />
                </div>
             </div>
          </div>
          <h3 className="font-bold text-slate-800 mb-2 flex items-center">
            <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2 shrink-0">3</span>
            Retain Notices
          </h3>
          <p className="text-sm text-slate-600 flex-1 leading-relaxed">
            You must keep all original copyright notices, license texts, and installation instructions intact. You cannot claim you wrote the original AGPL components.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-slate-800 text-slate-100 rounded-xl p-6 relative overflow-hidden">
        <Info className="absolute -right-4 -bottom-4 w-40 h-40 text-slate-700 opacity-50 font-bold" />
        <h4 className="font-bold text-lg mb-2 relative z-10 text-white">The Golden Rule of Copyleft</h4>
        <p className="text-sm text-slate-300 relative z-10 max-w-3xl">
          "If you benefit from the community's work by building upon it, you must give your improvements back to the community under the same terms."
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: 'Copyright vs AGPL', icon: Scale },
    { id: 'loophole', label: 'GPL vs AGPL', icon: FileCode2 },
    { id: 'boundaries', label: 'Architecture Boundaries', icon: Shield },
    { id: 'duties', label: 'Derivative Duties', icon: ListChecks },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide border border-blue-200">
            Interactive Guide
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Navigating AGPL v3
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Understand the nuances of the strongest open-source copyleft license, how it handles the cloud, and how to architect your software safely.
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        </div>

        {/* Content Area */}
        <main className="min-h-[500px]">
          {activeTab === 'basics' && <CopyrightVsAGPL />}
          {activeTab === 'loophole' && <GPLvsAGPL />}
          {activeTab === 'boundaries' && <Boundaries />}
          {activeTab === 'duties' && <DerivativeDuties />}
        </main>

        {/* Footer Disclaimer */}
        <footer className="mt-12 text-center text-xs text-slate-400">
          <p>Disclaimer: This interactive guide is for educational purposes only and does not constitute legal advice. <br/>Always consult with legal counsel for software licensing compliance.</p>
        </footer>

      </div>
    </div>
  );
}