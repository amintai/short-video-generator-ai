import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { VideoUploadRequest, InstagramUploadResponse } from '../../../../../types/social-sharing';

/**
 * Instagram Reels Upload API Route
 * 
 * This endpoint handles uploading videos to Instagram Reels using the Instagram Graph API.
 * 
 * Required Environment Variables:
 * - INSTAGRAM_APP_ID: Facebook App ID
 * - INSTAGRAM_APP_SECRET: Facebook App Secret
 * - INSTAGRAM_REDIRECT_URI: OAuth redirect URI
 * 
 * Process:
 * 1. Validate user authentication and request payload
 * 2. Download video from Firebase URL
 * 3. Upload to Instagram as media container
 * 4. Publish the media container as Reel
 * 5. Return success response with Instagram URL
 */
export async function POST(request: NextRequest): Promise<NextResponse<InstagramUploadResponse>> {
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

    // Validate Instagram access token
    const tokenValidation = await validateInstagramToken(accessToken);
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired Instagram access token' },
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

    // Validate video specifications for Instagram Reels
    const videoValidation = await validateVideoForInstagram(videoBuffer);
    if (!videoValidation.isValid) {
      return NextResponse.json(
        { success: false, error: videoValidation.error },
        { status: 400 }
      );
    }

    // Create Instagram media container
    console.log('📤 Creating Instagram media container...');
    const mediaContainer = await createInstagramMediaContainer({
      accessToken,
      videoBuffer,
      caption: formatInstagramCaption(title, description, hashtags),
      userId: tokenValidation.instagramUserId!
    });

    if (!mediaContainer.success) {
      return NextResponse.json(
        { success: false, error: mediaContainer.error },
        { status: 500 }
      );
    }

    // Publish the media container
    console.log('🚀 Publishing Instagram Reel...');
    const publishResult = await publishInstagramMedia({
      accessToken,
      containerId: mediaContainer.containerId!,
      userId: tokenValidation.instagramUserId!
    });

    if (!publishResult.success) {
      return NextResponse.json(
        { success: false, error: publishResult.error },
        { status: 500 }
      );
    }

    // Return success response
    const response: InstagramUploadResponse = {
      success: true,
      instagramMediaId: publishResult.mediaId,
      instagramUrl: publishResult.permalink,
      platformVideoId: publishResult.mediaId,
      platformUrl: publishResult.permalink,
      message: 'Successfully uploaded to Instagram Reels!'
    };

    console.log('✅ Instagram upload completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Instagram upload failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during Instagram upload',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Validates Instagram access token and returns user information
 */
async function validateInstagramToken(accessToken: string): Promise<{
  isValid: boolean;
  instagramUserId?: string;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        isValid: false,
        error: errorData.error?.message || 'Invalid access token'
      };
    }

    const userData = await response.json();
    return {
      isValid: true,
      instagramUserId: userData.id
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate access token'
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
 * Validates video specifications for Instagram Reels
 */
async function validateVideoForInstagram(videoBuffer: Buffer): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // Basic size check (Instagram max: 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (videoBuffer.length > maxSize) {
    return {
      isValid: false,
      error: 'Video file size exceeds 100MB limit for Instagram Reels'
    };
  }

  // TODO: Add more video validation (duration, format, resolution)
  // You might want to use FFmpeg for detailed validation

  return { isValid: true };
}

/**
 * Creates Instagram media container for video upload
 */
async function createInstagramMediaContainer({
  accessToken,
  videoBuffer,
  caption,
  userId
}: {
  accessToken: string;
  videoBuffer: Buffer;
  caption: string;
  userId: string;
}): Promise<{
  success: boolean;
  containerId?: string;
  error?: string;
}> {
  try {
    // Upload video to a temporary hosting service (you might use a different approach)
    // For now, we'll use multipart form data directly to Instagram
    
    const formData = new FormData();
    const videoBlob = new Blob([videoBuffer], { type: 'video/mp4' });
    formData.append('video_file', videoBlob);
    formData.append('caption', caption);
    formData.append('media_type', 'REELS');
    formData.append('access_token', accessToken);

    const response = await fetch(
      `https://graph.instagram.com/v18.0/${userId}/media`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || 'Failed to create media container'
      };
    }

    const data = await response.json();
    return {
      success: true,
      containerId: data.id
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create Instagram media container'
    };
  }
}

/**
 * Publishes Instagram media container
 */
async function publishInstagramMedia({
  accessToken,
  containerId,
  userId
}: {
  accessToken: string;
  containerId: string;
  userId: string;
}): Promise<{
  success: boolean;
  mediaId?: string;
  permalink?: string;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${userId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || 'Failed to publish media'
      };
    }

    const data = await response.json();
    
    // Get media permalink
    const mediaResponse = await fetch(
      `https://graph.instagram.com/v18.0/${data.id}?fields=permalink&access_token=${accessToken}`
    );

    let permalink = '';
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      permalink = mediaData.permalink;
    }

    return {
      success: true,
      mediaId: data.id,
      permalink
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to publish Instagram media'
    };
  }
}

/**
 * Formats caption for Instagram with hashtags
 */
function formatInstagramCaption(title: string, description: string, hashtags: string[]): string {
  let caption = title;
  
  if (description) {
    caption += `\n\n${description}`;
  }

  if (hashtags.length > 0) {
    const formattedHashtags = hashtags.map(tag => 
      tag.startsWith('#') ? tag : `#${tag}`
    ).join(' ');
    caption += `\n\n${formattedHashtags}`;
  }

  // Instagram caption limit is 2,200 characters
  if (caption.length > 2200) {
    caption = caption.substring(0, 2197) + '...';
  }

  return caption;
}
