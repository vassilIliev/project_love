"use client";

import { useState } from "react";

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
 */
export default function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, boolean>>>({});

  const handleChange = (field: FieldName, value: string) => {
    if (value.length >= LIMITS[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: true }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data = {
      recipientName: (fd.get("recipientName") as string)?.trim(),
      time: (fd.get("time") as string)?.trim() || undefined,
      place: (fd.get("place") as string)?.trim() || undefined,
      extraMessage: (fd.get("extraMessage") as string)?.trim() || undefined,
    };

    if (!data.recipientName) {
      setError("Моля, въведи име на получателя.");
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
        setError(json.error || "Нещо се обърка. Моля, опитай отново.");
        setLoading(false);
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      }
    } catch {
      setError("Мрежова грешка. Моля, опитай отново.");
      setLoading(false);
    }
  };

  const fieldErrorMsg = (field: FieldName) =>
    fieldErrors[field] ? (
      <p className="text-red-500 text-xs mt-1">Максимум {LIMITS[field]} символа.</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
      {/* Recipient name */}
      <div>
        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1 text-left">
          Име на получателя <span className="text-pink-500">*</span>
        </label>
        <input
          id="recipientName"
          name="recipientName"
          type="text"
          required
          maxLength={LIMITS.recipientName}
          autoComplete="off"
          onChange={(e) => handleChange("recipientName", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200
                     outline-none transition-all text-gray-800 bg-white placeholder-gray-400"
        />
        {fieldErrorMsg("recipientName")}
      </div>

      {/* Time */}
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1 text-left">
          Час
        </label>
        <input
          id="time"
          name="time"
          type="text"
          maxLength={LIMITS.time}
          autoComplete="off"
          onChange={(e) => handleChange("time", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200
                     outline-none transition-all text-gray-800 bg-white placeholder-gray-400"
        />
        {fieldErrorMsg("time")}
      </div>

      {/* Place */}
      <div>
        <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1 text-left">
          Място
        </label>
        <input
          id="place"
          name="place"
          type="text"
          maxLength={LIMITS.place}
          autoComplete="off"
          onChange={(e) => handleChange("place", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200
                     outline-none transition-all text-gray-800 bg-white placeholder-gray-400"
        />
        {fieldErrorMsg("place")}
      </div>

      {/* Extra message */}
      <div>
        <label htmlFor="extraMessage" className="block text-sm font-medium text-gray-700 mb-1 text-left">
          Допълнително съобщение
        </label>
        <textarea
          id="extraMessage"
          name="extraMessage"
          maxLength={LIMITS.extraMessage}
          rows={3}
          autoComplete="off"
          onChange={(e) => handleChange("extraMessage", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200
                     outline-none transition-all text-gray-800 bg-white placeholder-gray-400 resize-none"
        />
        {fieldErrorMsg("extraMessage")}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600
                   text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl
                   disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400
                   active:scale-[0.98] cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Пренасочване към плащане...
          </span>
        ) : (
          "Създай и плати €1.99 💝"
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        Ще бъдете пренасочен/а към Stripe за сигурно плащане. Имейлът Ви няма да бъде използван за маркетинг и няма да получавате рекламни съобщения.
      </p>
    </form>
  );
}
