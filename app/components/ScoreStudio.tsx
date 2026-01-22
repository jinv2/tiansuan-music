"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Pause, Download, Cpu, Terminal, Share2, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ScoreStudioProps {
  format?: string;
  audioFile?: File | null;
}

export default function ScoreStudio({ format = 'staff', audioFile }: ScoreStudioProps) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'rendering' | 'ready'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]); // 模拟终端日志
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const jianpuRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const wavesurfer = useRef<any>(null);

  // 模拟终端日志生成
  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  // 1. 初始化 WaveSurfer (霓虹配色)
  useEffect(() => {
    const initWaveSurfer = async () => {
      if (!waveformRef.current || !audioFile) return;
      const WaveSurfer = (await import('wavesurfer.js')).default;
      if (wavesurfer.current) wavesurfer.current.destroy();
      
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#3f3f46', // gray-700
        progressColor: '#22d3ee', // cyan-400
        cursorColor: '#ffffff',
        barWidth: 2, barGap: 2, height: 40, normalize: true,
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

  // 2. 初始化 OSMD (暗黑模式配置 - 解决五线谱看不见的问题)
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current) {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true, 
          backend: "svg", 
          drawingParameters: "compacttight", 
          darkMode: true, // 【关键】开启暗黑模式
        });
        // 强制设置颜色，防止透明不可见
        osmdRef.current.setOptions({
          backgroundColor: "#000000",
          defaultColorMusic: "#FFFFFF", // 白音符
          defaultColorLabel: "#FFFFFF",
        });
      } catch (e) { console.error(e); }
    }
  }, []);

  // 3. AI 生成流程 (模拟真实感)
  const startGeneration = async () => {
    if (!audioFile) return;
    setStatus('analyzing');
    setLogs(['Initializing Neural Network...']);
    
    // 模拟耗时分析
    setTimeout(() => addLog('Extracting Mel-spectrogram...'), 800);
    setTimeout(() => addLog('Separating Vocal/Instrumental stems...'), 1600);
    setTimeout(() => addLog('Identifying Pitch Contours (DualMHR)...'), 2400);
    
    setTimeout(async () => {
      setStatus('rendering');
      addLog('Quantizing MIDI data...');
      
      // 渲染五线谱
      if (format === 'staff' && osmdRef.current) {
        osmdRef.current.clear();
        // 这是一个稍微复杂点的 Demo XML，看起来更像真实乐谱
        const complexXML = \`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>AI Lead</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>A</step><octave>4</octave></pitch><duration>2</duration><type>eighth</type></note><note><pitch><step>C</step><octave>5</octave></pitch><duration>2</duration><type>eighth</type></note><note><pitch><step>E</step><octave>5</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>A</step><octave>4</octave></pitch><duration>8</duration><type>half</type></note></measure><measure number="2"><note><pitch><step>B</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>5</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>G</step><octave>5</octave></pitch><duration>8</duration><type>half</type></note></measure></part></score-partwise>\`;
        try { 
          await osmdRef.current.load(complexXML); 
          osmdRef.current.render(); 
        } catch (e) { console.error(e); }
      }
      setStatus('ready');
      addLog('Rendering Complete.');
    }, 3200);
  };

  // 4. 导出图片 (黑色背景处理)
  const handleExport = async () => {
    const targetRef = format === 'staff' ? sheetRef : jianpuRef;
    if (targetRef.current) {
      try {
        const canvas = await html2canvas(targetRef.current, { 
          backgroundColor: '#000000', // 导出黑色背景
          scale: 2 
        });
        const link = document.createElement('a');
        link.download = \`TianSuan_\${audioFile?.name || 'Score'}.jpg\`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      } catch (err) { alert("Export failed"); }
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6">
      {/* 顶部状态栏 + 波形 */}
      <div className="h-32 w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group">
        {/* 顶部信息 */}
        <div className="flex justify-between items-start z-10">
           <div>
             <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
               {status === 'ready' ? <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_lime]"/> : <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"/>}
               {audioFile ? audioFile.name : 'NO INPUT SIGNAL'}
             </h2>
             <p className="text-[10px] text-gray-500 font-mono mt-1">FREQ: 44.1kHz / BITRATE: 320kbps</p>
           </div>
           
           <div className="flex gap-3">
             <button onClick={startGeneration} disabled={!audioFile || status === 'analyzing'} 
               className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
               {status === 'analyzing' ? <Cpu className="animate-spin" size={14}/> : <Terminal size={14}/>}
               {status === 'analyzing' ? "PROCESSING" : "EXECUTE"}
             </button>
             {status === 'ready' && (
               <button onClick={handleExport} className="border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                 <Download size={14}/> JPG
               </button>
             )}
           </div>
        </div>

        {/* 波形容器 */}
        <div className="relative z-10 mt-2 flex items-center gap-4">
           <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-black text-white flex items-center justify-center transition-all">
             {isPlaying ? <Pause size={12}/> : <Play size={12}/>}
           </button>
           <div className="flex-1" ref={waveformRef}></div>
        </div>
        
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-cyan-900/20 to-transparent pointer-events-none"></div>
      </div>

      {/* 乐谱展示区 (核心区域) */}
      <div className="flex-1 relative bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        {/* 顶部条 */}
        <div className="h-8 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
           <span className="text-[10px] text-gray-500 font-mono">VIEWPORT: {format.toUpperCase()}</span>
           <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
           </div>
        </div>

        {/* 终端日志浮窗 */}
        {status === 'analyzing' && (
           <div className="absolute top-12 right-6 w-64 bg-black/90 border border-green-900/50 text-green-500 font-mono text-[10px] p-4 rounded-lg z-50 shadow-2xl backdrop-blur">
             {logs.map((log, i) => (
               <div key={i} className="mb-1 opacity-80">{log}</div>
             ))}
             <div className="animate-pulse">_</div>
           </div>
        )}

        {/* 内容容器 */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          
          {/* 空闲提示 */}
          {status === 'idle' && (
            <div className="text-center opacity-30">
              <Cpu size={64} className="mx-auto mb-4 text-cyan-500"/>
              <p className="text-xs font-mono tracking-widest text-cyan-300">WAITING FOR COMMAND...</p>
            </div>
          )}

          {/* 五线谱容器 (黑色背景，白色音符) */}
          <div 
            ref={sheetRef} 
            className={`w-full max-w-4xl min-h-[400px] transition-opacity duration-500 
            ${status === 'ready' && format === 'staff' ? 'opacity-100' : 'opacity-0 hidden'}`}
          />

          {/* 简谱容器 (黑色背景，白色文字) */}
          {status === 'ready' && format === 'jianpu' && (
            <div ref={jianpuRef} className="w-full max-w-4xl p-10 bg-black text-white font-mono animate-in fade-in zoom-in-95 duration-500 border border-white/5 rounded-xl">
               <div className="flex justify-between border-b border-gray-800 pb-4 mb-8">
                 <h2 className="text-xl font-bold text-cyan-400">{audioFile?.name}</h2>
                 <span className="text-xs text-gray-500 py-1">AI CONFIDENCE: 98.4%</span>
               </div>
               
               <div className="grid grid-cols-1 gap-8 text-2xl tracking-widest">
                 {/* 模拟的复杂简谱数据 */}
                 <div className="flex gap-8 items-center text-gray-300 hover:text-white transition-colors">
                   <span className="text-xs text-gray-600 w-8">01</span>
                   <span className="jianpu-note">6<span className="jianpu-underline"></span></span>
                   <span className="jianpu-note">1<span className="jianpu-dot-top"></span></span>
                   <span className="jianpu-note">3<span className="jianpu-dot-top"></span></span>
                   <span className="jianpu-note">6<span className="text-xs absolute -right-3 top-0">.</span></span>
                   <span className="ml-auto text-gray-700">|</span>
                 </div>
                 <div className="flex gap-8 items-center text-gray-300 hover:text-white transition-colors">
                   <span className="text-xs text-gray-600 w-8">02</span>
                   <span className="jianpu-note">5<span className="jianpu-dot-top"></span></span>
                   <span className="jianpu-note">3<span className="jianpu-dot-top"></span></span>
                   <span className="jianpu-note">2<span className="jianpu-dot-top"></span><span className="jianpu-underline"></span></span>
                   <span className="jianpu-note">3<span className="jianpu-dot-top"></span></span>
                   <span className="ml-auto text-gray-700">|</span>
                 </div>
               </div>

               <div className="mt-12 p-4 border border-yellow-900/50 bg-yellow-900/10 rounded flex gap-3 items-start">
                 <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5"/>
                 <p className="text-[10px] text-yellow-500/80 leading-relaxed">
                   DEMO MODE LIMITATION: 
                   Real-time audio-to-midi conversion requires backend Python inference (DualMHR Model). 
                   This preview shows generated structural data. Please connect local server for full transcription.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
