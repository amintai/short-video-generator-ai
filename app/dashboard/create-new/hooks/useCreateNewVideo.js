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
import { generateSimpleVideoName } from "../../../../lib/videoUtils";

const useCreateNewVideo = () => {
  const [formData, setFormData] = useState([]);
  const [isAPILoading, setAPILoading] = useState(false);
  const [videoScript, setVideoScript] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);

  const { userId, coins } = useSelector((state) => {
    const userId = state.user.details.id;
    const coins = state.user.details.coins;
    return {
      userId,
      coins,
    };
  });

  const dispatch = useDispatch();

  const [playVideo, setPlayVideo] = useState(false);

  const [videoContent, setVideoContent] = useState();

  const notify = () =>
    toast.success("Video Generated Successfully.", {
      position: "top-right",
    });

  const errorNotify = () =>
    toast.error(
      "You don't have enough coins to generate this video, Upgrade Your plan!",
      {
        position: "top-right",
      }
    );

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
    const userData = await db
      .update(Users)
      .set({
        coins: coins - 50,
      })
      .where(eq(Users.id, userId))
      .returning(Users);

    dispatch(userDetails(userData.at(0)));
  };

  //! Save Video Data To DB
  const saveVideoData = async (videoData) => {
    setAPILoading(true);

    // Generate video name based on form data
    const videoName = generateSimpleVideoName(
      formData.topic || 'Video Topic',
      formData.duration || '30'
    );

    await db
      .insert(VideoData)
      .values({
        name: videoName,
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
    const prompt = `Generate a complete and highly detailed script in ${formData.language} language for a video that is exactly ${formData.duration} seconds long, centered around the topic: "${formData.topic}".  

Divide the script logically based on the time allocation, ensuring smooth transitions and narrative flow throughout the entire video duration.  

For **each segment**, include the following in the output:
1. **imagePrompt**: A vivid, detailed AI image generation prompt in the "${formData.imageStyle}" style. This should describe the visual scene clearly, specifying mood, composition, lighting, subjects, and any relevant background elements.
2. **contentText**: A concise, engaging, and informative narration text for that segment. The tone should be audience-appropriate (e.g., professional, casual, inspirational) and aligned with the topic.

**Constraints**:
- Total script length must be timed to fit exactly within ${formData.duration} seconds.
- Use natural segmentation (e.g., intro, development, conclusion) without explicitly labeling them.
- Do NOT use labels like "Scene 1", "Segment", etc.
- Do NOT wrap the output inside any object or property (e.g., no { "segments": [...] }).
- The output must be strictly in **valid JSON format**, containing only an **array of objects**, each with:
  - "imagePrompt": string
  - "contentText": string
- Do not include any explanation, headings, or comments outside the JSON array.

Make the result visually immersive and narratively compelling, with each image prompt complementing the corresponding narration.`;

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

        console.log("Video Script Data:", res.data.result);

        generateAudioFile(res.data.result);
      });
  };

  const handleCreateVideo = () => {
    if (coins >= 50) {
      getVideoScript();
    } else {
      errorNotify();
    }
  };

  //! Generate Audio Script
  const generateAudioFile = async (videoScriptData) => {
    console.log("Generating audio file with script data:", videoScriptData);
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
    notify();

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
