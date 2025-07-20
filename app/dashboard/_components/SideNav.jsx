"use client";
import {
  LayoutDashboard,
  VideoIcon,
  Sparkles,
  User,
  Settings,
  HelpCircle,
  History,
  TrendingUp,
  Crown,
  Zap,
  PlayCircle,
  Film,
  Palette,
  BarChart3,
  Gift,
  Star,
  Users,
  Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Badge } from "../../../@/components/ui/badge";
import { Button } from "../../../@/components/ui/button";
import { useSelector } from "react-redux";

const SideNav = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathName = usePathname();
  const coins = useSelector((state) => state.user.details.coins);
  const isAdmin = useSelector((state) => state.user.details.role) === 'admin'; 

  const Menu = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      Icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      description: "Overview & Analytics"
    },
    {
      id: 2,
      name: "Create Video",
      path: "/dashboard/create-new",
      Icon: VideoIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      description: "AI Video Generator",
      highlight: true
    },
    {
      id: 3,
      name: "My Videos",
      path: "/dashboard/videos",
      Icon: Film,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      description: "Video Library"
    },
    {
      id: 4,
      name: "Templates",
      path: "/dashboard/templates",
      Icon: Palette,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Video Templates",
      badge: "New"
    },
    {
      id: 5,
      name: "Analytics",
      path: "/dashboard/analytics",
      Icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      description: "Performance Stats"
    }
  ];

  // Conditional menu for admin
  const adminMenu = [
    {
      id: 9,
      name: "User Management",
      path: "/dashboard/user-management",
      Icon: Users,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      description: "Manage users and roles",
      role: "admin"
    }
  ];

  const bottomMenu = [
    {
      id: 6,
      name: "Upgrade Plan",
      path: "/dashboard/upgrade",
      Icon: Crown,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Get Premium Features",
      special: true
    },
    {
      id: 7,
      name: "Settings",
      path: "/dashboard/settings",
      Icon: Settings,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      description: "Account Settings"
    },
    {
      id: 8,
      name: "Help & Support",
      path: "/dashboard/help",
      Icon: HelpCircle,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Get Help"
    }
  ];

  const MenuItem = ({ item, isActive }) => {
    const { Icon, name, path, color, bgColor, description, highlight, badge, special } = item;
    
    return (
      <Link href={path}>
        <div 
          className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
            isActive 
              ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-105`
              : `hover:${bgColor} hover:scale-105 hover:shadow-md`
          }`}
          onClick={onClose}
        >
          {/* Icon Container */}
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
            isActive 
              ? 'bg-white/20 text-white' 
              : `bg-gradient-to-r ${color} text-white group-hover:scale-110 group-hover:rotate-3`
          }`}>
            <Icon className="h-5 w-5" />
            {highlight && !isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${
                isActive ? 'text-white' : 'text-gray-900'
              }`}>
                {name}
              </span>
              {badge && (
                <Badge className={`text-xs px-2 py-0.5 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                }`}>
                  {badge}
                </Badge>
              )}
              {special && (
                <Sparkles className={`h-3 w-3 ${
                  isActive ? 'text-white' : 'text-yellow-500'
                } animate-pulse`} />
              )}
            </div>
            <p className={`text-xs mt-0.5 ${
              isActive ? 'text-white/80' : 'text-gray-500'
            }`}>
              {description}
            </p>
          </div>
          
          {/* Active Indicator */}
          {isActive && (
            <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen z-30 bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-xl overflow-y-auto">
      <div className="p-6">
        {/* Quick Stats */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Your Progress</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
            <span className="text-xs text-gray-600">75%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">3 videos created this week</p>
        </div>

        {/* Main Navigation */}
        <div className="space-y-2 mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main</h3>
{[...Menu, ...(isAdmin ? adminMenu : [])].map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isActive={pathName === item.path}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Link href="/dashboard/create-new">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm py-2 transition-all duration-200 transform hover:scale-105">
                <PlayCircle className="h-4 w-4 mr-2" />
                Create Video
              </Button>
            </Link>
            <Link href="/dashboard/templates">
              <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm py-2">
                <Palette className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
          {bottomMenu.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isActive={pathName === item.path}
            />
          ))}
        </div>

        {/* Upgrade Prompt */}
        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <Crown className="h-6 w-6 mb-2" />
            <h4 className="font-bold text-sm mb-1">Upgrade to Pro</h4>
            <p className="text-xs opacity-90 mb-3">Unlock unlimited videos & premium features</p>
            <Link href="/dashboard/upgrade">
              <Button className="bg-white text-orange-600 hover:bg-gray-50 text-xs px-3 py-1 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                <Gift className="h-3 w-3 mr-1" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-gray-500" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Video created 2 hours ago</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Template used yesterday</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Account upgraded 3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
