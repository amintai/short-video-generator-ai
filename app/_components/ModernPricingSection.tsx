"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "../../components/ui/button";
import { 
  Check, 
  Sparkles, 
  Crown, 
  Rocket, 
  Star,
  Zap,
  ArrowRight,
  Gift,
  Gem,
  Shield
} from "lucide-react";
import { redirect } from "next/navigation";

const ModernPricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      icon: Rocket,
      description: "Perfect for individuals getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: "Free Forever",
      badgeColor: "from-emerald-500 to-green-600",
      cardGradient: "from-slate-800/50 to-gray-900/50",
      borderGradient: "from-emerald-400/20 to-green-600/20",
      popular: false,
      features: [
        "5 videos per month",
        "720p HD quality",
        "Basic AI voices",
        "Standard templates",
        "Email support",
        "Watermark included"
      ]
    },
    {
      name: "Pro",
      icon: Crown,
      description: "For creators and businesses",
      monthlyPrice: 29,
      yearlyPrice: 290,
      badge: "Most Popular",
      badgeColor: "from-purple-500 to-pink-600",
      cardGradient: "from-purple-900/30 to-pink-900/30",
      borderGradient: "from-purple-400/40 to-pink-600/40",
      popular: true,
      features: [
        "100 videos per month",
        "4K Ultra HD quality",
        "Premium AI voices",
        "Custom branding",
        "Priority support",
        "No watermark",
        "Advanced analytics",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      icon: Gem,
      description: "For teams and large organizations",
      monthlyPrice: 99,
      yearlyPrice: 990,
      badge: "Best Value",
      badgeColor: "from-cyan-500 to-blue-600",
      cardGradient: "from-cyan-900/30 to-blue-900/30",
      borderGradient: "from-cyan-400/40 to-blue-600/40",
      popular: false,
      features: [
        "Unlimited videos",
        "8K quality",
        "Custom AI voice cloning",
        "White-label solution",
        "Dedicated support",
        "Advanced integrations",
        "Custom workflows",
        "SLA guarantee"
      ]
    }
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const getPrice = (plan: any) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getSavings = (plan: any) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    return billingCycle === 'yearly' ? savings : null;
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-bounce-slow" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />

      <div ref={sectionRef} className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 glassmorphism border border-white/20 rounded-full px-6 py-3 mb-8">
            <Gift className="h-5 w-5 text-yellow-400 animate-bounce" />
            <span className="text-sm font-semibold gradient-text">
              Choose Your Perfect Plan
            </span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Simple,{" "}
            <span className="gradient-text">Transparent</span>
            <br />
            Pricing
          </h2>

          <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-12">
            Start for free, scale as you grow. No hidden fees, no surprises.
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 glassmorphism rounded-2xl p-2 border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Yearly
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold px-2 py-1 rounded-full text-black">
                -20%
              </div>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const savings = getSavings(plan);
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative ${plan.popular ? 'lg:-mt-8 lg:scale-105' : ''}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className={`bg-gradient-to-r ${plan.badgeColor} px-6 py-2 rounded-full shadow-2xl`}>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-white" />
                        <span className="text-sm font-bold text-white">{plan.badge}</span>
                        <Star className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                <motion.div
                  className={`relative group glassmorphism backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-500 cursor-pointer overflow-hidden ${
                    plan.popular 
                      ? 'border-purple-500/40 hover:border-purple-400/60' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: plan.popular ? 1.02 : 1.05, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.cardGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Border glow */}
                  <div className={`absolute -inset-px bg-gradient-to-r ${plan.borderGradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${plan.badgeColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                          <p className="text-sm text-foreground/60">{plan.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold gradient-text">
                          {getPrice(plan)}
                        </span>
                        {plan.monthlyPrice > 0 && (
                          <span className="text-foreground/60">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        )}
                      </div>
                      
                      {savings && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-emerald-400 font-semibold">
                            Save ${savings}/year
                          </span>
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-foreground/80 group-hover:text-foreground/90 transition-colors">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => redirect("/sign-up")}
                        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          plan.popular
                            ? 'bg-gradient-cosmic hover:shadow-2xl hover:shadow-purple-500/25 text-white border-2 border-transparent hover:border-white/20'
                            : 'glassmorphism border-2 border-white/20 hover:border-white/40 text-foreground hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {plan.monthlyPrice === 0 ? (
                            <>
                              <Rocket className="h-5 w-5" />
                              <span>Get Started Free</span>
                            </>
                          ) : (
                            <>
                              <span>Choose {plan.name}</span>
                              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </>
                          )}
                        </div>
                      </Button>
                    </motion.div>

                    {/* Additional info for paid plans */}
                    {plan.monthlyPrice > 0 && (
                      <div className="mt-4 text-center text-sm text-foreground/60">
                        <div className="flex items-center justify-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>30-day money-back guarantee</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="glassmorphism rounded-3xl p-8 max-w-4xl mx-auto border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-cosmic rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold gradient-text mb-1">
                    Enterprise Solutions
                  </h3>
                  <p className="text-foreground/70">
                    Custom pricing for large teams and organizations
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="glassmorphism border-2 border-white/20 hover:border-white/40 text-foreground hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl"
              >
                Contact Sales
              </Button>
            </div>
          </div>

          {/* FAQ link */}
          <div className="mt-8">
            <p className="text-foreground/60">
              Have questions? Check out our{" "}
              <a href="#faq" className="gradient-text hover:underline font-semibold">
                FAQ
              </a>{" "}
              or{" "}
              <a href="#contact" className="gradient-text hover:underline font-semibold">
                contact support
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernPricingSection;
