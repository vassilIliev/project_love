"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface ConfettiButtonProps {
  label?: string;
  onConfirm: () => void;
}

/**
 * The YES button. On click, fires confetti and calls onConfirm.
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
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big center burst
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.55 },
      colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500", "#e91e63"],
    });

    onConfirm();
  };

  return (
    <button
      aria-label={`${label} button`}
      onClick={handleClick}
      disabled={clicked}
      className="relative z-20 px-16 py-5 bg-pink-500 hover:bg-pink-600
                 text-white font-bold rounded-full transition-all duration-200
                 shadow-lg hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-300
                 text-3xl disabled:opacity-80 cursor-pointer"
    >
      {label}
    </button>
  );
}
