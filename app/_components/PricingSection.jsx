"use client";

import React, { useState } from "react";
import { Button } from "../../@/components/ui/button";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { redirect } from "next/navigation";

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      icon: Sparkles,
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: [
        "3 videos per month",
        "30-second duration",
        "Basic AI voices",
        "Standard video quality",
        "Basic templates",
        "Community support"
      ],
      limitations: [
        "Watermarked videos",
        "Limited customization"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "gray"
    },
    {
      name: "Creator",
      icon: Zap,
      price: { monthly: 19, annual: 15 },
      description: "For content creators and small businesses",
      features: [
        "50 videos per month",
        "Up to 60-second duration",
        "Premium AI voices",
        "HD video quality",
        "Advanced templates",
        "Custom branding",
        "Priority support",
        "No watermarks"
      ],
      limitations: [],
      cta: "Start Creating",
      popular: true,
      color: "blue"
    },
    {
      name: "Business",
      icon: Crown,
      price: { monthly: 49, annual: 39 },
      description: "For teams and growing businesses",
      features: [
        "200 videos per month",
        "Unlimited duration",
        "All premium AI voices",
        "4K video quality",
        "Custom templates",
        "Team collaboration",
        "Advanced analytics",
        "API access",
        "24/7 priority support",
        "Custom integrations"
      ],
      limitations: [],
      cta: "Scale Your Business",
      popular: false,
      color: "purple"
    }
  ];

  const getColorClasses = (color, isPrimary = false) => {
    const colorMap = {
      gray: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
        button: "bg-gray-900 hover:bg-gray-800 text-white"
      },
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        button: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        button: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      }
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Simple Pricing</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                !isAnnual 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                isAnnual 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color);
            const currentPrice = isAnnual ? plan.price.annual : plan.price.monthly;
            
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular 
                    ? "border-2 border-blue-200 shadow-lg shadow-blue-100/50" 
                    : "border border-gray-200 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${colors.bg}`}>
                    <plan.icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${currentPrice}
                    </span>
                    <span className="text-gray-600">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  {isAnnual && plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      ${plan.price.monthly}/month billed annually
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => redirect("/sign-up")}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${colors.button}`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span>✨ Upgrade or downgrade anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
