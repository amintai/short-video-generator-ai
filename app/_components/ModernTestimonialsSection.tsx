"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";

const ModernTestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      company: "TechFlow Media",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content: "VideoAI has completely transformed my content creation process. What used to take hours now takes minutes. The AI-generated scripts are spot-on and the voice quality is incredible.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Manager",
      company: "StartupLab",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content: "As a marketing manager, I need to create engaging videos quickly. VideoAI delivers exactly what I need - professional quality videos in minutes, not hours.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Social Media Manager",
      company: "BrandBoost",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content: "The variety of styles and customization options is amazing. I can create videos that perfectly match our brand identity. Our engagement rates have increased by 200%!",
      rating: 5
    },
    {
      name: "David Park",
      role: "Entrepreneur",
      company: "InnovateHub",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content: "I'm not a video expert, but VideoAI makes me look like a pro. The AI understands my content and creates videos that perfectly capture my message.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "E-commerce Owner",
      company: "StyleHub",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content: "Creating product videos for my online store was always a challenge. Now I can create professional product videos in minutes. Sales have increased significantly!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Digital Marketer",
      company: "GrowthHackers",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content: "The ROI on VideoAI is incredible. We're creating 10x more video content with the same budget. The quality is consistently high across all our campaigns.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Videos Created" },
    { number: "15K+", label: "Happy Customers" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "99%", label: "Success Rate" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        {/* Subtle accent orbs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-32 left-10 w-48 h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-10 w-56 h-56 bg-gradient-to-br from-cyan-600/15 to-blue-600/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div ref={sectionRef} className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">
              Loved by Creators Worldwide
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            What Our Users Are{" "}
            <span className="gradient-text">
              Saying
            </span>
          </h2>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Join thousands of content creators who have transformed their video creation process with our AI platform.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-white/60 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-6 w-6 text-purple-400 opacity-60" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 mb-6 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <div className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-white/60">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="glassmorphism rounded-3xl p-8 max-w-2xl mx-auto border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-white/90 font-medium">Ready to join our satisfied customers?</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-white/60">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span>Rated 4.9/5 stars by 15,000+ users</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernTestimonialsSection;
