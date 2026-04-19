"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { HeaderActions } from "@/components/TopNavTabs";

const faq = [
  {
    q: "Why does the live camera use Python?",
    a: "OpenCV and FER run in the Flask backend. The browser shows an MJPEG stream from localhost:5000 — not getUserMedia.",
  },
  {
    q: "Where is mood history stored?",
    a: "Next.js saves to MongoDB via /api/emotions. Match MONGODB_URI in backend/.env and frontend/.env.local.",
  },
  {
    q: "What is MoodFlow vs Analytics?",
    a: "MoodFlow is a visual timeline of recent saved moods. Analytics is the Recharts dashboard for counts over time.",
  },
];

export default function HelpPage() {
  return (
    <AppChrome
      sidebarActive="help"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35 mb-1">
              <Link href="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#af7fff]">Help</span>
            </nav>
            <h1 className="text-lg font-bold text-white sm:text-xl">Help</h1>
            <p className="text-xs text-white/40">FAQ and quick links</p>
          </div>
          <HeaderActions />
        </div>
      }
    >
      <div className="p-8 max-w-2xl mx-auto space-y-10 pb-20">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">FAQ</h2>
          <ul className="space-y-4">
            {faq.map((item) => (
              <li key={item.q} className="rounded-2xl border border-white/10 bg-[#1c2033]/35 p-5">
                <p className="font-semibold text-white text-sm mb-2">{item.q}</p>
                <p className="text-sm text-white/45 leading-relaxed">{item.a}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="settings" className="scroll-mt-24 space-y-3 rounded-2xl border border-white/10 bg-[#171a2a]/50 p-6">
          <h2 className="text-sm font-bold text-white">Settings (demo)</h2>
          <p className="text-sm text-white/45 leading-relaxed">
            There is no settings panel yet. Use <code className="text-purple-300/90">CAMERA_INDEX</code> in{" "}
            <code className="text-purple-300/90">backend/.env</code> and <code className="text-purple-300/90">NEXT_PUBLIC_FLASK_URL</code> in{" "}
            <code className="text-purple-300/90">frontend/.env.local</code>. Run <code className="text-purple-300/90">python test_cameras.py</code> in{" "}
            <code className="text-purple-300/90">backend</code> to pick a camera index.
          </p>
        </section>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Live dashboard
          </Link>
          <Link href="/analytics" className="text-white/45 hover:text-white">
            Analytics
          </Link>
          <Link href="/new-entry" className="text-white/45 hover:text-white">
            New entry
          </Link>
        </div>
      </div>
    </AppChrome>
  );
}
