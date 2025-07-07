"use client";

import { SignUp } from "@clerk/nextjs";
import HomePageHeader from "../../../_components/Header";
import { Play, Sparkles, Video, Zap, ArrowLeft } from "lucide-react";
import { Button } from "../../../../@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-30"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      <div className="absolute bottom-10 left-1/2 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      
      <HomePageHeader />
      
      <div className="relative pt-20 md:pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className="order-2 lg:order-1 space-y-8">
              {/* Back Button */}
              <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              
              {/* Welcome Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Get Started Today
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Join{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    VideoAI
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Create your account and start generating amazing short videos with AI in minutes. Transform your ideas into engaging content effortlessly.
                </p>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Lightning Fast</h3>
                  <p className="text-xs text-gray-600">Generate in minutes</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">HD Quality</h3>
                  <p className="text-xs text-gray-600">Professional output</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">AI Powered</h3>
                  <p className="text-xs text-gray-600">Smart generation</p>
                </div>
              </div>
              
              {/* Sign in link */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-gray-600 mb-3">Already have an account?</p>
                <Link href="/sign-in">
                  <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2 rounded-full transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Side - Sign Up Form */}
            <div className="order-1 lg:order-2 flex justify-center items-center">
              <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-100">
                  <div className="flex items-center justify-center mb-8">
                    <div className="relative">
                      <Play className="h-8 w-8 text-blue-600 fill-current" />
                      <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
                    </div>
                    <span className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl">
                      VideoAI
                    </span>
                  </div>
                  
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl",
                        card: "bg-transparent shadow-none",
                        headerTitle: "text-gray-900 font-bold text-xl",
                        headerSubtitle: "text-gray-600",
                        formFieldInput: "rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                        formFieldLabel: "text-gray-700 font-medium",
                        footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                        dividerLine: "bg-gray-200",
                        dividerText: "text-gray-500",
                        socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 rounded-xl",
                        socialButtonsBlockButtonText: "text-gray-700 font-medium",
                        formResendCodeLink: "text-blue-600 hover:text-blue-700 font-medium",
                        otpCodeFieldInput: "border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
