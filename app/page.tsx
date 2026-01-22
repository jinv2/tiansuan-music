"use client";

import React, { useState } from 'react';
import ScoreStudio from './components/ScoreStudio';
import { Upload, Mic, Command, Cpu, Globe, Settings2, Sparkles } from 'lucide-react';

export default function Home() {
  const [format, setFormat] = useState('staff'); // staff = 五线谱, jianpu = 简谱

  return (
    <main className="h-screen bg-white flex flex-col font-sans overflow-hidden selection:bg-zinc-900 selection:text-white">
      {/* 顶部导航 - 极简透明风 */}
      <nav className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-950 text-white p-1.5 rounded-lg shadow-lg shadow-zinc-200">
            <Cpu size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base tracking-tight text-zinc-900">天算AI · 核心引擎</span>
          <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium ml-1 border border-zinc-200">v1.1.0 Pro</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-zinc-50 transition cursor-pointer">
            <Globe size={14} /> 实验室接入中
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧控制台 - 悬浮卡片风格 */}
        <aside className="w-72 bg-zinc-50/50 border-r border-zinc-100 flex flex-col p-4 gap-6 z-40 backdrop-blur-sm">
          
          {/* 输入区 */}
          <div>
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">Input Source</h2>
            <div className="space-y-3">
              <div className="group relative overflow-hidden p-5 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-900 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="p-2 bg-zinc-50 rounded-full group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs font-semibold text-zinc-700">Drop Audio Here</span>
                </div>
                {/* 动效背景 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-600 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-50 transition shadow-sm">
                <Mic size={14} /> 实时拾音模式
              </button>
            </div>
          </div>

          {/* 参数设置区 - 核心交互点 */}
          <div>
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">Configuration</h2>
            <div className="space-y-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              
              {/* 乐谱格式选择器 (核心功能 A) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Settings2 size={12} /> 显示格式
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100/80 rounded-lg">
                  <button 
                    onClick={() => setFormat('staff')}
                    className={`text-[11px] font-medium py-1.5 rounded-md transition-all ${format === 'staff' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    五线谱
                  </button>
                  <button 
                    onClick={() => setFormat('jianpu')}
                    className={`text-[11px] font-medium py-1.5 rounded-md transition-all ${format === 'jianpu' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    中国简谱
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">目标声部</label>
                <select className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-black/5 appearance-none">
                  <option>主旋律 (Melody)</option>
                  <option>钢琴伴奏 (Piano)</option>
                </select>
              </div>

            </div>
          </div>
          
          {/* 底部版权 */}
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

        {/* 右侧工作区 */}
        <section className="flex-1 bg-zinc-50 relative overflow-hidden flex flex-col">
          <ScoreStudio format={format} />
        </section>
      </div>
    </main>
  );
}
