"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Download, Loader2, Music, Wand2 } from 'lucide-react';

export default function ScoreStudio() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const sheetRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  useEffect(() => {
    if (sheetRef.current && !osmdRef.current) {
      try {
        osmdRef.current = new OpenSheetMusicDisplay(sheetRef.current, {
          autoResize: true,
          backend: "svg",
          drawingParameters: "compacttight",
          darkMode: false, 
        });
      } catch (e) {
        console.error("OSMD Init Error", e);
      }
    }
  }, []);

  const simulateGeneration = async () => {
    setStatus('processing');
    setTimeout(async () => {
      if (osmdRef.current) {
        try {
          // 修复：使用纯净的反引号，没有反斜杠
          const sampleXML = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>AI Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="2"><note><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="3"><note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note><note><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note></measure><measure number="4"><note><pitch><step>E</step><octave>4</octave></pitch><duration>6</duration><type>quarter</type><dot/></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>2</duration><type>eighth</type></note><note><pitch><step>D</step><octave>4</octave></pitch><duration>8</duration><type>half</type></note></measure></part></score-partwise>`;
          
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
      <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-30">
        <div className="flex items-center gap-4"><h3 className="font-semibold text-slate-800 text-sm">Project: Demo_Transcription_001.mid</h3>{status === 'ready' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase tracking-wide">Success</span>}</div>
        <div className="flex gap-2">
           {status === 'idle' ? (
             <button onClick={simulateGeneration} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:scale-105 transition-all shadow-lg hover:shadow-xl"><Wand2 size={14} />Start AI Generation</button>
           ) : (
             <><button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-600 transition" disabled={status !== 'ready'}><Play size={14} /> Play MIDI</button><button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-md transition" disabled={status !== 'ready'}><Download size={14} /> Export XML</button></>
           )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-50/50">
        {status === 'idle' && (<div className="flex flex-col items-center justify-center text-slate-400 mt-20 gap-4"><div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100"><Music size={40} className="text-slate-300" /></div><p className="text-sm font-medium">Waiting for audio input...</p></div>)}
        {status === 'processing' && (<div className="flex flex-col items-center justify-center text-slate-500 mt-40"><Loader2 size={48} className="animate-spin mb-6 text-black" /><h3 className="text-lg font-bold text-slate-800">Processing Audio Signal</h3><p className="text-xs mt-2 text-slate-400 font-mono">Separating Stems... Analyzing Pitch... Quantizing...</p></div>)}
        <div ref={sheetRef} className={`bg-white shadow-xl p-10 w-full max-w-5xl min-h-[600px] transition-all duration-700 transform ${status === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`} />
      </div>
    </div>
  );
}
