"use client";
import { Button } from "../../components/ui/button";
import React, { useState, useMemo, useEffect } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import VideoList from "./_components/VideoList";
import FullScreenLoader from "./_components/FullScreenLoader";
import useVideoList from "./hooks/useVideoList";
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Sparkles,
  Video,
  Clock,
  Calendar,
  Users,
  ShoppingBag,
} from "lucide-react";
import { Input } from "../../@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";
import { Badge } from "../../@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import Replicate from "replicate";

const Dashboard = () => {
  const [
    { videoList, openPlayDialog, videoData, hasNext, isLoading },
    {
      handleDeleteVideo,
      handleCancelVideoPlayerCb,
      throttledFetch,
      getVideoData,
      setVideoData,
      setVideoList
    },
  ] = useVideoList();


  const replicate = new Replicate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all-videos");
  const searchParams = useSearchParams();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle shared video URL parameter
  useEffect(() => {
    const videoId = searchParams.get("video");
    if (videoId && videoList.length > 0 && !openPlayDialog) {
      // Find the video in the list and open it
      const foundVideo = videoList.find(
        ({video}) => video.id === parseInt(videoId)
      );
      if (foundVideo) {
        getVideoData(foundVideo.id);
      }
    }
  }, [searchParams, videoList, openPlayDialog, getVideoData]);



  // Separate videos by type
  const { allVideos, ugcVideos, regularVideos } = useMemo(() => {
    const ugc = videoList.filter(({ video }) => video.category === "ugc-ad");
    const regular = videoList.filter(({ video }) => video.category !== "ugc-ad");
    
    return {
      allVideos: videoList,
      ugcVideos: ugc,
      regularVideos: regular
    };
  }, [videoList]);

  // Get current tab videos
  const currentTabVideos = useMemo(() => {
    switch (activeTab) {
      case "ugc-videos":
        return ugcVideos;
      case "all-videos":
      default:
        return allVideos;
    }
  }, [activeTab, allVideos, ugcVideos]);

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = currentTabVideos;

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(({ video }) => {

        const nameMatch = video.name
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
        const idMatch = video.id?.toString().includes(debouncedSearchTerm);

        // Search through script content if it's an array
        let scriptMatch = false;
        if (Array.isArray(video.script)) {
          const scriptText = video.script
            .map((segment) => segment.contentText || "")
            .join(" ")
            .toLowerCase();
          scriptMatch = scriptText.includes(debouncedSearchTerm.toLowerCase());
        }

        return nameMatch || idMatch || scriptMatch;
      });
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(({video, isFavorite}) => {
        switch (filterBy) {
          case "recent":
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return new Date(video.createdAt) > oneWeekAgo;
          case "favorites":
            return isFavorite;
          case "shared":
            return video.isShared;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { video: aVideo } = a;
      const { video: bVideo } = b;
      switch (sortBy) {
        case "newest":
          return new Date(bVideo.createdAt) - new Date(aVideo.createdAt);
        case "oldest":
          return new Date(aVideo.createdAt) - new Date(bVideo.createdAt);
        case "name":
          return (aVideo.name || "").localeCompare(bVideo.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [currentTabVideos, debouncedSearchTerm, sortBy, filterBy]);

  // Render video content function
  const renderVideoContent = () => {
    if (filteredAndSortedVideos.length === 0 && currentTabVideos.length === 0) {
      return activeTab === "ugc-videos" ? renderUGCEmptyState() : <EmptyState />;
    }
    
    if (filteredAndSortedVideos.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No videos found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setFilterBy("all");
              setSortBy("newest");
            }}
            variant="outline"
            className="rounded-full"
          >
            Clear Filters
          </Button>
        </div>
      );
    }
    
    return (
      <VideoList
        videoList={filteredAndSortedVideos}
        originalVideoList={videoList}
        openPlayDialog={openPlayDialog}
        videoData={videoData}
        hasNext={hasNext}
        handleDeleteVideo={handleDeleteVideo}
        handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
        getVideoList={throttledFetch}
        isLoading={isLoading}
        getVideoData={getVideoData}
        viewMode={viewMode}
        setVideoData={setVideoData}
        setVideoList={setVideoList}
      />
    );
  };

  // UGC Empty state
  const renderUGCEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="h-12 w-12 text-violet-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No UGC videos yet
      </h3>
      <p className="text-gray-600 mb-4">
        Create your first UGC-style advertisement video with AI avatars
      </p>
      <Link href="/dashboard/ugc-video">
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full">
          <Users className="h-4 w-4 mr-2" />
          Create UGC Video
        </Button>
      </Link>
    </div>
  );

  if (isLoading && videoList.length === 0) {
    return <FullScreenLoader />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Videos
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and organize your AI-generated videos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/ugc-video">
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Users className="h-5 w-5 mr-2" />
              Create UGC Video
            </Button>
          </Link>
          <Link href="/dashboard/create-new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Plus className="h-5 w-5 mr-2" />
              Create New Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto lg:mx-0">
          <TabsTrigger value="all-videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            All Videos ({allVideos.length})
          </TabsTrigger>
          <TabsTrigger value="ugc-videos" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            UGC Videos ({ugcVideos.length})
          </TabsTrigger>
        </TabsList>

        {/* Stats Cards */}
        {currentTabVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentTabVideos.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activeTab === "ugc-videos" ? "UGC Videos" : "Total Videos"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredAndSortedVideos.length}
                  </p>
                  <p className="text-sm text-gray-600">Filtered Results</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      currentTabVideos.filter(({ video }) => {
                        const oneWeekAgo = new Date(
                          Date.now() - 7 * 24 * 60 * 60 * 1000
                        );
                        return new Date(video.createdAt) > oneWeekAgo;
                      }).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      currentTabVideos.filter(({video}) => {
                        const today = new Date();
                        const videoDate = new Date(video.createdAt);
                        return videoDate.toDateString() === today.toDateString();
                      }).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Today</p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Filters and Search */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos by name, content, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 rounded-xl border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter */}
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full lg:w-48 rounded-xl border-gray-200">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Videos</SelectItem>
              <SelectItem value="recent">Recent (7 days)</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-xl"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-xl"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || filterBy !== "all" || sortBy !== "newest") && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {searchTerm && (
              <Badge variant="secondary" className="rounded-full p-2">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterBy !== "all" && (
              <Badge variant="secondary" className="rounded-full p-2">
                Filter: {filterBy}
                <button
                  onClick={() => setFilterBy("all")}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {sortBy !== "newest" && (
              <Badge variant="secondary" className="rounded-full p-2">
                Sort: {sortBy}
                <button
                  onClick={() => setSortBy("newest")}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

        {/* Tab Content */}
        <TabsContent value="all-videos" className="space-y-6">
          {renderVideoContent()}
        </TabsContent>
        
        <TabsContent value="ugc-videos" className="space-y-6">
          {renderVideoContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
