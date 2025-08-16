"use client";
import HomePageHeader from "./_components/Header";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import PricingSection from "./_components/PricingSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";
import PricingSectionTemp from "./_components/PricingSectionTemp";
import CommunitySection from './_components/CommunitySection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <HomePageHeader />
      <HeroSection />
      <FeaturesSection />

      <CommunitySection />
      {/* <TestimonialsSection /> */}
      {/* <PricingSection /> */}
      <PricingSectionTemp />
      <CTASection />
      <Footer />
    </div>
  );
}
