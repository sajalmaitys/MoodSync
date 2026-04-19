"use client";

import React, { useEffect, useRef } from "react";
import { EmotionTheme } from "@/lib/emotions";

interface Props {
  theme: EmotionTheme;
  emotion: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function MoodBackground({ theme, emotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles based on emotion
    const spawnParticles = () => {
      const count =
        emotion === "happy" || emotion === "surprise" ? 12
        : emotion === "angry" ? 8
        : 5;

      for (let i = 0; i < count; i++) {
        const angle =
          emotion === "sad"
            ? (Math.random() * Math.PI) / 4 + (3 * Math.PI) / 8   // rain-ish
            : Math.random() * Math.PI * 2;

        const speed =
          emotion === "angry" ? 2 + Math.random() * 3
          : emotion === "happy" || emotion === "surprise" ? 1 + Math.random() * 2
          : 0.3 + Math.random() * 0.7;

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: emotion === "sad" ? -10 : Math.random() * canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: emotion === "angry" ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
          alpha: 0.7 + Math.random() * 0.3,
          decay: 0.003 + Math.random() * 0.005,
          color: theme.particleColor,
        });
      }

      // Cap particles
      if (particlesRef.current.length > 200) {
        particlesRef.current.splice(0, particlesRef.current.length - 200);
      }
    };

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn periodically
      if (frame % 6 === 0) spawnParticles();

      // Draw & update particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        if (emotion === "happy" || emotion === "surprise") {
          // Circles with glow
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (emotion === "sad") {
          // Thin raindrop
          ctx.strokeStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 4, p.y + p.vy * 4);
          ctx.stroke();
        } else {
          // Generic glowing dot
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (emotion === "sad") {
          p.vy += 0.05; // gravity for rain
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      particlesRef.current = [];
    };
  }, [emotion, theme]);

  return (
    <div className="fixed inset-0 transition-all duration-1000" style={{ zIndex: 0 }}>
      {/* Gradient background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: theme.gradient }}
      />
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/noise.svg')]" />
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}
