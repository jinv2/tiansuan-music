"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Zap } from 'lucide-react';

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
    // 1. 使用 style 强制覆盖任何 Tailwind 配置，确保物理全屏覆盖
    <div 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2147483647, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose} // 点击背景关闭
    >
      {/* 2. 内容卡片：物理强制居中，阻断点击冒泡 */}
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
          
          {/* 3. 输入框关键修复：
              onKeyDown 阻止冒泡，防止空格键触发播放器
              className 添加 select-text 允许选中
              autoFocus 自动聚焦
          */}
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} 
            autoFocus
            placeholder="sk-..."
            className="w-full h-12 bg-[#1e1e1e] border border-[#444] text-white px-4 rounded-lg text-base font-mono mb-6 focus:border-blue-500 focus:outline-none select-text"
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
