"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Video, Zap, Sparkles, ArrowRight } from "lucide-react";

interface TransitionOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: string;
  duration: string;
  premium: boolean;
  bestFor: string[];
}

const EnhancedSelectTransition = ({ onHandleInputChange = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const transitionOptions: TransitionOption[] = [
    {
      id: "fade",
      name: "Smooth Fade",
      description: "Gentle fade between scenes",
      preview: "→ ○ ←",
      style: "Classic",
      duration: "0.5s",
      premium: false,
      bestFor: ["Professional", "Educational", "Corporate"]
    },
    {
      id: "slide",
      name: "Dynamic Slide",
      description: "Modern sliding transitions",
      preview: "← → ↑",
      style: "Modern",
      duration: "0.3s",
      premium: false,
      bestFor: ["Social Media", "Modern", "Tech"]
    },
    {
      id: "zoom",
      name: "Cinematic Zoom",
      description: "Dramatic zoom effects",
      preview: "◇ ◆ ◇",
      style: "Cinematic",
      duration: "0.7s",
      premium: true,
      bestFor: ["Storytelling", "Drama", "Entertainment"]
    },
    {
      id: "wipe",
      name: "Creative Wipe",
      description: "Directional wipe transitions",
      preview: "▱ ▰ ▱",
      style: "Creative",
      duration: "0.4s",
      premium: true,
      bestFor: ["Creative", "Artistic", "Promotional"]
    },
    {
      id: "morphing",
      name: "AI Morphing",
      description: "Intelligent content-aware transitions",
      preview: "∿ ≈ ∿",
      style: "AI-Powered",
      duration: "0.8s",
      premium: true,
      bestFor: ["Premium", "Innovative", "Cutting-edge"]
    },
    {
      id: "none",
      name: "No Transition",
      description: "Direct cuts between scenes",
      preview: "| | |",
      style: "Direct",
      duration: "0s",
      premium: false,
      bestFor: ["Fast-paced", "News", "Quick content"]
    }
  ];

  const handleTransitionSelect = (option: TransitionOption) => {
    setSelectedOption(option.id);
    onHandleInputChange("transitionStyle", option.name);
  };

  return (
    <div className="space-y-6">
      {/* Transition Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transitionOptions.map((option) => {
          const isSelected = selectedOption === option.id;

          return (
            <motion.div
              key={option.id}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
              onClick={() => handleTransitionSelect(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Premium Badge */}
              {option.premium && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">PRO</span>
                  </div>
                </div>
              )}

              {/* Preview Animation */}
              <div className="h-16 flex items-center justify-center mb-4 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-xl">
                <motion.div
                  className="text-2xl font-mono text-white/80"
                  animate={
                    isSelected
                      ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {option.preview}
                </motion.div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{option.name}</h3>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                    {option.duration}
                  </span>
                </div>

                <p className="text-white/70 text-sm">{option.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-purple-300 border border-purple-500/20">
                    {option.style}
                  </span>
                </div>

                {/* Best For Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {option.bestFor.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 border-2 border-purple-500 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Selected Transition Info */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
            <Video className="h-4 w-4" />
            Selected Transition: {transitionOptions.find(opt => opt.id === selectedOption)?.name}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
            <div>
              <span className="font-medium">Style:</span> {transitionOptions.find(opt => opt.id === selectedOption)?.style}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {transitionOptions.find(opt => opt.id === selectedOption)?.duration}
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium text-white/90">Best for:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {transitionOptions.find(opt => opt.id === selectedOption)?.bestFor.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Transition Tips */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Transition Guidelines</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm">
          <div>
            <div className="font-medium text-white/90 mb-1">Fast Content:</div>
            <p>Use quick transitions (0.3s) or no transitions for rapid-fire content.</p>
          </div>
          <div>
            <div className="font-medium text-white/90 mb-1">Cinematic Feel:</div>
            <p>Longer transitions (0.7s+) with zoom or morphing effects create drama.</p>
          </div>
        </div>
      </div>

      {/* Optional Notice */}
      <div className="text-center text-white/50 text-sm">
        <div className="flex items-center justify-center gap-2">
          <ArrowRight className="h-3 w-3" />
          <span>Transitions are optional and can be skipped</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSelectTransition;
