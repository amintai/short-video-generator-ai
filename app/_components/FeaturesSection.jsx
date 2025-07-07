"use client";

import React from "react";
import { 
  Wand2, 
  Mic, 
  Image, 
  FileText, 
  Zap, 
  Globe, 
  Palette, 
  Clock,
  Users,
  Sparkles 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Wand2,
      title: "AI Script Generation",
      description: "Our AI creates engaging scripts tailored to your topic and target audience automatically.",
      color: "blue"
    },
    {
      icon: Mic,
      title: "Natural Voice Synthesis",
      description: "High-quality, human-like voiceovers in multiple languages and tones.",
      color: "purple"
    },
    {
      icon: Image,
      title: "Smart Visual Creation",
      description: "AI-generated images and video clips that perfectly match your content.",
      color: "pink"
    },
    {
      icon: FileText,
      title: "Auto Captions",
      description: "Synchronized captions generated automatically for better accessibility.",
      color: "green"
    },
    {
      icon: Palette,
      title: "Custom Styling",
      description: "Choose from multiple video styles and customize colors, fonts, and layouts.",
      color: "orange"
    },
    {
      icon: Clock,
      title: "Multiple Durations",
      description: "Create videos in various lengths - from 15 seconds to 60 seconds.",
      color: "red"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Generate content in over 20 languages with native-speaking voices.",
      color: "indigo"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on video projects with your team members.",
      color: "teal"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "From idea to finished video in under 2 minutes with our optimized AI pipeline.",
      color: "yellow"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      pink: "bg-pink-100 text-pink-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      indigo: "bg-indigo-100 text-indigo-600",
      teal: "bg-teal-100 text-teal-600",
      yellow: "bg-yellow-100 text-yellow-600"
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Powered by AI</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Create{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stunning Videos
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive AI-powered platform handles every aspect of video creation, 
            from script writing to final rendering.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${getColorClasses(feature.color)}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span>✨ All features included in every plan</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
