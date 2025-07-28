import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  Download,
  Share2,
  Heart,
  MoreVertical,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Copy,
  Facebook,
  Twitter,
  Link,
  MessageCircle,
  Calendar,
  Clock,
  Sparkles,
  Edit3,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../@/components/ui/dropdown-menu";
import { Badge } from "../../../@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Separator } from "../../../@/components/ui/separator";
import { Input } from "../../../@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { sanitizeVideoName } from "../../../lib/videoUtils";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";

const PlayerDialog = ({
  playVideo,
  handleCancelVideoPlayerCb,
  isLoading,
  videoData,
  handleDeleteVideo = () => {},
}) => {

  const [durationInFrame, setDurationInFrame] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const playerRef = useRef(null);
  const router = useRouter();

  // Initialize editedName when videoData changes
  useEffect(() => {
    if (videoData?.video?.name) {
      setEditedName(videoData.name);
    } else {
      setEditedName("Untitled Video");
    }
  }, [videoData?.video?.name]);

  const handleCancelCb = () => {
    if (location.pathname !== "/dashboard") {
      router.replace("/dashboard");
    }
    handleCancelVideoPlayerCb();
  };

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Simulate export process - replace with actual export logic
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // For now, we'll create a simple download link
      // In a real implementation, you'd render the video server-side and provide a download URL
      const link = document.createElement("a");
      link.href = "#"; // Replace with actual video URL
      link.download = `video-${videoData.video.id || "generated"}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Video exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [videoData.video]);

  const handleShare = async (platform) => {
    const videoUrl = `${window.location.origin}/public/video?video=${videoData.video.id}`;
    const title = "Check out this amazing AI-generated video!";
    const scriptText =
      Array.isArray(videoData.video.script) && videoData.video.script.length > 0
        ? videoData.video.script
            .map((segment) => segment.contentText)
            .join(" ")
            .substring(0, 100)
        : "AI-generated video";
    const text = `Created with VideoAI: ${scriptText}...`;

    try {
      switch (platform) {
        case "native":
          if (navigator.share) {
            await navigator.share({ title, text, url: videoUrl });
          } else {
            throw new Error("Native sharing not supported");
          }
          break;
        case "copy":
          await navigator.clipboard.writeText(videoUrl);
          toast.success("Link copied to clipboard!");
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              text
            )}&url=${encodeURIComponent(videoUrl)}`
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              videoUrl
            )}`
          );
          break;
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${videoUrl}`)}`
          );
          break;
        default:
          break;
      }
      setShowShareMenu(false);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleNameUpdate = async () => {
    if (!editedName.trim() || editedName === videoData?.video?.name) {
      setIsEditingName(false);
      setEditedName(videoData?.video?.name || "Untitled Video");
      return;
    }

    setIsUpdatingName(true);
    try {
      const sanitizedName = sanitizeVideoName(editedName);

      // Import database functions dynamically

      await db
        .update(VideoData)
        .set({ name: sanitizedName })
        .where(eq(VideoData.id, videoData.video.id));

      // Update local state
      videoData.video.name = sanitizedName;
      setEditedName(sanitizedName);
      setIsEditingName(false);

      toast.success("Video name updated successfully!");
    } catch (error) {
      console.error("Error updating video name:", error);
      toast.error("Failed to update video name");
      setEditedName(videoData?.video?.name || "Untitled Video");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(videoData?.video?.name || "Untitled Video");
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(videoData?.video?.name || "Untitled Video");
  };

  if (isLoading) {
    return (
      <Dialog open={playVideo}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">Loading video...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const createdDate = videoData?.video?.createdAt
    ? new Date(videoData.video.createdAt)
    : new Date();

  return (
    <Dialog open={playVideo} onOpenChange={() => handleCancelCb()}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-scroll bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Generated Video
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Created {formatDistanceToNow(createdDate, { addSuffix: true })}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full ${
                isFavorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>

            <DropdownMenu open={showShareMenu} onOpenChange={setShowShareMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-gray-400 hover:text-blue-600"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 ">
                <div className="px-3 py-2 border-b">
                  <p className="font-medium text-sm">Share this video</p>
                  <p className="text-xs text-gray-500">
                    Choose how you want to share
                  </p>
                </div>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleShare("copy")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleShare("native")}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Native Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleShare("whatsapp")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share on WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-gray-400 hover:text-gray-600"
              onClick={handleCancelCb}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Video Player */}
          <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="relative">
              <Player
                ref={playerRef}
                component={RemotionVideo}
                durationInFrames={Number(durationInFrame.toFixed(0))}
                compositionWidth={350}
                compositionHeight={500}
                fps={30}
                inputProps={{
                  ...videoData.video,
                  setDurationInFrame: (frameValue) =>
                    setDurationInFrame(frameValue),
                }}
                controls
                doubleClickToFullscreen
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                className="shadow-2xl"
              />
            </div>
          </div>

          {/* Sidebar with video info and actions */}
          <div className="w-full lg:w-80 bg-white/60 backdrop-blur-sm border-l border-gray-100">
            <div className="p-6 space-y-6">
              {/* Video Name */}
              <Card className="border-0 shadow-sm bg-white/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Video Name</h3>
                    {!isEditingName && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditName}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isEditingName ? (
                    <div className="flex gap-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="flex-1"
                        placeholder="Enter video name..."
                        maxLength={255}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleNameUpdate();
                          } else if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleNameUpdate}
                        disabled={isUpdatingName}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isUpdatingName ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdatingName}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {videoData?.video?.name || "Untitled Video"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Video Details */}
              <Card className="border-0 shadow-sm bg-white/50">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Video Details</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>
                        Duration: ~{Math.round(durationInFrame / 30)}s
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    <Badge variant="secondary" className="text-xs p-2">
                      AI Generated
                    </Badge>
                    <Badge variant="outline" className="text-xs p-2">
                      HD Quality
                    </Badge>
                    {isFavorite && (
                      <Badge variant="destructive" className="text-xs p-2">
                        <Heart className="h-2 w-2 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Script Content */}
              {videoData?.video?.script &&
                Array.isArray(videoData.video.script) &&
                videoData.video.script.length > 0 && (
                  <Card className="border-0 shadow-sm bg-white/50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Script Content
                      </h3>
                      <div className="text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto space-y-2">
                        {videoData.video.script.map((segment, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-blue-200 pl-3 py-1"
                          >
                            <p className="text-gray-800 font-medium">
                              {segment.contentText || "No content available"}
                            </p>
                            {segment.imagePrompt && (
                              <p className="text-xs text-gray-500 mt-1 italic">
                                Image: {segment.imagePrompt.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Video
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-gray-200 hover:bg-gray-50"
                    onClick={() => setShowShareMenu(true)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-full border-gray-200 hover:bg-gray-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={toggleFavorite}>
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            isFavorite ? "fill-current text-red-500" : ""
                          }`}
                        />
                        {isFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Video
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          handleDeleteVideo(videoData);
                          handleCancelCb();
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Delete Video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button
                  variant="ghost"
                  className="w-full rounded-full text-gray-600 hover:text-gray-800"
                  onClick={handleCancelCb}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
