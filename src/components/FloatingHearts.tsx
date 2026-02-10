"use client";

import React, { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  emoji: string;
  blur: number;
}

const EMOJIS = ["💕", "💗", "💖", "💘", "❤️", "🩷", "🌹", "✨", "💫"] as const;

/**
 * Decorative floating hearts background animation.
 * Hearts float upward with gentle sway, varied blur for depth-of-field effect.
 *
 * Perf notes:
 * - Container uses `contain: strict` to isolate paint/layout from the rest of the tree.
 * - Each heart is GPU-composited via will-change in the CSS class.
 * - Wrapped in React.memo since props never change.
 */
function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: 18 }, (_, i) => {
      const depth = Math.random(); // 0 = far/blurry, 1 = close/sharp
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: 12 + depth * 22,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 14,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        blur: depth < 0.3 ? 2 : 0,
      };
    });
    setHearts(generated);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{ contain: "strict" }}
    >
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
            contain: "layout style",
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}

export default React.memo(FloatingHearts);
