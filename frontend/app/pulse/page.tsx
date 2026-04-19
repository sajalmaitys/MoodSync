"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import TopNavTabs, { HeaderActions } from "@/components/TopNavTabs";
import EmotionDisplay from "@/components/EmotionDisplay";
import { useLiveEmotion } from "@/hooks/useLiveEmotion";

export default function PulsePage() {
  const { state, theme, connected } = useLiveEmotion();

  return (
    <AppChrome
      sidebarActive={null}
      header={
        <>
          <TopNavTabs active="pulse" />
          <HeaderActions />
        </>
      }
    >
      <div className="p-8 max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pulse</h1>
          <p className="text-sm text-white/45 mt-1">
            A focused read on your live signal — same detector as Dashboard, without the full layout.
          </p>
        </div>

        <div className="rounded-3xl bg-[#1c2033]/60 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden min-h-[420px]">
          <EmotionDisplay
            emotion={state.emotion}
            confidence={state.confidence}
            theme={theme}
            allEmotions={state.all_emotions}
            isConnected={connected}
          />
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300 font-medium">
            ← Open full Dashboard
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/moodflow" className="text-white/50 hover:text-white">
            MoodFlow
          </Link>
          <Link href="/analytics" className="text-white/50 hover:text-white">
            Analytics
          </Link>
        </div>
      </div>
    </AppChrome>
  );
}
