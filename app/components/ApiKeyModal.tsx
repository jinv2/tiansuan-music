"use client";
import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, X, Zap } from 'lucide-react';

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
    // z-[99999] 确保在最上层，使用 flex 居中
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#252526] border border-[#555] shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* 头部 */}
        <div className="bg-[#333] px-6 py-4 border-b border-[#444] flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-3">
            <Zap className="text-blue-500" size={20} fill="currentColor" />
            DeepSeek 引擎配置
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#444] rounded-lg text-gray-400 hover:text-white transition">
            <X size={20}/>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-8">
          <label className="block text-sm text-gray-300 mb-3 font-medium">
            请输入您的 DeepSeek API Key (sk-...)
          </label>
          
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full h-12 bg-[#1e1e1e] border border-[#444] text-white px-4 rounded-lg text-base font-mono mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 h-12 rounded-lg border border-[#444] text-gray-300 font-bold hover:bg-[#333] transition"
            >
              取消
            </button>
            <button 
              onClick={() => { onSave(key); onClose(); }}
              className="flex-1 h-12 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <ShieldCheck size={18} />
              连接引擎
            </button>
          </div>
          
          <p className="mt-6 text-xs text-gray-500 text-center">
            密钥仅存储在您的本地浏览器中，直连 api.deepseek.com
          </p>
        </div>
      </div>
    </div>
  );
}
