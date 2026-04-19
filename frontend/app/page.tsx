"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import EmotionDisplay from "@/components/EmotionDisplay";
import MusicPlayer from "@/components/MusicPlayer";
import WebcamPreview from "@/components/WebcamPreview";
import AppChrome from "@/components/AppChrome";
import TopNavTabs, { HeaderActions } from "@/components/TopNavTabs";
import { getTheme, EmotionTheme } from "@/lib/emotions";

interface EmotionState {
  emotion: string;
  confidence: number;
  all_emotions: Record<string, number>;
  timestamp: string | null;
  error: string | null;
  running: boolean;
}

const POLL_INTERVAL = 2000;
const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL || "http://localhost:5000";

export default function HomePage() {
  const [emotionState, setEmotionState] = useState<EmotionState>({
    emotion: "neutral",
    confidence: 0,
    all_emotions: { happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0, disgust: 0, neutral: 0 },
    timestamp: null,
    error: null,
    running: false,
  });
  const [theme, setTheme] = useState<EmotionTheme>(getTheme("neutral"));
  const [isConnected, setIsConnected] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const fetchEmotion = useCallback(async () => {
    try {
      const res = await fetch(`${FLASK_URL}/api/emotion`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error("bad response");
      const data: EmotionState = await res.json();
      setEmotionState(data);
      setIsConnected(true);

      const newTheme = getTheme(data.emotion);
      setTheme(newTheme);

      if (data.timestamp && data.timestamp !== lastSaved && data.error !== "no_face") {
        setLastSaved(data.timestamp);
        fetch("/api/emotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).catch(() => {});
      }
    } catch {
      setIsConnected(false);
    }
  }, [lastSaved]);

  useEffect(() => {
    fetchEmotion();
    const id = setInterval(fetchEmotion, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchEmotion]);

  return (
    <AppChrome
      sidebarActive="home"
      header={
        <>
          <TopNavTabs active="dashboard" />
          <HeaderActions />
        </>
      }
    >
      <div className="p-8 max-w-[1400px] w-full mx-auto flex gap-6 min-h-[calc(100vh-80px)]">
          {/* Left Column (Current Emotion) */}
          <div className="flex-1 rounded-3xl bg-[#1c2033]/60 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden relative flex flex-col h-full">
            <EmotionDisplay
              emotion={emotionState.emotion}
              confidence={emotionState.confidence}
              theme={theme}
              allEmotions={emotionState.all_emotions}
              isConnected={isConnected}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
            {/* Camera Card */}
            <div className="flex-[0.45] rounded-3xl bg-[#171a2a] backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col shadow-xl">
              <WebcamPreview theme={theme} detectorError={emotionState.error} />
            </div>

            {/* Music Player Card */}
            <div className="flex-[0.25] rounded-3xl bg-[#1c2033]/60 backdrop-blur-xl border border-white/5 shadow-xl min-h-[160px]">
              <MusicPlayer theme={theme} emotion={emotionState.emotion} />
            </div>

            {/* Info Card */}
            <div className="flex-[0.3] rounded-3xl bg-[#1c2033]/40 backdrop-blur-xl border border-white/5 p-6 shadow-xl flex flex-col min-h-[220px]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-sm">✨</span>
                </div>
                <h3 className="font-semibold text-lg text-white">How it works</h3>
              </div>
              <div className="flex gap-8 flex-1">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[10px]">1</span>
                    Neural Processing
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    Our proprietary AI analyzes 68 distinct facial landmarks in real-time to detect subtle emotional shifts before they even surface.
                  </p>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                     <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[10px]">2</span>
                    Contextual Synergy
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    MoodSync integrates with your workspace and devices to adjust ambient lighting and music to complement your current state.
                  </p>
                </div>
              </div>
              <Link
                href="/moodflow"
                className="text-xs text-purple-400 font-semibold mt-4 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                Open MoodFlow <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </div>
        </div>
    </AppChrome>
  );
}
