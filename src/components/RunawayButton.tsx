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
 *
 * Perf notes:
 * - mousemove is throttled via requestAnimationFrame to avoid layout thrashing.
 * - getBoundingClientRect() calls are batched inside the RAF callback.
 * - Event listener uses { passive: true } to avoid blocking scroll.
 * - setTimeout is cleaned up on unmount.
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
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    };
  }, []);

  // Place the button to the right of center on mount
  // Note: we intentionally don't check buttonRef here — the position is derived
  // entirely from the container dimensions so the button doesn't need to be in
  // the DOM yet.  This lets us delay rendering until position is known,
  // preventing a visible "jump" from a CSS-fallback position to the real one.
  useEffect(() => {
    if (!containerRef.current || initialized) return;
    const rect = containerRef.current.getBoundingClientRect();

    setPosition({
      x: rect.width / 2 + initialLeftOffset,
      y: rect.height * (initialTopPercent / 100) + 12,
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
    const padding = container.width < 400 ? 16 : 24;
    const sidePadding = container.width < 400 ? 20 : padding;

    const maxX = container.width - button.width - sidePadding;
    const maxY = container.height - button.height - padding;

    let newX: number, newY: number;
    let attempts = 0;

    do {
      newX = sidePadding + Math.random() * (maxX - sidePadding);
      newY = padding + Math.random() * (maxY - padding);
      attempts++;
    } while (
      position &&
      Math.hypot(newX - position.x, newY - position.y) < 150 &&
      attempts < 50
    );

    setPosition({ x: newX, y: newY });

    moveTimerRef.current = setTimeout(() => {
      isMovingRef.current = false;
    }, 450);
  }, [containerRef, position, surrendered, maxDodges]);

  // Desktop: flee when cursor gets close — throttled via RAF
  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button || !initialized || surrendered) return;

    let rafId: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const checkDistance = () => {
      rafId = null;
      if (!buttonRef.current) return;
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const distance = Math.hypot(lastMouseX - btnCenterX, lastMouseY - btnCenterY);

      if (distance < 100) {
        moveAway();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      // Throttle: only schedule one RAF per frame
      if (rafId === null) {
        rafId = requestAnimationFrame(checkDistance);
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [containerRef, moveAway, initialized, surrendered]);

  // Don't render until position is calculated — avoids the visible "jump"
  // from a CSS-fallback position to the computed pixel position.
  if (hidden || !initialized) return null;

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
      className={`absolute px-10 sm:px-16 py-5 font-bold rounded-full
                 select-none focus:outline-none focus:ring-2
                 text-2xl sm:text-3xl cursor-pointer
                 liquid-glass
                 ${turnedYes
                   ? "liquid-glass-pink text-white focus:ring-pink-300 animate-glow-pulse"
                   : "liquid-glass-gray text-gray-700 focus:ring-gray-400"
                 }`}
      style={{
        left: `${position!.x}px`,
        top: `${position!.y}px`,
        zIndex: 10,
        // Only transition position after the first dodge so the initial
        // placement is instant (no glitchy slide from a default position).
        transition: dodgeCountRef.current > 0 || surrendered
          ? "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease, color 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease"
          : "background 0.5s ease, color 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease",
        willChange: "left, top",
      }}
    >
      {turnedYes ? "ДА" : label}
    </button>
  );
}
