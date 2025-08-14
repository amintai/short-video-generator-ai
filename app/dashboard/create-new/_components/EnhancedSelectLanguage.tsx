"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Globe, Users } from "lucide-react";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  speakers: string;
  popularity: "high" | "medium" | "low";
}

const EnhancedSelectLanguage = ({ onHandleInputChange = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const languageOptions: LanguageOption[] = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      region: "Global",
      speakers: "1.5B",
      popularity: "high"
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      flag: "🇪🇸",
      region: "Europe",
      speakers: "500M",
      popularity: "high"
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      flag: "🇫🇷",
      region: "Europe",
      speakers: "280M",
      popularity: "high"
    },
    {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      region: "Europe",
      speakers: "130M",
      popularity: "medium"
    },
    {
      code: "it",
      name: "Italian",
      nativeName: "Italiano",
      flag: "🇮🇹",
      region: "Europe",
      speakers: "65M",
      popularity: "medium"
    },
    {
      code: "pt",
      name: "Portuguese",
      nativeName: "Português",
      flag: "🇧🇷",
      region: "South America",
      speakers: "260M",
      popularity: "high"
    },
    {
      code: "ru",
      name: "Russian",
      nativeName: "Русский",
      flag: "🇷🇺",
      region: "Europe",
      speakers: "258M",
      popularity: "medium"
    },
    {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語",
      flag: "🇯🇵",
      region: "Asia",
      speakers: "125M",
      popularity: "medium"
    },
    {
      code: "ko",
      name: "Korean",
      nativeName: "한국어",
      flag: "🇰🇷",
      region: "Asia",
      speakers: "77M",
      popularity: "medium"
    },
    {
      code: "zh",
      name: "Chinese",
      nativeName: "中文",
      flag: "🇨🇳",
      region: "Asia",
      speakers: "918M",
      popularity: "high"
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
      region: "Asia",
      speakers: "600M",
      popularity: "high"
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      flag: "🇸🇦",
      region: "Middle East",
      speakers: "422M",
      popularity: "high"
    }
  ];

  const regions = ["All", ...new Set(languageOptions.map(lang => lang.region))];
  
  const filteredLanguages = selectedRegion === "All" 
    ? languageOptions 
    : languageOptions.filter(lang => lang.region === selectedRegion);

  const handleLanguageSelect = (option: LanguageOption) => {
    setSelectedOption(option.code);
    onHandleInputChange("language", option.code);
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Filter */}
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              selectedRegion === region
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLanguages.map((option) => {
          const isSelected = selectedOption === option.code;

          return (
            <motion.div
              key={option.code}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
              onClick={() => handleLanguageSelect(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Flag and Language */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{option.flag}</span>
                <div>
                  <h3 className="font-semibold text-white">{option.name}</h3>
                  <p className="text-white/60 text-sm">{option.nativeName}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{option.speakers} speakers</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getPopularityColor(option.popularity).replace('text-', 'bg-')}`} />
                  <span className={getPopularityColor(option.popularity)}>{option.popularity}</span>
                </div>
              </div>

              {/* Region Badge */}
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                  {option.region}
                </span>
                
                {option.popularity === "high" && (
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Popular
                  </div>
                )}
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

      {/* Selected Language Info */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
            <Languages className="h-4 w-4" />
            Selected Language: {languageOptions.find(opt => opt.code === selectedOption)?.name}
          </div>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <span>{languageOptions.find(opt => opt.code === selectedOption)?.flag}</span>
              <span>{languageOptions.find(opt => opt.code === selectedOption)?.nativeName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{languageOptions.find(opt => opt.code === selectedOption)?.speakers} speakers</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Language Tips */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Globe className="h-4 w-4" />
          <span className="font-medium">Language Tips</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm">
          <div>
            <div className="font-medium text-white/90 mb-1">High Popularity:</div>
            <p>Languages with largest global audiences and best AI voice quality.</p>
          </div>
          <div>
            <div className="font-medium text-white/90 mb-1">Native Scripts:</div>
            <p>We support proper text rendering for all writing systems including RTL languages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSelectLanguage;
