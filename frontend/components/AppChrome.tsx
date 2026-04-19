"use client";

import React from "react";
import SidebarNav, { type SidebarNavKey } from "@/components/SidebarNav";

interface Props {
  sidebarActive: SidebarNavKey | null;
  header: React.ReactNode;
  children: React.ReactNode;
}

/** Shared layout: sidebar + gradient main + sticky header row + scrollable body */
export default function AppChrome({ sidebarActive, header, children }: Props) {
  return (
    <div className="flex h-screen bg-[#0f1117] text-white font-sans overflow-hidden">
      <SidebarNav active={sidebarActive} />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative min-w-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121522] to-[#0a0c14] -z-10 pointer-events-none" />
        <header className="h-20 border-b border-white/5 flex items-center px-6 lg:px-10 bg-[#141724]/60 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex w-full min-w-0 items-center justify-between gap-4">{header}</div>
        </header>
        {children}
      </main>
    </div>
  );
}
