"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../@/components/ui/button";
import { Download, RefreshCw, Play, Pause, Share2, Copy, Check, Sparkles } from "lucide-react";
import { Player } from "@remotion/player";
import RemotionVideo from "../../_components/RemotionVideo";
import toast from "react-hot-toast";

const InlineVideoPlayer = ({ videoData, isLoading, onReset }) => {
  const [durationInFrame, setDurationInFrame] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    // Try videoUrl first, then audioFileUrl as fallback
    const downloadUrl = videoData?.video?.videoUrl || videoData?.video?.audioFileUrl;
    
    if (!downloadUrl) {
      toast.error('Video URL not available');
      return;
    }

    setIsDownloading(true);
    toast.loading('Preparing download...');
    
    try {
      // For Firebase URLs, we can directly use them
      if (downloadUrl.includes('firebase') || downloadUrl.includes('googleapis.com')) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${videoData.video.name || 'ugc-video'}.mp4`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.dismiss();
        toast.success('Download started! Check your downloads folder.');
        
        // Track download analytics
        await trackDownload(videoData.video.id);
      } else {
        // For other URLs, fetch and create blob
        const response = await fetch(downloadUrl, {
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) throw new Error('Failed to fetch video');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${videoData.video.name || 'ugc-video'}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.dismiss();
        toast.success('Video downloaded successfully!');
        
        // Track download analytics
        await trackDownload(videoData.video.id);
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.dismiss();
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const trackDownload = async (videoId) => {
    try {
      await fetch('/api/video-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoId,
          action: 'download'
        })
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const handleShare = () => {
    const videoUrl = `${window.location.origin}/public/video?video=${videoData.video.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Check out my UGC video: ${videoData.video.name}`,
        text: 'Created with AI - UGC Video Generator',
        url: videoUrl
      }).then(() => {
        toast.success('Video shared successfully!');
      }).catch((error) => {
        console.error('Share failed:', error);
        // Fallback to copy
        navigator.clipboard.writeText(videoUrl).then(() => {
          toast.success('Link copied to clipboard!');
        }).catch(() => {
          toast.error('Failed to share video');
        });
      });
    } else {
      // Fallback for desktop - copy to clipboard
      navigator.clipboard.writeText(videoUrl).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading Skeleton */}
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Generating your UGC video...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Script generated</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Audio synthesized</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700">Creating video...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="space-y-4">
        {/* Empty State */}
        <div className="aspect-video bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Ready to create your UGC video?</p>
            <p className="text-gray-500 text-sm">Fill in the form and click generate</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm">Your UGC video will appear here once generated</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
        <Player
          component={RemotionVideo}
          durationInFrames={Number(durationInFrame.toFixed(0))}
          compositionWidth={350}
          compositionHeight={500}
          fps={30}
          inputProps={{
            ...videoData.video,
            setDurationInFrame: (frameValue) => setDurationInFrame(frameValue),
          }}
          controls
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
          }}
        />
      </div>

      {/* Video Info Card */}
      <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 rounded-2xl p-6 border border-violet-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Live</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{videoData.video.name}</h3>
            <p className="text-sm text-gray-600">UGC Advertisement • Generated just now</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
              30s
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              AI Avatar
            </div>
          </div>
        </div>
        
        {/* Video Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 text-blue-500">🎬</span>
            <span>Professional Quality</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 text-green-500">✨</span>
            <span>AI Enhanced</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 text-purple-500">🎯</span>
            <span>UGC Style</span>
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Downloading...
              </>
            ) : (
              'Download Video'
            )}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-violet-200 hover:bg-violet-50 hover:border-violet-300 text-violet-700 rounded-xl h-12 font-semibold transition-all duration-200"
            onClick={onReset}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Generate New
          </Button>
        </div>
        
        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 h-10" 
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 h-10" 
            onClick={() => {
              const videoUrl = `${window.location.origin}/public/video?video=${videoData.video.id}`;
              navigator.clipboard.writeText(videoUrl).then(() => {
                toast.success('Link copied to clipboard!');
              }).catch(() => {
                toast.error('Failed to copy link');
              });
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      {/* Share & Engagement Tips */}
      <div className="pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Maximize Your UGC Impact
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>✨ Post during peak hours (6-9 PM) for maximum engagement</p>
            <p>🎯 Use trending hashtags related to your product</p>
            <p>📱 Share across Instagram, TikTok, and YouTube Shorts</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InlineVideoPlayer;
