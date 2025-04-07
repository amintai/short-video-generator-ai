import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { throttle } from "lodash";

const useVideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [{ page, perPage,hasNext }, setPage] = useState({
    page: 1,
    perPage: 6,
    hasNext: true
  })

  const { user } = useUser();

  //! Need to make new API call when page change, delete record
  useEffect(() => {
    if (user) {
      getVideoList();
    }
  }, [user]);


  const notify = () => toast.success('Video Deleted Successfully.', {
    position: 'top-right'
  })


  const getVideoData = async (id) => {
    const selectedVideoData = videoList.filter((item) => item.id === id);
    setVideoData(selectedVideoData[0]);
    setOpenPlayDialog(true);
  };

  const handleCancelVideoPlayerCb = () => {
    if (!openPlayDialog) {
      getVideoData();
    } else {
      setOpenPlayDialog(false);
    }
  };

  const throttledFetch = useCallback(
    throttle(() => {
      if (!isLoading && hasNext) {
        getVideoList();
      }
    }, 1000), // 1000ms throttle delay
    [isLoading, page]
  );

  const getVideoList = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createdBy, user?.primaryEmailAddress?.emailAddress))
      .limit(perPage)
      .offset((page - 1) * perPage);


      if(!result.length) {
        setPage((state) => ({
          ...state,
          hasNext: false
        }));
      } else {
        setPage((state) => ({
          ...state,
          page: page + 1
        }));
      }

      setLoading(false);
      setVideoList([...videoList, ...result]);
  };

  const handleDeleteVideo = async (videoData) => {
    await db.delete(VideoData).where(eq(VideoData.id, videoData.id)).returning().then((res) => {
      setOpenPlayDialog(false);
      setVideoData()
      getVideoList()
      notify()
    })
  }


  return [
    { 
      videoList,
      isLoading,
      openPlayDialog,
      videoData,
      hasNext
    }, 
    { 
      handleDeleteVideo,
      handleCancelVideoPlayerCb,
      throttledFetch,
      getVideoData
    }
  ];
};

export default useVideoList;
