import React, { useRef } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import useGetVideo from "../create-new/hooks/useGetVideo";

const VideoList = ({ videoList, fetchVideoListCb = () => {} }) => {
  const [
    { openPlayDialog, videoData, isLoading },
    { getVideoData, handleCancelVideoPlayerCb,handleDeleteVideo },
  ] = useGetVideo({
    videoList,
    fetchVideoListCb
  });

  const ref = useRef();
  return (
    <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3  place-items-center">
      {videoList.map((item, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              getVideoData(item.id);
            }}
          >
            <Thumbnail
              ref={ref}
              durationInFrames={30}
              compositionWidth={250}
              compositionHeight={350}
              fps={30}
              frameToDisplay={30}
              component={RemotionVideo}
              inputProps={{
                ...item,
                setDurationInFrame: (value) => {}
              }}
              style={{
                borderRadius: 15,
              }}
            />
          </div>
        );
      })}
      {openPlayDialog ? (
        <PlayerDialog
          handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
          handleDeleteVideo={handleDeleteVideo}
          playVideo={openPlayDialog}
          isLoading={isLoading}
          videoData={videoData}
        />
      ) : null}
    </div>
  );
};

export default VideoList;
