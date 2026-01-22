"use client";

import React, { useState, useRef } from 'react';
import ScoreStudio from './components/ScoreStudio';
import { Upload, Mic, Cpu, Globe, Settings2, Sparkles, Music } from 'lucide-react';

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
    <main className="h-screen bg-white flex flex-col font-sans overflow-hidden selection:bg-zinc-900 selection:text-white">
      {/* 顶部导航 */}
      <nav className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-950 text-white p-1.5 rounded-lg shadow-lg shadow-zinc-200">
            <Cpu size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base tracking-tight text-zinc-900">天算AI · 核心引擎</span>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium ml-1 border border-blue-100">v1.2.0 Audio</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-zinc-50 transition cursor-pointer">
            <Globe size={14} /> 实验室接入中
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧控制台 */}
        <aside className="w-72 bg-zinc-50/50 border-r border-zinc-100 flex flex-col p-4 gap-6 z-40 backdrop-blur-sm">
          
          {/* 输入区 (Plan B 核心升级) */}
          <div>
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">Input Source</h2>
            <div className="space-y-3">
              {/* 隐藏的文件输入框 */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="audio/*" 
                className="hidden" 
              />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative overflow-hidden p-5 border border-dashed rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${audioFile ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-zinc-300 hover:border-zinc-900'}`}
              >
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`p-2 rounded-full transition-colors duration-300 ${audioFile ? 'bg-white/20 text-white' : 'bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white'}`}>
                    {audioFile ? <Music size={18} /> : <Upload size={18} />}
                  </div>
                  <span className={`text-xs font-semibold ${audioFile ? 'text-white' : 'text-zinc-700'}`}>
                    {audioFile ? audioFile.name.substring(0, 20) + '...' : '点击上传音频文件'}
                  </span>
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-600 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-50 transition shadow-sm">
                <Mic size={14} /> 实时拾音模式
              </button>
            </div>
          </div>

          {/* 参数设置区 */}
          <div>
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">Configuration</h2>
            <div className="space-y-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Settings2 size={12} /> 显示格式
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100/80 rounded-lg">
                  <button onClick={() => setFormat('staff')} className={`text-[11px] font-medium py-1.5 rounded-md transition-all ${format === 'staff' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>五线谱</button>
                  <button onClick={() => setFormat('jianpu')} className={`text-[11px] font-medium py-1.5 rounded-md transition-all ${format === 'jianpu' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>中国简谱</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-zinc-200">
             <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-lg text-white shadow-lg">
                <Sparkles size={12} className="text-yellow-400" />
                <div>
                  <p className="text-[10px] font-bold">天算模型 v4.0</p>
                  <p className="text-[9px] text-zinc-400">Natural Algorithm Lab</p>
                </div>
             </div>
          </div>
        </aside>

        {/* 右侧工作区 (传递文件) */}
        <section className="flex-1 bg-zinc-50 relative overflow-hidden flex flex-col">
          <ScoreStudio format={format} audioFile={audioFile} />
        </section>
      </div>
    </main>
  );
}
