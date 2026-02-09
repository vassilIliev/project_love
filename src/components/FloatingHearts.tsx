"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  emoji: string;
}

/**
 * Decorative floating hearts background animation.
 */
export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const emojis = ["💕", "💗", "💖", "💘", "❤️", "🩷", "🌹"];
    const generated: Heart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 14 + Math.random() * 20,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 15,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute animate-float-heart"
          style={{
            left: heart.left,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            bottom: "-40px",
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}
