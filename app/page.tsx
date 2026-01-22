"use client";

import React, { useState } from 'react';
import ScoreStudio from './components/ScoreStudio';
import { Music, Upload, Command, Cpu, Mic } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 顶部导航 - 天算实验室风格 */}
      <nav className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-md">
            <Cpu size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">天算AI · 全能扒带引擎</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-2">v1.0.0 Alpha</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <span className="hover:text-black cursor-pointer">文档</span>
          <span className="hover:text-black cursor-pointer">实验室</span>
          <a href="https://github.com/jinv2" target="_blank" className="hover:text-black cursor-pointer">GitHub</a>
        </div>
      </nav>

      {/* 核心工作区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：控制面板 */}
        <aside className="w-80 bg-white border-r flex flex-col p-6 gap-6 z-40 shadow-sm overflow-y-auto">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">操作台</h2>
            <div className="space-y-3">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-black hover:bg-slate-50 transition cursor-pointer group text-center">
                <Upload className="mx-auto text-slate-400 group-hover:text-black mb-2" />
                <p className="text-sm text-slate-600 font-medium">上传音频文件</p>
                <p className="text-xs text-slate-400 mt-1">支持 MP3, WAV (Max 50MB)</p>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg transition font-medium">
                <Mic size={18} />
                实时哼唱输入
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">参数设置</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">目标乐器</label>
                <select className="w-full p-2 border rounded-md text-sm bg-slate-50">
                  <option>钢琴 (Piano)</option>
                  <option>吉他 (Guitar)</option>
                  <option>人声 (Vocal)</option>
                  <option>全管弦乐总谱 (Full Score)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">输出格式</label>
                <select className="w-full p-2 border rounded-md text-sm bg-slate-50">
                  <option>五线谱 (Standard)</option>
                  <option>中国简谱 (Jianpu)</option>
                  <option>MIDI 文件</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">AI 精度模型</label>
                <div className="flex items-center gap-2 p-2 bg-slate-100 rounded text-xs text-slate-600">
                  <Command size={14} />
                  <span>Basic Pitch + GPT-4o Correction</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t text-xs text-slate-400">
            &copy; 2026 Natural Algorithm AI R&D Lab.
          </div>
        </aside>

        {/* 右侧：乐谱渲染区 */}
        <section className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
          <ScoreStudio />
        </section>
      </div>
    </main>
  );
}
