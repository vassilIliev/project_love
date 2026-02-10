"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RunawayButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  label?: string;
  hidden?: boolean;
  initialTopPercent?: number;
  initialLeftOffset?: number;
  /** Called when the user clicks the surrendered button after it turned to YES */
  onSurrender?: () => void;
  /** Max dodge count before the button stops running */
  maxDodges?: number;
}

/**
 * NO button — always absolutely positioned.
 * Starts to the right of the midpoint (forming a centered pair with YES),
 * and smoothly flees when the cursor approaches.
 * After maxDodges it stops running. First click turns it into YES, second click confirms.
 */
export default function RunawayButton({
  containerRef,
  label = "NO",
  hidden = false,
  initialTopPercent = 55,
  initialLeftOffset = 16,
  onSurrender,
  maxDodges = 20,
}: RunawayButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [surrendered, setSurrendered] = useState(false);
  const [turnedYes, setTurnedYes] = useState(false);
  const isMovingRef = useRef(false);
  const dodgeCountRef = useRef(0);

  // Place the button to the right of center on mount
  useEffect(() => {
    if (!containerRef.current || !buttonRef.current || initialized) return;
    const cw = containerRef.current.getBoundingClientRect().width;
    const ch = containerRef.current.getBoundingClientRect().height;

    setPosition({
      x: cw / 2 + initialLeftOffset,
      y: ch * (initialTopPercent / 100) + 12,
    });
    setInitialized(true);
  }, [containerRef, initialized, initialTopPercent, initialLeftOffset]);

  const moveAway = useCallback(() => {
    if (surrendered) return;
    if (isMovingRef.current) return;
    if (!containerRef.current || !buttonRef.current) return;

    dodgeCountRef.current += 1;

    if (dodgeCountRef.current >= maxDodges) {
      setSurrendered(true);
      return;
    }

    isMovingRef.current = true;

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();
    const padding = 24;

    const maxX = container.width - button.width - padding;
    const maxY = container.height - button.height - padding;

    let newX: number, newY: number;
    let attempts = 0;

    do {
      newX = padding + Math.random() * (maxX - padding);
      newY = padding + Math.random() * (maxY - padding);
      attempts++;
    } while (
      position &&
      Math.hypot(newX - position.x, newY - position.y) < 150 &&
      attempts < 50
    );

    setPosition({ x: newX, y: newY });

    setTimeout(() => {
      isMovingRef.current = false;
    }, 450);
  }, [containerRef, position, surrendered, maxDodges]);

  // Desktop: flee when cursor gets close
  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button || !initialized || surrendered) return;

    const handleMouseMove = (e: MouseEvent) => {
      const btnRect = button.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      if (distance < 100) {
        moveAway();
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef, moveAway, initialized, surrendered]);

  if (hidden) return null;

  const handleClick = () => {
    if (!surrendered) return;

    if (!turnedYes) {
      // First click: turn into YES
      setTurnedYes(true);
    } else {
      // Second click: act as YES — fire confetti & reveal
      onSurrender?.();
    }
  };

  return (
    <button
      ref={buttonRef}
      aria-label={turnedYes ? "ДА button" : `${label} button`}
      onMouseEnter={surrendered ? undefined : moveAway}
      onMouseDown={(e) => {
        if (!surrendered) {
          e.preventDefault();
          moveAway();
        }
      }}
      onTouchStart={(e) => {
        if (!surrendered) {
          e.preventDefault();
          moveAway();
        }
      }}
      onClick={surrendered ? handleClick : undefined}
      className={`absolute px-16 py-5 font-bold rounded-full
                 select-none focus:outline-none focus:ring-2
                 text-3xl cursor-pointer
                 liquid-glass transition-all duration-500
                 ${turnedYes
                   ? "liquid-glass-pink text-white focus:ring-pink-300 animate-glow-pulse"
                   : "liquid-glass-gray text-gray-700 focus:ring-gray-400"
                 }`}
      style={{
        left: position ? `${position.x}px` : `calc(50% + ${initialLeftOffset}px)`,
        top: position ? `${position.y}px` : `${initialTopPercent}%`,
        transform: position ? "none" : "translateY(-50%)",
        zIndex: 10,
        transition: "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease, color 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease",
      }}
    >
      {turnedYes ? "ДА" : label}
    </button>
  );
}
