import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">💔</div>
        <h1 className="text-3xl font-bold text-gray-800">
          Поканата не е намерена
        </h1>
        <p className="text-gray-500">
          Тази покана не съществува или вече не е активна.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white
                     font-semibold rounded-full hover:from-pink-600 hover:to-rose-600
                     transition-all shadow-lg"
        >
          Създай своята ✉️
        </Link>
      </div>
    </main>
  );
}
