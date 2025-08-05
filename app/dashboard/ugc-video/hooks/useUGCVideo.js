"use client";
import { useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import axios from "axios";
import { VideoDataContext } from "../../../_context/VideoDataContext";
import { db } from "../../../../configs/db";
import { useUser } from "@clerk/nextjs";
import { Users, VideoData, UGCVideoMetadata } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../../redux/sclices/userDetailsSlice";
import { generateSimpleVideoName } from "../../../../lib/videoUtils";

export const useUGCVideo = () => {
  const [formData, setFormData] = useState({
    avatar: null,
    productName: "",
    productDescription: "",
    productImage: null,
    tone: "excited",
    language: "en",
    voiceStyle: "friendly"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoScript, setVideoScript] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoContent, setVideoContent] = useState();

  const { userId, coins } = useSelector((state) => {
    const userId = state.user.details.id;
    const coins = state.user.details.coins;
    return { userId, coins };
  });

  const dispatch = useDispatch();
  const { user } = useUser();
  const { videoData, setVideoData } = useContext(VideoDataContext);

  const setSelectedAvatar = (avatar) => {
    setFormData(prev => ({ ...prev, avatar }));
  };

  const setProductData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const setTone = (tone) => {
    setFormData(prev => ({ ...prev, tone }));
  };

  const setLanguage = (language) => {
    setFormData(prev => ({ ...prev, language }));
  };

  // Use effect to handle video data saving - matches existing pattern
  useEffect(() => {
    if (Object.keys(videoData).length === 4) {
      saveVideoData(videoData);
    }
  }, [videoData]);

  const notify = () =>
    toast.success("UGC Video Generated Successfully.", {
      position: "top-right",
    });

  const errorNotify = () =>
    toast.error(
      "You don't have enough coins to generate this video, Upgrade Your plan!",
      {
        position: "top-right",
      }
    );

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

  // Save Video Data To DB with UGC metadata
  const saveVideoData = async (videoData) => {
    setIsLoading(true);

    try {
      const videoName = generateSimpleVideoName(
        `UGC Ad - ${formData.productName}` || "UGC Video",
        "30"
      );

      // Generate D-ID avatar video
      const didVideoResponse = await generateDIDVideo(videoData);
      
      // Insert video and get the inserted ID
      const [inserted] = await db
        .insert(VideoData)
        .values({
          name: videoName,
          script: videoData?.videoScript,
          audioFileUrl: videoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList,
          videoUrl: didVideoResponse?.videoUrl,
          thumbnailUrl: didVideoResponse?.videoUrl, // Use video as thumbnail for now
          createdBy: user?.primaryEmailAddress.emailAddress,
          category: "ugc-ad",
          tags: ["ugc", "advertisement", "ai-avatar", formData.productName?.toLowerCase()].filter(Boolean),
          status: "completed",
          duration: 30
        })
        .returning({
          id: VideoData.id,
        });

      // Insert UGC-specific metadata
      await db
        .insert(UGCVideoMetadata)
        .values({
          videoId: inserted.id,
          avatarId: formData.avatar?.id || formData.avatar,
          avatarPersonality: formData.avatar?.personality,
          productName: formData.productName,
          productDescription: formData.productDescription,
          productImageUrl: formData.productImage,
          tone: formData.tone,
          language: formData.language,
          voiceStyle: formData.voiceStyle,
          gestures: formData.avatar?.gestures || [],
          hasProductIntegration: !!formData.productImage,
          enhancementType: "did_realistic_ugc"
        });

      // Fetch full record using returned ID
      const [fullVideo] = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, inserted.id));

      // Return formatted object with `isFavorite`
      const finalVideo = {
        video: {
          ...fullVideo,
          videoUrl: didVideoResponse?.videoUrl || fullVideo.videoUrl
        },
        isFavorite: false,
      };

      // Update your state with the same structure used in video list
      setVideoContent(finalVideo);
      setVideoData({});
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate UGC Video Script with AI Enhancement
  const getUGCVideoScript = async () => {
    setIsLoading(true);

    try {
      // First, try to enhance the script with AI
      const enhanceResponse = await axios.post("/api/ugc/enhance-script", {
        productName: formData.productName,
        productDescription: formData.productDescription,
        tone: formData.tone,
        language: formData.language,
        avatarPersonality: formData.avatar?.personality || "friendly",
        voiceStyle: formData.voiceStyle
      });

      if (enhanceResponse.data.success) {
        const enhancedScript = enhanceResponse.data.enhancedScript;
        setVideoData((state) => ({
          ...state,
          videoScript: enhancedScript,
        }));
        setVideoScript(enhancedScript);
        generateAudioFile(enhancedScript);
        return;
      }
    } catch (enhanceError) {
      console.warn("Script enhancement failed, using fallback:", enhanceError);
    }

    // Fallback to original script generation
    await axios
      .post("/api/ugc/generate-script", {
        productName: formData.productName,
        productDescription: formData.productDescription,
        tone: formData.tone,
        language: formData.language,
        avatar: formData.avatar
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

  const generateVideo = () => {
    if (!formData.avatar || !formData.productName || !formData.productDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (coins >= 50) {
      getUGCVideoScript();
    } else {
      errorNotify();
    }
  };

  // Generate Audio Script - matches existing pattern
  const generateAudioFile = async (videoScriptData) => {
    let script = "";
    const id = uuidv4();

    videoScriptData.forEach((item) => {
      script = script + item.contentText + " ";
    });

    const res = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
      language: formData.language,
      contentType: "UGC Ad",
      timeout: 30000,
    });

    setVideoData((state) => ({
      ...state,
      audioFileUrl: res.data.url,
    }));
    setAudioFileUrl(res.data.url);
    generateAudioCaption(res.data.url, videoScriptData);
  };

  // Generate Audio Captions - matches existing pattern
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
        res.data.result && generateUGCImages(videoScriptData);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("Error:", err);
      });
  };

  // Skip AI image generation for UGC - use product images only
  const generateUGCImages = async (scriptData) => {
    let images = [];
    
    // For UGC videos, we use the uploaded product image for all scenes
    if (formData.productImage) {
      // Use the same product image for all scenes in UGC videos
      for (let i = 0; i < scriptData.length; i++) {
        images.push(formData.productImage);
      }
    } else {
      // If no product image, create placeholder or use avatar images
      for (let i = 0; i < scriptData.length; i++) {
        images.push('/placeholder-product.jpg'); // You can add a default placeholder
      }
    }
    
    setVideoData((state) => ({
      ...state,
      imageList: images,
    }));
    setImageList(images);
    notify();

    await videoSuccessCb();

    setIsLoading(false);
  };

  const handleCancelVideoPlayerCb = () => {
    setPlayVideo(false);
  };

  // Generate D-ID Avatar Video
  const generateDIDVideo = async (videoData) => {
    try {
      const response = await axios.post("/api/ugc/generate-did-avatar", {
        avatarId: formData.avatar?.id || formData.avatar,
        audioUrl: videoData.audioFileUrl,
        script: videoData.videoScript,
        productImage: formData.productImage,
        productName: formData.productName,
        tone: formData.tone,
        voiceStyle: formData.voiceStyle,
        id: uuidv4()
      });

      if (response.data.success) {
        return {
          videoUrl: response.data.videoUrl,
          enhancement: response.data.enhancement
        };
      } else {
        throw new Error(response.data.error || "Failed to generate D-ID video");
      }
    } catch (error) {
      console.error("D-ID video generation failed:", error);
      // Return null to use fallback (existing Remotion video)
      return null;
    }
  };

  const resetForm = () => {
    setFormData({
      avatar: null,
      productName: "",
      productDescription: "",
      productImage: null,
      tone: "excited",
      language: "en",
      voiceStyle: "friendly"
    });
    setGeneratedVideo(null);
    setVideoContent(null);
    setVideoScript("");
    setAudioFileUrl("");
    setCaptions([]);
    setImageList([]);
    setVideoData({});
    toast.success("Form reset successfully!");
  };

  return [
    {
      formData,
      isAPILoading: isLoading,
      videoScript,
      audioFileUrl,
      captions,
      playVideo,
      videoData,
      videoContent,
    },
    {
      setSelectedAvatar,
      setProductData,
      setTone,
      setLanguage,
      generateVideo,
      generateAudioFile,
      generateAudioCaption,
      handleCancelVideoPlayerCb,
      resetForm,
    },
  ];
};
