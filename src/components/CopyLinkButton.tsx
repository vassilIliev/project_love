"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n/context";

interface CopyLinkButtonProps {
  link: string;
}

export default function CopyLinkButton({ link }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const dict = useTranslations();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={dict.copy.ariaLabel}
      className={`shrink-0 px-4 py-2 text-white text-sm font-medium
                 rounded-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400
                 cursor-pointer hover:scale-105
                 liquid-glass liquid-glass-sm
                 ${copied
                   ? "liquid-glass-green"
                   : "liquid-glass-pink"
                 }`}
    >
      {copied ? (
        <span className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {dict.copy.copied}
        </span>
      ) : (
        dict.copy.copy
      )}
    </button>
  );
}
