import { UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Coins,
  Play,
  Sparkles,
  Zap,
  Bell,
  TrendingUp,
  Gift,
  Crown,
  Gem,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import { Badge } from "../../../@/components/ui/badge";
import Link from "next/link";

const Header = ({ onMobileMenuToggle }) => {
  const coins = useSelector((state) => state.user.details.coins);
  const [showNotifications, setShowNotifications] = useState(false);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Animate coins when they change
  useEffect(() => {
    setCoinAnimation(true);
    const timer = setTimeout(() => setCoinAnimation(false), 600);
    return () => clearTimeout(timer);
  }, [coins]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
{/* Left Section - Mobile Menu + Logo */}
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMobileMenu(!showMobileMenu);
                  onMobileMenuToggle && onMobileMenuToggle(!showMobileMenu);
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </Button>
            </div>

            {/* Logo Section - Enhanced Visibility */}
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 group"
              title="VideoAI Dashboard"
            >
              <div className="relative p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Play className="h-7 w-7 text-white fill-current" />
                </div>
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-xl">
                  VideoAI
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Spacer for center alignment */}
          <div className="flex-1"></div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Coins Display */}
            <div className="relative group">
              <div
                className={`flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  coinAnimation ? "animate-bounce" : ""
                }`}
              >
                <div className="relative">
                  <Gem className="h-5 w-5 animate-pulse" />
                  <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-30 animate-ping"></div>
                </div>
                <span className="font-bold text-lg">
                  {coins?.toLocaleString() || "0"}
                </span>
                <Crown className="h-4 w-4" />
              </div>

              {/* Coins Tooltip */}
              <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>Your Video Coins</span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Use to create amazing videos
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  2
                </Badge>
              </Button>

              {/* Get More Coins Button */}
              <Link href="/dashboard/upgrade">
                <Button className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <Gift className="h-4 w-4" />
                  <span>Get Coins</span>
                </Button>
              </Link>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900">
                  Welcome back!
                </span>
                <span className="text-xs text-gray-500">
                  Create amazing videos
                </span>
              </div>
              <div className="relative">
                <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 rounded-full border-2 border-white shadow-lg",
                      },
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-full right-6 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Video Generation Complete!
                  </p>
                  <p className="text-xs text-gray-600">
                    Your AI video is ready to view and share.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                <Gift className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Daily Coins Bonus!
                  </p>
                  <p className="text-xs text-gray-600">
                    You earned 50 coins for logging in today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;
