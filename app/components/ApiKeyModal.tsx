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
    // 使用 fixed + inset-0 创建全屏遮罩
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm">
      {/* 使用 absolute + translate 进行物理居中 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-[#252526] border border-[#444] shadow-2xl rounded-lg overflow-hidden">
        
        <div className="bg-[#2d2d2d] px-4 py-3 border-b border-[#333] flex justify-between items-center">
          <span className="font-bold text-xs text-white flex items-center gap-2">
            <Key size={14} className="text-[#007fd4]" /> 
            DeepSeek Connection
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16}/></button>
        </div>

        <div className="p-6">
          <p className="text-xs text-gray-400 mb-4">
            Enter your API Key to enable the V3 Inference Engine.
          </p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-white px-3 py-2 rounded text-xs font-mono mb-4 focus:border-[#007fd4] focus:outline-none"
          />
          <button 
            onClick={() => { onSave(key); onClose(); }}
            className="w-full py-2 bg-[#007fd4] hover:bg-[#0063b1] text-white text-xs font-bold rounded flex items-center justify-center gap-2"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
