"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Pause, Download, Loader2, Wand2, FileMusic, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ScoreStudioProps {
  format?: string;
  audioFile?: File | null;
}

export default function ScoreStudio({ format = 'staff', audioFile }: ScoreStudioProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const jianpuRef = useRef<HTMLDivElement>(null); // 简谱容器引用
  const waveformRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const wavesurfer = useRef<any>(null);

  // 1. WaveSurfer 初始化 (保持不变)
  useEffect(() => {
    const initWaveSurfer = async () => {
      if (!waveformRef.current || !audioFile) return;
      const WaveSurfer = (await import('wavesurfer.js')).default;
      if (wavesurfer.current) wavesurfer.current.destroy();
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#d4d4d8', progressColor: '#18181b', cursorColor: '#ef4444',
        barWidth: 2, barGap: 3, height: 60, normalize: true,
      });
      wavesurfer.current.load(URL.createObjectURL(audioFile));
      wavesurfer.current.on('finish', () => setIsPlaying(false));
    };
    initWaveSurfer();
    return () => { if (wavesurfer.current) wavesurfer.current.destroy(); };
  }, [audioFile]);

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  // 2. OSMD 初始化
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current) {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true, backend: "svg", drawingParameters: "compacttight", darkMode: false
        });
      } catch (e) { console.error(e); }
    }
  }, []); // 只初始化一次

  // 3. 生成逻辑 (带切换动画)
  const startGeneration = async () => {
    setStatus('processing');
    setTimeout(async () => {
      // 只有在五线谱模式下才渲染 XML
      if (format === 'staff' && osmdRef.current) {
        // 清除旧内容
        osmdRef.current.clear(); 
        const sampleXML = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>AI Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="2"><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure></part></score-partwise>`;
        try { 
          await osmdRef.current.load(sampleXML); 
          osmdRef.current.render(); 
        } catch (e) { console.error(e); }
      }
      setStatus('ready');
    }, 1000); // 加快一点速度
  };

  // 监听格式变化，如果在 ready 状态下切换，自动重绘
  useEffect(() => {
    if (status === 'ready') {
      startGeneration();
    }
  }, [format]);

  // 4. 真实导出功能 (v1.3 新增)
  const handleExport = async () => {
    setIsExporting(true);
    // 决定截取哪个容器
    const targetRef = format === 'staff' ? sheetRef : jianpuRef;
    
    if (targetRef.current) {
      try {
        const canvas = await html2canvas(targetRef.current, { backgroundColor: '#ffffff', scale: 2 });
        const link = document.createElement('a');
        link.download = `TianSuan_Score_${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      } catch (err) {
        console.error("Export failed", err);
        alert("导出失败，请重试");
      }
    }
    setIsExporting(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部栏 */}
      <div className="h-16 px-8 flex items-center justify-between z-30 shrink-0 bg-white/50 backdrop-blur-sm border-b border-zinc-100/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            {status === 'idle' ? 'Ready to Create' : (audioFile ? audioFile.name : 'Composition #001')}
            {status === 'ready' && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-fade-in shadow-emerald-200 shadow-lg">Done</span>}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
             {status === 'processing' ? 'Thinking...' : 'DualMHR Engine v4.0 Connected'}
          </p>
        </div>
        <div className="flex gap-3">
           <button onClick={startGeneration} disabled={!audioFile || status === 'processing'} 
             className={`group flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-xl text-xs font-bold shadow-xl transition-all 
             ${!audioFile ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-black text-white hover:scale-105 hover:shadow-2xl'}`}>
             {status === 'processing' ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14} className={audioFile ? "group-hover:rotate-12 transition-transform" : ""} />}
             {status === 'processing' ? "AI 计算中..." : "启动逆向工程"}
           </button>
           
           {status === 'ready' && (
             <>
               <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-50 hover:border-black transition-colors shadow-sm">
                 {isExporting ? <Loader2 size={14} className="animate-spin"/> : <Download size={14} />}
                 {isExporting ? "处理中..." : "导出图片"}
               </button>
             </>
           )}
        </div>
      </div>

      {/* 波形播放器 */}
      <div className={`px-8 transition-all duration-500 overflow-hidden ${audioFile ? 'h-24 opacity-100 my-4' : 'h-0 opacity-0'}`}>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shrink-0">
            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
          </button>
          <div className="flex-1" ref={waveformRef}></div>
          <div className="text-[10px] font-mono text-zinc-400 shrink-0">
             {isPlaying ? <span className="text-red-500 animate-pulse">● LIVE</span> : 'PAUSED'}
          </div>
        </div>
      </div>

      {/* 画布区 */}
      <div className="flex-1 overflow-auto p-8 pt-0 flex justify-center bg-zinc-50/30">
        
        {/* 空闲状态 */}
        {status === 'idle' && !audioFile && (
           <div className="flex flex-col items-center justify-center text-zinc-300 mt-20 gap-6 animate-fade-in opacity-50">
             <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border border-zinc-200"><FileMusic size={40} className="text-zinc-200" /></div>
             <p className="text-sm font-medium">等待音频输入...</p>
           </div>
        )}

        {/* 加载状态 */}
        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center mt-32 animate-in fade-in duration-700">
             <div className="relative mb-8">
                <div className="absolute inset-0 bg-black blur-2xl opacity-10 rounded-full animate-pulse"></div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-zinc-100 relative z-10">
                   <Loader2 size={32} className="animate-spin text-black" />
                </div>
             </div>
             <p className="text-xs text-zinc-500 font-mono tracking-wide uppercase">正在解析声波结构...</p>
             <div className="w-48 h-1 bg-zinc-200 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-black animate-[loading_1.5s_ease-in-out_infinite] w-1/3"></div>
             </div>
          </div>
        )}

        {/* 结果：五线谱 */}
        <div 
          ref={sheetRef} 
          className={`bg-white shadow-2xl rounded-xl p-10 w-full max-w-5xl min-h-[600px] transition-all duration-500 origin-bottom
            ${status === 'ready' && format === 'staff' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 hidden'}`}
        />
        
        {/* 结果：简谱 (可导出) */}
        {status === 'ready' && format === 'jianpu' && (
          <div ref={jianpuRef} className="bg-white shadow-2xl rounded-xl p-16 w-full max-w-5xl min-h-[600px] animate-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
            <h2 className="text-2xl font-serif font-bold mb-2 text-zinc-900">{audioFile ? audioFile.name.replace(/\.[^/.]+$/, "") : "Untitled Score"}</h2>
            <p className="text-sm text-zinc-500 mb-12 font-serif border-b border-zinc-100 pb-4 px-8">1=C 4/4 | Tempo: 120 | Transcribed by TianSuan AI</p>
            
            <div className="flex flex-wrap gap-12 text-3xl font-serif leading-loose w-full max-w-3xl justify-center selection:bg-yellow-100">
              {/* 模拟数据 (Demo) */}
              <div className="flex gap-6 border-b border-zinc-100 pb-2 hover:bg-zinc-50 transition-colors p-2 rounded cursor-pointer group">
                <span className="jianpu-note group-hover:text-blue-600 transition-colors">3</span>
                <span className="jianpu-note group-hover:text-blue-600 transition-colors">3</span>
                <span className="jianpu-note group-hover:text-blue-600 transition-colors">4</span>
                <span className="jianpu-note group-hover:text-blue-600 transition-colors">5</span>
                <span className="ml-4 text-zinc-300">|</span>
              </div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2 hover:bg-zinc-50 transition-colors p-2 rounded cursor-pointer">
                <span className="jianpu-note">5</span>
                <span className="jianpu-note">4</span>
                <span className="jianpu-note">3</span>
                <span className="jianpu-note">2</span>
                <span className="ml-4 text-zinc-300">|</span>
              </div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2 hover:bg-zinc-50 transition-colors p-2 rounded cursor-pointer">
                <span className="jianpu-note">1</span>
                <span className="jianpu-note">1</span>
                <span className="jianpu-note">2</span>
                <span className="jianpu-note">3</span>
                <span className="ml-4 text-zinc-300">|</span>
              </div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2 hover:bg-zinc-50 transition-colors p-2 rounded cursor-pointer">
                 <span className="jianpu-note">3<span className="text-xs absolute -right-2 top-2">.</span></span>
                 <span className="jianpu-note">2<span className="jianpu-underline"></span></span>
                 <span className="jianpu-note">2<span className="jianpu-dash ml-2">- -</span></span>
                 <span className="ml-4 text-zinc-300">||</span>
              </div>
            </div>
            
            <div className="mt-auto pt-10 flex gap-2 text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
               <span>Generated at {new Date().toLocaleTimeString()}</span>
               <span>•</span>
               <span>Natural Algorithm Lab</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
