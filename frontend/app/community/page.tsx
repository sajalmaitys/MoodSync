"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import TopNavTabs, { HeaderActions } from "@/components/TopNavTabs";

const cards = [
  { title: "Mood circles", body: "Share anonymized streaks with friends (concept).", tag: "Soon" },
  { title: "Challenges", body: "7-day calm or joy challenges with gentle prompts.", tag: "Planned" },
  { title: "Spotlight", body: "Curated playlists matched to collective trends.", tag: "Ideas" },
];

export default function CommunityPage() {
  return (
    <AppChrome
      sidebarActive={null}
      header={
        <>
          <TopNavTabs active="community" />
          <HeaderActions />
        </>
      }
    >
      <div className="p-8 max-w-4xl mx-auto space-y-8 pb-16">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Community</h1>
          <p className="text-sm text-white/45 mt-1">Social layers around MoodSync — placeholders for upcoming features.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-[#1c2033]/40 p-5 flex flex-col gap-2 hover:border-[#af7fff]/30 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#af7fff] font-bold">{c.tag}</span>
              <h2 className="text-lg font-semibold text-white">{c.title}</h2>
              <p className="text-sm text-white/40 flex-1 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30">
          Nothing here connects to a live backend yet.{" "}
          <Link href="/help" className="text-purple-400 hover:text-purple-300">
            Read help →
          </Link>
        </p>
      </div>
    </AppChrome>
  );
}
