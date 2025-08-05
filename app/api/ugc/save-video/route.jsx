import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { currentUser } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated"
      }, { status: 401 });
    }

    const {
      id,
      name,
      script,
      audioFileUrl,
      videoUrl,
      productData,
      avatar,
      tone,
      language
    } = await req.json();

    if (!id || !name || !script || !videoUrl) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields"
      }, { status: 400 });
    }

    // Create video record in database
    const videoRecord = await db.insert(VideoData).values({
      name: name,
      script: [{ text: script, duration: 30 }], // Simplified script format
      audioFileUrl: audioFileUrl,
      videoUrl: videoUrl,
      imageList: productData?.image ? [productData.image] : [],
      createdBy: user.emailAddresses[0].emailAddress,
      duration: 30,
      category: "ugc-ad",
      tags: ["ugc", "advertisement", "ai-avatar", productData?.name?.toLowerCase()].filter(Boolean),
      status: "completed",
      // Store UGC-specific metadata in a custom field or extend schema
      thumbnailUrl: videoUrl, // Use video URL as thumbnail for now
    }).returning();

    // You might want to create a separate table for UGC-specific data
    // or extend the VideoData schema to include UGC fields like:
    // - avatar information
    // - product details
    // - tone/language settings

    return NextResponse.json({
      success: true,
      videoId: videoRecord[0].id,
      video: videoRecord[0]
    });

  } catch (error) {
    console.error("Error saving UGC video:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to save video to database"
    }, { status: 500 });
  }
}
