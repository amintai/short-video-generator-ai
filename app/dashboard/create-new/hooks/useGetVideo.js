import { useState } from "react";

const useGetVideo = ({ videoList }) => {
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

  return [
    { openPlayDialog, videoData, isLoading },
    { getVideoData, handleCancelVideoPlayerCb },
  ];
};

export default useGetVideo;
