"use client";
import React from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import CustomLoading from "./_components/CustomLoading";
import useCreateNewVideo from "./hooks/useCreateNewVideo";
import PlayerDialog from "../_components/PlayerDialog";

const CreateNew = () => {
  const [
    {
      formData,
      isAPILoading,
      videoScript,
      audioFileUrl,
      captions,
      playVideo,
      videoId,
      videoData,
      videoContent,
    },
    {
      onHandleInputChange,
      getVideoScript,
      handleCreateVideo,
      generateAudioFile,
      generateAudioCaption,
      handleCancelVideoPlayerCb,
    },
  ] = useCreateNewVideo();

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>

      <div className="mt-10 shadow-md p-10">
        <SelectTopic onHandleInputChange={onHandleInputChange} />
        <SelectStyle onHandleInputChange={onHandleInputChange} />
        <SelectDuration onHandleInputChange={onHandleInputChange} />

        <Button className="mt-10 w-full" onClick={handleCreateVideo}>
          Create Short Video
        </Button>
      </div>

      <CustomLoading loading={isAPILoading} />

      {playVideo ? (
        <PlayerDialog
          handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
          playVideo={playVideo}
          videoId={videoId}
          isLoading={isAPILoading}
          videoData={videoContent}
        />
      ) : null}
    </div>
  );
};

export default CreateNew;
