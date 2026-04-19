"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { HeaderActions } from "@/components/TopNavTabs";

const EMOTIONS = ["neutral", "happy", "sad", "angry", "fear", "surprise", "disgust"] as const;

export default function NewEntryPage() {
  const [emotion, setEmotion] = useState<string>("neutral");
  const [confidence, setConfidence] = useState(0.75);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const ts = new Date().toISOString();
    const all = Object.fromEntries(EMOTIONS.map((k) => [k, k === emotion ? confidence : 0.02]));
    try {
      const res = await fetch("/api/emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion,
          confidence,
          all_emotions: all,
          timestamp: ts,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "save failed");
      setMsg("Saved to your mood history.");
    } catch {
      setMsg("Could not save — is MongoDB running?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppChrome
      sidebarActive="new-entry"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35 mb-1">
              <Link href="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#af7fff]">New entry</span>
            </nav>
            <h1 className="text-lg font-bold text-white sm:text-xl">Log a mood</h1>
            <p className="text-xs text-white/40">Manual entry (no camera)</p>
          </div>
          <HeaderActions />
        </div>
      }
    >
      <div className="p-8 max-w-md mx-auto pb-16">
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[#1c2033]/50 p-6 space-y-5">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Emotion</span>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white outline-none focus:border-[#af7fff]/50"
            >
              {EMOTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Confidence ({Math.round(confidence * 100)}%)
            </span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="mt-3 w-full accent-[#af7fff]"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#af7fff] py-3 text-sm font-bold text-[#1e143b] hover:bg-[#9f6eff] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save entry"}
          </button>
          {msg && <p className="text-sm text-center text-white/60">{msg}</p>}
        </form>
        <p className="text-xs text-white/30 mt-6 text-center">
          <Link href="/moodflow" className="text-purple-400 hover:text-purple-300">
            View MoodFlow →
          </Link>
        </p>
      </div>
    </AppChrome>
  );
}
