"use client";

import Link from "next/link";
import React from "react";

export type SidebarNavKey =
  | "home"
  | "moodflow"
  | "analytics"
  | "connections"
  | "new-entry"
  | "account"
  | "help";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const FlowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const ConnectionsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

function navClass(active: boolean) {
  return [
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
    active
      ? "bg-white/5 text-white border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.03)]"
      : "text-white/50 hover:text-white hover:bg-white/5",
  ].join(" ");
}

interface Props {
  /** Which sidebar item is highlighted; `null` means none (e.g. Pulse / Insights use top tabs only) */
  active: SidebarNavKey | null;
}

export default function SidebarNav({ active }: Props) {
  const a = (key: SidebarNavKey) => active === key;

  return (
    <aside className="w-[280px] bg-[#141724] flex flex-col justify-between border-r border-white/5 shrink-0">
      <div>
        <div className="px-8 py-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl" style={{ filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))" }}>
              🧠
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                MoodSync
              </h1>
              <p className="text-[10px] text-purple-300/60 uppercase tracking-widest mt-0.5">Emotion-Based UI</p>
            </div>
          </Link>
          <p className="text-xs text-white/40 mt-6 font-medium">The Ethereal Pulse</p>
        </div>

        <nav className="mt-4 px-4 flex flex-col gap-1">
          <Link href="/" className={navClass(a("home"))}>
            <HomeIcon /> <span className={`text-sm ${a("home") ? "font-semibold" : "font-medium"}`}>Home</span>
          </Link>
          <Link href="/moodflow" className={navClass(a("moodflow"))}>
            <FlowIcon /> <span className={`text-sm ${a("moodflow") ? "font-semibold" : "font-medium"}`}>MoodFlow</span>
          </Link>
          <Link href="/analytics" className={navClass(a("analytics"))}>
            <AnalyticsIcon /> <span className={`text-sm ${a("analytics") ? "font-semibold" : "font-medium"}`}>Analytics</span>
          </Link>
          <Link href="/connections" className={navClass(a("connections"))}>
            <ConnectionsIcon /> <span className={`text-sm ${a("connections") ? "font-semibold" : "font-medium"}`}>Connections</span>
          </Link>
        </nav>
      </div>

      <div className="p-6">
        <Link
          href="/new-entry"
          className={`flex w-full items-center justify-center bg-[#af7fff] hover:bg-[#9f6eff] text-[#1e143b] font-bold text-sm py-3.5 rounded-xl transition-all mb-6 shadow-[0_0_20px_rgba(175,127,255,0.4)] ${a("new-entry") ? "ring-2 ring-white/30" : ""}`}
        >
          New Entry
        </Link>
        <div className="flex flex-col gap-4 text-white/50 px-2">
          <Link href="/account" className={`flex items-center gap-3 text-sm hover:text-white transition-colors ${a("account") ? "text-white" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Account
          </Link>
          <Link href="/help" className={`flex items-center gap-3 text-sm hover:text-white transition-colors ${a("help") ? "text-white" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Help
          </Link>
        </div>
      </div>
    </aside>
  );
}
