export type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "fear"
  | "surprise"
  | "disgust"
  | "neutral";

export interface EmotionTheme {
  label: string;
  emoji: string;
  gradient: string;         // CSS gradient for background
  accent: string;           // Primary accent colour (Tailwind class)
  accentHex: string;        // Hex for inline styles
  textColor: string;        // Tailwind text class
  musicFile: string;        // File in /public/music/
  particleColor: string;
  animation: string;        // CSS animation class defined in globals.css
  description: string;
}

export const EMOTION_THEMES: Record<string, EmotionTheme> = {
  happy: {
    label: "Happy",
    emoji: "😊",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 40%, #fbbf24 100%)",
    accent: "text-amber-400",
    accentHex: "#f59e0b",
    textColor: "text-amber-950",
    musicFile: "/music/happy-happy-happy-song.mp3",
    particleColor: "#fbbf24",
    animation: "animate-float",
    description: "You're glowing! Keep that energy!",
  },
  sad: {
    label: "Sad",
    emoji: "😢",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #1e1b4b 100%)",
    accent: "text-blue-300",
    accentHex: "#93c5fd",
    textColor: "text-blue-100",
    musicFile: "/music/sad-hamster.mp3",
    particleColor: "#60a5fa",
    animation: "animate-rain",
    description: "It's okay to feel down. Music helps.",
  },
  angry: {
    label: "Angry",
    emoji: "😠",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #450a0a 100%)",
    accent: "text-red-300",
    accentHex: "#f87171",
    textColor: "text-red-100",
    musicFile: "/music/angry-boat-5.mp3",
    particleColor: "#ef4444",
    animation: "animate-pulse-fast",
    description: "Take a deep breath. Let the music calm you.",
  },
  fear: {
    label: "Fearful",
    emoji: "😨",
    gradient: "linear-gradient(135deg, #064e3b 0%, #059669 40%, #022c22 100%)",
    accent: "text-emerald-300",
    accentHex: "#6ee7b7",
    textColor: "text-emerald-100",
    musicFile: "/music/studio-audience-awwww-sound-fx.mp3",
    particleColor: "#34d399",
    animation: "animate-flicker",
    description: "You're safe. Let's breathe together.",
  },
  surprise: {
    label: "Surprised",
    emoji: "😲",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #ec4899 100%)",
    accent: "text-purple-300",
    accentHex: "#c4b5fd",
    textColor: "text-purple-100",
    musicFile: "/music/huh-cat.mp3",
    particleColor: "#a78bfa",
    animation: "animate-confetti",
    description: "Wow! Something caught your eye!",
  },
  disgust: {
    label: "Disgusted",
    emoji: "🤢",
    gradient: "linear-gradient(135deg, #365314 0%, #84cc16 40%, #1a2e05 100%)",
    accent: "text-lime-300",
    accentHex: "#bef264",
    textColor: "text-lime-100",
    musicFile: "/music/the-rap-battle-parody-oh_1.mp3",
    particleColor: "#a3e635",
    animation: "animate-wave",
    description: "Something's off. Music to the rescue.",
  },
  neutral: {
    label: "Neutral",
    emoji: "😐",
    gradient: "linear-gradient(135deg, #1e293b 0%, #475569 50%, #0f172a 100%)",
    accent: "text-slate-300",
    accentHex: "#94a3b8",
    textColor: "text-slate-200",
    musicFile: "/music/accha-thik-hai-samjhgya-puneet-superstar.mp3",
    particleColor: "#94a3b8",
    animation: "animate-breathe",
    description: "Just chilling. All good.",
  },
};

export function getTheme(emotion: string): EmotionTheme {
  return EMOTION_THEMES[emotion.toLowerCase()] ?? EMOTION_THEMES.neutral;
}
