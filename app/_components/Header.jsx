"use client";

import React from "react";
import { Button } from "../../@/components/ui/button";
import { redirect } from "next/navigation";
import { Play, Sparkles } from "lucide-react";

const HomePageHeader = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Logo */}
        <a
          className="flex items-center space-x-2 text-slate-900 no-underline hover:no-underline font-bold text-xl transition-all duration-200 hover:scale-105"
          href="/"
        >
          <div className="relative">
            <Play className="h-8 w-8 text-blue-600 fill-current" />
            <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VideoAI
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
            Features
          </a>
          <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
            Pricing
          </a>
          <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
            Testimonials
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            onClick={() => redirect("/sign-in")}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Sign In
          </Button>
          <Button
            onClick={() => redirect("/sign-up")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HomePageHeader;
