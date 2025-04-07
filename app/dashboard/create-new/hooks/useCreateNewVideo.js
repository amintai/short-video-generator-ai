import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { VideoDataContext } from "../../../_context/VideoDataContext";
import { db } from "../../../../configs/db";
import { useUser } from "@clerk/nextjs";
import { Users, VideoData } from "../../../../configs/schema";
import toast from "react-hot-toast";
import { eq } from "drizzle-orm";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../../redux/sclices/counterSlice";

const useCreateNewVideo = () => {
  const [formData, setFormData] = useState([]);
  const [isAPILoading, setAPILoading] = useState(false);
  const [videoScript, setVideoScript] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);


  const { userId,coins } = useSelector((state) => {
    const userId = state.user.details.id;
    const coins = state.user.details.coins;
    return {
      userId,
      coins
    }
  })

  const dispatch = useDispatch();

  const [playVideo, setPlayVideo] = useState(false);

  const [videoContent, setVideoContent] = useState();

  const notify = () => toast.success('Video Generated Successfully.', {
    position: 'top-right'
  })

  const errorNotify = () => toast.error("You don't have enough coins to generate this video, Upgrade Your plan!", {
    position: 'top-right'
  })


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

  const videoSuccessCb = async () => {
     const userData = await db.update(Users).set({
      coins: coins - 50
     }).where(eq(Users.id, userId)).returning(Users);

     dispatch(userDetails(userData.at(0)))
    }

  //! Save Video Data To DB
  const saveVideoData = async (videoData) => {
    setAPILoading(true);

    await db
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

    setVideoContent(videoData);
    setVideoData({});

    setPlayVideo(true);
    setAPILoading(false);
  };

  //! Generate Video Script
  const getVideoScript = async () => {
    setAPILoading(true);
    // const prompt = `Write a script to generate ${formData.duration} seconds video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each and give me result in JSON format with imagePrompt and ContetText as field, No Plain Text it should not start with scene keyword.`;
    const prompt = `Generate a detailed script for a video that is exactly ${formData.duration} seconds long, focused on the topic: "${formData.topic}".  
For each part of the video, also generate an AI-generated image prompt in the "${formData.imageStyle}" style.  
The output should be in JSON format with the following structure:  
- **imagePrompt**: A detailed image generation prompt for AI.  
- **contentText**: Well-structured, engaging, and concise narration text for the video.  

Ensure the script is engaging, informative, and visually compelling. The response must be in JSON format only, without any plain text or introductory words. Avoid starting with generic scene labels like "Scene 1"`;  

    await axios
      .post("/api/get-video-script", {
        prompt: prompt,
      })
      .then((res) => {
        setVideoData((state) => ({
          ...state,
          videoScript: res.data.result,
        }));
        setVideoScript(res.data.result);

        let key = Object.keys(res.data.result);

        generateAudioFile(res.data.result[key]);
      });
  };

  const handleCreateVideo = () => {
    if(coins >= 50) {
      getVideoScript();
    } else {
      errorNotify()
    }
  };

  //! Generate Audio Script
  const generateAudioFile = async (videoScriptData) => {
    let script = "";
    const id = uuid4();

    videoScriptData.forEach((item) => {
      script = script + item.contentText + " ";
    });

    const res = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
      timeout: 30000,
    });

    setVideoData((state) => ({
      ...state,
      audioFileUrl: res.data.url,
    }));
    setAudioFileUrl(res.data.url);
    generateAudioCaption(res.data.url, videoScriptData);
  };

  //! Generate Audio Captions
  const generateAudioCaption = async (fileUrl, videoScriptData) => {
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
    notify()

    await videoSuccessCb();
    
    setAPILoading(false);
  };

  const handleCancelVideoPlayerCb = () => {
    setPlayVideo(false);
  };

  return [
    {
      formData,
      isAPILoading,
      videoScript,
      audioFileUrl,
      captions,
      playVideo,
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
  ];
};

export default useCreateNewVideo;
