"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, X, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  storedKey: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, storedKey }: Props) {
  const [key, setKey] = useState(storedKey);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setKey(storedKey), [storedKey]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2147483647, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-[500px] bg-[#252526] border border-[#555] shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-[#333] px-6 py-4 border-b border-[#444] flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-3">
            <Zap className="text-blue-500" size={20} fill="currentColor" />
            DeepSeek 引擎配置
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-8">
          <label className="block text-sm text-gray-300 mb-3 font-medium">DeepSeek API Key</label>
          
          {/* 修复点：
             1. bg-black: 纯黑背景
             2. text-white: 纯白文字
             3. style={{ color: 'white' }}: 强制覆盖
          */}
          <input
            ref={inputRef}
            type="text" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} 
            placeholder="sk-..."
            style={{ color: '#ffffff', backgroundColor: '#000000' }}
            className="w-full h-12 border border-[#555] px-4 rounded-lg text-lg font-mono mb-6 focus:border-blue-500 focus:outline-none !select-text placeholder-gray-600"
          />

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 h-12 rounded-lg border border-[#444] text-gray-300 font-bold hover:bg-[#333]">取消</button>
            <button onClick={() => { onSave(key); onClose(); }} className="flex-1 h-12 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2">
              <ShieldCheck size={18} /> 连接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
