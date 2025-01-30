import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

console.log("client", client);

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

  //! To save audio in local
  //   const writeFile = util.promisify(fs.writeFile);
  //   await writeFile("output.mp3", response.audioContent, "binary");

  return NextResponse.json({
    Result: "Success",
    url: downloadUrl,
  });
}
