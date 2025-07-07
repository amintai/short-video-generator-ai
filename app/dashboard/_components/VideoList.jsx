import React, { useRef, useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import InfiniteScroll from "react-infinite-scroller";
import {
  Play,
  Heart,
  Share2,
  MoreVertical,
  Download,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../@/components/ui/dropdown-menu";
import { Badge } from "../../../@/components/ui/badge";
import { Card, CardContent } from "../../../@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const VideoList = ({
  videoList,
  originalVideoList,
  openPlayDialog,
  videoData,
  handleDeleteVideo,
  handleCancelVideoPlayerCb,
  getVideoList,
  hasNext,
  getVideoData,
  isLoading,
  viewMode = "grid",
}) => {
  const ref = useRef();
  const [favorites, setFavorites] = useState(new Set());
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (!loadingMore && hasNext) {
      setLoadingMore(true);
      await getVideoList();
      setLoadingMore(false);
    }
  };

  const toggleFavorite = (videoId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(videoId)) {
      newFavorites.delete(videoId);
    } else {
      newFavorites.add(videoId);
    }
    setFavorites(newFavorites);
  };

  const shareVideo = async (video) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this AI-generated video!",
          text: `Created with VideoAI: ${video.name || 'AI-generated video'}...`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const VideoCard = ({ item, index }) => {
    const isFavorite = favorites.has(item.id);
    const createdDate = new Date(item.createdAt || new Date());

    return (
      <Card className="group bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
        <CardContent className="p-0">
          {/* Video Thumbnail */}
          <div className="relative overflow-hidden">
            <div
              className="cursor-pointer"
              onClick={() => getVideoData(item.id)}
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
                  ...item,
                  setDurationInFrame: (value) => {
                    console.log("Duration in frame set to:", value);
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
                onClick={() => getVideoData(item.id)}
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
                    isFavorite ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full w-8 h-8 p-0 text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    shareVideo(item);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>

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
                    <DropdownMenuItem onClick={() => getVideoData(item.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Play Video
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareVideo(item)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
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
                {item.name || 'Untitled Video'}
              </h3>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  {/* {formatDistanceToNow(createdDate, { addSuffix: true })} */}
                </span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                AI Generated
              </Badge>
              {isFavorite && (
                <Badge variant="destructive" className="text-xs">
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
                onClick={() => getVideoData(item.id)}
              >
                <Play className="h-3 w-3 mr-1" />
                Play
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => shareVideo(item)}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ListItem = ({ item, index }) => {
    const isFavorite = favorites.has(item.id);
    const createdDate = new Date(item.createdAt || new Date());

    return (
      <Card className="group bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <div
                className="cursor-pointer"
                onClick={() => getVideoData(item.id)}
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
                    ...item,
                    setDurationInFrame: (value) => {
                      console.log("Duration in frame set to:", value);
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
                  onClick={() => getVideoData(item.id)}
                >
                  <Play className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {item.name || 'Untitled Video'}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {/* {formatDistanceToNow(createdDate, { addSuffix: true })} */}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>~30 seconds</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    AI Generated
                  </Badge>
                  {isFavorite && (
                    <Badge variant="destructive" className="text-xs">
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
                    onClick={() => getVideoData(item.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => shareVideo(item)}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full w-8 h-8 p-0 ${
                      isFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
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
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMore}
        hasMore={hasNext && !loadingMore}
        loader={
          <div className="flex justify-center items-center py-8" key="loader">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading more videos...</span>
          </div>
        }
        threshold={250}
      >
        {viewMode === "grid" ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videoList.map((item, index) => (
              <VideoCard
                key={`${item.id}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {videoList.map((item, index) => (
              <ListItem key={`${item.id}-${index}`} item={item} index={index} />
            ))}
          </div>
        )}
      </InfiniteScroll>

      {openPlayDialog && (
        <PlayerDialog
          handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
          handleDeleteVideo={handleDeleteVideo}
          playVideo={openPlayDialog}
          isLoading={isLoading}
          videoData={videoData}
        />
      )}
    </>
  );
};

export default VideoList;
