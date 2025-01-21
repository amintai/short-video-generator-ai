import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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
    let endTimeStamp = captions[captions.length - 1]?.end;
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
        return (
          <>
            <Sequence
              key={Math.random()}
              from={(index * getDurationFrames()) / imageList.length}
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
          </>
        );
      })}

      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  );
};

export default RemotionVideo;
