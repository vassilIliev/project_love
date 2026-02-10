import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import DemoSection from "@/components/sections/DemoSection";
import CreateSection from "@/components/sections/CreateSection";
import FloatingHearts from "@/components/FloatingHearts";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <FloatingHearts />
      <div className="relative z-10 pt-14">
        <HeroSection />
        <DemoSection />
        <CreateSection />
        <Footer />
      </div>
    </main>
  );
}
