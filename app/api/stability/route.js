import { NextResponse } from "next/server";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../../../configs/firebaseConfig";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    // Call Stability AI’s official API
    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // API returns array of images as base64
    const imageBase64 = response.data.artifacts[0].base64;
    const dataUrl = `data:image/png;base64,${imageBase64}`;

    const fileName = "ai-short-video-files/" + Date.now() + ".png";
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, dataUrl, "data_url");
    const downloadUrl = await getDownloadURL(storageRef);
    

    return NextResponse.json({ image: downloadUrl });
  } catch (error) {
    console.error("🔥 Stability API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
