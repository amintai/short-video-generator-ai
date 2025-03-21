import { useState } from "react";
import { db } from "../../../../configs/db";
import { VideoData } from "../../../../configs/schema";
import { eq } from "drizzle-orm";

const useGetVideo = ({ videoList,fetchVideoListCb }) => {
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDeleteVideo = async (videoData) => {
    await db.delete(VideoData).where(eq(VideoData.id, videoData.id)).returning().then((res) => {
      console.log("res",res)
      setOpenPlayDialog(false);
      setVideoData()
      fetchVideoListCb()
    })
  } 

  return [
    { openPlayDialog, videoData, isLoading },
    { getVideoData, handleCancelVideoPlayerCb,handleDeleteVideo },
  ];
};

export default useGetVideo;
