"use client";

import React, { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  Sparkles,
  Bot,
  Layers,
  TrendingUp,
  Shield,
  Headphones,
  Monitor
} from "lucide-react";

const ModernFeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Bot,
      title: "AI Script Generation",
      description: "Our advanced AI creates engaging, personalized scripts tailored to your topic and target audience in seconds.",
      color: "from-blue-500 to-purple-600",
      accentColor: "text-blue-400",
      bgGradient: "from-blue-500/10 to-purple-600/10"
    },
    {
      icon: Headphones,
      title: "Neural Voice Synthesis",
      description: "High-quality, human-like voiceovers in 40+ languages with emotional depth and natural intonation.",
      color: "from-purple-500 to-pink-600",
      accentColor: "text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-600/10"
    },
    {
      icon: Layers,
      title: "Smart Visual Creation",
      description: "AI-generated images and video clips that perfectly match your content theme and narrative flow.",
      color: "from-pink-500 to-red-600",
      accentColor: "text-pink-400",
      bgGradient: "from-pink-500/10 to-red-600/10"
    },
    {
      icon: FileText,
      title: "Dynamic Captions",
      description: "Synchronized, stylized captions generated automatically with perfect timing and customizable styling.",
      color: "from-green-500 to-emerald-600",
      accentColor: "text-emerald-400",
      bgGradient: "from-green-500/10 to-emerald-600/10"
    },
    {
      icon: Palette,
      title: "Brand Customization",
      description: "Choose from premium templates or create custom styles that match your brand identity perfectly.",
      color: "from-orange-500 to-yellow-600",
      accentColor: "text-orange-400",
      bgGradient: "from-orange-500/10 to-yellow-600/10"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track engagement, optimize content, and grow your audience with detailed insights and recommendations.",
      color: "from-teal-500 to-cyan-600",
      accentColor: "text-teal-400",
      bgGradient: "from-teal-500/10 to-cyan-600/10"
    },
    {
      icon: Globe,
      title: "Multi-Platform Export",
      description: "Export in formats optimized for TikTok, Instagram, YouTube Shorts, and other social platforms.",
      color: "from-indigo-500 to-blue-600",
      accentColor: "text-indigo-400",
      bgGradient: "from-indigo-500/10 to-blue-600/10"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, secure cloud storage, and compliance with GDPR and other privacy regulations.",
      color: "from-slate-500 to-gray-600",
      accentColor: "text-slate-400",
      bgGradient: "from-slate-500/10 to-gray-600/10"
    },
    {
      icon: Zap,
      title: "Lightning Speed",
      description: "From idea to finished video in under 60 seconds with our optimized AI pipeline and cloud infrastructure.",
      color: "from-yellow-500 to-amber-600",
      accentColor: "text-yellow-400",
      bgGradient: "from-yellow-500/10 to-amber-600/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // 3D Card Effect Component
  const Card3D = ({ children, className = "", ...props }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), {
      stiffness: 300,
      damping: 30
    });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), {
      stiffness: 300,
      damping: 30
    });

    const handleMouseMove = (event: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(event.clientX - centerX);
      mouseY.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={cardRef}
        className={className}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-bounce-slow" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

      <div ref={sectionRef} className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 glassmorphism border border-white/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-semibold gradient-text">
              Powered by Advanced AI
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
            Everything You Need to Create{" "}
            <span className="gradient-text block">
              Professional Videos
            </span>
          </h2>
          
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive AI-powered platform handles every aspect of video creation, 
            from initial concept to final rendering. Experience the future of content creation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isMainFeature = index < 3; // First 3 are main features
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative ${isMainFeature ? 'lg:col-span-1' : ''}`}
              >
                <Card3D
                  className="group relative h-full glassmorphism backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Glow effect */}
                  <div className={`absolute -inset-px bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="relative mb-6">
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      {/* Icon glow */}
                      <div className={`absolute -inset-2 bg-gradient-to-r ${feature.color} rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-all duration-300`} />
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-1 h-1 ${feature.accentColor} rounded-full opacity-0 group-hover:opacity-60`}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            whileHover={{
                              scale: [0, 1, 0],
                              x: [0, Math.random() * 40 - 20],
                              y: [0, Math.random() * 40 - 20],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className={`font-bold text-2xl text-foreground mb-4 group-hover:${feature.accentColor} transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Learn more link */}
                    <motion.div
                      className="mt-6 flex items-center text-sm font-semibold text-foreground/60 group-hover:text-foreground transition-colors duration-300"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                    >
                      <span>Learn more</span>
                      <motion.div
                        className="ml-2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Stats/CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-2 text-sm text-foreground/60 mb-8">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span>All features included • No hidden costs • Cancel anytime</span>
          </div>
          
          {/* Trusted by stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { number: "500K+", label: "Active Users" },
              { number: "2M+", label: "Videos Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "4.9/5", label: "User Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernFeaturesSection;
