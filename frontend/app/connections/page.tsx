"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { HeaderActions } from "@/components/TopNavTabs";

const integrations = [
  { name: "Spotify", desc: "Sync playlists with detected mood.", status: "Coming soon" },
  { name: "Google Calendar", desc: "Soften notifications on heavy days.", status: "Planned" },
  { name: "Slack / Teams", desc: "Optional status line from MoodSync.", status: "Ideas" },
  { name: "Home Assistant", desc: "Scene changes from emotion events.", status: "Ideas" },
];

export default function ConnectionsPage() {
  return (
    <AppChrome
      sidebarActive="connections"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35 mb-1">
              <Link href="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#af7fff]">Connections</span>
            </nav>
            <h1 className="text-lg font-bold text-white sm:text-xl">Connections</h1>
            <p className="text-xs text-white/40">External services and devices</p>
          </div>
          <HeaderActions />
        </div>
      }
    >
      <div className="p-8 max-w-3xl mx-auto space-y-6 pb-16">
        <p className="text-sm text-white/45 leading-relaxed">
          Wire MoodSync into the tools you already use. These entries are UI placeholders — no OAuth or webhooks are configured in this demo.
        </p>
        <ul className="space-y-3">
          {integrations.map((row) => (
            <li
              key={row.name}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-white/10 bg-[#1c2033]/40 px-5 py-4"
            >
              <div>
                <p className="font-semibold text-white">{row.name}</p>
                <p className="text-sm text-white/40">{row.desc}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#af7fff] font-bold shrink-0">{row.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppChrome>
  );
}
