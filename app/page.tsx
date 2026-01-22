"use client";

import React, { useState, useRef } from 'react';
import ScoreStudio from './components/ScoreStudio';
import ApiKeyModal from './components/ApiKeyModal';
import { Upload, Cpu, Disc, Zap, KeyRound } from 'lucide-react';
import useLocalStorageState from 'use-local-storage-state';

export default function Home() {
  const [format, setFormat] = useState('staff');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useLocalStorageState('ts_deepseek_key', { defaultValue: '' }); // 存储 Key 变更为 deepseek
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAudioFile(e.target.files[0]);
  };

  return (
    <main className="h-screen w-screen bg-black flex flex-col relative overflow-hidden font-sans">
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} storedKey={apiKey} onSave={setApiKey} />

      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-950 text-blue-400 border border-blue-800 p-2 rounded-lg"><Cpu size={20} /></div>
          <div>
            <h1 className="font-bold text-lg tracking-widest uppercase text-white font-mono">TIANSUAN <span className="text-blue-500">DEEPSEEK</span></h1>
            <p className="text-[9px] text-gray-500 tracking-[0.3em] uppercase">V3.1 INDUSTRIAL AGENT</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSettingsOpen(true)} className={`flex items-center gap-2 text-xs font-mono px-4 py-1.5 rounded border transition-all ${apiKey ? 'border-emerald-900 bg-emerald-950/30 text-emerald-400' : 'border-red-900 bg-red-950/30 text-red-400 animate-pulse'}`}>
            <KeyRound size={12}/> {apiKey ? 'DEEPSEEK V3 READY' : 'NO API KEY'}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden z-10">
        <aside className="w-80 bg-black border-r border-white/10 flex flex-col p-6 gap-8">
          <div>
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Disc size={12} /> Source Material</h2>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />
            <div onClick={() => fileInputRef.current?.click()} className={`group relative h-24 border border-dashed rounded-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 ${audioFile ? 'border-blue-500/50 bg-blue-900/10' : 'border-white/20 hover:border-white/50'}`}>
              <div className={`p-2 rounded-full transition-all ${audioFile ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                {audioFile ? <Disc size={18} className="animate-spin-slow"/> : <Upload size={18} />}
              </div>
              <span className="text-xs font-mono text-gray-400 truncate max-w-[80%]">{audioFile ? audioFile.name : 'LOAD AUDIO FILE'}</span>
            </div>
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={12} /> Target Format</h2>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => setFormat('staff')} className={`px-4 py-3 rounded-lg border text-xs font-mono text-left uppercase transition-all ${format === 'staff' ? 'border-blue-500 bg-blue-950/30 text-blue-400' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>Orchestral Score</button>
              <button onClick={() => setFormat('jianpu')} className={`px-4 py-3 rounded-lg border text-xs font-mono text-left uppercase transition-all ${format === 'jianpu' ? 'border-purple-500 bg-purple-950/30 text-purple-400' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>Numeric Notation</button>
            </div>
          </div>
          <div className="mt-auto border-t border-white/10 pt-4 text-[10px] text-gray-600 font-mono">Model: deepseek-chat<br/>Latency: ~120ms</div>
        </aside>
        <section className="flex-1 bg-zinc-950 relative flex flex-col"><ScoreStudio format={format} audioFile={audioFile} apiKey={apiKey} /></section>
      </div>
    </main>
  );
}
