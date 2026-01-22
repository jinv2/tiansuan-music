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

      {/* Header: 手机端 px-3, 电脑端 px-4 */}
      <header className="h-14 bg-[#252526] border-b border-[#333] flex items-center px-3 md:px-4 justify-between shrink-0 shadow-md z-40 flex-none">
        
        <div className="flex items-center gap-2 md:gap-3">
          {/* Logo 容器 */}
          <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] rounded-md overflow-hidden border border-[#555] shadow-sm bg-white flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          
          <div className="font-bold text-base md:text-lg text-white tracking-wide flex items-baseline gap-1">
            TIANSUAN <span className="text-blue-500 font-normal text-xs md:text-sm">DAW</span>
          </div>

          {/* 桌面端菜单 (手机隐藏) */}
          <div className="hidden md:flex items-center gap-4 ml-6 text-xs text-gray-400 font-medium">
            <span className="hover:text-white cursor-pointer px-2 py-1">File</span>
            <span className="hover:text-white cursor-pointer px-2 py-1">Edit</span>
            <span className="hover:text-white cursor-pointer px-2 py-1">View</span>
          </div>
        </div>

        <button onClick={() => setIsSettingsOpen(true)} className={`flex items-center gap-2 text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full border transition-all ${apiKey ? 'bg-[#1e1e1e] text-green-500 border-green-800' : 'bg-red-900/10 text-red-500 border-red-800 animate-pulse'}`}>
          <KeyRound size={12}/> {apiKey ? 'ONLINE' : 'API'}
        </button>
      </header>

      {/* 核心布局：手机 flex-col (上下), 电脑 flex-row (左右) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
        
        {/* 侧边栏：手机 w-full (全宽), 电脑 w-72 (固定宽) */}
        <aside className="w-full md:w-72 bg-[#202021] border-b md:border-b-0 md:border-r border-[#333] flex flex-col shrink-0 z-30 shadow-lg md:h-full max-h-[35vh] md:max-h-full">
          <div className="p-2 md:p-3 bg-[#2d2d2d] text-xs font-bold text-gray-300 border-b border-[#333] flex justify-between items-center shrink-0">
            <span>INSPECTOR</span><Menu size={14}/>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto min-h-0 space-y-4 md:space-y-8">
             {/* 手机端并排布局优化 */}
             <div className="flex flex-row md:flex-col gap-4">
                 <div className="flex-1">
                   <h3 className="text-[10px] md:text-xs text-blue-400 font-bold mb-2 uppercase flex items-center gap-2"><Music size={12}/> Source</h3>
                   <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />
                   <div onClick={() => fileInputRef.current?.click()} className={`h-20 md:h-32 border-2 border-dashed bg-[#1a1a1a] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${audioFile ? 'border-blue-500/50 bg-blue-900/10' : 'border-[#444] hover:border-blue-400'}`}>
                     {audioFile ? (
                       <div className="text-center w-full px-2">
                         <Music size={20} className="mx-auto mb-1 text-blue-500"/>
                         <div className="text-xs font-medium text-white truncate max-w-[100px] md:max-w-full">{audioFile.name}</div>
                       </div>
                     ) : (
                       <div className="text-center text-gray-500"><Upload size={20} className="mx-auto mb-1"/><span className="text-xs">Import</span></div>
                     )}
                   </div>
                 </div>

                 <div className="flex-1">
                   <h3 className="text-[10px] md:text-xs text-blue-400 font-bold mb-2 uppercase flex items-center gap-2"><Layers size={12}/> Format</h3>
                   <div className="flex flex-col gap-1 md:gap-2">
                     <button onClick={() => setFormat('staff')} className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium ${format === 'staff' ? 'bg-[#37373d] text-white border-l-4 border-blue-500' : 'text-gray-400 hover:bg-[#2a2a2b]'}`}>
                       <Layers size={14} className="mr-2"/> Score
                     </button>
                     <button onClick={() => setFormat('jianpu')} className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium ${format === 'jianpu' ? 'bg-[#37373d] text-white border-l-4 border-purple-500' : 'text-gray-400 hover:bg-[#2a2a2b]'}`}>
                       <Square size={14} className="mr-2"/> Jianpu
                     </button>
                   </div>
                 </div>
             </div>
          </div>
          
          <div className="p-2 md:p-4 md:pb-10 border-t border-[#333] shrink-0 bg-[#202021] hidden md:block">
             <div className="text-xs font-bold text-gray-400 mb-1">TIANSUAN ENGINE v4.4</div>
             <div className="text-[10px] text-gray-600 font-mono">Powered by DeepSeek V3</div>
          </div>
        </aside>

        <section className="flex-1 bg-[#181818] relative overflow-hidden flex flex-col">
          <ScoreStudio format={format} audioFile={audioFile} apiKey={apiKey} />
        </section>
      </div>
    </main>
  );
}
