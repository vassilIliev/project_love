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
        <footer className="py-8 text-center text-sm text-gray-400">
          <p>Направено с 💕 — Date Me Maybe {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
