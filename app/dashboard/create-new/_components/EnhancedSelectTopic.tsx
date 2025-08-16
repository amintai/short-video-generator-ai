"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Type, 
  Wand2, 
  BookOpen, 
  Ghost, 
  Landmark, 
  Moon, 
  Zap, 
  Lightbulb,
  Heart,
  Briefcase,
  Users,
  TrendingUp,
  Coffee,
  Music,
  Gamepad2,
  Plane
} from "lucide-react";

interface TopicOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
  category: string;
}

const EnhancedSelectTopic = ({ onHandleInputChange = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const topicOptions: TopicOption[] = [
    {
      id: "custom",
      name: "Custom Prompt",
      description: "Write your own unique video concept",
      icon: Type,
      color: "from-purple-500 to-pink-500",
      examples: ["Your creative idea", "Specific story", "Unique concept"],
      category: "Custom"
    },
    {
      id: "ai-story",
      name: "AI Story",
      description: "Let AI create an engaging narrative",
      icon: Wand2,
      color: "from-blue-500 to-cyan-500",
      examples: ["Random adventure", "Sci-fi tale", "Mystery story"],
      category: "Creative"
    },
    {
      id: "horror",
      name: "Horror Story",
      description: "Spine-chilling tales and scary narratives",
      icon: Ghost,
      color: "from-gray-700 to-gray-900",
      examples: ["Ghost encounters", "Urban legends", "Creepy mysteries"],
      category: "Entertainment"
    },
    {
      id: "historical",
      name: "Historical Facts",
      description: "Fascinating events from the past",
      icon: Landmark,
      color: "from-amber-500 to-orange-500",
      examples: ["Ancient civilizations", "World wars", "Famous figures"],
      category: "Educational"
    },
    {
      id: "bedtime",
      name: "Bedtime Story",
      description: "Calming and peaceful narratives",
      icon: Moon,
      color: "from-indigo-500 to-purple-500",
      examples: ["Fairy tales", "Peaceful adventures", "Dreams"],
      category: "Lifestyle"
    },
    {
      id: "motivational",
      name: "Motivational",
      description: "Inspiring content to uplift viewers",
      icon: Zap,
      color: "from-yellow-500 to-red-500",
      examples: ["Success stories", "Life lessons", "Personal growth"],
      category: "Inspiration"
    },
    {
      id: "fun-facts",
      name: "Fun Facts",
      description: "Interesting and surprising information",
      icon: Lightbulb,
      color: "from-green-500 to-teal-500",
      examples: ["Science facts", "Animal facts", "Space discoveries"],
      category: "Educational"
    },
    {
      id: "love-story",
      name: "Love Story",
      description: "Romantic tales and relationship stories",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      examples: ["First love", "Epic romance", "Heartwarming tales"],
      category: "Romance"
    },
    {
      id: "business",
      name: "Business Tips",
      description: "Entrepreneurship and business advice",
      icon: Briefcase,
      color: "from-slate-500 to-gray-600",
      examples: ["Startup advice", "Leadership tips", "Market insights"],
      category: "Business"
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      description: "Daily life tips and wellness content",
      icon: Coffee,
      color: "from-emerald-500 to-green-600",
      examples: ["Health tips", "Productivity", "Self-care"],
      category: "Lifestyle"
    },
    {
      id: "technology",
      name: "Tech News",
      description: "Latest in technology and innovation",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      examples: ["AI developments", "Gadget reviews", "Tech trends"],
      category: "Technology"
    },
    {
      id: "travel",
      name: "Travel Stories",
      description: "Adventures and destination guides",
      icon: Plane,
      color: "from-sky-500 to-blue-500",
      examples: ["Hidden gems", "Cultural experiences", "Travel tips"],
      category: "Travel"
    }
  ];

  const categories = [...new Set(topicOptions.map(option => option.category))];
  
  const filteredOptions = topicOptions.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopicSelect = (option: TopicOption) => {
    setSelectedOption(option.id);
    
    if (option.id === "custom") {
      // For custom prompt, we'll handle the value in the textarea
      if (customPrompt) {
        onHandleInputChange("topic", customPrompt);
      }
    } else {
      onHandleInputChange("topic", option.name);
    }
  };

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    if (selectedOption === "custom") {
      onHandleInputChange("topic", value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSearchTerm("")}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
            searchTerm === ""
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSearchTerm(category)}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
              searchTerm === category
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === option.id;

          return (
            <motion.div
              key={option.id}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
              onClick={() => handleTopicSelect(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Icon with gradient background */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>

              {/* Topic Info */}
              <h3 className="font-semibold text-white mb-2">{option.name}</h3>
              <p className="text-white/60 text-sm mb-3">{option.description}</p>

              {/* Examples */}
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase tracking-wider">Examples:</p>
                {option.examples.slice(0, 2).map((example, index) => (
                  <div key={index} className="text-xs text-white/50">
                    • {example}
                  </div>
                ))}
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 right-2">
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                  {option.category}
                </span>
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

      {/* Custom Prompt Textarea */}
      {selectedOption === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <label className="block text-white font-medium mb-2">
            Describe your video concept
          </label>
          <textarea
            placeholder="Write your custom video prompt here. Be specific about what you want to create - the theme, style, mood, and any particular elements you'd like to include..."
            className="min-h-32 bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 resize-none"
            value={customPrompt}
            onChange={(e) => handleCustomPromptChange(e.target.value)}
          />
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>Be creative and specific for best results</span>
            <span>{customPrompt.length}/500</span>
          </div>
        </motion.div>
      )}

      {/* Selected Topic Display */}
      {selectedOption && selectedOption !== "custom" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            Selected Topic
          </div>
          <p className="text-white">
            {topicOptions.find(opt => opt.id === selectedOption)?.name}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedSelectTopic;
