import React, { useRef, useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";

const VideoList = ({ videoList }) => {
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoId, setVideoId] = useState();
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
          videoId={videoId}
          isLoading={isLoading}
          videoData={videoData}
        />
      ) : null}
    </div>
  );
};

export default VideoList;
