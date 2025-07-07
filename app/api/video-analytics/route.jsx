import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { VideoData, VideoAnalytics } from "../../../configs/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req) {
  try {
    const { videoId, action, userEmail } = await req.json();
    
    // Validate required fields
    if (!videoId || !action) {
      return NextResponse.json(
        { error: "Video ID and action are required" },
        { status: 400 }
      );
    }

    // Get client IP and user agent for analytics
    const ipAddress = req.headers.get("x-forwarded-for") || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || "direct";

    // Record the analytics event
    await db.insert(VideoAnalytics).values({
      videoId,
      action,
      userEmail,
      ipAddress,
      userAgent,
      referrer,
      timestamp: new Date()
    });

    // Update the video's statistics based on action
    switch (action) {
      case "view":
        await db
          .update(VideoData)
          .set({ views: sql`${VideoData.views} + 1` })
          .where(eq(VideoData.id, videoId));
        break;
      
      case "download":
        await db
          .update(VideoData)
          .set({ downloads: sql`${VideoData.downloads} + 1` })
          .where(eq(VideoData.id, videoId));
        break;
      
      case "share":
        await db
          .update(VideoData)
          .set({ shares: sql`${VideoData.shares} + 1` })
          .where(eq(VideoData.id, videoId));
        break;
      
      default:
        // For any other actions, just record the event without updating counts
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    let query = db.select().from(VideoData).where(eq(VideoData.createdBy, userEmail));

    if (videoId) {
      query = query.where(eq(VideoData.id, parseInt(videoId)));
    }

    const analytics = await query;

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
