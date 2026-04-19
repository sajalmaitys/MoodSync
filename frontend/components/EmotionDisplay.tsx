"use client";

import React from "react";
import { EmotionTheme } from "@/lib/emotions";

interface Props {
  emotion: string;
  confidence: number;
  theme: EmotionTheme;
  allEmotions: Record<string, number>;
  isConnected: boolean;
}

export default function EmotionDisplay({
  emotion,
  confidence,
  theme,
  allEmotions,
  isConnected,
}: Props) {
  const pct = Math.round(confidence * 100);
  
  // To draw the ring, we use SVG circle stroke-dasharray
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  // The 7 emotions ordered as in the image: HAP, SAD, ANG, FEA, SUR, DIS, NEU
  const emotionKeys = [
    { key: "happy", label: "HAP" },
    { key: "sad", label: "SAD" },
    { key: "angry", label: "ANG" },
    { key: "fear", label: "FEA" },
    { key: "surprise", label: "SUR" },
    { key: "disgust", label: "DIS" },
    { key: "neutral", label: "NEU" },
  ];

  return (
    <div className="flex flex-col h-full w-full p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs tracking-widest text-white/50 uppercase font-semibold">Live Spectrum</span>
        <div className="flex items-center gap-2 text-xs font-black tracking-wider border border-white/10 px-3 py-1.5 rounded-full bg-white/5">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#4ade80]" : "bg-red-500 animate-pulse"}`} />
          <span className={isConnected ? "text-[#4ade80]" : "text-red-500"}>{isConnected ? "CONNECTED" : "OFFLINE"}</span>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight text-white mb-auto shadow-black drop-shadow-md">
        Current<br/>Emotion
      </h2>

      {/* Center Ring Chart */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-8 mb-12">
        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="14"
              fill="none"
            />
            {/* Foreground progress ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="url(#ring-gradient)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 10px ${theme.accentHex}40)` }}
            />
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.accentHex} />
                <stop offset="100%" stopColor="#c5ffc9" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="flex flex-col items-center justify-center text-center mt-2">
            <span className="text-6xl mb-2 drop-shadow-xl select-none">{theme.emoji}</span>
            <span className="text-2xl font-bold text-white tracking-wide capitalize">{emotion}</span>
            <span className="text-sm text-white/50">{pct}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar Chart */}
      <div className="flex justify-between items-end h-[100px] w-full px-4 gap-2">
        {emotionKeys.map((item) => {
          const val = allEmotions[item.key] || 0;
          const isHighest = item.key === emotion;
          const heightPct = Math.max(10, Math.round(val * 100)); // min 10% for visibility
          return (
            <div key={item.key} className="flex flex-col items-center justify-end h-full flex-1 gap-3">
              <div 
                className={`w-full max-w-[24px] rounded-t-lg rounded-b-sm transition-all duration-700 ease-out`}
                style={{ 
                  height: `${heightPct}%`, 
                  backgroundColor: isHighest ? theme.accentHex : "rgba(255,255,255,0.08)",
                  boxShadow: isHighest ? `0 0 15px ${theme.accentHex}60` : 'none'
                }}
              />
              <span className={`text-[10px] font-bold ${isHighest ? "text-white" : "text-white/30"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
