import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const fs = require("fs");
const util = require("util");

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();

  const storageRef = ref(storage, "ai-short-video-files/" + id + ".mp3");

  const request = {
    input: {
      text: text,
    },
    voice: {
      languageCode: "en-US",
      ssmlGender: "FEMAIL",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  //! To store audio in firebase
  const audioBuffer = Buffer.from(response.audioContent, "binary");

  await uploadBytes(storageRef, audioBuffer, {
    contentType: "audio/mp3",
  });

  const downloadUrl = await getDownloadURL(storageRef);

  console.log("downloadUrl", downloadUrl);
  //! To save audio in local
  //   const writeFile = util.promisify(fs.writeFile);
  //   await writeFile("output.mp3", response.audioContent, "binary");
  console.log("Audio content written to file: output.mp3");

  return NextResponse.json({
    Result: "Success",
    url: downloadUrl,
  });
}
