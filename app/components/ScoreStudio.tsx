"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Download, Loader2, Music4 } from 'lucide-react';

export default function ScoreStudio() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const sheetRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  // 初始化 OSMD
  useEffect(() => {
    if (sheetRef.current && !osmdRef.current) {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true,
          backend: "svg",
          drawingParameters: "compacttight",
          darkMode: false, 
        });
        console.log("OSMD Initialized");
      } catch (e) {
        console.error("OSMD Init Error", e);
      }
    }
  }, []);

  // 模拟生成过程
  const simulateGeneration = async () => {
    setStatus('processing');
    
    // 模拟 AI 处理延时
    setTimeout(async () => {
      if (osmdRef.current) {
        try {
          // 这里加载一个简单的 MusicXML 示例 (贝多芬欢乐颂片段)
          // 在实际产品中，这里是 fetch('/api/transcribe') 返回的数据
          const sampleXML = \`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>AI Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="2"><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure></part></score-partwise>\`;
          
          await osmdRef.current.load(sampleXML);
          osmdRef.current.render();
          setStatus('ready');
        } catch (e) {
          console.error(e);
        }
      }
    }, 2500);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 工具栏 */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-slate-800">当前工程: Untitled_Audio_2026.mp3</h3>
          {status === 'ready' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">转换完成</span>}
        </div>
        <div className="flex gap-2">
           {status === 'idle' ? (
             <button 
              onClick={simulateGeneration}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition shadow-lg">
               <Music4 size={16} />
               开始生成乐谱 (模拟)
             </button>
           ) : (
             <>
               <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-slate-50 text-slate-600" disabled={status !== 'ready'}>
                 <Play size={16} /> 试听 MIDI
               </button>
               <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-md" disabled={status !== 'ready'}>
                 <Download size={16} /> 导出 PDF
               </button>
             </>
           )}
        </div>
      </div>

      {/* 乐谱画布 */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-100">
        {status === 'idle' && (
           <div className="flex flex-col items-center justify-center text-slate-400 mt-20">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <Music4 size={32} />
             </div>
             <p>请上传音频或点击“开始生成”进行演示</p>
           </div>
        )}
        
        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center text-slate-500 mt-40 animate-pulse">
            <Loader2 size={48} className="animate-spin mb-4 text-black" />
            <p className="font-medium">AI 正在分离音轨并计算乐理结构...</p>
            <p className="text-xs mt-2 text-slate-400">调用 Neural Algorithm Audio Engine v4.0</p>
          </div>
        )}

        <div 
          ref={sheetRef} 
          className={`bg-white shadow-2xl p-10 w-full max-w-5xl min-h-[600px] transition-opacity duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0 hidden'}`}
        />
      </div>
    </div>
  );
}
