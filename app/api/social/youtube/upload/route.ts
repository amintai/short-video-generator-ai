import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { VideoUploadRequest, YouTubeUploadResponse } from '../../../../../types/social-sharing';

/**
 * YouTube Shorts Upload API Route
 * 
 * This endpoint handles uploading videos to YouTube Shorts using the YouTube Data API v3.
 * 
 * Required Environment Variables:
 * - YOUTUBE_CLIENT_ID: Google OAuth2 Client ID
 * - YOUTUBE_CLIENT_SECRET: Google OAuth2 Client Secret
 * - YOUTUBE_REDIRECT_URI: OAuth redirect URI
 * 
 * Process:
 * 1. Validate user authentication and request payload
 * 2. Download video from Firebase URL
 * 3. Validate video for YouTube Shorts specifications
 * 4. Upload video using YouTube Data API v3
 * 5. Return success response with YouTube URL
 */
export async function POST(request: NextRequest): Promise<NextResponse<YouTubeUploadResponse>> {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body: VideoUploadRequest = await request.json();
    const { videoUrl, title, description, hashtags = [], accessToken } = body;

    if (!videoUrl || !accessToken) {
      return NextResponse.json(
        { success: false, error: 'Video URL and access token are required' },
        { status: 400 }
      );
    }

    // Initialize Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    // Set access token
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    // Initialize YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // Validate access token by getting channel info
    console.log('🔐 Validating YouTube access token...');
    const tokenValidation = await validateYouTubeToken(youtube);
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired YouTube access token' },
        { status: 401 }
      );
    }

    // Download video from Firebase
    console.log('📥 Downloading video from Firebase...');
    const videoBuffer = await downloadVideoFromUrl(videoUrl);
    
    if (!videoBuffer) {
      return NextResponse.json(
        { success: false, error: 'Failed to download video from URL' },
        { status: 400 }
      );
    }

    // Validate video specifications for YouTube Shorts
    const videoValidation = await validateVideoForYouTube(videoBuffer);
    if (!videoValidation.isValid) {
      return NextResponse.json(
        { success: false, error: videoValidation.error },
        { status: 400 }
      );
    }

    // Create video metadata for YouTube Shorts
    const videoMetadata = {
      snippet: {
        title: truncateString(title, 100), // YouTube title limit
        description: formatYouTubeDescription(description, hashtags),
        tags: hashtags.slice(0, 15), // YouTube allows max 15 tags
        categoryId: '24', // Entertainment category
        defaultLanguage: 'en'
      },
      status: {
        privacyStatus: 'public', // or 'private', 'unlisted'
        selfDeclaredMadeForKids: false
      }
    };

    // Upload video to YouTube
    console.log('📤 Uploading video to YouTube Shorts...');
    const uploadResult = await uploadVideoToYouTube(youtube, videoBuffer, videoMetadata);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // Return success response
    const response: YouTubeUploadResponse = {
      success: true,
      youtubeVideoId: uploadResult.videoId,
      youtubeUrl: `https://youtube.com/shorts/${uploadResult.videoId}`,
      platformVideoId: uploadResult.videoId,
      platformUrl: `https://youtube.com/shorts/${uploadResult.videoId}`,
      status: 'uploaded',
      message: 'Successfully uploaded to YouTube Shorts!'
    };

    console.log('✅ YouTube upload completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ YouTube upload failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during YouTube upload',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Validates YouTube access token by attempting to get channel information
 */
async function validateYouTubeToken(youtube: any): Promise<{
  isValid: boolean;
  channelId?: string;
  error?: string;
}> {
  try {
    const response = await youtube.channels.list({
      part: ['id'],
      mine: true
    });

    if (!response.data.items || response.data.items.length === 0) {
      return {
        isValid: false,
        error: 'No YouTube channel found for this account'
      };
    }

    return {
      isValid: true,
      channelId: response.data.items[0].id
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: error.message || 'Failed to validate YouTube access token'
    };
  }
}

/**
 * Downloads video from Firebase URL and returns buffer
 */
async function downloadVideoFromUrl(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Failed to download video:', error);
    return null;
  }
}

/**
 * Validates video specifications for YouTube Shorts
 */
async function validateVideoForYouTube(videoBuffer: Buffer): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // Basic size check (YouTube max: 256GB, but we'll use a more reasonable limit)
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  if (videoBuffer.length > maxSize) {
    return {
      isValid: false,
      error: 'Video file size exceeds 2GB limit for YouTube upload'
    };
  }

  // TODO: Add more video validation (duration ≤60s for Shorts, format, resolution)
  // You might want to use FFmpeg for detailed validation

  return { isValid: true };
}

/**
 * Uploads video to YouTube using the YouTube Data API v3
 */
async function uploadVideoToYouTube(
  youtube: any,
  videoBuffer: Buffer,
  metadata: any
): Promise<{
  success: boolean;
  videoId?: string;
  error?: string;
}> {
  try {
    // Convert buffer to readable stream
    const videoStream = new Readable({
      read() {
        this.push(videoBuffer);
        this.push(null); // End of stream
      }
    });

    // Upload video
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: metadata,
      media: {
        body: videoStream,
        mimeType: 'video/mp4'
      }
    });

    if (!response.data.id) {
      return {
        success: false,
        error: 'YouTube did not return a video ID'
      };
    }

    return {
      success: true,
      videoId: response.data.id
    };
  } catch (error: any) {
    console.error('YouTube API upload error:', error);
    
    // Handle specific YouTube API errors
    if (error.code === 403) {
      return {
        success: false,
        error: 'Insufficient permissions. Please ensure the YouTube account has upload permissions.'
      };
    }
    
    if (error.code === 400) {
      return {
        success: false,
        error: 'Invalid video format or metadata. Please check video specifications.'
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to upload video to YouTube'
    };
  }
}

/**
 * Formats description for YouTube with hashtags
 */
function formatYouTubeDescription(description: string, hashtags: string[]): string {
  let formattedDescription = description;

  if (hashtags.length > 0) {
    const formattedHashtags = hashtags.map(tag => 
      tag.startsWith('#') ? tag : `#${tag}`
    ).join(' ');
    
    formattedDescription += `\n\n${formattedHashtags}`;
  }

  // Add Shorts-specific tags if not already present
  if (!formattedDescription.includes('#Shorts')) {
    formattedDescription += ' #Shorts';
  }
  if (!formattedDescription.includes('#YouTubeShorts')) {
    formattedDescription += ' #YouTubeShorts';
  }

  // YouTube description limit is 5,000 characters
  if (formattedDescription.length > 5000) {
    formattedDescription = formattedDescription.substring(0, 4997) + '...';
  }

  return formattedDescription;
}

/**
 * Truncates string to specified length
 */
function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
}
