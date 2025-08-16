"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Sparkles, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  Heart,
  ExternalLink
} from "lucide-react";

const ModernFooter = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Templates", href: "/templates" },
      { name: "API", href: "/api" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" }
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "GitHub", icon: Github, href: "https://github.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { name: "Email", icon: Mail, href: "mailto:hello@videoai.com" }
  ];

  return (
    <footer className="relative mt-32 bg-gradient-to-b from-background to-slate-950">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Play className="h-6 w-6 text-white fill-current" />
                  </div>
                  <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                </div>
                <span className="text-2xl font-bold gradient-text">VideoMagic AI</span>
              </div>
              
              <p className="text-white/70 leading-relaxed mb-6 max-w-sm">
                Transform your ideas into professional videos with AI. 
                No editing skills required - just pure creativity.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 glassmorphism rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      {link.href.startsWith('http') && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="py-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Stay in the loop</h3>
              <p className="text-white/60 text-sm">Get the latest updates and tips for creating amazing videos.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>&copy; {new Date().getFullYear()} VideoMagic AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
            <span>for creators worldwide</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default ModernFooter;
