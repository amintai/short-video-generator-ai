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
import { userDetails } from "../../../redux/sclices/userDetailsSlice";
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

    try {
      const videoName = generateSimpleVideoName(
        formData.topic || "Video Topic",
        formData.duration || "30"
      );

      // Insert video and get the inserted ID
      const [inserted] = await db
        .insert(VideoData)
        .values({
          name: videoName,
          script: videoData?.videoScript,
          audioFileUrl: videoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList,
          createdBy: user?.primaryEmailAddress.emailAddress,
          
          // Enhanced video generation options
          topic: formData.topic,
          imageStyle: formData.imageStyle,
          language: formData.language || "en",
          voiceStyle: formData.voiceStyle,
          voiceName: formData.voiceName,
          transitionStyle: formData.transitionStyle,
          duration: formData.duration || 30,
          contentType: formData.contentType,
          mood: formData.mood,
          targetAudience: formData.targetAudience,
          backgroundColor: formData.backgroundColor,
          textStyle: formData.textStyle,
          musicUrl: formData.musicUrl,
          musicVolume: formData.musicVolume || 0.5,
          visualEffects: formData.visualEffects || [],
          generationSettings: formData // Store all form settings for regeneration
        })
        .returning({
          id: VideoData.id,
        });

      // Fetch full record using returned ID
      const [fullVideo] = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, inserted.id));

      // Return formatted object with `isFavorite`
      const finalVideo = {
        video: fullVideo,
        isFavorite: false,
      };

      // Update your state with the same structure used in video list
      setVideoContent(finalVideo);
      setVideoData({});
      setPlayVideo(true);
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video");
    } finally {
      setAPILoading(false);
    }
  };

  //! Generate Video Script
  const getVideoScript = async () => {
    setAPILoading(true);
    const prompt = `Generate a highly detailed and compelling script in the "${formData.language}" language for a video that is exactly ${formData.duration} seconds long, centered around the topic: "${formData.topic}". 

Break the content into natural narrative segments based on time—such as opening hook, body, and conclusion—ensuring a smooth and immersive storytelling experience from start to finish.

For **each time-segment**, provide the following:
1. **imagePrompt**: A vivid, detailed image description in "${formData.imageStyle}" style, optimized for AI generation. It should specify atmosphere, environment, characters, objects, lighting, and mood.
2. **contentText**: Engaging, human-like narration that resonates with the viewer. Make it realistic, emotionally engaging, and relevant to the viewer’s everyday life or curiosity. Avoid generic facts—be specific, add real-world context, and use storytelling techniques.

### Additional Rules:
- **DO NOT** include any timestamps (e.g., “(0–5 seconds)”) or labels inside the "contentText".
- The total content must **perfectly fit** within ${formData.duration} seconds.
- Use a tone appropriate for the topic: inspiring, educational, thrilling, emotional, or funny.
- Do NOT include any labels (like “Intro”, “Scene 1”, etc.)
- Do NOT wrap the output in an object—return **only a JSON array** of:
  - "imagePrompt": string
  - "contentText": string
- No additional explanation or commentary—just pure JSON.

Ensure every image prompt clearly reflects and enriches its corresponding narration text. Each segment should naturally lead into the next.`;


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
    let script = "";
    const id = uuid4();

    videoScriptData.forEach((item) => {
      script = script + item.contentText + " ";
    });

    const res = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
      language: formData.language || "en",
      contentType: formData.contentType,
      voiceName: formData.voiceName,
      voiceStyle: formData.voiceStyle,
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
        //! OLD IMAGE GENERATION LOGIC
        const res = await axios.post("/api/generate-image", {
          prompt: element?.imagePrompt,
        });
        // const res = await axios.post("/api/stability", {
        //   prompt: element?.imagePrompt,
        // });
        //!OLD
        images.push(res.data.result);
        // const downloadUrl = res.data.image;
        // images.push(downloadUrl);
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
