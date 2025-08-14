"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "../../components/ui/button";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Zap, 
  Video,
  Rocket,
  CheckCircle,
  Users,
  Clock
} from "lucide-react";
import { redirect } from "next/navigation";

const ModernHeroSection = () => {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Videos ready in 60 seconds" },
    { icon: Video, title: "HD Quality", desc: "Professional 4K output" },
    { icon: Sparkles, title: "AI Powered", desc: "Smart content generation" }
  ];

  const highlights = [
    "No video editing skills required",
    "30+ languages supported",
    "Custom branding options",
    "Export to all social platforms"
  ];

  return (
    <motion.section className="relative min-h-screen flex items-center justify-center pt-20 pb-12">
      {/* Clean Background */}
      <div className="absolute inset-0">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-purple-950/30 to-slate-950/90" />
        
        {/* Minimal accent orbs - much more subtle */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-600/15 to-blue-600/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Main Content - Clean and Readable */}
      <div ref={heroRef} className="relative container mx-auto px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Clean Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white/90">
                AI-Powered Video Creation Platform
              </span>
            </div>
          </motion.div>

          {/* Clear, Readable Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Create Amazing Videos
            <br />
            <span className="gradient-text">In Just 60 Seconds</span>
          </motion.h1>

          {/* Clear Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Turn your ideas into professional short videos with AI. No editing skills required.
            Just type your topic and watch our AI create engaging content for social media.
          </motion.p>

          {/* Value Highlights */}
          <motion.div 
            variants={itemVariants}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-sm text-white/70">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons - Simplified */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={() => redirect("/sign-up")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                <span>Start Creating Free</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10 font-medium px-8 py-4 rounded-2xl text-lg transition-all duration-200"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </div>
            </Button>
          </motion.div>

          {/* Features Grid - Clean and Simple */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: "50K+", label: "Videos Created" },
              { number: "15K+", label: "Happy Creators" },
              { number: "99.9%", label: "Uptime" },
              { number: "<60s", label: "Generation Time" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:animate-pulse">
                  {stat.number}
                </div>
                <div className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors duration-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernHeroSection;
