import { NextResponse } from "next/server";
import Replicate from "replicate";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { avatarId, audioUrl, script, id } = await req.json();

    if (!avatarId || !audioUrl) {
      return NextResponse.json({
        success: false,
        error: "Avatar ID and audio URL are required"
      }, { status: 400 });
    }

    // Avatar image mapping (you can store these in a database or config file)
    const avatarImages = {
      "sara": "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJA/output.jpg",
      "alex": "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJB/output.jpg",
      "emma": "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJC/output.jpg",
      "david": "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJD/output.jpg",
      "sophia": "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJE/output.jpg",
      "michael": "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJF/output.jpg"
    };

    const avatarImageUrl = avatarImages[avatarId] || avatarImages["sara"]; // fallback to sara

    // Use D-ID or similar API through Replicate for lip-sync avatar generation
    // This is using a hypothetical model - you'd need to use actual D-ID API or similar
    const output = await replicate.run(
      "devxpy/cog-wav2lip:8d65e3f4f4298520e079198b493c25adfc43c058ffec924f2aefc8010ed25eef",
      {
        input: {
          face: avatarImageUrl,
          audio: audioUrl,
          smooth: true,
          resize_factor: 1
        }
      }
    );

    // If the output is a URL, we can use it directly
    let videoUrl = output;

    // If we want to store it in our Firebase storage
    if (typeof output === "string" && output.startsWith("http")) {
      try {
        // Download the video and upload to Firebase
        const response = await fetch(output);
        const videoBuffer = await response.arrayBuffer();
        
        const storageRef = ref(storage, `ugc-videos/${id}.mp4`);
        const uploadResult = await uploadBytes(storageRef, videoBuffer, {
          contentType: "video/mp4",
        });
        
        videoUrl = await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.error("Error uploading to Firebase:", uploadError);
        // Use the original URL if upload fails
        videoUrl = output;
      }
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      avatarId,
      duration: 30 // estimated duration
    });

  } catch (error) {
    console.error("Error generating avatar video:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to generate avatar video",
      details: error.message
    }, { status: 500 });
  }
}
