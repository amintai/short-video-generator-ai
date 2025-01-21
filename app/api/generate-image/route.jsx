import Replicate from "replicate";
import { NextResponse } from "next/server";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../../../configs/firebaseConfig";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    // const output = await replicate.run(
    //   "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
    //   { input }
    // );

    const output = await replicate.run(
      "nvidia/sana:c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6",
      { input }
    );

    const downloadUrl = handleUploadImage(output);

    return NextResponse.json({
      result: downloadUrl,
    });
  } catch (e) {
    //! NOTE: This is Temporary code as currently we do not have a lincence key which generates real images.
    const base64Image =
      "data:image/png;base64," +
      (await convertImage(
        "https://fastly.picsum.photos/id/172/536/354.jpg?hmac=vGTqZcarPIEk4mDaK426APQYPgDIfPuISnvISC_-cAU"
      ));

    const fileName = "ai-short-video-files/" + Date.now() + ".png";

    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, "data_url");

    const downloadUrl = await getDownloadURL(storageRef);

    return NextResponse.json({
      result: downloadUrl,
    });
  }
}

//! Upload Image to Firebase
const handleUploadImage = async (image) => {
  const base64Image = "data:image/png;base64," + (await convertImage(image));

  const fileName = "ai-short-video-files/" + Date.now() + ".png";

  const storageRef = ref(storage, fileName);

  await uploadString(storageRef, base64Image, "data_url");

  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
};

//! Convert Image to base64 Format
const convertImage = async (imageUrl) => {
  try {
    const res = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(res.data).toString("base64");

    return base64Image;
  } catch (e) {
    console.log(e);
  }
};
