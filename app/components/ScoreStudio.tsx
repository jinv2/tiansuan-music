"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Pause, Download, Cpu, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props { format?: string; audioFile?: File | null; apiKey: string; }

export default function ScoreStudio({ format = 'staff', audioFile, apiKey }: Props) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'ready' | 'error'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const wavesurfer = useRef<any>(null);

  // 初始化 WaveSurfer - 仿 Cubase 样式
  useEffect(() => {
    const initWS = async () => {
      if (!waveformRef.current || !audioFile) return;
      const WaveSurfer = (await import('wavesurfer.js')).default;
      if (wavesurfer.current) wavesurfer.current.destroy();
      
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#5a5a5a',      // 轨道底色
        progressColor: '#3b82f6',  // 播放进度蓝
        cursorColor: '#ffffff',
        barWidth: 0,               // 实心波形模式
        height: 120,               // 高度增加
        normalize: true,
        fillParent: true,
        minPxPerSec: 50,
      });
      wavesurfer.current.load(URL.createObjectURL(audioFile));
      wavesurfer.current.on('finish', () => setIsPlaying(false));
    };
    initWS();
    return () => { if (wavesurfer.current) wavesurfer.current.destroy(); };
  }, [audioFile]);

  const togglePlay = () => { if (wavesurfer.current) { wavesurfer.current.playPause(); setIsPlaying(!isPlaying); }};

  // OSMD 初始化 (已修复 TS 报错)
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current) {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true, backend: "svg", drawingParameters: "compacttight", darkMode: true,
        });
        // 【关键修复】删除了 backgroundColor，只保留合法的颜色设置
        osmdRef.current.setOptions({ defaultColorMusic: "#ccc", defaultColorLabel: "#ccc" });
      } catch(e){}
    }
  }, []);

  // 真实 API 调用
  const startGeneration = async () => {
    if (!apiKey) { alert("Please Configure API Key in Header"); return; }
    setStatus('analyzing');
    try {
      const prompt = audioFile ? `Transcribe "${audioFile.name}" to MusicXML.` : "Generate demo XML.";
      const res = await fetch('/api/conduct', {
        method: 'POST', body: JSON.stringify({ apiKey, prompt }), headers: { 'Content-Type': 'application/json'}
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (format === 'staff' && osmdRef.current) {
        osmdRef.current.clear(); await osmdRef.current.load(data.result); osmdRef.current.render();
      }
      setStatus('ready');
    } catch (e) { setStatus('error'); console.error(e); }
  };

  const exportImg = async () => {
    if(sheetRef.current) {
       const c = await html2canvas(sheetRef.current, {backgroundColor:'#1e1e1e'});
       const l = document.createElement('a'); l.download='score.jpg'; l.href=c.toDataURL(); l.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部：波形轨道区域 */}
      <div className="h-40 bg-[#1a1a1a] border-b border-[#333] relative p-2 flex flex-col group">
         <div className="absolute top-2 left-2 text-[10px] font-bold text-gray-500 z-10 flex gap-2">
            <span className="bg-[#333] px-1 rounded text-blue-400">Audio 01</span>
            {status === 'analyzing' && <span className="text-yellow-500 animate-pulse">ANALYZING...</span>}
         </div>
         
         <div className="flex-1 relative mt-4 bg-[#111] rounded border border-[#333] overflow-hidden" ref={waveformRef}>
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                 style={{backgroundImage: 'linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '100px 100%'}}></div>
            {!audioFile && <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs tracking-widest">NO AUDIO EVENT</div>}
         </div>

         {audioFile && (
           <button onClick={togglePlay} className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg z-20">
             {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
           </button>
         )}
      </div>

      {/* 底部：乐谱编辑区 */}
      <div className="flex-1 bg-[#222] overflow-auto p-8 relative flex justify-center">
         <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button onClick={startGeneration} disabled={status === 'analyzing'} className="bg-[#333] hover:bg-[#444] border border-[#555] text-gray-200 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
              <Cpu size={12}/> {status === 'analyzing' ? 'Processing...' : 'DeepSeek Transform'}
            </button>
            {status === 'ready' && <button onClick={exportImg} className="bg-[#333] hover:bg-[#444] border border-[#555] text-gray-200 px-3 py-1 rounded text-xs"><Download size={12}/></button>}
         </div>

         <div ref={sheetRef} className={`w-full max-w-5xl transition-opacity duration-300 ${status === 'ready' ? 'opacity-100' : 'opacity-50 blur-[1px]'}`} />
         
         {status === 'idle' && !audioFile && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 flex flex-col items-center">
             <Activity size={48} className="mb-4 opacity-20"/>
             <span className="text-xs tracking-[0.5em] uppercase">Empty Project</span>
           </div>
         )}
      </div>
    </div>
  );
}
