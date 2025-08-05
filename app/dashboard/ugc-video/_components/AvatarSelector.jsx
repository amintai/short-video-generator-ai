"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, User, Sparkles, Heart, ThumbsUp, Zap } from "lucide-react";
import { cn } from "../../../../lib/utils";

const AVATARS = [
  {
    id: "sara",
    name: "Sara",
    description: "Enthusiastic • Full Body",
    personality: "enthusiastic",
    gestures: ["pointing", "holding", "excited_wave"],
    speciality: "Perfect for beauty & lifestyle products",
    icon: Sparkles,
    image: "/avatars/sara.jpg",
    voiceId: "sara_voice",
    gender: "female",
    tone: "excited",
    bodyVisible: true
  },
  {
    id: "alex",
    name: "Alex",
    description: "Professional • Full Body",
    personality: "professional",
    gestures: ["presentation", "thumbs_up", "open_palm"],
    speciality: "Great for tech & business products",
    icon: ThumbsUp,
    image: "/avatars/alex.jpg",
    voiceId: "alex_voice",
    gender: "male",
    tone: "professional",
    bodyVisible: true
  },
  {
    id: "emma",
    name: "Emma",
    description: "Friendly • Full Body",
    personality: "friendly",
    gestures: ["heart_hands", "clapping", "product_showcase"],
    speciality: "Ideal for wellness & family products",
    icon: Heart,
    image: "/avatars/emma.jpg",
    voiceId: "emma_voice",
    gender: "female",
    tone: "casual",
    bodyVisible: true
  },
  {
    id: "david",
    name: "David",
    description: "Confident • Full Body",
    personality: "confident",
    gestures: ["strong_point", "crossed_arms", "approval_nod"],
    speciality: "Best for fitness & automotive products",
    icon: Zap,
    image: "/avatars/david.jpg",
    voiceId: "david_voice",
    gender: "male",
    tone: "enthusiastic",
    bodyVisible: true
  },
  {
    id: "sophia",
    name: "Sophia",
    description: "Elegant • Full Body",
    personality: "elegant",
    gestures: ["graceful_wave", "delicate_hold", "gentle_point"],
    speciality: "Perfect for luxury & fashion products",
    icon: Sparkles,
    image: "/avatars/sophia.jpg",
    voiceId: "sophia_voice",
    gender: "female",
    tone: "professional",
    bodyVisible: true
  },
  {
    id: "michael",
    name: "Michael",
    description: "Energetic • Full Body",
    personality: "energetic",
    gestures: ["dynamic_point", "victory_pose", "product_lift"],
    speciality: "Great for sports & food products",
    icon: Zap,
    image: "/avatars/michael.jpg",
    voiceId: "michael_voice",
    gender: "male",
    tone: "casual",
    bodyVisible: true
  }
];

const getAvatarGradient = (avatarId) => {
  const gradients = {
    sara: "from-pink-500 to-rose-500",
    alex: "from-blue-500 to-indigo-500", 
    emma: "from-purple-500 to-violet-500",
    david: "from-green-500 to-emerald-500",
    sophia: "from-orange-500 to-amber-500",
    michael: "from-cyan-500 to-teal-500"
  };
  return gradients[avatarId] || "from-violet-500 to-purple-600";
};

const AvatarSelector = ({ selectedAvatar, onAvatarSelect }) => {
  const handleAvatarSelect = (avatar) => {
    onAvatarSelect(avatar);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {AVATARS.map((avatar, index) => (
        <motion.div
          key={avatar.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "relative cursor-pointer group rounded-2xl overflow-hidden border-2 transition-all duration-300",
            selectedAvatar?.id === avatar.id
              ? "border-violet-500 shadow-lg shadow-violet-500/20 scale-105"
              : "border-gray-200 hover:border-violet-300 hover:shadow-md"
          )}
          onClick={() => handleAvatarSelect(avatar)}
        >
          {/* Avatar Image */}
          <div className="aspect-square bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
            {/* Gradient placeholder with avatar initial */}
            <div className={`w-16 h-16 bg-gradient-to-r ${getAvatarGradient(avatar.id)} rounded-full flex items-center justify-center`}>
              <span className="text-2xl font-bold text-white">{avatar.name.charAt(0)}</span>
            </div>
            
            {/* Selection Indicator */}
            {selectedAvatar?.id === avatar.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Avatar Info */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <avatar.icon className="h-3 w-3 text-violet-500" />
              <h3 className="font-semibold text-gray-900 text-sm">{avatar.name}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-1">{avatar.description}</p>
            <p className="text-xs text-violet-600 font-medium">{avatar.speciality}</p>
            
            {/* Gesture indicators */}
            {selectedAvatar?.id === avatar.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 pt-2 border-t border-gray-100"
              >
                <p className="text-xs text-gray-400 mb-1">Available gestures:</p>
                <div className="flex flex-wrap gap-1">
                  {avatar.gestures.slice(0, 2).map((gesture) => (
                    <span key={gesture} className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">
                      {gesture.replace('_', ' ')}
                    </span>
                  ))}
                  {avatar.gestures.length > 2 && (
                    <span className="text-xs text-gray-400">+{avatar.gestures.length - 2}</span>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AvatarSelector;
