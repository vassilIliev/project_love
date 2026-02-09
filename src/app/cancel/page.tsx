import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">💔</div>
        <h1 className="text-3xl font-bold text-gray-800">Плащането е отменено</h1>
        <p className="text-gray-500">
          Няма проблем! Поканата ти все още не е създадена. Можеш
          да опиташ отново, когато си готов/а.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white
                     font-semibold rounded-full hover:from-pink-600 hover:to-rose-600
                     transition-all shadow-lg"
        >
          Обратно към началото 💕
        </Link>
      </div>
    </main>
  );
}
