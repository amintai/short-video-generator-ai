"use client"

import React from "react";
import useVideoList from "../hooks/useVideoList"; // Assuming this hook brings video analytics
import { BarChart, Activity, Eye, Download, Share } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../@/components/ui/card";

const Analytics = () => {
  const [{ videoList }] = useVideoList();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Activity className="w-4 h-4" /> Analytics Overview
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Your Video Performance</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor your video's views, downloads, and shares over time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videoList.map((item) => (
            <Card key={item.video.id} className="shadow-lg">
              <CardHeader className="flex justify-between items-center pb-4">
                <div>
                  <CardTitle className="text-xl font-bold">{item.video.name}</CardTitle>
                  {/* <p className="text-sm text-gray-500">{video.createdAt}</p> */}
                </div>
                <BarChart className="w-7 h-7 text-purple-600" />
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold">{item.video.views} Views</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-semibold">{item.video.downloads} Downloads</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Share className="w-5 h-5 text-yellow-600" />
                    <span className="text-lg font-semibold">{item.video.shares} Shares</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
