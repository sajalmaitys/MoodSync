"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { EmotionTheme } from "@/lib/emotions";

interface Props {
  theme: EmotionTheme;
  /** Backend detector message (e.g. camera open failure) */
  detectorError?: string | null;
  flaskUrl?: string; // Kept for backwards compatibility if needed
}

/** MJPEG must hit Flask directly — Next route/proxy often buffers and breaks multipart streams in <img>. */
const FLASK_BASE = (process.env.NEXT_PUBLIC_FLASK_URL || "http://localhost:5000").replace(/\/$/, "");

export default function WebcamPreview({ theme, detectorError }: Props) {
  const [visible, setVisible] = useState(true);
  const [showStream, setShowStream] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHiddenRef = useRef(false);
  /** MJPEG can fire onLoad every frame — only react once per stream URL. */
  const loadHandledForKey = useRef<number | null>(null);

  const streamSrc = `${FLASK_BASE}/api/stream?r=${retryKey}`;

  useEffect(() => {
    loadHandledForKey.current = null;
  }, [retryKey]);

  useEffect(() => {
    if (!visible) {
      wasHiddenRef.current = true;
      return;
    }
    if (wasHiddenRef.current) {
      wasHiddenRef.current = false;
      setError(false);
      setShowStream(false);
      setRetryKey((k) => k + 1);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && !error) {
      showTimer.current = setTimeout(() => setShowStream(true), 400);
    }
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, [visible, error, retryKey]);

  const handleError = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    setShowStream(false);
    setError(true);
  }, []);

  const handleStreamLoad = useCallback(() => {
    if (loadHandledForKey.current === retryKey) return;
    loadHandledForKey.current = retryKey;
    if (showTimer.current) clearTimeout(showTimer.current);
    setShowStream(true);
  }, [retryKey]);

  const retry = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    setError(false);
    setShowStream(false);
    setRetryKey((k) => k + 1);
  }, []);

  const transientCameraMsg =
    !!detectorError &&
    detectorError !== "no_face" &&
    /reconnect|retrying|connecting to webcam|hiccup|dropped|no camera available/i.test(detectorError);

  const blockingDetectorError =
    !!detectorError && detectorError !== "no_face" && !transientCameraMsg;

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            style={{
              background: showStream && !error ? "#ef4444" : "#f87171",
              animation: showStream && !error ? "none" : "pulse 1.5s ease-in-out infinite",
            }}
          />
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5 text-white/70"><path d="M15 10l5-4v12l-5-4v-4z"></path><rect x="4" y="6" width="11" height="12" rx="2"></rect></svg>
          <span className="text-white text-base font-bold tracking-wide">Live Camera</span>
        </div>
        <button
          id="toggle-camera-btn"
          onClick={() => setVisible((v) => !v)}
          className="text-[10px] uppercase tracking-widest font-bold text-white/50 border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {/* Video stream container */}
      {visible && (
        <div className="relative flex-1 bg-[#050508] overflow-hidden group">
          {blockingDetectorError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="text-2xl opacity-80" aria-hidden>⚠️</span>
              <p className="text-sm font-semibold text-white/85 leading-snug max-w-sm">
                {detectorError.startsWith("Camera stream lost")
                  ? "The webcam feed dropped. Close other apps using the camera, then restart the Python backend."
                  : detectorError}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider max-w-sm">
                If it keeps happening: set CAMERA_INDEX in backend/.env (see python test_cameras.py)
              </p>
            </div>
          ) : !error ? (
            <>
              {/* Fallback / Loading Background Pattern */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mb-4 opacity-50"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                 <span className="text-xs uppercase tracking-[0.2em] font-bold">Stream Optimized</span>
              </div>

              {/* MJPEG stream */}
              <img
                key={retryKey}
                id="webcam-stream"
                src={streamSrc}
                alt="Live webcam emotion detection"
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleError}
                onLoad={handleStreamLoad}
                style={{
                  display: "block",
                  opacity: showStream ? 1 : 0,
                  transition: "opacity 0.8s ease",
                }}
              />

              {/* Emotion overlay badge (Top Right) */}
              {showStream && !error && (
                <div
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black text-white backdrop-blur-md shadow-lg"
                  style={{ background: theme.accentHex + "33", border: `1px solid ${theme.accentHex}80` }}
                >
                  <span className="drop-shadow-sm">{theme.label} 87%</span>
                </div>
              )}

              {transientCameraMsg && detectorError && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 max-w-[90%] rounded-lg border border-amber-500/30 bg-black/70 px-3 py-2 text-center text-[11px] text-amber-100/95 backdrop-blur-sm">
                  {detectorError}
                </div>
              )}

              {/* Mini controls overlay (Bottom Left) */}
              <div className="absolute bottom-5 left-5 flex gap-2 z-20">
                <button 
                  onClick={retry}
                  title="Reload Camera Stream"
                  className={`w-10 h-10 rounded-full backdrop-blur border flex items-center justify-center transition-all ${
                    showStream ? "bg-white/20 border-white/30 text-white" : "bg-black/40 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </button>
                <button 
                  title="Toggle Grid View"
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </button>
              </div>
            </>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
               <span className="text-4xl opacity-50">📷</span>
               <p className="text-sm font-semibold uppercase tracking-widest">Stream unavailable</p>
               <button
                 className="text-xs text-white/50 border border-white/10 hover:text-white hover:bg-white/10 transition-colors mt-2 px-4 py-2 rounded-full uppercase tracking-widest font-bold"
                 onClick={retry}
               >
                 Retry Connection
               </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
