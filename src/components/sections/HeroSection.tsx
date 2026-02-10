"use client";

import { useCallback } from "react";

/**
 * Hero section — the main landing view.
 *
 * Perf notes:
 * - All animations are CSS-only with GPU-composited properties.
 * - scrollIntoView uses smooth behavior (native browser implementation).
 * - No re-renders needed — scrollTo callbacks are stable via useCallback.
 */
export default function HeroSection() {
  const scrollToForm = useCallback(() => {
    document.getElementById("create-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToDemo = useCallback(() => {
    document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 text-center">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Animated emoji with decorative ring */}
        <div className="animate-stagger-in stagger-1 !mb-1">
          <div className="emoji-ring inline-block">
            <div className="text-6xl sm:text-7xl animate-gentle-float">💝</div>
          </div>
        </div>

        {/* Main heading with animated gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 leading-tight animate-stagger-in stagger-2 !mt-0">
          Искаш ли да направиш{" "}
          <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent animate-gradient-text">
            предложение, на което не могат да ти откажат
          </span>
          ?
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto animate-stagger-in stagger-3">
          Създай персонализирана линк-покана, на която половинката ти
          не може да каже &bdquo;не&ldquo;. Буквално. 😏
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 animate-stagger-in stagger-4">
          <button
            onClick={scrollToForm}
            className="liquid-glass liquid-glass-pink px-8 py-4
                       text-white font-semibold rounded-full text-lg
                       active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400
                       cursor-pointer animate-glow-pulse hover:scale-105"
          >
            Създай своята сега 💌
          </button>
          <button
            onClick={scrollToDemo}
            className="liquid-glass liquid-glass-light group px-8 py-4 text-pink-600 font-semibold rounded-full text-lg
                       active:scale-95 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 cursor-pointer hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Виж примерна покана
              <span
                className="inline-block group-hover:translate-x-0.5 group-hover:scale-110"
                style={{ transition: "transform 0.3s ease" }}
              >
                👀
              </span>
            </span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8 animate-stagger-in stagger-5">
          <div className="animate-bounce text-pink-300 text-2xl flex flex-col items-center gap-1">
            <span className="text-xs tracking-widest uppercase text-gray-400 font-medium">Разгледай</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
