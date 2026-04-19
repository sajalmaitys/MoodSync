import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoodSync — Emotion-Based UI Changer",
  description:
    "Real-time emotion detection changes your UI and music automatically. Built with FER, Flask, and Next.js.",
  keywords: ["emotion detection", "AI", "music", "UI", "webcam", "FER"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
