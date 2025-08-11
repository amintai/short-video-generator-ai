import React, { useRef, useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import useFavorites from "../hooks/useFavorites";
import {
  Play,
  Heart,
  Share2,
  MoreVertical,
  Download,
  Calendar,
  Clock,
  Copy,
  Twitter,
  Facebook,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../@/components/ui/dropdown-menu";
import { Badge } from "../../../@/components/ui/badge";
import { Card, CardContent } from "../../../@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";

const VideoList = ({
  videoList,
  originalVideoList,
  openPlayDialog,
  videoData,
  handleDeleteVideo,
  handleCancelVideoPlayerCb,
  getVideoData,
  isLoading,
  viewMode = "grid",
  setVideoData = () => {}, // Added setVideoData prop
  setVideoList = () => {}, // Added setVideoList prop
}) => {
  const ref = useRef();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, video: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete confirmation
  const handleDeleteClick = (video) => {
    setDeleteDialog({ isOpen: true, video });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.video) return;
    
    setIsDeleting(true);
    try {
      await handleDeleteVideo(deleteDialog.video);
      setDeleteDialog({ isOpen: false, video: null });
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, video: null });
  };


  const handleShare = async (video, platform) => {
    const videoUrl = `${window.location.origin}/public/video?video=${video.id}`;
    const title = "Check out this AI-generated video!";
    const scriptText = Array.isArray(video.script) && video.script.length > 0 
      ? video.script.map(segment => segment.contentText).join(' ').substring(0, 100)
      : 'AI-generated video';
    const text = `Created with VideoAI: ${scriptText}...`;


    try {
      // Track the share in database first
      const trackResponse = await fetch('/api/videos/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          platform: platform
        })
      });

      if (!trackResponse.ok) {
        console.error('Failed to track share:', await trackResponse.text());
      }

      // Proceed with the sharing action
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share({ title, text, url: videoUrl });
            toast.success('Video shared successfully!');
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
          toast.success('Shared to Twitter!');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`);
          toast.success('Shared to Facebook!');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${videoUrl}`)}`);
          toast.success('Shared to WhatsApp!');
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

  const downloadVideo = async (video) => {
    try {
      // For now, we'll simulate a download process
      // In a real implementation, you would call your video export API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = '#'; // In reality, this would be the rendered video URL
      link.download = `${video.name || 'video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('Video download started!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download video. Please try again.');
    }
  };

  const VideoCard = ({ item, index }) => {
    const videoDetails = item.video;

    const isVideoFavorite = isFavorite(videoDetails.id);
    const createdDate = new Date(videoDetails.createdAt || new Date());

    return (
      <Card className="group bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
        <CardContent className="p-0">
          {/* Video Thumbnail */}
          <div className="relative overflow-hidden">
            <div
              className="cursor-pointer"
              onClick={() => getVideoData(videoDetails.id)}
            >
              <Thumbnail
                ref={ref}
                durationInFrames={30}
                compositionWidth={viewMode === "grid" ? 300 : 200}
                compositionHeight={viewMode === "grid" ? 400 : 280}
                fps={30}
                frameToDisplay={30}
                component={RemotionVideo}
                inputProps={{
                  ...videoDetails,
                  setDurationInFrame: (value) => {
                  },
                }}
                style={{
                  borderRadius: viewMode === "grid" ? "12px 12px 0 0" : "8px",
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>

            {/* Overlay with play button */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                size="sm"
                className="bg-white/90 hover:bg-white text-black rounded-full w-12 h-12 p-0"
                onClick={() => getVideoData(videoDetails.id)}
              >
                <Play className="h-5 w-5 ml-0.5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className={`rounded-full w-8 h-8 p-0 ${
                    isVideoFavorite ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(videoDetails.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${isVideoFavorite ? "fill-current" : ""}`}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full w-8 h-8 p-0 text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2 border-b">
                      <p className="font-medium text-sm">Share this video</p>
                    </div>
                    <DropdownMenuItem onClick={() => handleShare(videoDetails, 'copy')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(videoDetails, 'native')}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Native Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShare(videoDetails, 'twitter')}>
                      <Twitter className="h-4 w-4 mr-2" />
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(videoDetails, 'facebook')}>
                      <Facebook className="h-4 w-4 mr-2" />
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(videoDetails, 'whatsapp')}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Share on WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full w-8 h-8 p-0 text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => getVideoData(videoDetails.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Play Video
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareVideo(videoDetails)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadVideo(videoDetails)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(videoDetails)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Video
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight">
                {videoDetails.name || 'Untitled Video'}
              </h3>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(createdDate, { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs p-2">
                AI Generated
              </Badge>
              {isVideoFavorite && (
                <Badge variant="destructive" className="text-xs p-2">
                  <Heart className="h-2 w-2 mr-1 fill-current" />
                  Favorite
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                onClick={() => getVideoData(videoDetails.id)}
              >
                <Play className="h-3 w-3 mr-1" />
                Play
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-sm">Share this video</p>
                  </div>
                  <DropdownMenuItem onClick={() => handleShare(videoDetails, 'copy')}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(videoDetails, 'native')}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Native Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleShare(videoDetails, 'twitter')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(videoDetails, 'facebook')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(videoDetails, 'whatsapp')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share on WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ListItem = ({ item, index }) => {
    const videoDetails = item.video;
    const isVideoFavorite = isFavorite(videoDetails.id);
    const createdDate = new Date(item.createdAt || new Date());

    return (
      <Card className="group bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <div
                className="cursor-pointer"
                onClick={() => getVideoData(videoDetails.id)}
              >
                <Thumbnail
                  ref={ref}
                  durationInFrames={30}
                  compositionWidth={120}
                  compositionHeight={160}
                  fps={30}
                  frameToDisplay={30}
                  component={RemotionVideo}
                  inputProps={{
                    ...videoDetails,
                    setDurationInFrame: (value) => {
                    },
                  }}
                  style={{
                    borderRadius: 8,
                    width: 120,
                    height: 160,
                  }}
                />
              </div>

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                <Button
                  size="sm"
                  className="bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 p-0"
                  onClick={() => getVideoData(videoDetails.id)}
                >
                  <Play className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {videoDetails.name || 'Untitled Video'}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(createdDate, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>~30 seconds</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs p-2">
                    AI Generated
                  </Badge>
                  {isVideoFavorite && (
                    <Badge variant="destructive" className="text-xs p-2">
                      <Heart className="h-2 w-2 mr-1 fill-current" />
                      Favorite
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                    onClick={() => getVideoData(videoDetails.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium text-sm">Share this video</p>
                      </div>
                      <DropdownMenuItem onClick={() => handleShare(videoDetails, 'copy')}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(videoDetails, 'native')}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Native Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleShare(videoDetails, 'twitter')}>
                        <Twitter className="h-4 w-4 mr-2" />
                        Share on Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(videoDetails, 'facebook')}>
                        <Facebook className="h-4 w-4 mr-2" />
                        Share on Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(videoDetails, 'whatsapp')}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Share on WhatsApp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full w-8 h-8 p-0 ${
                      isVideoFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                    onClick={() => toggleFavorite(videoDetails.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isVideoFavorite ? "fill-current" : ""}`}
                    />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full w-8 h-8 p-0 text-gray-400"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => downloadVideo(videoDetails)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteClick(videoDetails)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {viewMode === "grid" ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videoList.map((item, index) => (
            <VideoCard
              key={`${item?.video?.id}-${index}`}
              item={item}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {videoList.map((item, index) => (
            <ListItem key={`${item.video.id}-${index}`} item={item} index={index} />
          ))}
        </div>
      )}

      {openPlayDialog && (
        <PlayerDialog
          handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
          handleDeleteVideo={handleDeleteVideo}
          playVideo={openPlayDialog}
          isLoading={isLoading}
          videoData={videoData}
          setVideoData={setVideoData}
          setVideoList={setVideoList}
        />
      )}

      <ConfirmDeleteDialog 
        isOpen={deleteDialog.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        videoName={deleteDialog?.video?.video?.name ?? ''}
        key={Math.random()}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default VideoList;
