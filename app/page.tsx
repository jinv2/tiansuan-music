"use client";

import React, { useState, useRef, useEffect } from 'react';
import ScoreStudio from './components/ScoreStudio';
import ApiKeyModal from './components/ApiKeyModal';
import { Upload, Layers, Square, Music, KeyRound, Menu } from 'lucide-react';
import useLocalStorageState from 'use-local-storage-state';

export default function Home() {
  const [format, setFormat] = useState('staff');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useLocalStorageState('ts_deepseek_key', { defaultValue: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAudioFile(e.target.files[0]);
  };

  if (!mounted) return <div className="h-screen w-full bg-[#1e1e1e]" />;

  return (
    <main className="flex flex-col h-[100dvh] w-full bg-[#1e1e1e] text-[#e5e5e5] overflow-hidden select-none font-sans">
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} storedKey={apiKey} onSave={setApiKey} />

      {/* 顶部 Header */}
      <header className="h-14 bg-[#252526] border-b border-[#333] flex items-center px-6 justify-between shrink-0 shadow-md z-40 flex-none">
        <div className="flex items-center gap-8">
          <div className="font-bold text-lg text-white flex items-center gap-3 tracking-wide">
            <div className="w-4 h-4 bg-blue-600 rounded"></div> 
            TIANSUAN <span className="text-blue-500 font-normal">DAW</span>
          </div>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border ${apiKey ? 'bg-[#1e1e1e] text-green-500 border-green-800' : 'bg-red-900/10 text-red-500 border-red-800 animate-pulse'}`}>
          <KeyRound size={14}/> {apiKey ? 'ONLINE' : 'CONNECT API'}
        </button>
      </header>

      {/* 主体区域 */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* 侧边栏 */}
        <aside className="w-72 bg-[#202021] border-r border-[#333] flex flex-col shrink-0 z-30 h-full shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
          <div className="p-3 bg-[#2d2d2d] text-xs font-bold text-gray-300 border-b border-[#333] flex justify-between items-center shrink-0">
            <span>INSPECTOR</span><Menu size={14}/>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto min-h-0 space-y-8">
             <div>
               <h3 className="text-xs text-blue-400 font-bold mb-3 uppercase flex items-center gap-2"><Music size={14}/> Audio Source</h3>
               <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />
               <div onClick={() => fileInputRef.current?.click()} className={`h-32 border-2 border-dashed bg-[#1a1a1a] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${audioFile ? 'border-blue-500/50 bg-blue-900/10' : 'border-[#444] hover:border-blue-400'}`}>
                 {audioFile ? (
                   <div className="text-center w-full px-4">
                     <Music size={32} className="mx-auto mb-3 text-blue-500"/>
                     <div className="text-sm font-medium text-white truncate">{audioFile.name}</div>
                   </div>
                 ) : (
                   <div className="text-center text-gray-500"><Upload size={28} className="mx-auto mb-3"/><span className="text-sm">Import Audio</span></div>
                 )}
               </div>
             </div>

             <div>
               <h3 className="text-xs text-blue-400 font-bold mb-3 uppercase flex items-center gap-2"><Layers size={14}/> Output Format</h3>
               <div className="flex flex-col gap-2">
                 <button onClick={() => setFormat('staff')} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${format === 'staff' ? 'bg-[#37373d] text-white border-l-4 border-blue-500' : 'text-gray-400 hover:bg-[#2a2a2b]'}`}>
                   <Layers size={18} className="mr-3"/> Orchestral Score
                 </button>
                 <button onClick={() => setFormat('jianpu')} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${format === 'jianpu' ? 'bg-[#37373d] text-white border-l-4 border-purple-500' : 'text-gray-400 hover:bg-[#2a2a2b]'}`}>
                   <Square size={18} className="mr-3"/> Jianpu / Numeric
                 </button>
               </div>
             </div>
          </div>
          
          <div className="p-4 pb-10 border-t border-[#333] shrink-0 bg-[#202021]">
             <div className="text-xs font-bold text-gray-400 mb-1">TIANSUAN ENGINE v4.0</div>
             <div className="text-[10px] text-gray-600 font-mono">Powered by DeepSeek V3</div>
          </div>
        </aside>

        {/* 右侧工作区 (包含 Logo 和 编辑器) */}
        <section className="flex-1 bg-[#181818] relative overflow-hidden flex flex-col">
          
          {/* Layer 0: 背景 Logo (绝对居中 + 模糊处理) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src="/logo.jpg" 
               alt="Background Watermark" 
               className="w-[500px] h-[500px] object-contain opacity-[0.06] blur-[3px] grayscale contrast-125"
             />
          </div>

          {/* Layer 1: 编辑器内容 (位于 Logo 之上) */}
          <div className="relative z-10 flex-1 flex flex-col w-full h-full">
            <ScoreStudio format={format} audioFile={audioFile} apiKey={apiKey} />
          </div>

        </section>
      </div>
    </main>
  );
}
