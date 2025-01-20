import axios from "axios";
import { useState } from "react";
import { v4 as uuid4 } from "uuid";

const scriptData =
  "Scene 1: Even in the darkest moments, there is a spark of potential within you. It's time to ignite it. Scene 2: The path to success may be challenging, but every step takes you closer to your goal. Scene 3: Cultivate your talents and watch them bloom into something truly beautiful. Scene 4: Let go of your doubts and fears; your potential will set you free and take you to new heights. Scene 5: We accomplish more together than we do alone. Unite with purpose, and build something greater. Scene 6: The universe is full of possibilities; believe in your dreams and reach for the stars. Scene 7: Let your inner light shine; be a guiding beacon for yourself and others. Scene 8: Listen to your heart, follow your passions and always believe in the power of who you are. ";
const FILE_URL =
  "https://firebasestorage.googleapis.com/v0/b/ai-short-video-generator-a99a3.firebasestorage.app/o/ai-short-video-files%2F0f9dc104-2080-45d8-a95d-416cff427cf9.mp3?alt=media&token=ca33c46e-e062-49a4-8ea9-f52e1a72dfb3";

const SCRIPT_JSON = [
  {
    imagePrompt:
      "A close-up of a comic book page with vibrant colors and dynamic action, showcasing a superhero mid-leap, their cape billowing behind them.",
    contentText:
      "Open on a comic book page. Vibrant colors, dynamic action. A superhero leaps through the air, cape billowing behind them. ",
  },
  {
    imagePrompt:
      "A child sitting on a living room floor, engrossed in reading a comic book, their eyes wide with wonder and excitement.",
    contentText:
      "Cut to a child, eyes wide, engrossed in a comic book. They're surrounded by colorful panels. ",
  },
];

const useCreateNewVideo = () => {
  const [formData, setFormData] = useState([]);
  const [isAPILoading, setAPILoading] = useState(false);
  const [videoScript, setVideoScript] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);

  console.log("videoScript", videoScript);
  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((state) => ({
      ...state,
      [fieldName]: fieldValue,
    }));
  };

  const getVideoScript = async () => {
    setAPILoading(true);
    const propmt = `Write a script to generate ${formData.duration} seconds video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each and give me result in JSON format with imagePrompt and ContetText as field, No Plain Text it should not include scene 1, 2 ,3 as Start of paragraph.`;
    await axios
      .post("/api/get-video-script", {
        propmt: propmt,
      })
      .then((res) => {
        setVideoScript(res.data.result);
        generateAudioFile(res.data.result.scenes);
      });
    setAPILoading(false);
  };

  const handleCreateVideo = () => {
    // getVideoScript();
    // generateAudioFile(scriptData);
    // generateAudioCaption(FILE_URL);
    generateImage();
  };

  const generateAudioFile = async (data) => {
    // let script = "";
    const id = uuid4();

    setAPILoading(true);

    // data.forEach((item) => {
    //   script = script + item.contentText + " ";
    // });
    // console.log(script);

    await axios
      .post("/api/generate-audio", {
        text: data,
        id: id,
      })
      .then((res) => {
        setAPILoading(false);
        setAudioFileUrl(res.data.url);
      })
      .catch((e) => {
        setAPILoading(false);
      });
  };

  const generateAudioCaption = async (fileUrl) => {
    setAPILoading(true);

    await axios
      .post("/api/generate-caption", {
        audioFileUrl: fileUrl,
      })
      .then((res) => {
        setCaptions(res.data.result);
        generateImage();
      })
      .catch((err) => {
        setAPILoading(false);
      });
  };

  const generateImage = async () => {
    let images = [];
    SCRIPT_JSON.forEach(async (element) => {
      await axios
        .post("/api/generate-image", {
          prompt: element?.imagePrompt,
        })
        .then((res) => {
          console.log("RES", res);
          setAPILoading(false);
          images.push(res.data.result);
        })
        .catch((e) => {
          setAPILoading(false);
        });
    });
    setImageList(images);
  };
  return [
    { formData, isAPILoading, videoScript, audioFileUrl, captions },
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
