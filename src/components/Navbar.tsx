"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3
                  backdrop-blur-xl border-b transition-all duration-500 animate-nav-border
                  ${scrolled
                    ? "bg-gradient-to-r from-pink-50/60 via-pink-100/55 to-rose-50/60 shadow-lg shadow-pink-200/50 py-2.5"
                    : "bg-gradient-to-r from-pink-50/45 via-pink-100/40 to-rose-50/45 py-3"
                  }`}
    >
      <a
        href="/"
        className="group text-lg font-bold text-pink-600 transition-all duration-300 hover:text-pink-700 flex items-center gap-1.5"
      >
        <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
          💝
        </span>
        <span className="relative">
          datememaybe.net
          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-300 group-hover:w-full" />
        </span>
      </a>
      <a
        href="#create-section"
        className="liquid-glass liquid-glass-pink px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium text-white
                   rounded-full transition-all duration-300
                   hover:scale-105 active:scale-95"
      >
        Създай покана 💌
      </a>
    </nav>
  );
}
