"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { EMOTION_THEMES } from "@/lib/emotions";

interface EmotionEvent {
  emotion: string;
  confidence: number;
  timestamp: string;
}

export default function MoodChart() {
  const [history, setHistory] = useState<EmotionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/emotions");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.reverse()); // oldest first for timeline
        }
      } catch {
        // MongoDB not available
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Pie distribution
  const counts: Record<string, number> = {};
  for (const e of history) {
    counts[e.emotion] = (counts[e.emotion] || 0) + 1;
  }
  const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));

  // Timeline: last 50 events with numeric emotion index
  const emotionList = Object.keys(EMOTION_THEMES);
  const timelineData = history.slice(-50).map((e) => ({
    time: new Date(e.timestamp).toLocaleTimeString(),
    emotion: e.emotion,
    index: emotionList.indexOf(e.emotion),
    confidence: Math.round(e.confidence * 100),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white/40">
        Loading mood history…
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/40 gap-3">
        <span className="text-4xl">📊</span>
        <p>No mood data yet. Start the camera to record emotions!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Timeline */}
      <div>
        <h3 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
          Mood Timeline (last 50 events)
        </h3>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
              <YAxis
                tickFormatter={(v) => emotionList[v] || ""}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                domain={[0, emotionList.length - 1]}
                ticks={emotionList.map((_, i) => i)}
              />
              <Tooltip
                contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}
                formatter={(value) => [emotionList[value as number] ?? String(value), "Emotion"]}
              />
              <Line
                type="monotone"
                dataKey="index"
                stroke="#818cf8"
                strokeWidth={2}
                dot={{ r: 3, fill: "#818cf8" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart */}
      <div>
        <h3 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">
          Emotion Distribution
        </h3>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                label={(props) => {
                  const name = String(props.name ?? "");
                  const percent = Number(props.percent ?? 0);
                  return `${EMOTION_THEMES[name]?.emoji || ""} ${Math.round(percent * 100)}%`;
                }}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={EMOTION_THEMES[entry.name]?.accentHex || "#64748b"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                formatter={(v) => [Number(v), "occurrences"]}
              />
              <Legend
                formatter={(v) =>
                  `${EMOTION_THEMES[v]?.emoji || ""} ${EMOTION_THEMES[v]?.label || v}`
                }
                wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Events", value: history.length },
          {
            label: "Most Common",
            value: pieData.sort((a, b) => b.value - a.value)[0]
              ? `${EMOTION_THEMES[pieData[0].name]?.emoji} ${EMOTION_THEMES[pieData[0].name]?.label}`
              : "—",
          },
          {
            label: "Avg Confidence",
            value:
              history.length > 0
                ? `${Math.round((history.reduce((s, e) => s + e.confidence, 0) / history.length) * 100)}%`
                : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
