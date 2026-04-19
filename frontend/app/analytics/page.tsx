"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { HeaderActions } from "@/components/TopNavTabs";
import MoodChart from "@/components/MoodChart";

export default function AnalyticsPage() {
  return (
    <AppChrome
      sidebarActive="analytics"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35 mb-1">
              <Link href="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#af7fff]">Analytics</span>
            </nav>
            <h1 className="text-lg font-bold text-white tracking-tight sm:text-xl">Mood analytics</h1>
            <p className="text-xs text-white/40 truncate">History chart from your saved sessions</p>
          </div>
          <HeaderActions />
        </div>
      }
    >
      <div className="max-w-3xl mx-auto px-6 py-10 w-full">
        <MoodChart />
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/moodflow" className="text-purple-400 hover:text-purple-300 font-medium">
            MoodFlow timeline →
          </Link>
          <Link href="/insights" className="text-white/45 hover:text-white">
            Insights
          </Link>
        </div>
      </div>
    </AppChrome>
  );
}
