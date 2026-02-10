"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  emoji: string;
  blur: number;
  swayAmount: number;
}

/**
 * Decorative floating hearts background animation.
 * Hearts float upward with gentle sway, varied blur for depth-of-field effect.
 */
export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const emojis = ["💕", "💗", "💖", "💘", "❤️", "🩷", "🌹", "✨", "💫"];
    const generated: Heart[] = Array.from({ length: 20 }, (_, i) => {
      const depth = Math.random(); // 0 = far/blurry, 1 = close/sharp
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: 12 + depth * 22,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 14,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        blur: depth < 0.3 ? 2 : 0,
        swayAmount: 10 + Math.random() * 20,
      };
    });
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
            filter: heart.blur ? `blur(${heart.blur}px)` : undefined,
            willChange: "transform, opacity",
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}
