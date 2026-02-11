"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "@/i18n/context";

const LIMITS = {
  recipientName: 50,
  time: 50,
  place: 50,
  extraMessage: 100,
} as const;

type FieldName = keyof typeof LIMITS;

/**
 * Simple form — no auth needed.
 * User fills in invitation details → pays via Stripe → gets shareable link.
 * Stripe Checkout collects the user's email automatically.
 *
 * Perf notes:
 * - inputClass and fieldErrorMsg are pure functions, no allocation on render.
 * - handleChange only updates state when limit boundary is crossed.
 */
export default function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, boolean>>>({});
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const dict = useTranslations();
  const locale = useLocale();

  // Reset loading state when user navigates back (e.g. from Stripe checkout).
  // The "pageshow" event fires on back/forward navigation, including bfcache restores.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleChange = useCallback((field: FieldName, value: string) => {
    const atLimit = value.length >= LIMITS[field];
    setFieldErrors((prev) => {
      if (prev[field] === atLimit) return prev; // Avoid unnecessary state update
      return { ...prev, [field]: atLimit };
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const ref = typeof window !== "undefined" ? sessionStorage.getItem("ref") : null;
    const data = {
      recipientName: (fd.get("recipientName") as string)?.trim(),
      time: (fd.get("time") as string)?.trim() || undefined,
      place: (fd.get("place") as string)?.trim() || undefined,
      extraMessage: (fd.get("extraMessage") as string)?.trim() || undefined,
      locale,
      ...(ref ? { ref } : {}),
    };

    if (!data.recipientName) {
      setError(dict.form.requiredError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || dict.form.genericError);
        setLoading(false);
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      }
    } catch {
      setError(dict.form.networkError);
      setLoading(false);
    }
  }, [locale, dict]);

  const fieldErrorMsg = (field: FieldName) =>
    fieldErrors[field] ? (
      <p className="text-red-500 text-xs mt-1 animate-fade-in">{dict.form.maxChars.replace("{n}", String(LIMITS[field]))}</p>
    ) : null;

  const inputClass = (field: FieldName) =>
    `w-full px-4 py-3 rounded-xl border text-gray-800 bg-white placeholder-gray-400
     outline-none input-glow
     ${focusedField === field
       ? "border-pink-400 ring-2 ring-pink-200/60 shadow-md shadow-pink-100/30"
       : "border-gray-200 hover:border-pink-200"
     }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
      {/* Privacy notice */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPrivacy((v) => !v)}
          className="flex items-center gap-2 mx-auto px-3.5 py-1.5 rounded-full
                     bg-emerald-50 border border-emerald-200/60 text-emerald-700
                     hover:bg-emerald-100/80 active:scale-[0.97] cursor-pointer
                     group"
          style={{ transition: "background 0.2s ease, transform 0.1s ease" }}
          aria-expanded={showPrivacy}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-600 shrink-0"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs font-semibold">{dict.form.privacyLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-emerald-500 shrink-0 ${showPrivacy ? "rotate-180" : ""}`}
            style={{ transition: "transform 0.25s ease" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div
          className={`overflow-hidden ${showPrivacy ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`}
          style={{ transition: "max-height 0.35s ease, opacity 0.3s ease, margin 0.3s ease" }}
        >
          <div className="bg-emerald-50/70 border border-emerald-200/50 rounded-xl px-4 py-3 text-xs text-emerald-800 leading-relaxed text-left space-y-2">
            <p>{dict.form.privacyTooltip}</p>
            <p>{dict.form.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Recipient name */}
      <div className="group">
        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1.5 text-left group-focus-within:text-pink-600" style={{ transition: "color 0.2s ease" }}>
          {dict.form.recipientLabel} <span className="text-pink-500">*</span>
        </label>
        <input
          id="recipientName"
          name="recipientName"
          type="text"
          required
          maxLength={LIMITS.recipientName}
          autoComplete="off"
          placeholder={dict.form.recipientPlaceholder}
          onFocus={() => setFocusedField("recipientName")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("recipientName", e.target.value)}
          className={inputClass("recipientName")}
        />
        {fieldErrorMsg("recipientName")}
      </div>

      {/* Time */}
      <div className="group">
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1.5 text-left group-focus-within:text-pink-600" style={{ transition: "color 0.2s ease" }}>
          {dict.form.timeLabel}
        </label>
        <input
          id="time"
          name="time"
          type="text"
          maxLength={LIMITS.time}
          autoComplete="off"
          placeholder={dict.form.timePlaceholder}
          onFocus={() => setFocusedField("time")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("time", e.target.value)}
          className={inputClass("time")}
        />
        {fieldErrorMsg("time")}
      </div>

      {/* Place */}
      <div className="group">
        <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1.5 text-left group-focus-within:text-pink-600" style={{ transition: "color 0.2s ease" }}>
          {dict.form.placeLabel}
        </label>
        <input
          id="place"
          name="place"
          type="text"
          maxLength={LIMITS.place}
          autoComplete="off"
          placeholder={dict.form.placePlaceholder}
          onFocus={() => setFocusedField("place")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("place", e.target.value)}
          className={inputClass("place")}
        />
        {fieldErrorMsg("place")}
      </div>

      {/* Extra message */}
      <div className="group">
        <label htmlFor="extraMessage" className="block text-sm font-medium text-gray-700 mb-1.5 text-left group-focus-within:text-pink-600" style={{ transition: "color 0.2s ease" }}>
          {dict.form.messageLabel}
        </label>
        <textarea
          id="extraMessage"
          name="extraMessage"
          maxLength={LIMITS.extraMessage}
          rows={3}
          autoComplete="off"
          placeholder={dict.form.messagePlaceholder}
          onFocus={() => setFocusedField("extraMessage")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("extraMessage", e.target.value)}
          className={`${inputClass("extraMessage")} resize-none`}
        />
        {fieldErrorMsg("extraMessage")}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-in border border-red-100">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="liquid-glass liquid-glass-pink w-full py-3.5 px-6
                   text-white font-semibold rounded-xl
                   disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400
                   active:scale-[0.98] cursor-pointer hover:scale-[1.02]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {dict.form.submitting}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {dict.form.submit}
            <span className="text-lg">💝</span>
          </span>
        )}
      </button>

      <p className="text-xs text-center text-gray-400 leading-relaxed">
        {dict.form.disclaimer}
      </p>
    </form>
  );
}
