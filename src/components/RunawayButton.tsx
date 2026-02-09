"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RunawayButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  label?: string;
  hidden?: boolean;
  initialTopPercent?: number;
  initialLeftOffset?: number;
}

/**
 * NO button — always absolutely positioned.
 * Starts to the right of the midpoint (forming a centered pair with YES),
 * and smoothly flees when the cursor approaches.
 * Uses a throttled move to prevent jittery rapid repositioning.
 */
export default function RunawayButton({
  containerRef,
  label = "NO",
  hidden = false,
  initialTopPercent = 55,
  initialLeftOffset = 16,
}: RunawayButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isMovingRef = useRef(false);

  // Place the button to the right of center on mount
  useEffect(() => {
    if (!containerRef.current || !buttonRef.current || initialized) return;
    const cw = containerRef.current.getBoundingClientRect().width;
    const ch = containerRef.current.getBoundingClientRect().height;
    const bh = buttonRef.current.getBoundingClientRect().height;

    setPosition({
      x: cw / 2 + initialLeftOffset,
      y: ch * (initialTopPercent / 100) + 12,
    });
    setInitialized(true);
  }, [containerRef, initialized, initialTopPercent, initialLeftOffset]);

  const moveAway = useCallback(() => {
    // Throttle: don't move again while the CSS transition is still running
    if (isMovingRef.current) return;
    if (!containerRef.current || !buttonRef.current) return;

    isMovingRef.current = true;

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();
    const padding = 24;

    const maxX = container.width - button.width - padding;
    const maxY = container.height - button.height - padding;

    let newX: number, newY: number;
    let attempts = 0;

    // Pick a position that is far enough from current
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

    // Allow next move after the CSS transition finishes (500ms)
    setTimeout(() => {
      isMovingRef.current = false;
    }, 500);
  }, [containerRef, position]);

  // Desktop: flee when cursor gets close
  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button || !initialized) return;

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
  }, [containerRef, moveAway, initialized]);

  if (hidden) return null;

  return (
    <button
      ref={buttonRef}
      aria-label={`${label} button`}
      onMouseEnter={moveAway}
      onMouseDown={(e) => {
        e.preventDefault();
        moveAway();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        moveAway();
      }}
      className="absolute px-16 py-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full
                 select-none focus:outline-none focus:ring-2 focus:ring-gray-400
                 text-3xl shadow-md cursor-pointer"
      style={{
        left: position ? `${position.x}px` : `calc(50% + ${initialLeftOffset}px)`,
        top: position ? `${position.y}px` : `${initialTopPercent}%`,
        transform: position ? "none" : "translateY(-50%)",
        zIndex: 10,
        transition: "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {label}
    </button>
  );
}
