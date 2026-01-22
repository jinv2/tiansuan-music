"use client";
import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  storedKey: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, storedKey }: Props) {
  const [key, setKey] = useState(storedKey);
  const [show, setShow] = useState(false);

  useEffect(() => setKey(storedKey), [storedKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>

        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="text-blue-500" size={20} fill="currentColor"/>
          DeepSeek Authentication
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-mono leading-relaxed">
          请输入您的 <strong>DeepSeek API Key</strong> (sk-...)。<br/>
          系统将直连 api.deepseek.com 进行推理。
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-sm pr-12"
            />
            <button onClick={() => setShow(!show)} className="absolute right-3 top-3 text-zinc-500 hover:text-white">
              {show ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 text-xs font-bold transition">CANCEL</button>
            <button onClick={() => { onSave(key); onClose(); }} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
              <ShieldCheck size={16}/>
              CONNECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
