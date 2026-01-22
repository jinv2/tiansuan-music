"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Pause, Download, Cpu, AlertTriangle, Terminal } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  format?: string;
  audioFile?: File | null;
  apiKey: string;
}

export default function ScoreStudio({ format = 'staff', audioFile, apiKey }: Props) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const wavesurfer = useRef<any>(null);

  // 初始化 WaveSurfer
  useEffect(() => {
    const initWaveSurfer = async () => {
      if (!waveformRef.current || !audioFile) return;
      const WaveSurfer = (await import('wavesurfer.js')).default;
      if (wavesurfer.current) wavesurfer.current.destroy();
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#52525b', progressColor: '#06b6d4', cursorColor: '#fff',
        barWidth: 2, barGap: 2, height: 40, normalize: true,
      });
      wavesurfer.current.load(URL.createObjectURL(audioFile));
      wavesurfer.current.on('finish', () => setIsPlaying(false));
    };
    initWaveSurfer();
    return () => { if (wavesurfer.current) wavesurfer.current.destroy(); };
  }, [audioFile]);

  const togglePlay = () => { if (wavesurfer.current) { wavesurfer.current.playPause(); setIsPlaying(!isPlaying); }};

  // 初始化 OSMD (已修复 TypeScript 报错)
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current) {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true, backend: "svg", drawingParameters: "compacttight", darkMode: true,
        });
        // 【关键修复】移除了报错的 backgroundColor，保留音符颜色设置
        osmdRef.current.setOptions({ 
          defaultColorMusic: "#FFFFFF", 
          defaultColorLabel: "#FFFFFF" 
        });
      } catch (e) { console.error(e); }
    }
  }, []);

  // 核心：真实调用 API 生成乐谱
  const startRealGeneration = async () => {
    if (!apiKey) {
      alert("请先点击右上角配置您的 DeepSeek API Key");
      return;
    }
    
    setStatus('analyzing');
    setErrorMsg('');

    try {
      const promptText = audioFile 
        ? `Generate a transcription for a song titled "${audioFile.name}". It sounds like a melancholic piano piece in A Minor.` 
        : `Generate a complex orchestral idea in C Minor with rapid strings and heavy brass.`;

      const response = await fetch('/api/conduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          apiKey, 
          prompt: promptText 
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to contact AI');

      if (format === 'staff' && osmdRef.current) {
        osmdRef.current.clear();
        await osmdRef.current.load(data.result);
        osmdRef.current.render();
      }
      
      setStatus('ready');

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  const handleExport = async () => {
    if (sheetRef.current) {
      const canvas = await html2canvas(sheetRef.current, { backgroundColor: '#000000', scale: 2 });
      const link = document.createElement('a');
      link.download = `TianSuan_AI_Score.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6">
      <div className="h-24 w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between backdrop-blur">
         <div className="flex-1 mr-8">
           {audioFile ? (
             <div className="flex items-center gap-4">
               <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center hover:bg-cyan-500 transition">
                 {isPlaying ? <Pause size={16} fill="white"/> : <Play size={16} fill="white"/>}
               </button>
               <div className="flex-1 h-10" ref={waveformRef}></div>
             </div>
           ) : (
             <div className="text-zinc-600 font-mono text-xs">Waiting for audio source...</div>
           )}
         </div>

         <button 
           onClick={startRealGeneration}
           disabled={status === 'analyzing'}
           className={`px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2
           ${status === 'analyzing' ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_20px_cyan]'}`}
         >
           {status === 'analyzing' ? <Cpu className="animate-spin" size={16}/> : <Terminal size={16}/>}
           {status === 'analyzing' ? 'DEEPSEEKING...' : 'GENERATE SCORE'}
         </button>
      </div>

      <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-8">
        {status === 'error' && (
          <div className="text-red-500 font-mono text-sm flex flex-col items-center gap-2">
            <AlertTriangle size={32}/>
            <p>ERROR: {errorMsg}</p>
            <p className="text-xs text-zinc-600">Please check your DeepSeek API Key.</p>
          </div>
        )}

        <div 
          ref={sheetRef} 
          className={`w-full max-w-5xl h-full transition-opacity duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0 hidden'}`}
        />
        
        {status === 'idle' && (
          <div className="text-zinc-800 font-bold text-4xl uppercase tracking-tighter select-none">
            DEEPSEEK V3 AGENT
          </div>
        )}
      </div>
    </div>
  );
}
