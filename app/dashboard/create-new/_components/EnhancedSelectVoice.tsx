"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, User, Mic } from "lucide-react";

interface VoiceOption {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  accent: string;
  style: string;
  description: string;
  premium: boolean;
  sampleText: string;
}

const EnhancedSelectVoice = ({ onHandleInputChange = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [playingVoice, setPlayingVoice] = useState("");

  const voiceOptions: VoiceOption[] = [
    {
      id: "friendly-female",
      name: "Sarah",
      gender: "female",
      accent: "American",
      style: "Friendly",
      description: "Warm and approachable voice perfect for tutorials",
      premium: false,
      sampleText: "Hi there! Let me tell you an amazing story..."
    },
    {
      id: "professional-male",
      name: "David",
      gender: "male",
      accent: "British",
      style: "Professional",
      description: "Clear and authoritative for business content",
      premium: false,
      sampleText: "Welcome to this comprehensive guide on..."
    },
    {
      id: "energetic-female",
      name: "Emma",
      gender: "female",
      accent: "Australian",
      style: "Energetic",
      description: "Dynamic and engaging for entertainment",
      premium: true,
      sampleText: "Get ready for the most incredible adventure!"
    },
    {
      id: "calm-male",
      name: "James",
      gender: "male",
      accent: "Canadian",
      style: "Calm",
      description: "Soothing voice ideal for relaxing content",
      premium: false,
      sampleText: "Take a moment to relax and listen to this story..."
    },
    {
      id: "youthful-female",
      name: "Zoe",
      gender: "female",
      accent: "American",
      style: "Youthful",
      description: "Young and trendy voice for social media",
      premium: true,
      sampleText: "OMG, you won't believe what happened next!"
    },
    {
      id: "narrator-male",
      name: "Morgan",
      gender: "male",
      accent: "American",
      style: "Narrator",
      description: "Deep storytelling voice for documentaries",
      premium: true,
      sampleText: "In a world where artificial intelligence meets creativity..."
    }
  ];

  const handleVoiceSelect = (option: VoiceOption) => {
    setSelectedOption(option.id);
    onHandleInputChange("voiceStyle", option.style);
  };

  const handlePlaySample = (voiceId: string) => {
    setPlayingVoice(voiceId);
    // Simulate playing voice sample
    setTimeout(() => {
      setPlayingVoice("");
    }, 3000);
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "female": return "from-pink-500 to-purple-500";
      case "male": return "from-blue-500 to-cyan-500";
      case "neutral": return "from-gray-500 to-slate-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === "female" ? "♀" : gender === "male" ? "♂" : "⚬";
  };

  return (
    <div className="space-y-6">
      {/* Voice Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {voiceOptions.map((option) => {
          const isSelected = selectedOption === option.id;
          const isPlaying = playingVoice === option.id;

          return (
            <motion.div
              key={option.id}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
              onClick={() => handleVoiceSelect(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGenderColor(option.gender)} flex items-center justify-center text-white font-bold`}>
                    {getGenderIcon(option.gender)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{option.name}</h3>
                    <p className="text-white/60 text-sm">{option.accent} • {option.style}</p>
                  </div>
                </div>
                
                {/* Premium Badge */}
                {option.premium && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">PRO</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm mb-4">{option.description}</p>

              {/* Sample Text */}
              <div className="bg-white/5 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="h-3 w-3 text-white/50" />
                  <span className="text-xs text-white/50 uppercase tracking-wider">Sample</span>
                </div>
                <p className="text-white/80 text-sm italic">"{option.sampleText}"</p>
              </div>

              {/* Play Button */}
              <motion.button
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200 ${
                  isPlaying 
                    ? "bg-green-600/20 text-green-400 border border-green-400/30"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySample(option.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Preview Voice</span>
                  </>
                )}
              </motion.button>

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

      {/* Selected Voice Info */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
            <Volume2 className="h-4 w-4" />
            Selected Voice: {voiceOptions.find(opt => opt.id === selectedOption)?.name}
          </div>
          <p className="text-white/80 text-sm">
            {voiceOptions.find(opt => opt.id === selectedOption)?.description}
          </p>
        </motion.div>
      )}

      {/* Voice Tips */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <User className="h-4 w-4" />
          <span className="font-medium">Voice Selection Tips</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm">
          <div>
            <div className="font-medium text-white/90 mb-1">For Educational Content:</div>
            <p>Choose professional or calm voices for better comprehension.</p>
          </div>
          <div>
            <div className="font-medium text-white/90 mb-1">For Entertainment:</div>
            <p>Energetic and youthful voices work best for engaging content.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSelectVoice;
