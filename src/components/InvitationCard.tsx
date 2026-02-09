"use client";

import { useRef, useState, useMemo } from "react";
import ConfettiButton from "./ConfettiButton";
import RunawayButton from "./RunawayButton";

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

  const hearts = useMemo(() => generateHearts(recipientName), [recipientName]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 20%, #f0abfc 40%, #f9a8d4 60%, #e879f9 80%, #c4b5fd 100%)",
      }}
    >
      {/* Randomly placed heart background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {hearts.map((h, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="absolute"
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              width: `${h.size}px`,
              height: `${h.size}px`,
              opacity: h.opacity,
              transform: `rotate(${h.rotation}deg)`,
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>


      {/* Въпрос — вертикално центриран в горната половина */}
      <div
        className={`absolute left-0 right-0 text-center z-10 px-4 sm:px-6
                    transition-opacity duration-500 ${showMessage ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ top: "50%", transform: "translateY(calc(-100% - 48px))" }}
      >
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight break-words overflow-wrap-anywhere max-w-[90vw] mx-auto">
          <span className="text-pink-600 break-words">{recipientName}</span>,
          <br />
          ще излезеш ли на среща с мен?
        </h2>
      </div>

      {/* ДА — статичен, леко вляво от центъра, вертикално на 50% */}
      <div
        className={`absolute z-20 transition-opacity duration-500
                    ${showMessage ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(calc(-100% - 12px), 12px)",
        }}
      >
        <ConfettiButton label="ДА" onConfirm={() => setShowMessage(true)} />
      </div>

      {/* НЕ — стартира леко вдясно от центъра, бяга при приближаване */}
      <RunawayButton
        containerRef={containerRef}
        label="НЕ"
        hidden={showMessage}
        initialTopPercent={50}
        initialLeftOffset={16}
      />

      {/* Разкрито съобщение */}
      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in px-4 sm:px-6">
          <div className="text-center space-y-3 sm:space-y-4 w-full max-w-[90vw] sm:max-w-lg">
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-pink-600">
              Ураа!
            </p>

            {time && (
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <p className="text-base sm:text-xl md:text-2xl break-words overflow-wrap-anywhere">
                  <span className="font-medium">Час:</span> {time}
                </p>
              </div>
            )}

            {place && (
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <p className="text-base sm:text-xl md:text-2xl break-words overflow-wrap-anywhere">
                  <span className="font-medium">Място:</span> {place}
                </p>
              </div>
            )}

            {extraMessage && (
              <p className="text-base sm:text-xl md:text-2xl text-gray-600 italic bg-white/40 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mx-auto max-w-md break-words overflow-wrap-anywhere">
                {extraMessage}
              </p>
            )}

            <div className="pt-2 sm:pt-3 text-sm sm:text-base text-gray-400">
              Ще се видим там!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
