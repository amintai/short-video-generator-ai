import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { VideoData, VideoAnalytics } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { videoId, platform } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Update video isShared status and increment shares count
    await db
      .update(VideoData)
      .set({ 
        isShared: true,
        shares: db.raw('shares + 1')
      })
      .where(eq(VideoData.id, videoId));

    // Track the share in analytics
    await db.insert(VideoAnalytics).values({
      videoId: videoId,
      action: `share_${platform || 'unknown'}`,
      userEmail: userId, // Using userId for now, could be enhanced with email
      timestamp: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      message: "Share tracked successfully"
    });

  } catch (error) {
    console.error("Error tracking share:", error);
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}
