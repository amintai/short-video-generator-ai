"use client";
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "../../../@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Badge } from "../../../@/components/ui/badge";
import { Switch } from "../../../@/components/ui/switch";
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  Users, 
  Building, 
  Star,
  ArrowRight,
  Shield,
  Infinity
} from "lucide-react";
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Upgrade = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Users,
      description: 'Perfect for beginners and casual creators',
      monthlyPrice: 25,
      yearlyPrice: 250,
      yearlyDiscount: 17,
      features: [
        { name: '5 AI videos per month', included: true },
        { name: '720p video quality', included: true },
        { name: 'Basic video templates', included: true },
        { name: 'Text-to-video generation', included: true },
        { name: 'Up to 30 seconds length', included: true },
        { name: 'Standard rendering speed', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced editing tools', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority rendering', included: false }
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      description: 'For serious content creators and marketers',
      monthlyPrice: 49,
      yearlyPrice: 490,
      yearlyDiscount: 17,
      features: [
        { name: '25 AI videos per month', included: true },
        { name: '1080p video quality', included: true },
        { name: 'Premium video templates', included: true },
        { name: 'Text-to-video generation', included: true },
        { name: 'Up to 2 minutes length', included: true },
        { name: 'Fast rendering speed', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Advanced editing tools', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Priority rendering', included: true },
        { name: 'Stock footage library', included: true },
        { name: 'API access', included: false }
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building,
      description: 'Ultimate solution for agencies and businesses',
      monthlyPrice: 99,
      yearlyPrice: 990,
      yearlyDiscount: 17,
      features: [
        { name: 'Unlimited AI videos', included: true },
        { name: '4K video quality', included: true },
        { name: 'Custom video templates', included: true },
        { name: 'Text-to-video generation', included: true },
        { name: 'Unlimited video length', included: true },
        { name: 'Ultra-fast rendering speed', included: true },
        { name: 'Dedicated support team', included: true },
        { name: 'Advanced editing tools', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Priority rendering', included: true },
        { name: 'Stock footage library', included: true },
        { name: 'API access', included: true }
      ],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          isYearly,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription process');
    } finally {
      setLoading(false);
    }
  };

  const PricingCard = ({ plan }) => {
    const { id, name, icon: Icon, description, monthlyPrice, yearlyPrice, yearlyDiscount, features, color, bgColor, popular } = plan;
    const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
    const originalYearlyPrice = monthlyPrice * 12;
    
    return (
      <Card className={`relative h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        popular ? 'ring-2 ring-purple-500 shadow-2xl' : 'hover:shadow-xl'
      }`}>
        {popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${color} text-white mx-auto mb-4`}>
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <CardDescription className="text-gray-600 mt-2">{description}</CardDescription>
          
          <div className="mt-6">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-extrabold text-gray-900">₹{currentPrice}</span>
              <span className="text-gray-500 ml-1">/{isYearly ? 'year' : 'month'}</span>
            </div>
            
            {isYearly && (
              <div className="mt-2">
                <span className="text-sm text-gray-500 line-through">₹{originalYearlyPrice}/year</span>
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                  Save {yearlyDiscount}%
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="px-6">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  feature.included 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {feature.included ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-xs">×</span>
                  )}
                </div>
                <span className={`text-sm ${
                  feature.included ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="pt-6 px-6 pb-8">
          <Button 
            onClick={() => handleSubscribe(id)}
            disabled={loading}
            className={`w-full py-3 font-semibold transition-all duration-200 ${
              popular 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                : `bg-gradient-to-r ${color} hover:opacity-90 text-white`
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                {id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Upgrade Your Plan
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Choose the perfect plan for your 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> AI videos</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your ideas into stunning short videos with our AI-powered platform. 
            Start free, upgrade when you're ready to scale.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 bg-white rounded-2xl p-2 shadow-lg max-w-sm mx-auto">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch 
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                Save 17%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by creators worldwide</h3>
            <p className="text-gray-600">Join thousands of content creators who trust our platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Videos Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan later?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">What happens if I exceed my video limit?</h4>
              <p className="text-gray-600">You'll receive a notification when you're close to your limit. You can upgrade your plan or wait for the next billing cycle.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h4>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
