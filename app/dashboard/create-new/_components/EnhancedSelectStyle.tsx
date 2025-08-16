"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Star, Sparkles } from "lucide-react";

interface StyleOption {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  premium: boolean;
  tags: string[];
  examples: string[];
}

const EnhancedSelectStyle = ({ onHandleInputChange = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const styleOptions: StyleOption[] = [
    // Realistic Styles
    {
      id: "photorealistic",
      name: "Photorealistic",
      description: "Ultra-realistic, lifelike imagery",
      image: "/realistic.jpeg",
      category: "Realistic",
      premium: false,
      tags: ["professional", "corporate", "documentary"],
      examples: ["Portrait photography", "Nature scenes", "Product shots"]
    },
    {
      id: "cinematic",
      name: "Cinematic",
      description: "Movie-quality visuals with dramatic lighting",
      image: "/realistic.jpeg",
      category: "Realistic",
      premium: true,
      tags: ["dramatic", "professional", "storytelling"],
      examples: ["Film scenes", "Dramatic portraits", "Action sequences"]
    },
    
    // Artistic Styles
    {
      id: "cartoon",
      name: "Cartoon",
      description: "Fun, colorful animated style",
      image: "/cartoon.jpg",
      category: "Artistic",
      premium: false,
      tags: ["fun", "colorful", "family-friendly"],
      examples: ["Character animation", "Children's content", "Educational"]
    },
    {
      id: "anime",
      name: "Anime",
      description: "Japanese animation style",
      image: "/cartoon.jpg",
      category: "Artistic",
      premium: true,
      tags: ["stylized", "expressive", "dynamic"],
      examples: ["Character stories", "Fantasy themes", "Action scenes"]
    },
    {
      id: "comic-book",
      name: "Comic Book",
      description: "Bold, graphic novel aesthetics",
      image: "/comic.jpeg",
      category: "Artistic",
      premium: false,
      tags: ["bold", "graphic", "dynamic"],
      examples: ["Superhero stories", "Action scenes", "Drama"]
    },
    {
      id: "watercolor",
      name: "Watercolor",
      description: "Soft, flowing painted textures",
      image: "/fantasy.jpg",
      category: "Artistic",
      premium: false,
      tags: ["soft", "artistic", "elegant"],
      examples: ["Nature scenes", "Portraits", "Abstract concepts"]
    },
    {
      id: "oil-painting",
      name: "Oil Painting",
      description: "Classic, textured painted style",
      image: "/fantasy.jpg",
      category: "Artistic",
      premium: true,
      tags: ["classic", "textured", "artistic"],
      examples: ["Historical scenes", "Portraits", "Landscapes"]
    },
    
    // Modern Styles
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean, simple, focused design",
      image: "/realistic.jpeg",
      category: "Modern",
      premium: false,
      tags: ["clean", "simple", "professional"],
      examples: ["Tech content", "Business", "Educational"]
    },
    {
      id: "neon-cyberpunk",
      name: "Neon Cyberpunk",
      description: "Futuristic with glowing neon colors",
      image: "/gta.jpg",
      category: "Modern",
      premium: true,
      tags: ["futuristic", "neon", "tech"],
      examples: ["Sci-fi themes", "Technology", "Gaming"]
    },
    {
      id: "synthwave",
      name: "Synthwave",
      description: "80s-inspired retro futuristic style",
      image: "/gta.jpg",
      category: "Modern",
      premium: true,
      tags: ["retro", "80s", "neon"],
      examples: ["Music content", "Nostalgia", "Tech reviews"]
    },
    {
      id: "vaporwave",
      name: "Vaporwave",
      description: "Aesthetic with pastel colors and glitch effects",
      image: "/gta.jpg",
      category: "Modern",
      premium: false,
      tags: ["aesthetic", "pastel", "dreamy"],
      examples: ["Chill content", "Music", "Art"]
    },
    
    // Fantasy Styles
    {
      id: "fantasy-medieval",
      name: "Fantasy Medieval",
      description: "Magical realms and medieval settings",
      image: "/fantasy.jpg",
      category: "Fantasy",
      premium: true,
      tags: ["magical", "medieval", "epic"],
      examples: ["Fantasy stories", "Gaming", "Adventures"]
    },
    {
      id: "steampunk",
      name: "Steampunk",
      description: "Victorian-era industrial fantasy",
      image: "/fantasy.jpg",
      category: "Fantasy",
      premium: true,
      tags: ["industrial", "victorian", "mechanical"],
      examples: ["Alt-history", "Adventure", "Sci-fi"]
    },
    {
      id: "gothic-dark",
      name: "Gothic Dark",
      description: "Dark, mysterious, atmospheric",
      image: "/fantasy.jpg",
      category: "Fantasy",
      premium: false,
      tags: ["dark", "mysterious", "atmospheric"],
      examples: ["Horror stories", "Mystery", "Drama"]
    },
    
    // Vintage Styles
    {
      id: "vintage-50s",
      name: "1950s Vintage",
      description: "Classic Americana, retro advertising style",
      image: "/comic.jpeg",
      category: "Vintage",
      premium: false,
      tags: ["retro", "americana", "classic"],
      examples: ["Nostalgia content", "Advertising", "Lifestyle"]
    },
    {
      id: "film-noir",
      name: "Film Noir",
      description: "Black and white with dramatic shadows",
      image: "/comic.jpeg",
      category: "Vintage",
      premium: true,
      tags: ["dramatic", "shadows", "classic"],
      examples: ["Mystery stories", "Drama", "Crime"]
    },
    {
      id: "art-deco",
      name: "Art Deco",
      description: "Elegant geometric patterns and luxury",
      image: "/comic.jpeg",
      category: "Vintage",
      premium: true,
      tags: ["elegant", "geometric", "luxury"],
      examples: ["Luxury content", "Fashion", "Architecture"]
    }
  ];

  const categories = ["All", ...new Set(styleOptions.map(option => option.category))];
  
  const filteredOptions = selectedCategory === "All" 
    ? styleOptions 
    : styleOptions.filter(option => option.category === selectedCategory);

  const handleStyleSelect = (option: StyleOption) => {
    setSelectedOption(option.id);
    onHandleInputChange("imageStyle", option.name);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOptions.map((option) => {
          const isSelected = selectedOption === option.id;

          return (
            <motion.div
              key={option.id}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-purple-500 scale-105"
                  : "hover:scale-102"
              }`}
              onClick={() => handleStyleSelect(option)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Premium Badge */}
                {option.premium && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-white fill-current" />
                      <span className="text-xs font-bold text-white">PRO</span>
                    </div>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-1 bg-black/50 rounded-full text-white backdrop-blur-sm">
                    {option.category}
                  </span>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 border-4 border-purple-500 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1">{option.name}</h3>
                <p className="text-white/80 text-sm mb-2">{option.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {option.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-white/20 rounded-full backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Examples */}
                <div className="text-xs text-white/60">
                  Best for: {option.examples.slice(0, 2).join(", ")}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent" />
            </motion.div>
          );
        })}
      </div>

      {/* Selected Style Info */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
            <Palette className="h-4 w-4" />
            Selected Style: {styleOptions.find(opt => opt.id === selectedOption)?.name}
          </div>
          <p className="text-white/80 text-sm">
            {styleOptions.find(opt => opt.id === selectedOption)?.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {styleOptions.find(opt => opt.id === selectedOption)?.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Style Tips */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Style Tips</span>
        </div>
        <ul className="text-white/70 text-sm space-y-1">
          <li>• Choose styles that match your content theme</li>
          <li>• Realistic styles work best for educational content</li>
          <li>• Artistic styles are great for creative storytelling</li>
          <li>• Modern styles suit tech and business content</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedSelectStyle;
