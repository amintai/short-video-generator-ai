"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { 
  Play, 
  Sparkles, 
  Menu, 
  X, 
  Zap, 
  Rocket, 
  ArrowRight,
  Stars
} from "lucide-react";
import { redirect } from "next/navigation";

const ModernHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotateY: 15,
      transition: { duration: 0.3 }
    }
  };

  const navLinkVariants = {
    hover: {
      scale: 1.1,
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const staggerMenuItems = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    }
  };

  const menuItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  const navItems = [
    { label: "Features", href: "#features", icon: Zap },
    { label: "Pricing", href: "#pricing", icon: Stars },
    { label: "Testimonials", href: "#testimonials", icon: Sparkles }
  ];

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glassmorphism border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-electric-violet to-cyber-pink rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto flex items-center justify-between px-6 lg:px-8 py-4 relative">
        {/* Logo */}
        <motion.div
          variants={logoVariants}
          whileHover="hover"
          className="relative cursor-pointer"
          onClick={() => redirect("/")}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-cosmic rounded-full opacity-20 blur-sm animate-pulse-slow" />
              <div className="relative bg-gradient-primary p-3 rounded-2xl neon-glow">
                <Play className="h-8 w-8 text-white fill-current" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </motion.div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">
                VideoMagic AI
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Next-Gen Video Creation
              </span>
            </div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.a
                key={item.label}
                variants={navLinkVariants}
                whileHover="hover"
                href={item.href}
                className="group flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.1 * index }
                }}
              >
                <IconComponent className="h-4 w-4 text-electric-violet group-hover:text-cyber-pink transition-colors duration-200" />
                <span>{item.label}</span>
                
                {/* Underline effect */}
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            );
          })}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => redirect("/sign-in")}
            className="text-foreground/80 hover:text-foreground hover:bg-white/5 font-medium transition-all duration-200"
          >
            Sign In
          </Button>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => redirect("/sign-up")}
              className="relative overflow-hidden bg-gradient-primary hover:bg-gradient-secondary text-white font-medium px-6 py-2 rounded-2xl transition-all duration-300 neon-glow group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <span className="relative flex items-center space-x-2">
                <Rocket className="h-4 w-4" />
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden relative p-2 glassmorphism rounded-xl neon-glow"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed top-full left-0 w-full h-screen glassmorphism backdrop-blur-3xl"
          >
            <div className="container mx-auto px-6 py-8">
              <motion.nav
                variants={staggerMenuItems}
                className="space-y-6"
              >
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      variants={menuItemVariants}
                      href={item.href}
                      className="flex items-center space-x-4 text-xl font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 p-4 rounded-2xl hover:bg-white/5 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 bg-gradient-primary rounded-xl group-hover:neon-glow transition-all duration-200">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span>{item.label}</span>
                    </motion.a>
                  );
                })}
                
                <motion.div variants={menuItemVariants} className="pt-6 space-y-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => redirect("/sign-in")}
                    className="w-full text-foreground/80 hover:text-foreground hover:bg-white/5 font-medium py-4 text-lg"
                  >
                    Sign In
                  </Button>
                  
                  <Button
                    onClick={() => redirect("/sign-up")}
                    className="w-full bg-gradient-primary hover:bg-gradient-secondary text-white font-medium py-4 text-lg rounded-2xl neon-glow"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Get Started
                  </Button>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default ModernHeader;
