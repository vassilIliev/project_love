"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";
import ConfettiButton from "./ConfettiButton";
import RunawayButton from "./RunawayButton";
import { useTranslations } from "@/i18n/context";

interface InvitationCardProps {
  recipientName: string;
  time?: string | null;
  place?: string | null;
  extraMessage?: string | null;
  isDemo?: boolean;
  fullScreen?: boolean;
}

/** Generate deterministic random hearts based on a seed string */
function generateHearts(seed: string, count: number = 35) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  const rand = () => {
    h = (h * 16807 + 0) % 2147483647;
    return (h & 0x7fffffff) / 2147483647;
  };

  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 16 + rand() * 32,
    opacity: 0.06 + rand() * 0.08,
    rotation: -30 + rand() * 60,
    duration: 5 + rand() * 8,
    delay: rand() * 5,
  }));
}

export default function InvitationCard({
  recipientName,
  time,
  place,
  extraMessage,
  isDemo = false,
}: InvitationCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMessage, setShowMessage] = useState(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dict = useTranslations();

  const hearts = useMemo(() => generateHearts(recipientName), [recipientName]);

  // Cleanup confetti RAF and timers on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fireConfettiAndReveal = useCallback(() => {
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
        rafRef.current = requestAnimationFrame(frame);
      }
    };
    frame();

    confetti({
      particleCount: 180,
      spread: 140,
      origin: { y: 0.55 },
      colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff4500", "#e91e63", "#e879f9", "#c084fc"],
    });

    timerRef.current = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4, x: 0.5 },
        colors: ["#fbbf24", "#f472b6", "#a78bfa", "#fb923c"],
        scalar: 1.2,
      });
    }, 400);

    setShowMessage(true);
  }, []);

  const handleConfirm = useCallback(() => setShowMessage(true), []);

  // Count how many detail items we have for staggering
  const detailItems = useMemo(
    () => [time, place, extraMessage].filter(Boolean),
    [time, place, extraMessage]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-screen min-h-screen overflow-hidden animate-bg-drift"
      style={{
        background: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 15%, #f0abfc 30%, #f9a8d4 50%, #e879f9 70%, #c4b5fd 85%, #ddd6fe 100%)",
      }}
    >
      {/* Animated heart background with gentle drift — isolated paint layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ contain: "strict" }}
      >
        {hearts.map((h, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="absolute animate-heart-drift"
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              width: `${h.size}px`,
              height: `${h.size}px`,
              opacity: h.opacity,
              "--heart-opacity": h.opacity,
              "--heart-rotation": `${h.rotation}deg`,
              "--heart-duration": `${h.duration}s`,
              "--heart-delay": `${h.delay}s`,
            } as React.CSSProperties}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      {/* Subtle radial glow overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Question — vertically centered in the top half */}
      <div
        className={`absolute left-0 right-0 text-center z-10 px-4 sm:px-6
                    ${showMessage ? "opacity-0 pointer-events-none scale-95" : "opacity-100"}`}
        style={{ top: "50%", transform: "translateY(calc(-100% - 48px))", transition: "opacity 0.7s ease, transform 0.7s ease" }}
      >
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight break-words overflow-wrap-anywhere max-w-[90vw] mx-auto animate-stagger-in stagger-1">
          <span className="text-pink-600 break-words">{recipientName}</span>,
          <br />
          <span className="animate-stagger-in stagger-2 inline-block">
            {dict.invitation.question}
          </span>
        </h2>
      </div>

      {/* YES — static, slightly left of center, vertically at 50% */}
      <div
        className={`absolute z-20
                    ${showMessage ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}`}
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(calc(-100% - 8px), 12px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <ConfettiButton label={dict.invitation.yes} onConfirm={handleConfirm} />
      </div>

      {/* NO — starts slightly right of center, runs away on approach */}
      <RunawayButton
        containerRef={containerRef}
        label={dict.invitation.no}
        yesLabel={dict.invitation.yes}
        hidden={showMessage}
        initialTopPercent={50}
        initialLeftOffset={12}
        onSurrender={fireConfettiAndReveal}
      />

      {/* Revealed message — staggered reveal */}
      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6">
          <div className="text-center space-y-3 sm:space-y-4 w-full max-w-[90vw] sm:max-w-lg">
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-pink-600 animate-reveal-item" style={{ animationDelay: "0s" }}>
              {dict.invitation.hooray}
            </p>

            {time && (
              <div className="flex items-center justify-center gap-2 text-gray-700 animate-reveal-item" style={{ animationDelay: "0.2s" }}>
                <p className="text-base sm:text-xl md:text-2xl break-words overflow-wrap-anywhere">
                  <span className="font-medium">{dict.invitation.dateTime}</span> {time}
                </p>
              </div>
            )}

            {place && (
              <div className="flex items-center justify-center gap-2 text-gray-700 animate-reveal-item" style={{ animationDelay: "0.35s" }}>
                <p className="text-base sm:text-xl md:text-2xl break-words overflow-wrap-anywhere">
                  <span className="font-medium">{dict.invitation.place}</span> {place}
                </p>
              </div>
            )}

            {extraMessage && (
              <p
                className="text-base sm:text-xl md:text-2xl text-gray-600 italic bg-white/40 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mx-auto max-w-md break-words overflow-wrap-anywhere animate-reveal-item shadow-lg shadow-purple-200/20"
                style={{ animationDelay: `${0.2 + detailItems.indexOf(extraMessage) * 0.15 + 0.15}s` }}
              >
                &ldquo;{extraMessage}&rdquo;
              </p>
            )}

            <div
              className="pt-2 sm:pt-3 text-sm sm:text-base text-gray-500 font-medium animate-reveal-item"
              style={{ animationDelay: `${0.3 + detailItems.length * 0.15 + 0.15}s` }}
            >
              {dict.invitation.seeYou}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
