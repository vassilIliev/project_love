"use client";

import { useTranslations } from "@/i18n/context";

export default function Footer() {
  const dict = useTranslations();

  return (
    <footer className="py-10 text-center relative">
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-200" />
          <span className="text-pink-300 text-sm">💕</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-200" />
        </div>
        <p className="text-sm text-gray-400">
          {dict.footer.text} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
