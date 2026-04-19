"use client";

import { useCallback, useEffect, useState } from "react";
import { getTheme, EmotionTheme } from "@/lib/emotions";

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL || "http://localhost:5000";
const POLL_MS = 2000;

export interface LiveEmotionState {
  emotion: string;
  confidence: number;
  all_emotions: Record<string, number>;
  timestamp: string | null;
  error: string | null;
  running: boolean;
}

export function useLiveEmotion() {
  const [state, setState] = useState<LiveEmotionState>({
    emotion: "neutral",
    confidence: 0,
    all_emotions: { happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0, disgust: 0, neutral: 0 },
    timestamp: null,
    error: null,
    running: false,
  });
  const [theme, setTheme] = useState<EmotionTheme>(getTheme("neutral"));
  const [connected, setConnected] = useState(false);

  const tick = useCallback(async () => {
    try {
      const res = await fetch(`${FLASK_URL}/api/emotion`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error("bad");
      const data: LiveEmotionState = await res.json();
      setState(data);
      setTheme(getTheme(data.emotion));
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [tick]);

  return { state, theme, connected, refresh: tick };
}
