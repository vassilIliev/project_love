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
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);

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
      <p className="text-red-500 text-xs mt-1 animate-fade-in">Максимум {LIMITS[field]} символа.</p>
    ) : null;

  const inputClass = (field: FieldName) =>
    `w-full px-4 py-3 rounded-xl border transition-all duration-300 text-gray-800 bg-white placeholder-gray-400
     outline-none input-glow
     ${focusedField === field
       ? "border-pink-400 ring-2 ring-pink-200/60 shadow-md shadow-pink-100/30"
       : "border-gray-200 hover:border-pink-200"
     }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
      {/* Recipient name */}
      <div className="group">
        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1.5 text-left transition-colors duration-200 group-focus-within:text-pink-600">
          Име на получателя <span className="text-pink-500">*</span>
        </label>
        <input
          id="recipientName"
          name="recipientName"
          type="text"
          required
          maxLength={LIMITS.recipientName}
          autoComplete="off"
          placeholder="Напр. Маги"
          onFocus={() => setFocusedField("recipientName")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("recipientName", e.target.value)}
          className={inputClass("recipientName")}
        />
        {fieldErrorMsg("recipientName")}
      </div>

      {/* Time */}
      <div className="group">
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1.5 text-left transition-colors duration-200 group-focus-within:text-pink-600">
          Дата и час
        </label>
        <input
          id="time"
          name="time"
          type="text"
          maxLength={LIMITS.time}
          autoComplete="off"
          placeholder="Напр. 14.02 в 19:30"
          onFocus={() => setFocusedField("time")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("time", e.target.value)}
          className={inputClass("time")}
        />
        {fieldErrorMsg("time")}
      </div>

      {/* Place */}
      <div className="group">
        <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1.5 text-left transition-colors duration-200 group-focus-within:text-pink-600">
          Място
        </label>
        <input
          id="place"
          name="place"
          type="text"
          maxLength={LIMITS.place}
          autoComplete="off"
          placeholder="Напр. В италианския ресторант"
          onFocus={() => setFocusedField("place")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleChange("place", e.target.value)}
          className={inputClass("place")}
        />
        {fieldErrorMsg("place")}
      </div>

      {/* Extra message */}
      <div className="group">
        <label htmlFor="extraMessage" className="block text-sm font-medium text-gray-700 mb-1.5 text-left transition-colors duration-200 group-focus-within:text-pink-600">
          Допълнително съобщение
        </label>
        <textarea
          id="extraMessage"
          name="extraMessage"
          maxLength={LIMITS.extraMessage}
          rows={3}
          autoComplete="off"
          placeholder="Напр. Облечи нещо топло 💘"
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
                   text-white font-semibold rounded-xl transition-all duration-300
                   disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400
                   active:scale-[0.98] cursor-pointer hover:scale-[1.02]"
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
          <span className="flex items-center justify-center gap-2">
            Създай и плати €1.99
            <span className="text-lg">💝</span>
          </span>
        )}
      </button>

      <p className="text-xs text-center text-gray-400 leading-relaxed">
        Ще бъдете пренасочен/а към Stripe за сигурно плащане. Имейлът Ви няма да бъде използван за маркетинг и няма да получавате рекламни съобщения.
      </p>
    </form>
  );
}
