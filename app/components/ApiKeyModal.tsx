"use client";
import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  storedKey: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, storedKey }: Props) {
  const [key, setKey] = useState(storedKey);

  useEffect(() => setKey(storedKey), [storedKey]);

  if (!isOpen) return null;

  return (
    // z-[9999] 确保在最顶层，bg-black/80 提供遮罩
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-[2px]">
      <div className="bg-[#2b2b2b] border border-[#444] rounded shadow-2xl w-[400px] flex flex-col overflow-hidden">
        {/* 标题栏 */}
        <div className="bg-[#333] px-4 py-2 border-b border-[#444] flex justify-between items-center">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Key size={12} /> DeepSeek API Configuration
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={14}/></button>
        </div>

        {/* 内容区 */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Authentication Required for V3 Inference Engine.
            <br/>Connecting to: <span className="font-mono text-blue-400">api.deepseek.com</span>
          </p>

          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-[#1a1a1a] border border-[#3f3f3f] text-white px-3 py-2 rounded text-xs font-mono focus:border-blue-500 focus:outline-none"
          />

          <button 
            onClick={() => { onSave(key); onClose(); }}
            className="w-full py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck size={14}/> CONNECT ENGINE
          </button>
        </div>
      </div>
    </div>
  );
}
