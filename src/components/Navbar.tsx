"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "@/i18n/context";

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
  const dict = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const otherLocale = locale === "bg" ? "en" : "bg";
  const switchedPath = pathname.replace(/^\/(bg|en)/, `/${otherLocale}`);

  const handleLangSwitch = useCallback(() => {
    // Set cookie so the middleware remembers the explicit choice
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }, [otherLocale]);

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
        href={`/${locale}`}
        className="group text-lg font-bold text-pink-600 flex items-center gap-1.5"
        style={{ transition: "color 0.3s ease" }}
      >
        <span className="inline-block" style={{ transition: "transform 0.3s ease" }}>
          💝
        </span>
        <span className="relative">
          {dict.nav.brand}
          <span
            className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full group-hover:w-full"
            style={{ transition: "width 0.3s ease" }}
          />
        </span>
      </a>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language switcher — shows current locale flag, click to toggle */}
        <a
          href={switchedPath}
          onClick={handleLangSwitch}
          className="text-xl sm:text-2xl hover:scale-110 active:scale-95 rounded-full"
          style={{ transition: "transform 0.2s ease" }}
          title={locale === "bg" ? "Switch to English" : "Превключи на български"}
          aria-label={locale === "bg" ? "Switch to English" : "Превключи на български"}
        >
          {locale === "bg" ? "🇺🇸" : "🇧🇬"}
        </a>

        <a
          href="#create-section"
          className="liquid-glass liquid-glass-pink px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium text-white
                     rounded-full active:scale-95 hover:scale-105"
        >
          {dict.nav.cta}
        </a>
      </div>
    </nav>
  );
}
