"use client";
import ModernHeader from "./_components/ModernHeader";
import ModernHeroSection from "./_components/ModernHeroSection";
import ModernFeaturesSection from "./_components/ModernFeaturesSection";
import ModernTestimonialsSection from "./_components/ModernTestimonialsSection";
import ModernPricingSection from "./_components/ModernPricingSection";
import ModernCTASection from "./_components/ModernCTASection";
import ModernFooter from "./_components/ModernFooter";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Dark theme background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_50%)] -z-10" />
      
      <ModernHeader />
      <ModernHeroSection />
      <ModernFeaturesSection />
      <ModernTestimonialsSection />
      <ModernPricingSection />
      <ModernCTASection />
      <ModernFooter />
    </div>
  );
}
