"use client";

import React, { useState, useRef, useEffect } from 'react';
import ScoreStudio from './components/ScoreStudio';
import ApiKeyModal from './components/ApiKeyModal';
import { Upload, Settings, Play, Square, Layers, Music, KeyRound } from 'lucide-react';
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
    <main className="flex flex-col h-screen w-full bg-[#1e1e1e] text-[#ccc] overflow-hidden">
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} storedKey={apiKey} onSave={setApiKey} />

      {/* Header */}
      <header className="h-10 bg-[#2d2d2d] border-b border-[#333] flex items-center px-4 justify-between shrink-0 select-none">
        <div className="flex items-center gap-6">
          <div className="font-bold text-gray-100 flex items-center gap-2">
            <div className="w-3 h-3 bg-[#007fd4]"></div> TIANSUAN <span className="text-[#007fd4] text-[10px]">DAW</span>
          </div>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className={`flex items-center gap-2 text-[10px] font-mono px-3 py-1 rounded transition-colors ${apiKey ? 'bg-[#1e1e1e] text-green-500 border border-green-900' : 'bg-red-900/20 text-red-500 border border-red-900'}`}
        >
          <KeyRound size={12}/> {apiKey ? 'LINKED' : 'NO KEY'}
        </button>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <aside className="w-64 bg-[#252526] border-r border-[#333] flex flex-col shrink-0">
          <div className="p-2 bg-[#2d2d2d] text-[11px] font-bold text-gray-400 border-b border-[#333]">INSPECTOR</div>
          <div className="p-4 space-y-6">
             <div>
               <h3 className="text-[10px] text-[#007fd4] font-bold mb-2 uppercase">Audio Input</h3>
               <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`h-24 border border-[#3e3e42] bg-[#1e1e1e] rounded flex flex-col items-center justify-center cursor-pointer hover:border-[#007fd4] transition-colors ${audioFile ? 'border-l-4 border-l-[#007fd4]' : ''}`}
               >
                 {audioFile ? (
                   <div className="text-center w-full px-2">
                     <Music size={24} className="mx-auto mb-2 text-[#007fd4]"/>
                     <div className="text-[10px] text-white truncate w-full">{audioFile.name}</div>
                   </div>
                 ) : (
                   <div className="text-center text-gray-500">
                     <Upload size={20} className="mx-auto mb-2"/>
                     <span className="text-[10px]">Import Media...</span>
                   </div>
                 )}
               </div>
             </div>

             <div>
               <h3 className="text-[10px] text-[#007fd4] font-bold mb-2 uppercase">View Mode</h3>
               <div className="flex flex-col gap-1">
                 <button onClick={() => setFormat('staff')} className={`flex items-center px-3 py-2 rounded text-[11px] ${format === 'staff' ? 'bg-[#37373d] text-white border-l-2 border-[#007fd4]' : 'text-gray-400 hover:text-white'}`}>
                   <Layers size={14} className="mr-2"/> Score Editor
                 </button>
                 <button onClick={() => setFormat('jianpu')} className={`flex items-center px-3 py-2 rounded text-[11px] ${format === 'jianpu' ? 'bg-[#37373d] text-white border-l-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}>
                   <Square size={14} className="mr-2"/> Jianpu Grid
                 </button>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Editor */}
        <section className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex flex-col">
          <ScoreStudio format={format} audioFile={audioFile} apiKey={apiKey} />
        </section>
      </div>

      {/* Footer */}
      <footer className="h-8 bg-[#007fd4] flex items-center justify-between px-4 text-[10px] text-white font-bold shrink-0">
        <div>READY</div>
        <div className="font-mono">44.1 kHz | 16 bit</div>
      </footer>
    </main>
  );
}
