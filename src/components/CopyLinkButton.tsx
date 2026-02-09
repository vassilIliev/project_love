"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  link: string;
}

export default function CopyLinkButton({ link }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Резервен метод за по-стари браузъри
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
      aria-label="Копирай линка"
      className="shrink-0 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium
                 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400
                 cursor-pointer"
    >
      {copied ? "Копирано! ✓" : "Копирай 📋"}
    </button>
  );
}
