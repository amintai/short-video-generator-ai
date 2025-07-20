"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@remotion/player";
import RemotionVideo from "../../dashboard/_components/RemotionVideo";
import { Share2, Calendar, Sparkles, Copy, Twitter, Facebook, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Badge } from "../../../@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../../@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

const PublicVideoPage = () => {
  const searchParams = useSearchParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [durationInFrame, setDurationInFrame] = useState(90);

  useEffect(() => {
    const videoId = searchParams.get('video');
    if (videoId) {
      // Simulate fetching video data
      fetch(`/api/videos/${videoId}`)
        .then(response => response.json())
        .then(data => {
          setVideoData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching video:', error);
          toast.error('Failed to load video.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleShare = async (platform) => {
    const videoUrl = window.location.href;
    const title = "Check out this AI-generated video!";
    const scriptText = Array.isArray(videoData.script) && videoData.script.length > 0 
      ? videoData.script.map(segment => segment.contentText).join(' ').substring(0, 100)
      : 'AI-generated video';
    const text = `Created with VideoAI: ${scriptText}...`;

    try {
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share({ title, text, url: videoUrl });
          } else {
            throw new Error('Native sharing not supported');
          }
          break;
        case 'copy':
          await navigator.clipboard.writeText(videoUrl);
          toast.success('Link copied to clipboard!');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(videoUrl)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${videoUrl}`)}`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(videoUrl);
        toast.success('Link copied to clipboard!');
      } catch (copyError) {
        toast.error('Sharing failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-lg text-gray-600">Loading video...</span>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Video not found</h2>
          <p className="text-gray-600">The video you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const createdDate = videoData?.createdAt ? new Date(videoData.createdAt) : new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {videoData.name || 'Untitled Video'}
          </h1>
          <p className="text-gray-600">AI-Generated Video • Created {formatDistanceToNow(createdDate, { addSuffix: true })}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Player */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <Player
                component={RemotionVideo}
                durationInFrames={Number(durationInFrame.toFixed(0))}
                compositionWidth={350}
                compositionHeight={500}
                fps={30}
                inputProps={{
                  ...videoData,
                  setDurationInFrame: (frameValue) => setDurationInFrame(frameValue),
                }}
                controls
                doubleClickToFullscreen
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
                className="shadow-2xl"
              />
            </div>
          </div>

          {/* Video Info Sidebar */}
          <div className="w-full lg:w-80">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                {/* Video Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Video Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sparkles className="h-4 w-4" />
                      <span>Duration: ~{Math.round(durationInFrame / 30)}s</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs p-2">
                      AI Generated
                    </Badge>
                    <Badge variant="outline" className="text-xs p-2">
                      HD Quality
                    </Badge>
                  </div>
                </div>

                {/* Script Content */}
                {videoData?.script && Array.isArray(videoData.script) && videoData.script.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Script Content</h3>
                    <div className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto space-y-2">
                      {videoData.script.map((segment, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-3 py-1">
                          <p className="text-gray-800">
                            {segment.contentText || 'No content available'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Options */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Share this video</h3>
                  <div className="space-y-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Video
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-3 py-2 border-b">
                          <p className="font-medium text-sm">Share this video</p>
                          <p className="text-xs text-gray-500">Choose how you want to share</p>
                        </div>
                        <DropdownMenuItem onClick={() => handleShare('copy')}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('native')}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Native Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleShare('twitter')}>
                          <Twitter className="h-4 w-4 mr-2" />
                          Share on Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('facebook')}>
                          <Facebook className="h-4 w-4 mr-2" />
                          Share on Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Share on WhatsApp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVideoPage;

