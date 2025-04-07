import { useState } from "react";
import { db } from "../../../../configs/db";
import { VideoData } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import toast from "react-hot-toast";

const useGetVideo = ({ videoList }) => {
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

    const handleDeleteVideo = async (videoData) => {
      await db.delete(VideoData).where(eq(VideoData.id, videoData.id)).returning().then((res) => {
        setOpenPlayDialog(false);
        setVideoData()
        fetchVideoListCb()
        notify()
      })
    }

  return [
    { openPlayDialog, videoData, isLoading },
    { getVideoData, handleCancelVideoPlayerCb, handleDeleteVideo },
  ];
};

export default useGetVideo;
