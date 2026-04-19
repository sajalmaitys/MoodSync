"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getTheme } from "@/lib/emotions";

export interface EmotionEvent {
  emotion: string;
  confidence: number;
  timestamp: string;
  all_emotions?: Record<string, number>;
}

export default function MoodFlowView() {
  const [events, setEvents] = useState<EmotionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/emotions");
        const data = (await res.json()) as EmotionEvent[];
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const chronological = useMemo(() => [...events].reverse(), [events]);

  const transitions = useMemo(() => {
    const pairs: { from: string; to: string; at: string }[] = [];
    for (let i = 1; i < chronological.length; i++) {
      const prev = chronological[i - 1].emotion;
      const cur = chronological[i].emotion;
      if (prev !== cur) {
        pairs.push({
          from: prev,
          to: cur,
          at: chronological[i].timestamp,
        });
      }
    }
    return pairs.slice(-12).reverse();
  }, [chronological]);

  const flowSlice = useMemo(() => chronological.slice(-40), [chronological]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-white/40 text-sm tracking-wide">
        Loading your mood stream…
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#1c2033]/40 backdrop-blur-xl p-12 text-center max-w-lg mx-auto">
        <p className="text-4xl mb-4">〰️</p>
        <h2 className="text-lg font-semibold text-white mb-2">No flow yet</h2>
        <p className="text-sm text-white/45 leading-relaxed mb-6">
          MoodFlow builds from saved detections. Open the live home view with the camera running so moments can be recorded.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#af7fff] px-5 py-2.5 text-sm font-bold text-[#1e143b] hover:bg-[#9f6eff] transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#1c2033]/50 backdrop-blur-xl p-6 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Emotional river</h2>
            <span className="text-[10px] text-white/35 uppercase tracking-wider">{flowSlice.length} moments</span>
          </div>
          <div className="relative overflow-x-auto pb-4 -mx-2 px-2">
            <div className="absolute left-0 right-0 top-[52px] h-px bg-gradient-to-r from-transparent via-[#af7fff]/40 to-transparent pointer-events-none" />
            <div className="flex gap-0 min-w-min items-start">
              {flowSlice.map((ev, i) => {
                const t = getTheme(ev.emotion);
                const next = flowSlice[i + 1];
                const bend = next && next.emotion !== ev.emotion;
                return (
                  <div key={`${ev.timestamp}-${i}`} className="flex items-start shrink-0">
                    <div className="flex flex-col items-center w-[72px] sm:w-[80px]">
                      <div
                        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl shadow-lg transition-transform hover:scale-105"
                        style={{
                          borderColor: `${t.accentHex}55`,
                          background: `linear-gradient(145deg, ${t.accentHex}22, rgba(0,0,0,0.5))`,
                          boxShadow: `0 0 24px ${t.accentHex}28`,
                        }}
                        title={`${t.label} · ${Math.round((ev.confidence || 0) * 100)}%`}
                      >
                        {t.emoji}
                      </div>
                      <span className="mt-2 text-[9px] uppercase tracking-tighter text-white/35 text-center leading-tight px-0.5 line-clamp-2">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {i < flowSlice.length - 1 && (
                      <div className="flex items-center h-14 mt-0 w-4 sm:w-6 shrink-0">
                        <svg viewBox="0 0 48 8" className="w-full h-2 text-white/15" preserveAspectRatio="none">
                          <path
                            d={bend ? "M0 4 Q 24 0, 48 4" : "M0 4 L48 4"}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-[#171a2a]/80 backdrop-blur-xl p-6 shadow-xl flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Shifts</h2>
          <p className="text-xs text-white/35 mb-4 leading-relaxed">
            Recent changes between dominant emotions from your saved history.
          </p>
          <ul className="flex flex-col gap-3 overflow-y-auto max-h-[320px] pr-1">
            {transitions.length === 0 ? (
              <li className="text-sm text-white/30">No shifts in this window — steady mood.</li>
            ) : (
              transitions.map((tr, idx) => {
                const a = getTheme(tr.from);
                const b = getTheme(tr.to);
                return (
                  <li
                    key={`${tr.at}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                  >
                    <span className="text-lg">{a.emoji}</span>
                    <span className="text-white/25 text-xs">→</span>
                    <span className="text-lg">{b.emoji}</span>
                    <span className="ml-auto text-[10px] text-white/30 tabular-nums">
                      {new Date(tr.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
          <Link
            href="/analytics"
            className="mt-6 text-center text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Open full analytics chart →
          </Link>
        </div>
      </div>
    </div>
  );
}
