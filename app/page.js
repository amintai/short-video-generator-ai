"use client";
import HomePageHeader from "./_components/Header";
import FeaturedCard from "./_components/FeaturedCard";
import Footer from "./_components/Footer";
import MainSection from "./_components/MainSection";
import Upgrade from "./_components/Upgrade";

export default function Home() {
  return (
    <>
      <div className="h-screen pb-14 bg-right bg-cover px-12">
        <HomePageHeader />
        <MainSection />
        <FeaturedCard />
        <Upgrade />
        <Footer />
      </div>
    </>
  );
}
