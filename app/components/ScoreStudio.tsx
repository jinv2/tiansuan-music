"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Download, Loader2, Music, Wand2, FileMusic } from 'lucide-react';

interface ScoreStudioProps {
  format?: string;
}

export default function ScoreStudio({ format = 'staff' }: ScoreStudioProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const sheetRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  // 初始化五线谱引擎
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current && format === 'staff') {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true,
          backend: "svg",
          drawingParameters: "compacttight",
          darkMode: false, 
        });
      } catch (e) { console.error(e); }
    }
  }, [format]);

  // AI 生成逻辑
  const startGeneration = async () => {
    setStatus('processing');
    
    setTimeout(async () => {
      if (format === 'staff' && osmdRef.current) {
        // 修复点：这里是纯净的字符串，没有反斜杠
        const sampleXML = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>AI Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="2"><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure></part></score-partwise>`;
        
        try {
          await osmdRef.current.load(sampleXML);
          osmdRef.current.render();
        } catch (e) { console.error(e); }
      }
      setStatus('ready');
    }, 1500);
  };

  useEffect(() => {
    if (status === 'ready') {
      startGeneration();
    }
  }, [format]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部状态栏 */}
      <div className="h-16 px-8 flex items-center justify-between z-30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            {status === 'idle' ? 'Ready to Create' : 'Composition #001'}
            {status === 'ready' && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-fade-in">Generated</span>}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">DualMHR Audio Engine / 44.1kHz / Stereo</p>
        </div>
        
        <div className="flex gap-3">
           {status === 'idle' ? (
             <button 
              onClick={startGeneration}
              className="group flex items-center gap-2 bg-zinc-900 text-white pl-4 pr-5 py-2.5 rounded-xl text-xs font-bold shadow-xl shadow-zinc-200 hover:scale-105 hover:bg-black transition-all">
               <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
               启动 AI 逆向工程
             </button>
           ) : (
             <>
               <button className="flex items-center gap-2 border border-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white hover:border-zinc-300 text-zinc-600 transition" disabled={status !== 'ready'}>
                 <Play size={14} /> 试听
               </button>
               <button className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-black shadow-lg hover:shadow-xl transition" disabled={status !== 'ready'}>
                 <Download size={14} /> 导出 {format === 'staff' ? 'PDF' : 'JPG'}
               </button>
             </>
           )}
        </div>
      </div>

      {/* 核心画布区 */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        
        {/* 状态：空闲 */}
        {status === 'idle' && (
           <div className="flex flex-col items-center justify-center text-zinc-300 mt-32 gap-6 animate-fade-in">
             <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
               <FileMusic size={40} className="text-zinc-200" />
             </div>
             <p className="text-sm font-medium">请点击右上角启动生成</p>
           </div>
        )}
        
        {/* 状态：处理中 */}
        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center mt-40">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <Loader2 size={40} className="animate-spin text-zinc-900 relative z-10" />
            </div>
            <p className="text-xs mt-6 text-zinc-500 font-mono tracking-wide">AI IS LISTENING...</p>
          </div>
        )}

        {/* 状态：完成 - 五线谱模式 */}
        <div 
          ref={sheetRef} 
          className={`bg-white shadow-2xl rounded-xl p-10 w-full max-w-5xl min-h-[600px] transition-all duration-700 
            ${status === 'ready' && format === 'staff' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}
        />

        {/* 状态：完成 - 简谱模式 (Plan A 核心实现) */}
        {status === 'ready' && format === 'jianpu' && (
          <div className="bg-white shadow-2xl rounded-xl p-16 w-full max-w-5xl min-h-[600px] animate-fade-in flex flex-col items-center">
            <h2 className="text-xl font-serif font-bold mb-2">欢乐颂 (Ode to Joy)</h2>
            <p className="text-sm text-zinc-500 mb-12 font-serif">1=C 4/4 AI Transcription</p>
            
            <div className="flex flex-wrap gap-12 text-3xl font-serif leading-loose w-full max-w-3xl justify-center">
              <div className="flex gap-6 border-b border-zinc-100 pb-2">
                <span className="jianpu-note">3</span>
                <span className="jianpu-note">3</span>
                <span className="jianpu-note">4</span>
                <span className="jianpu-note">5</span>
                <span className="ml-4 text-zinc-300">|</span>
              </div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2">
                <span className="jianpu-note">5</span>
                <span className="jianpu-note">4</span>
                <span className="jianpu-note">3</span>
                <span className="jianpu-note">2</span>
                <span className="ml-4 text-zinc-300">|</span>
              </div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2">
                <span className="jianpu-note">1</span>
                <span className="jianpu-note">1</span>
                <span className="jianpu-note">2</span>
                <span className="jianpu-note">3</span>
                <span className="ml-4 text-zinc-300">|</span>
              </div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2">
                 <span className="jianpu-note">3<span className="text-xs absolute -right-2 top-2">.</span></span>
                 <span className="jianpu-note">2<span className="jianpu-underline"></span></span>
                 <span className="jianpu-note">2<span className="jianpu-dash ml-2">- -</span></span>
                 <span className="ml-4 text-zinc-300">||</span>
              </div>
            </div>

            <div className="mt-20 p-4 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100 max-w-md text-center">
              💡 提示：这是天算AI生成的“简谱预览”。在完整版中，您可以编辑任意音符，AI会自动同步修改五线谱。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
