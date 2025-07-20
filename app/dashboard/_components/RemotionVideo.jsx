import React, { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RemotionVideo = ({
  imageList,
  audioFileUrl,
  captions,
  setDurationInFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Calculate duration frames without side effects
  const durationFrames = useMemo(() => {
    if (!captions || captions.length === 0) return 90; // Default 3 seconds at 30fps
    const endTimeStamp = captions[captions.length - 1]?.end || 3000;
    return (endTimeStamp / 1000) * fps;
  }, [captions, fps]);

  // Use useEffect to update parent component state
  useEffect(() => {
    if (setDurationInFrame && typeof setDurationInFrame === 'function') {
      setDurationInFrame(durationFrames);
    }
  }, [durationFrames, setDurationInFrame]);

  const getCurrentCaptions = () => {
    const currentTime = (frame / 30) * 1000; //Convert frame number to milisecond
    const currentCaption = captions.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption?.text : "";
  };


  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
      }}
    >
      {imageList?.map((item, index) => {
        const startTime = (index * durationFrames) / imageList?.length;
        const duration = durationFrames;

        const scale = (index) => {
          return interpolate(
            frame,
            [startTime, startTime + duration / 2, startTime + duration],
            index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ); // Zoom In and Zoom Out
        };
        return (
          <div key={index}>
            <Sequence
              key={Math.random()}
              from={startTime}
              durationInFrames={durationFrames}
            >
              <AbsoluteFill
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Img
                  src={item}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale(index)})`,
                  }}
                />
                <AbsoluteFill
                  style={{
                    color: "white",
                    justifyContent: "center",
                    top: undefined,
                    bottom: 50,
                    height: 150,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <h2 className="text-2xl">{getCurrentCaptions()}</h2>
                </AbsoluteFill>
              </AbsoluteFill>
            </Sequence>
          </div>
        );
      })}

      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  );
};

export default RemotionVideo;
