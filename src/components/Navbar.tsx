"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Sticky navbar with scroll-aware background.
 *
 * Perf notes:
 * - Scroll handler already uses { passive: true }.
 * - Uses RAF-throttle to batch scroll reads to one per frame.
 * - Explicit transition properties on the nav element.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6
                  backdrop-blur-xl border-b animate-nav-border
                  ${scrolled
                    ? "bg-gradient-to-r from-pink-50/60 via-pink-100/55 to-rose-50/60 shadow-lg shadow-pink-200/50 py-2.5"
                    : "bg-gradient-to-r from-pink-50/45 via-pink-100/40 to-rose-50/45 py-3"
                  }`}
      style={{
        transition: "padding 0.5s ease, background 0.5s ease, box-shadow 0.5s ease",
      }}
    >
      <a
        href="/"
        className="group text-lg font-bold text-pink-600 flex items-center gap-1.5"
        style={{ transition: "color 0.3s ease" }}
      >
        <span className="inline-block" style={{ transition: "transform 0.3s ease" }}>
          💝
        </span>
        <span className="relative">
          datememaybe.net
          <span
            className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full group-hover:w-full"
            style={{ transition: "width 0.3s ease" }}
          />
        </span>
      </a>
      <a
        href="#create-section"
        className="liquid-glass liquid-glass-pink px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium text-white
                   rounded-full active:scale-95 hover:scale-105"
      >
        Създай покана 💌
      </a>
    </nav>
  );
}
