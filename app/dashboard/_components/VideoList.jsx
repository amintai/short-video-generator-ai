import React, { useRef } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import useGetVideo from "../create-new/hooks/useGetVideo";

const VideoList = ({ videoList }) => {
  const [
    { openPlayDialog, videoData, isLoading },
    { getVideoData, handleCancelVideoPlayerCb },
  ] = useGetVideo({
    videoList,
  });

  const ref = useRef();
  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-y-4 lg:gap-6 gap-8">
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
                setDurationInFrame: (value) => console.log(value),
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
          playVideo={openPlayDialog}
          isLoading={isLoading}
          videoData={videoData}
        />
      ) : null}
    </div>
  );
};

export default VideoList;
