"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Pause, Download, Loader2, Wand2, FileMusic, Waves } from 'lucide-react';

interface ScoreStudioProps {
  format?: string;
  audioFile?: File | null;
}

export default function ScoreStudio({ format = 'staff', audioFile }: ScoreStudioProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const wavesurfer = useRef<any>(null);

  // 1. 初始化 WaveSurfer (Plan B 核心)
  useEffect(() => {
    // 动态导入 wavesurfer 以避免 SSR 错误
    const initWaveSurfer = async () => {
      if (!waveformRef.current || !audioFile) return;

      const WaveSurfer = (await import('wavesurfer.js')).default;
      
      // 销毁旧实例
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      // 创建新实例
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#d4d4d8', // zinc-300
        progressColor: '#18181b', // zinc-900
        cursorColor: '#ef4444',
        barWidth: 2,
        barGap: 3,
        height: 60,
        normalize: true,
      });

      // 加载文件
      const url = URL.createObjectURL(audioFile);
      wavesurfer.current.load(url);
      
      wavesurfer.current.on('finish', () => setIsPlaying(false));
    };

    initWaveSurfer();

    return () => {
      if (wavesurfer.current) wavesurfer.current.destroy();
    };
  }, [audioFile]);

  // 2. 播放控制
  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  // 3. 乐谱渲染 (保持不变)
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current && format === 'staff') {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true, backend: "svg", drawingParameters: "compacttight", darkMode: false
        });
      } catch (e) { console.error(e); }
    }
  }, [format]);

  const startGeneration = async () => {
    setStatus('processing');
    setTimeout(async () => {
      if (format === 'staff' && osmdRef.current) {
        const sampleXML = \`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>AI Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="2"><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure></part></score-partwise>\`;
        try { await osmdRef.current.load(sampleXML); osmdRef.current.render(); } catch (e) { console.error(e); }
      }
      setStatus('ready');
    }, 1500);
  };
  
  // 格式切换重新渲染
  useEffect(() => { if (status === 'ready') startGeneration(); }, [format]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部栏 */}
      <div className="h-16 px-8 flex items-center justify-between z-30 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            {status === 'idle' ? 'Ready to Create' : 'Analysis Complete'}
            {status === 'ready' && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-fade-in">Generated</span>}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">DualMHR Audio Engine / 44.1kHz / Stereo</p>
        </div>
        <div className="flex gap-3">
           <button onClick={startGeneration} disabled={!audioFile} className={`group flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-xl text-xs font-bold shadow-xl transition-all ${!audioFile ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 text-white hover:scale-105 hover:bg-black shadow-zinc-200'}`}>
             <Wand2 size={14} className={audioFile ? "group-hover:rotate-12 transition-transform" : ""} />
             {audioFile ? "启动 AI 逆向工程" : "请先上传音频"}
           </button>
           {status === 'ready' && (
               <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-50 shadow-sm transition">
                 <Download size={14} /> 导出
               </button>
           )}
        </div>
      </div>

      {/* 波形播放器 (Plan B 新增区域) */}
      <div className={`px-8 transition-all duration-500 overflow-hidden ${audioFile ? 'h-24 opacity-100 mb-4' : 'h-0 opacity-0'}`}>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-4 shadow-sm">
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-black transition shrink-0">
            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
          </button>
          <div className="flex-1" ref={waveformRef}></div>
          <div className="text-[10px] font-mono text-zinc-400 shrink-0">00:00 / 03:45</div>
        </div>
      </div>

      {/* 画布区 */}
      <div className="flex-1 overflow-auto p-8 pt-0 flex justify-center">
        {status === 'idle' && !audioFile && (
           <div className="flex flex-col items-center justify-center text-zinc-300 mt-20 gap-6 animate-fade-in">
             <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100"><FileMusic size={40} className="text-zinc-200" /></div>
             <p className="text-sm font-medium">请从左侧上传音频文件</p>
           </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center mt-32">
             <Loader2 size={40} className="animate-spin text-zinc-900 mb-6" />
             <p className="text-xs text-zinc-500 font-mono tracking-wide">ANALYZING FREQUENCIES...</p>
          </div>
        )}

        <div ref={sheetRef} className={`bg-white shadow-2xl rounded-xl p-10 w-full max-w-5xl min-h-[600px] transition-all duration-700 ${status === 'ready' && format === 'staff' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`} />
        
        {status === 'ready' && format === 'jianpu' && (
          <div className="bg-white shadow-2xl rounded-xl p-16 w-full max-w-5xl min-h-[600px] animate-fade-in flex flex-col items-center">
            <h2 className="text-xl font-serif font-bold mb-2">AI Transcription Result</h2>
            <p className="text-sm text-zinc-500 mb-12 font-serif">1=C 4/4 Detected</p>
            <div className="flex flex-wrap gap-12 text-3xl font-serif leading-loose w-full max-w-3xl justify-center">
              <div className="flex gap-6 border-b border-zinc-100 pb-2"><span className="jianpu-note">3</span><span className="jianpu-note">3</span><span className="jianpu-note">4</span><span className="jianpu-note">5</span><span className="ml-4 text-zinc-300">|</span></div>
              <div className="flex gap-6 border-b border-zinc-100 pb-2"><span className="jianpu-note">5</span><span className="jianpu-note">4</span><span className="jianpu-note">3</span><span className="jianpu-note">2</span><span className="ml-4 text-zinc-300">|</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
