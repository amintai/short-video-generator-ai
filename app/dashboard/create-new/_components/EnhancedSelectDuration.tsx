"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Play, Zap, TrendingUp } from "lucide-react";

interface DurationOption {
  value: string;
  seconds: number;
  name: string;
  description: string;
  icon: any;
  color: string;
  bestFor: string[];
  examples: string[];
}

const EnhancedSelectDuration = ({ onHandleInputChange = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const durationOptions: DurationOption[] = [
    {
      value: "15 Seconds",
      seconds: 15,
      name: "Quick Bite",
      description: "Perfect for social media snippets",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bestFor: ["Instagram Reels", "TikTok", "Twitter"],
      examples: ["Quick tips", "Announcements", "Teasers"]
    },
    {
      value: "30 Seconds", 
      seconds: 30,
      name: "Standard Short",
      description: "Ideal for most short-form content",
      icon: Play,
      color: "from-green-500 to-emerald-500",
      bestFor: ["YouTube Shorts", "Instagram", "LinkedIn"],
      examples: ["Tutorials", "Stories", "Promotions"]
    },
    {
      value: "60 Seconds",
      seconds: 60,
      name: "Extended Story",
      description: "Perfect for detailed explanations",
      icon: TrendingUp,
      color: "from-blue-500 to-purple-500",
      bestFor: ["YouTube", "Facebook", "Educational"],
      examples: ["How-tos", "Case studies", "Reviews"]
    }
  ];

  const handleDurationSelect = (option: DurationOption) => {
    setSelectedOption(option.value);
    onHandleInputChange("duration", option.value);
  };

  return (
    <div className="space-y-6">
      {/* Duration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {durationOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === option.value;

          return (
            <motion.div
              key={option.value}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10 scale-105"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
              onClick={() => handleDurationSelect(option)}
              whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>

              {/* Duration Display */}
              <div className="text-3xl font-bold text-white mb-1">
                {option.seconds}s
              </div>
              <div className="text-lg font-semibold text-white/90 mb-2">
                {option.name}
              </div>
              <p className="text-white/70 text-sm mb-4">
                {option.description}
              </p>

              {/* Best For Tags */}
              <div className="space-y-2 mb-4">
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  Best for:
                </div>
                <div className="flex flex-wrap gap-1">
                  {option.bestFor.map((platform, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/80"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="mb-4">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${option.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(option.seconds / 60) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>0s</span>
                  <span>60s</span>
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-1">
                <div className="text-xs text-white/40 uppercase tracking-wider">
                  Examples:
                </div>
                {option.examples.slice(0, 2).map((example, index) => (
                  <div key={index} className="text-xs text-white/60">
                    • {example}
                  </div>
                ))}
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
            </motion.div>
          );
        })}
      </div>

      {/* Selected Duration Info */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
            <Clock className="h-4 w-4" />
            Selected Duration: {selectedOption}
          </div>
          <p className="text-white/80 text-sm">
            {durationOptions.find(opt => opt.value === selectedOption)?.description}
          </p>
        </motion.div>
      )}

      {/* Duration Tips */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Duration Guidelines</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm">
          <div>
            <div className="font-medium text-white/90 mb-1">15 seconds:</div>
            <ul className="space-y-1">
              <li>• Maximum engagement on TikTok</li>
              <li>• Great for quick announcements</li>
              <li>• Higher completion rates</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-white/90 mb-1">30-60 seconds:</div>
            <ul className="space-y-1">
              <li>• Perfect for storytelling</li>
              <li>• Detailed explanations</li>
              <li>• Better for tutorials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSelectDuration;
