import { useState } from "react";
import { db } from "../../../../configs/db";
import { VideoData } from "../../../../configs/schema";
import { eq } from "drizzle-orm";

const useGetVideo = () => {
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getVideoData = async (id) => {
    setIsLoading(true);
    await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, id))
      .then((res) => {
        if (res.length) {
          setVideoData(res[0]);
          setIsLoading(false);
          setOpenPlayDialog(true);
        }
      });
  };

  const handleCancelVideoPlayerCb = () => {
    if (!openPlayDialog) {
      getVideoData();
    } else {
      setOpenPlayDialog(false);
    }
  };

  return [
    { openPlayDialog, videoData, isLoading },
    { getVideoData, handleCancelVideoPlayerCb },
  ];
};

export default useGetVideo;
