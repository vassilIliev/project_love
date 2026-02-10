"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/context";

/**
 * Client-side timezone-based locale redirect.
 *
 * Runs once on first visit when no explicit locale cookie exists.
 * Detects the user's timezone via `Intl.DateTimeFormat` and redirects
 * to Bulgarian if the timezone is Europe/Sofia.
 *
 * This covers cases where server-side geo headers aren't available
 * (local development, non-Vercel hosts, VPNs, etc.).
 */

const BG_TIMEZONES = ["Europe/Sofia"];

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function LocaleRedirect() {
  const currentLocale = useLocale();

  useEffect(() => {
    // If user already made an explicit language choice, don't override
    if (getCookie("NEXT_LOCALE")) return;

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shouldBeBg = BG_TIMEZONES.includes(tz);

      if (shouldBeBg && currentLocale !== "bg") {
        // Swap /en to /bg in the current URL and redirect
        const newPath = window.location.pathname.replace(/^\/(en)/, "/bg");
        window.location.replace(newPath + window.location.search + window.location.hash);
      }
    } catch {
      // Intl not supported — do nothing
    }
  }, [currentLocale]);

  return null;
}
