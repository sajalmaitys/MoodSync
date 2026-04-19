"use client";

import React, { useEffect, useRef, useState } from "react";
import { EmotionTheme } from "@/lib/emotions";

interface Props {
  theme: EmotionTheme;
  emotion: string;
}

export default function MusicPlayer({ theme, emotion }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = !audio.paused;

    const fadeOut = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(0, audio.volume - 0.05);
      } else {
        clearInterval(fadeOut);
        audio.pause();
        audio.src = theme.musicFile;
        audio.load();
        if (wasPlaying || playing) {
          audio.volume = 0;
          audio.play().catch(() => {});
          setPlaying(true);
          const fadeIn = setInterval(() => {
            if (audio.volume < volume - 0.05) {
              audio.volume = Math.min(volume, audio.volume + 0.05);
            } else {
              audio.volume = volume;
              clearInterval(fadeIn);
            }
          }, 60);
        }
      }
    }, 60);

    return () => clearInterval(fadeOut);
  }, [emotion, theme.musicFile]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.src = theme.musicFile;
      audio.volume = volume;
      audio.play().catch(() => {});
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="flex w-full h-full p-6 items-center flex-1">
      <audio ref={audioRef} loop />

      {/* Album Art Placeholder */}
      <div className="w-24 h-24 rounded-2xl bg-[#090b14] border border-white/5 shadow-2xl relative overflow-hidden flex-shrink-0 flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent" />
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-white/20"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
      </div>

      {/* Music Info & Controls */}
      <div className="flex flex-col flex-1 ml-6 gap-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white tracking-tight">Luminous Drift</h3>
              <span className="text-[9px] uppercase tracking-widest font-bold bg-[#534b8c] text-white px-2 py-0.5 rounded-full">Mood Matched</span>
            </div>
            <p className="text-sm text-white/50 mt-1">The Midnight Pulse - Ambient Electronic</p>
          </div>
          
          {/* Main Playback Controls */}
          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11 5L4 12L11 19V5Z" /><path d="M19 5L12 12L19 19V5Z" /></svg>
            </button>
            <button 
              onClick={toggle}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1c2033] hover:scale-105 transition-transform"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button className="text-white/40 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M13 5L20 12L13 19V5Z" /><path d="M5 5L12 12L5 19V5Z" /></svg>
            </button>
          </div>
        </div>

        {/* Progress Bar & Volume */}
        <div className="mt-4 flex flex-col gap-1 w-[60%]">
           <div className="w-full h-1.5 bg-white/10 rounded-full relative">
             <div className="absolute inset-y-0 left-0 w-[30%] bg-purple-400 rounded-full" />
             <div className="absolute top-1/2 left-[30%] -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
           </div>
           <div className="flex items-center justify-between text-[10px] text-white/40 font-mono mt-1">
             <span>02:14</span>
             <span className="flex-1 flex px-4">
               {/* Hidden real standard volume slider to retain functionality if needed */}
               <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume} className="w-full opacity-0 cursor-pointer" />
             </span>
             <span>04:50</span>
           </div>
        </div>
      </div>
    </div>
  );
}
