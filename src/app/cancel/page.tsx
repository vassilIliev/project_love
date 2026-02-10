import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(236,72,153,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="text-6xl animate-gentle-float animate-stagger-in stagger-1">💔</div>
        <h1 className="text-3xl font-bold text-gray-800 animate-stagger-in stagger-2">
          Плащането е отменено
        </h1>
        <p className="text-gray-500 animate-stagger-in stagger-3">
          Няма проблем! Поканата ти все още не е създадена. Можеш
          да опиташ отново, когато си готов/а.
        </p>
        <div className="animate-stagger-in stagger-4">
          <Link
            href="/"
            className="liquid-glass liquid-glass-pink inline-block px-8 py-3 text-white
                       font-semibold rounded-full
                       hover:scale-105 active:scale-95"
          >
            Обратно към началото 💕
          </Link>
        </div>
      </div>
    </main>
  );
}
