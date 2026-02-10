"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface ConfettiButtonProps {
  label?: string;
  onConfirm: () => void;
}

/**
 * The YES button. On click, fires a dramatic confetti celebration and calls onConfirm.
 * Features a pulsing glow and shimmer to draw attention.
 */
export default function ConfettiButton({
  label = "YES",
  onConfirm,
}: ConfettiButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);

    // Fire confetti from multiple angles
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500", "#e879f9", "#c084fc"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500", "#e879f9", "#c084fc"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big center burst
    confetti({
      particleCount: 180,
      spread: 140,
      origin: { y: 0.55 },
      colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500", "#e91e63", "#e879f9", "#c084fc"],
    });

    // Delayed secondary burst for extra drama
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4, x: 0.5 },
        colors: ["#fbbf24", "#f472b6", "#a78bfa", "#fb923c"],
        scalar: 1.2,
      });
    }, 400);

    onConfirm();
  };

  return (
    <button
      aria-label={`${label} button`}
      onClick={handleClick}
      disabled={clicked}
      className={`liquid-glass liquid-glass-pink relative z-20 px-16 py-5
                 text-white font-bold rounded-full transition-all duration-300
                 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-pink-300
                 text-3xl disabled:opacity-80 cursor-pointer
                 hover:scale-105
                 ${!clicked ? "animate-glow-pulse" : ""}`}
    >
      {label}
    </button>
  );
}
