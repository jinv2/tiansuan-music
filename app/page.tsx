"use client";

import React, { useState, useRef } from 'react';
import ScoreStudio from './components/ScoreStudio';
import ApiKeyModal from './components/ApiKeyModal';
import { Upload, Mic, Settings, Play, Square, Layers, Music, KeyRound } from 'lucide-react';
import useLocalStorageState from 'use-local-storage-state';

export default function Home() {
  const [format, setFormat] = useState('staff');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useLocalStorageState('ts_deepseek_key', { defaultValue: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAudioFile(e.target.files[0]);
  };

  return (
    <main className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-[#ccc]">
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} storedKey={apiKey} onSave={setApiKey} />

      {/* 1. 顶部菜单栏 (仿 DAW 菜单) */}
      <header className="h-8 bg-[#2d2d2d] border-b border-[#111] flex items-center px-4 justify-between select-none">
        <div className="flex items-center gap-6">
          <div className="font-bold text-gray-100 tracking-tight flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
            TIANSUAN <span className="text-blue-500 text-[10px] align-top">PRO</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span className="hover:text-white cursor-pointer">File</span>
            <span className="hover:text-white cursor-pointer">Edit</span>
            <span className="hover:text-white cursor-pointer">Project</span>
            <span className="hover:text-white cursor-pointer">Audio</span>
            <span className="text-blue-500 font-bold">AI Analysis</span>
          </div>
        </div>
        
        {/* API 状态指示灯 */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className={`flex items-center gap-2 text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${apiKey ? 'border-green-900 bg-green-900/20 text-green-500' : 'border-red-900 bg-red-900/20 text-red-500'}`}
        >
          <KeyRound size={10}/> {apiKey ? 'ENGINE: ONLINE' : 'ENGINE: OFFLINE'}
        </button>
      </header>

      {/* 2. 主工作区 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 左侧：轨道检查器 (Inspector) */}
        <aside className="w-64 bg-[#252525] border-r border-[#111] flex flex-col">
          <div className="p-2 bg-[#333] text-[11px] font-bold text-gray-300 border-b border-[#111] flex justify-between">
            <span>INSPECTOR</span>
            <Settings size={12}/>
          </div>
          
          <div className="p-4 space-y-6">
            {/* 输入源 */}
            <div>
               <h3 className="text-[10px] text-blue-400 font-bold mb-2 uppercase tracking-wider">Input Bus</h3>
               <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`h-20 border border-[#3f3f3f] bg-[#1a1a1a] rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors
                 ${audioFile ? 'border-l-4 border-l-blue-500' : ''}`}
               >
                 {audioFile ? (
                   <div className="text-center px-2">
                     <Music size={20} className="mx-auto mb-1 text-blue-500"/>
                     <div className="text-[10px] text-white truncate w-40">{audioFile.name}</div>
                     <div className="text-[9px] text-gray-500">44.1kHz • 16bit</div>
                   </div>
                 ) : (
                   <div className="text-center text-gray-500">
                     <Upload size={16} className="mx-auto mb-1"/>
                     <span className="text-[10px]">Import Audio</span>
                   </div>
                 )}
               </div>
            </div>

            {/* 格式选择 */}
            <div>
              <h3 className="text-[10px] text-blue-400 font-bold mb-2 uppercase tracking-wider">Quantize Target</h3>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setFormat('staff')}
                  className={`flex items-center px-3 py-1.5 rounded text-[11px] border border-transparent ${format === 'staff' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
                >
                  <Layers size={12} className="mr-2"/> Staff View
                </button>
                <button 
                  onClick={() => setFormat('jianpu')}
                  className={`flex items-center px-3 py-1.5 rounded text-[11px] border border-transparent ${format === 'jianpu' ? 'bg-purple-600 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
                >
                  <Square size={12} className="mr-2"/> Jianpu Grid
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* 右侧：编辑器 (Editor) */}
        <section className="flex-1 flex flex-col bg-[#1e1e1e] relative">
          <ScoreStudio format={format} audioFile={audioFile} apiKey={apiKey} />
        </section>
      </div>
      
      {/* 底部：走带控制器 (Transport Panel) - 纯装饰，增强沉浸感 */}
      <footer className="h-10 bg-[#2d2d2d] border-t border-[#111] flex items-center px-4 justify-center gap-8 shadow-2xl z-50">
         <div className="flex items-center gap-1">
            <Square size={14} fill="white" className="text-gray-400 hover:text-white cursor-pointer"/>
            <Play size={14} fill="white" className="text-gray-400 hover:text-white cursor-pointer ml-2"/>
            <div className="w-2 h-2 rounded-full bg-red-500 ml-4 animate-pulse"></div>
         </div>
         <div className="font-mono text-xl text-blue-500 tracking-widest font-bold">00:00:00:00</div>
         <div className="text-[10px] text-gray-500 flex gap-4">
            <span>4/4</span>
            <span>120.00</span>
            <span>Internal Sync</span>
         </div>
      </footer>
    </main>
  );
}
