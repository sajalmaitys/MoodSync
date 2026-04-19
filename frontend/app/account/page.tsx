"use client";

import React from "react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { HeaderActions } from "@/components/TopNavTabs";

export default function AccountPage() {
  return (
    <AppChrome
      sidebarActive="account"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35 mb-1">
              <Link href="/" className="hover:text-white/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#af7fff]">Account</span>
            </nav>
            <h1 className="text-lg font-bold text-white sm:text-xl">Account</h1>
            <p className="text-xs text-white/40">Profile placeholder — no auth in this demo</p>
          </div>
          <HeaderActions />
        </div>
      }
    >
      <div className="p-8 max-w-lg mx-auto space-y-6 pb-16">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1c2033]/40 p-5">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/10" />
          <div>
            <p className="font-semibold text-white">Guest user</p>
            <p className="text-xs text-white/40">Sign-in can be added later (e.g. Firebase).</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#171a2a]/50 p-5 space-y-3 text-sm text-white/50">
          <p>Display name</p>
          <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-white/30">Not configured</p>
          <p className="pt-2">Email</p>
          <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-white/30">—</p>
        </div>
        <Link href="/help" className="inline-block text-sm text-purple-400 hover:text-purple-300">
          Help &amp; privacy →
        </Link>
      </div>
    </AppChrome>
  );
}
