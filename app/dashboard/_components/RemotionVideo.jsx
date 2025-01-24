import React from "react";
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

  const getDurationFrames = () => {
    let endTimeStamp = captions?.[captions.length - 1]?.end;
    setDurationInFrame((endTimeStamp / 1000) * fps);

    return (endTimeStamp / 1000) * fps;
  };

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
        const startTime = (index * getDurationFrames()) / imageList?.length;
        const duration = getDurationFrames();

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
              durationInFrames={getDurationFrames()}
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
