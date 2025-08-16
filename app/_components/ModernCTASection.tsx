"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "../../components/ui/button";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Video, 
  Zap, 
  Users,
  CheckCircle,
  Rocket
} from "lucide-react";
import { redirect } from "next/navigation";

const ModernCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    "No credit card required",
    "14-day free trial",
    "Cancel anytime",
    "24/7 support"
  ];

  const stats = [
    { icon: Video, number: "50K+", label: "Videos Created" },
    { icon: Users, number: "15K+", label: "Happy Users" },
    { icon: Zap, number: "<60s", label: "Average Time" },
    { icon: Sparkles, number: "4.9★", label: "User Rating" }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-cyan-900/40" />
        
        {/* Animated orbs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-600/20 to-blue-600/15 rounded-full blur-3xl animate-bounce-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div ref={sectionRef} className="relative container mx-auto px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 glassmorphism border border-white/20 rounded-full px-6 py-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">
                Join 15,000+ Creators
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to Create Your First{" "}
            <span className="gradient-text">
              AI Video
            </span>
            ?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of creators who are already using our AI platform to transform their content. 
            Start your free trial today and experience the future of video creation.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/70">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
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

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 glassmorphism rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Free forever plan available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">No setup required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Start creating in minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModernCTASection;
