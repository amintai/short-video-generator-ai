import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { VideoDataContext } from "../../../_context/VideoDataContext";
import { db } from "../../../../configs/db";
import { useUser } from "@clerk/nextjs";
import { VideoData } from "../../../../configs/schema";

const useCreateNewVideo = () => {
  const [formData, setFormData] = useState([]);
  const [isAPILoading, setAPILoading] = useState(false);
  const [videoScript, setVideoScript] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);

  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(1);

  const { user } = useUser();

  const { videoData, setVideoData } = useContext(VideoDataContext);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((state) => ({
      ...state,
      [fieldName]: fieldValue,
    }));
  };

  useEffect(() => {
    if (Object.keys(videoData).length === 4) {
      saveVideoData(videoData);
    }
  }, [videoData]);

  //! Save Video Data To DB
  const saveVideoData = async (videoData) => {
    setAPILoading(true);

    const result = await db
      .insert(VideoData)
      .values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress.emailAddress,
      })
      .returning({
        id: VideoData?.id,
      });

    setVideoId(result[0].id);
    setPlayVideo(true);
    setAPILoading(false);
  };

  //! Generate Video Script
  const getVideoScript = async () => {
    setAPILoading(true);
    const propmt = `Write a script to generate ${formData.duration} seconds video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each and give me result in JSON format with imagePrompt and ContetText as field, No Plain Text it should not start with scene keyword.`;
    await axios
      .post("/api/get-video-script", {
        propmt: propmt,
      })
      .then((res) => {
        setVideoData((state) => ({
          ...state,
          videoScript: res.data.result,
        }));
        setVideoScript(res.data.result);
        generateAudioFile(res.data.result.scenes);
      });
    // setAPILoading(false);
  };

  const handleCreateVideo = () => {
    getVideoScript();
    // generateAudioFile(scriptData);
    // generateAudioCaption(FILE_URL);
    // generateImage();
  };

  //! Generate Audio Script
  const generateAudioFile = async (videoScriptData) => {
    let script = "";
    const id = uuid4();

    // setAPILoading(true);

    videoScriptData.forEach((item) => {
      script = script + item.contentText + " ";
    });

    const res = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
    });

    setVideoData((state) => ({
      ...state,
      audioFileUrl: res.data.url,
    }));
    setAudioFileUrl(res.data.url);
    generateAudioCaption(res.data.url, videoScriptData);

    // setAPILoading(false);
  };

  //! Generate Audio Captions
  const generateAudioCaption = async (fileUrl, videoScriptData) => {
    // setAPILoading(true);

    await axios
      .post("/api/generate-caption", {
        audioFileUrl: fileUrl,
      })
      .then((res) => {
        setVideoData((state) => ({
          ...state,
          captions: res.data.result,
        }));
        setCaptions(res.data.result);
        res.data.result && generateImage(videoScriptData);
      })
      .catch((err) => {
        setAPILoading(false);
        console.log("Error:", err);
      });
  };

  //! Generate Images
  const generateImage = async (scriptData) => {
    let images = [];

    for (const element of scriptData) {
      try {
        const res = await axios.post("/api/generate-image", {
          prompt: element?.imagePrompt,
        });
        images.push(res.data.result);
      } catch (e) {
        console.log("Error:", e);
      }
    }
    setVideoData((state) => ({
      ...state,
      imageList: images,
    }));
    setImageList(images);
    setAPILoading(false);
  };

  return [
    {
      formData,
      isAPILoading,
      videoScript,
      audioFileUrl,
      captions,
      playVideo,
      videoId,
    },
    {
      onHandleInputChange,
      getVideoScript,
      handleCreateVideo,
      generateAudioFile,
      generateAudioCaption,
    },
  ];
};

export default useCreateNewVideo;
