import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});


export async function POST(req) {
  const { text, id, language, contentType, voiceName, voiceStyle } = await req.json();

  const storageRef = ref(storage, "ai-short-video-files/" + id + ".mp3");

  // Enhanced voice mapping with more options
  const voiceMap = {
    en: {
      "sarah": { languageCode: "en-US", name: "en-US-Wavenet-F", gender: "FEMALE" },
      "john": { languageCode: "en-US", name: "en-US-Wavenet-D", gender: "MALE" },
      "emma": { languageCode: "en-US", name: "en-US-Wavenet-E", gender: "FEMALE" },
      "david": { languageCode: "en-US", name: "en-US-Wavenet-B", gender: "MALE" },
      "sophie": { languageCode: "en-GB", name: "en-GB-Wavenet-A", gender: "FEMALE" },
      "oliver": { languageCode: "en-GB", name: "en-GB-Wavenet-B", gender: "MALE" },
      "default": { languageCode: "en-US", name: "en-US-Wavenet-F", gender: "FEMALE" }
    },
    hi: {
      "arjun": { languageCode: "hi-IN", name: "hi-IN-Wavenet-A", gender: "MALE" },
      "kavya": { languageCode: "hi-IN", name: "hi-IN-Wavenet-B", gender: "FEMALE" },
      "default": { languageCode: "hi-IN", name: "hi-IN-Wavenet-A", gender: "MALE" }
    },
    es: {
      "carlos": { languageCode: "es-ES", name: "es-ES-Wavenet-B", gender: "MALE" },
      "lucia": { languageCode: "es-ES", name: "es-ES-Wavenet-C", gender: "FEMALE" },
      "default": { languageCode: "es-ES", name: "es-ES-Wavenet-B", gender: "MALE" }
    },
    fr: {
      "marie": { languageCode: "fr-FR", name: "fr-FR-Wavenet-C", gender: "FEMALE" },
      "pierre": { languageCode: "fr-FR", name: "fr-FR-Wavenet-B", gender: "MALE" },
      "default": { languageCode: "fr-FR", name: "fr-FR-Wavenet-C", gender: "FEMALE" }
    },
    de: {
      "hans": { languageCode: "de-DE", name: "de-DE-Wavenet-B", gender: "MALE" },
      "greta": { languageCode: "de-DE", name: "de-DE-Wavenet-A", gender: "FEMALE" },
      "default": { languageCode: "de-DE", name: "de-DE-Wavenet-B", gender: "MALE" }
    }
  };

  // Enhanced style configurations
  const styleConfig = {
    "Custom Prompt": { rate: "1.0", pitch: "0st" },
    "Random AI Story": { rate: "1.1", pitch: "+1st" },
    "Scary Story": { rate: "0.9", pitch: "-1st" },
    "Historical Facts": { rate: "1.0", pitch: "0st" },
    "Bed Time Story": { rate: "0.9", pitch: "+2st" },
    "Motivational": { rate: "1.2", pitch: "+2st" },
    "Fun Facts": { rate: "1.1", pitch: "+1st" },
  };

  // Voice style modifiers
  const voiceStyleConfig = {
    "friendly": { rate: "1.0", pitch: "+0.5st" },
    "professional": { rate: "0.95", pitch: "0st" },
    "energetic": { rate: "1.15", pitch: "+1st" },
    "calm": { rate: "0.9", pitch: "-0.5st" },
    "dramatic": { rate: "1.0", pitch: "+1.5st" },
    "conversational": { rate: "1.05", pitch: "+0.2st" }
  };

  // Get voice configuration
  const languageVoices = voiceMap[language] || voiceMap.en;
  const voice = languageVoices[voiceName] || languageVoices["default"];
  
  // Combine style configurations
  const contentStyle = styleConfig[contentType] || styleConfig["Custom Prompt"];
  const voiceStyleMod = voiceStyleConfig[voiceStyle] || voiceStyleConfig["friendly"];
  
  // Merge styles (voice style takes precedence)
  const finalStyle = {
    rate: voiceStyleMod.rate || contentStyle.rate,
    pitch: voiceStyleMod.pitch || contentStyle.pitch
  };

  const request = {
    input: {
      ssml: `
        <speak>
          <prosody rate="${finalStyle.rate}" pitch="${finalStyle.pitch}">
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
      speakingRate: parseFloat(finalStyle.rate),
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
