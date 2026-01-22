"use client";

import React, { useState, useRef } from 'react';
import ScoreStudio from './components/ScoreStudio';
import { Upload, Mic, Cpu, Radio, Activity, Disc, Zap } from 'lucide-react';

export default function Home() {
  const [format, setFormat] = useState('staff');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  return (
    <main className="h-screen w-screen bg-black flex flex-col relative overflow-hidden">
      {/* 动态背景层 */}
      <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none z-0"></div>

      {/* 顶部 HUD 导航 */}
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 p-2 rounded-lg neon-border">
            <Cpu size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-widest uppercase text-white font-mono">TIANSUAN <span className="text-cyan-400">CORE</span></h1>
            <p className="text-[9px] text-gray-500 tracking-[0.3em] uppercase">Neural Transcription System v2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded border border-emerald-900/50">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            SYSTEM ONLINE
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden z-10">
        {/* 左侧控制塔 */}
        <aside className="w-80 bg-black/80 border-r border-white/10 flex flex-col p-6 gap-8 backdrop-blur-xl">
          
          {/* 输入模块 */}
          <div>
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Disc size={12} /> Audio Input
            </h2>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group relative h-32 border border-dashed rounded-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden
              ${audioFile ? 'border-cyan-500/50 bg-cyan-900/10' : 'border-white/20 hover:border-white/50 hover:bg-white/5'}`}
            >
              <div className={`p-3 rounded-full transition-all ${audioFile ? 'bg-cyan-500 text-black shadow-[0_0_15px_cyan]' : 'bg-white/10 text-gray-400 group-hover:bg-white group-hover:text-black'}`}>
                {audioFile ? <Activity size={24} /> : <Upload size={24} />}
              </div>
              <span className="text-xs font-mono text-gray-400 z-10 max-w-[80%] truncate text-center">
                {audioFile ? audioFile.name : 'UPLOAD AUDIO STREAM'}
              </span>
              {/* 扫描线动画 */}
              {audioFile && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_10px_cyan] animate-[scan_2s_linear_infinite]"></div>}
            </div>
          </div>

          {/* 模式选择 */}
          <div>
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={12} /> Decoding Mode
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setFormat('staff')}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border text-xs font-mono transition-all ${format === 'staff' ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.1)]' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
              >
                <span>STANDARD STAFF</span>
                {format === 'staff' && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>}
              </button>
              <button 
                onClick={() => setFormat('jianpu')}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border text-xs font-mono transition-all ${format === 'jianpu' ? 'border-purple-500 bg-purple-950/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
              >
                <span>CN JIANPU (NUMERIC)</span>
                {format === 'jianpu' && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>}
              </button>
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 pt-4">
             <div className="text-[10px] text-gray-600 font-mono leading-relaxed">
               <div>MEM: 4.2GB / 16GB</div>
               <div>GPU: DISCONNECTED</div>
               <div>LATENCY: 42ms</div>
             </div>
          </div>
        </aside>

        {/* 主视图 */}
        <section className="flex-1 bg-black/20 relative flex flex-col">
          <ScoreStudio format={format} audioFile={audioFile} />
        </section>
      </div>
    </main>
  );
}
