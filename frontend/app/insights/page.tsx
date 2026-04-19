"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import TopNavTabs, { HeaderActions } from "@/components/TopNavTabs";
import { getTheme } from "@/lib/emotions";
import type { EmotionEvent } from "@/components/MoodFlowView";

export default function InsightsPage() {
  const [events, setEvents] = useState<EmotionEvent[]>([]);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const res = await fetch("/api/emotions");
        const data = (await res.json()) as EmotionEvent[];
        if (!c) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!c) setEvents([]);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of events) {
      const k = e.emotion || "neutral";
      m[k] = (m[k] || 0) + 1;
    }
    return m;
  }, [events]);

  const top = useMemo(() => {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [counts]);

  return (
    <AppChrome
      sidebarActive={null}
      header={
        <>
          <TopNavTabs active="insights" />
          <HeaderActions />
        </>
      }
    >
      <div className="p-8 max-w-4xl mx-auto space-y-8 pb-16">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Insights</h1>
          <p className="text-sm text-white/45 mt-1">Patterns from your saved mood history (MongoDB).</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#1c2033]/50 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Samples</h2>
            <p className="text-3xl font-black text-white">{events.length}</p>
            <p className="text-xs text-white/35 mt-1">Total logged moments</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#1c2033]/50 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Leading tones</h2>
            {top.length === 0 ? (
              <p className="text-sm text-white/35">No history yet — use the live dashboard to record moods.</p>
            ) : (
              <ul className="space-y-2">
                {top.map(([emo, n]) => {
                  const t = getTheme(emo);
                  return (
                    <li key={emo} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{t.emoji}</span>
                        <span className="text-white/80">{t.label}</span>
                      </span>
                      <span className="text-white/40 tabular-nums">{n}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171a2a]/60 p-6">
          <h2 className="text-sm font-semibold text-white mb-2">Tips</h2>
          <ul className="text-sm text-white/45 space-y-2 list-disc pl-5">
            <li>Longer sessions produce richer MoodFlow and analytics.</li>
            <li>Check Connections to plan music and calendar hooks (coming soon).</li>
            <li>
              <Link href="/analytics" className="text-purple-400 hover:text-purple-300">
                Open Analytics chart →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </AppChrome>
  );
}
