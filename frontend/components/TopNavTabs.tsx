"use client";

import Link from "next/link";
import React from "react";

export type TopNavTabKey = "dashboard" | "pulse" | "insights" | "community";

interface Props {
  active: TopNavTabKey;
}

function tabClass(isActive: boolean) {
  return isActive
    ? "relative text-white py-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t-full after:bg-[#af7fff]"
    : "text-white/50 hover:text-white transition-colors py-4";
}

export default function TopNavTabs({ active }: Props) {
  return (
    <nav className="flex items-center gap-8 text-sm font-medium">
      <Link href="/" className={tabClass(active === "dashboard")}>
        Dashboard
      </Link>
      <Link href="/pulse" className={tabClass(active === "pulse")}>
        Pulse
      </Link>
      <Link href="/insights" className={tabClass(active === "insights")}>
        Insights
      </Link>
      <Link href="/community" className={tabClass(active === "community")}>
        Community
      </Link>
    </nav>
  );
}

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4 text-white/50">
      <Link href="/help" className="hover:text-white transition-colors p-1" title="Help">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </Link>
      <Link href="/help#settings" className="hover:text-white transition-colors p-1" title="Settings and help">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </Link>
      <Link
        href="/account"
        className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/10 hover:opacity-90 transition-opacity shrink-0"
        title="Account"
      />
    </div>
  );
}
