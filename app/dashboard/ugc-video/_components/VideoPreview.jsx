"use client";
import React from "react";
import { motion } from "framer-motion";
import { CloudDownload } from "lucide-react";
import { Button } from "../../../../@/components/ui/button";

const VideoPreview = ({ video, isLoading, onReset }) => {
  if (isLoading) {
    return <p className="text-gray-600">Loading video...</p>;
  }

  if (!video) {
    return <p className="text-gray-500">Your generated video will appear here.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          controls
          src={video.url}
          className="w-full h-full"
        />
      </div>

      {/* Video Actions */}
      <div className="flex items-center gap-2">
        <Button className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl px-4 py-2">
          <CloudDownload className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          className="border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2"
          onClick={onReset}
        >
          Generate Another Video
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;

