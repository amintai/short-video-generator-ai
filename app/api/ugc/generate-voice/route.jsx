import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../configs/firebaseConfig";

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export async function POST(req) {
  try {
    const { text, voiceId, language, tone, id } = await req.json();

    if (!text || !voiceId) {
      return NextResponse.json({
        success: false,
        error: "Text and voice ID are required"
      }, { status: 400 });
    }

    const storageRef = ref(storage, `ugc-audio-files/${id}.mp3`);

    const voice = {
      languageCode: "en-US",
      name: voiceId,
      ssmlGender: "FEMALE"
    };

    const synthesisInput = { text };

    const audioConfig = {
      audioEncoding: "MP3",
      speakingRate: tone === "excited" ? 1.2 : 1.0,
      pitch: tone === "excited" ? 2.0 : 0.0
    };

    const [response] = await client.synthesizeSpeech({
      input: synthesisInput,
      voice,
      audioConfig
    });

    const audioBuffer = Buffer.from(response.audioContent, "binary");

    await uploadBytes(storageRef, audioBuffer, {
      contentType: "audio/mpeg",
    });

    const downloadUrl = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      audioUrl: downloadUrl
    });
  } catch (error) {
    console.error("Error generating voice audio:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to generate voice audio"
    }, { status: 500 });
  }
}

