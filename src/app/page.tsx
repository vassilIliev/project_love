import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import DemoSection from "@/components/sections/DemoSection";
import CreateSection from "@/components/sections/CreateSection";
import FloatingHearts from "@/components/FloatingHearts";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <FloatingHearts />
      <div className="relative z-10 pt-14">
        <HeroSection />
        <DemoSection />
        <CreateSection />
        {/* Футър */}
        <footer className="py-10 text-center relative">
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-200" />
              <span className="text-pink-300 text-sm">💕</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-200" />
            </div>
            <p className="text-sm text-gray-400">
              Направено с любов — Date Me Maybe {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
