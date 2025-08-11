import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState, useRef } from "react";
import { db } from "../../../configs/db";
import { VideoData, Favorites } from "../../../configs/schema";
import { eq, sql, leftJoin } from "drizzle-orm";
import { throttle } from "lodash";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";

const useVideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    isInitialized: false,
  });

  const isFirstLoad = useRef(true);

  const dispatch = useDispatch();
  const { user } = useUser();


  // Initialize data on first load
  useEffect(() => {
    if (user && isFirstLoad.current) {
      isFirstLoad.current = false;
      initializeVideoList();
    }
  }, [user]);


  const notify = () =>
    toast.success("Video Deleted Successfully.", {
      position: "top-right",
    });

  const initializeVideoList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    setLoading(true);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      isInitialized: false,
    }));
    setVideoList([]);

    try {
      // Get all videos
      const result = await db
        .select({
          video: VideoData,
          isFavorite:
            sql`CASE WHEN ${Favorites.id} IS NOT NULL THEN true ELSE false END`.as(
              "isFavorite"
            ),
        })
        .from(VideoData)
        .leftJoin(
          Favorites,
          sql`${VideoData.id} = ${Favorites.videoId} AND ${Favorites.userEmail} = ${user.primaryEmailAddress.emailAddress}`
        )
        .where(eq(VideoData.createdBy, user.primaryEmailAddress.emailAddress));

      setVideoList(result);

      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
        isInitialized: true,
      }));
    } catch (error) {
      console.error("Error loading initial videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };


  const getVideoData = async (id) => {
    const selectedVideoData = videoList.find((item) => item.video.id === id);
    if (selectedVideoData) {
      setVideoData(selectedVideoData);
      setOpenPlayDialog(true);
    }
  };

  const handleCancelVideoPlayerCb = () => {
    setOpenPlayDialog(false);
    setVideoData(null);
  };

  const setCurrentPage = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };


  const handleDeleteVideo = async (videoToDelete) => {
    if (!videoToDelete?.id) return;

    try {
      await db.delete(VideoData).where(eq(VideoData.id, videoToDelete.id));

      // Remove from local state - handle both old and new data structures
      setVideoList((prev) =>
        prev.filter((item) => {
          const videoId = item.video.id
          return videoId !== videoToDelete.id;
        })
      );
      setOpenPlayDialog(false);
      setVideoData(null);

      notify();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const refreshVideoList = () => {
    isFirstLoad.current = true;
    if (user) {
      initializeVideoList();
    }
  };

  return [
    {
      videoList,
      isLoading,
      openPlayDialog,
      videoData,
      pagination,
    },
    {
      handleDeleteVideo,
      handleCancelVideoPlayerCb,
      setCurrentPage,
      getVideoData,
      refreshVideoList,
      setVideoData,
      setVideoList
    },
  ];
};

export default useVideoList;
