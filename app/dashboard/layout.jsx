"use client";
import React, { useState } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_context/VideoDataContext";
import { Toaster } from "react-hot-toast";

const DashboardLayout = ({ children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [videoData, setVideoData] = useState({});
  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Enhanced Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-36 h-36 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-20 w-28 h-28 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-3000"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-4000"></div>
        </div>
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed top-0 left-0 z-40">
          <SideNav />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Mobile Sidebar */}
            <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
              <SideNav onClose={() => setShowMobileMenu(false)} />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="md:ml-64 relative z-10">
          <Header onMobileMenuToggle={setShowMobileMenu} />
          <main className="pt-24 pb-8">
            <div className="px-6 lg:px-8 mt-12" >
              {children}
            </div>
          </main>
        </div>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </div>
    </VideoDataContext.Provider>
  );
};

export default DashboardLayout;
