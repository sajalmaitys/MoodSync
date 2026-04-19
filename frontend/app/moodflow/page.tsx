"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { HeaderActions } from "@/components/TopNavTabs";
import MoodFlowView from "@/components/MoodFlowView";

export default function MoodFlowPage() {
  return (
    <AppChrome
      sidebarActive="moodflow"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35 mb-1">
              <Link href="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#af7fff]">MoodFlow</span>
            </nav>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl truncate">MoodFlow</h1>
            <p className="text-xs text-white/40 truncate">Saved emotional moments</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="text-sm font-medium text-white/50 hover:text-white border border-white/10 hover:bg-white/5 rounded-full px-4 py-2 transition-all hidden sm:inline-flex"
            >
              ← Live
            </Link>
            <HeaderActions />
          </div>
        </div>
      }
    >
      <div className="p-6 lg:p-8 max-w-[1400px] w-full mx-auto flex-1">
        <MoodFlowView />
      </div>
    </AppChrome>
  );
}
