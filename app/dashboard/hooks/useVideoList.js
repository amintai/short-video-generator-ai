import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState, useRef } from "react";
import { db } from "../../../configs/db";
import { VideoData, Favorites } from "../../../configs/schema";
import { eq, sql, leftJoin } from "drizzle-orm";
import { throttle } from "lodash";
import { toast } from "react-hot-toast";
import axios from "axios";

const useVideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 6,
    hasNext: true,
    isInitialized: false,
  });

  const isFirstLoad = useRef(true);
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
      page: 1,
      hasNext: true,
      isInitialized: false,
    }));
    setVideoList([]);

    try {
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
        .where(eq(VideoData.createdBy, user.primaryEmailAddress.emailAddress))
        .limit(pagination.perPage)
        .offset(0);


      setVideoList(result);
      setPagination((prev) => ({
        ...prev,
        page: 2, // Next page to load
        hasNext: result.length === pagination.perPage,
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

  const loadMoreVideos = async () => {
    if (
      !user?.primaryEmailAddress?.emailAddress ||
      !pagination.hasNext ||
      isLoading
    ) {
      return;
    }

    setLoading(true);

    try {
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
        .where(eq(VideoData.createdBy, user.primaryEmailAddress.emailAddress))
        .limit(pagination.perPage)
        .offset((pagination.page - 1) * pagination.perPage);


      if (result.length === 0) {
        setPagination((prev) => ({ ...prev, hasNext: false }));
      } else {
        // Filter out duplicates
        const newVideos = result.filter(
          (newVideo) =>
            !videoList.some(
              (existingVideo) => existingVideo.video.id === newVideo?.id
            )
        );

        setVideoList((prev) => [...prev, ...newVideos]);
        setPagination((prev) => ({
          ...prev,
          page: prev.page + 1,
          hasNext: result.length === pagination.perPage,
        }));
      }
    } catch (error) {
      console.error("Error loading more videos:", error);
      toast.error("Failed to load more videos");
    } finally {
      setLoading(false);
    }
  };

  const throttledFetch = useCallback(
    throttle(() => {
      if (pagination.hasNext && pagination.isInitialized) {
        loadMoreVideos();
      }
    }, 1000),
    [pagination.hasNext, pagination.isInitialized, pagination.page, user]
  );

  const handleDeleteVideo = async (videoToDelete) => {
    if (!videoToDelete?.id) return;

    try {
      await db.delete(VideoData).where(eq(VideoData.id, videoToDelete.id));

      // Remove from local state
      setVideoList((prev) =>
        prev.filter((video) => video.id !== videoToDelete.id)
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
      hasNext: pagination.hasNext,
    },
    {
      handleDeleteVideo,
      handleCancelVideoPlayerCb,
      throttledFetch,
      getVideoData,
      refreshVideoList,
    },
  ];
};

export default useVideoList;
