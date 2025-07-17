import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { VideoData } from "../../../../configs/schema";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    // Fetch video data from database
    const videoData = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, parseInt(id)))
      .limit(1);

    if (!videoData || videoData.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = videoData[0];

    // Return only the necessary data for public viewing
    // Remove sensitive information like user email
    const publicVideoData = {
      id: video.id,
      name: video.name,
      script: video.script,
      audioFileUrl: video.audioFileUrl,
      captions: video.captions,
      imageList: video.imageList,
      createdAt: video.createdAt,
      // Add any other public fields you want to include
    };

    return NextResponse.json(publicVideoData);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
