import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});


export async function POST(req) {
  const { text, id, language, contentType } = await req.json();

  const storageRef = ref(storage, "ai-short-video-files/" + id + ".mp3");

  const voiceMap = {
    en: { languageCode: "en-US", name: "en-US-Wavenet-F", gender: "FEMALE" },
    hi: { languageCode: "hi-IN", name: "hi-IN-Wavenet-A", gender: "MALE" },
    es: { languageCode: "es-ES", name: "es-ES-Wavenet-B", gender: "MALE" },
    fr: { languageCode: "fr-FR", name: "fr-FR-Wavenet-C", gender: "FEMALE" },
    de: { languageCode: "de-DE", name: "de-DE-Wavenet-B", gender: "MALE" },
  };

  const styleConfig = {
    "Custom Prompt": { rate: "1.0", pitch: "0st" },
    "Random AI Story": { rate: "1.1", pitch: "+1st" },
    "Scary Story": { rate: "0.9", pitch: "-1st" },
    "Historical Facts": { rate: "1.0", pitch: "0st" },
    "Bed Time Story": { rate: "0.9", pitch: "+2st" },
    "Motivational": { rate: "1.2", pitch: "+2st" },
    "Fun Facts": { rate: "1.1", pitch: "+1st" },
  };

  const voice = voiceMap[language] || voiceMap.en;
  const style = styleConfig[contentType] || styleConfig["Custom Prompt"];

  const request = {
    input: {
      ssml: `
        <speak>
          <prosody rate="${style.rate}" pitch="${style.pitch}">
            ${text}
          </prosody>
        </speak>
      `,
    },
    voice: {
      languageCode: voice.languageCode,
      name: voice.name,
      ssmlGender: voice.gender,
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: parseFloat(style.rate),
      pitch: 0.0,
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  const audioBuffer = Buffer.from(response.audioContent, "binary");

  await uploadBytes(storageRef, audioBuffer, {
    contentType: "audio/mp3",
  });

  const downloadUrl = await getDownloadURL(storageRef);

  return NextResponse.json({
    Result: "Success",
    url: downloadUrl,
  });
}
