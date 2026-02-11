import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import DemoSection from "@/components/sections/DemoSection";
import CreateSection from "@/components/sections/CreateSection";
import FloatingHearts from "@/components/FloatingHearts";
import Footer from "@/components/Footer";
import RefTracker from "@/components/RefTracker";

/**
 * Influencer referral landing page.
 *
 * Renders the exact same home page content but at a unique URL
 * (e.g. /en/ref/AB, /bg/ref/MG). Vercel Analytics automatically
 * tracks page views per path, so each influencer's traffic is
 * visible in the dashboard without any extra code or database.
 *
 * The RefTracker component stores the referral code in sessionStorage
 * so the CreateForm can include it in the checkout API call,
 * which saves it in Stripe session metadata for conversion tracking.
 *
 * Usage: give the influencer a link like https://datememaybe.net/ref/VI
 */
export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <RefTracker code={code} />
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
