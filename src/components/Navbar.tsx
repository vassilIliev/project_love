"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border-b border-pink-100">
      <a href="/" className="text-lg font-bold text-pink-600">
        💝 datememaybe.net
      </a>
      <a
        href="#create-section"
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500
                   rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
      >
        Създай покана 💌
      </a>
    </nav>
  );
}
