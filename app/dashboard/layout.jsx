"use client";
import React, { useState } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_context/VideoDataContext";

const DashboardLayout = ({ children }) => {
  const [videoData, setVideoData] = useState({});
  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      <div>
        <div className="hidden md:block h-screen bg-white fixed top-0 w-64">
          <SideNav />
        </div>
        <div className="md:ml-64 ">
          <Header />
          <div className="p-10 pt-20">{children}</div>
        </div>
      </div>
    </VideoDataContext.Provider>
  );
};

export default DashboardLayout;
