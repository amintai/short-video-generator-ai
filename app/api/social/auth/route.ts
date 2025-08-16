import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Social Media OAuth Authentication Handler
 * 
 * This endpoint generates OAuth URLs for different social media platforms
 * and handles the OAuth callback flow.
 * 
 * Supported Platforms:
 * - Instagram (Facebook Graph API)
 * - YouTube (Google OAuth2)
 * - TikTok (TikTok for Developers - future implementation)
 */

/**
 * GET /api/social/auth?platform=instagram|youtube
 * Returns OAuth authorization URL for the specified platform
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const action = searchParams.get('action'); // 'authorize' or 'callback'

    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform parameter is required' },
        { status: 400 }
      );
    }

    if (action === 'callback') {
      // Handle OAuth callback
      return handleOAuthCallback(platform, searchParams, userId);
    }

    // Generate OAuth authorization URL
    const authUrl = await generateOAuthUrl(platform, userId);
    
    if (!authUrl) {
      return NextResponse.json(
        { success: false, error: `OAuth not configured for platform: ${platform}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authUrl,
      platform
    });

  } catch (error) {
    console.error('OAuth authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generates OAuth authorization URL for specified platform
 */
async function generateOAuthUrl(platform: string, userId: string): Promise<string | null> {
  const baseState = `user_${userId}_platform_${platform}_${Date.now()}`;

  switch (platform.toLowerCase()) {
    case 'instagram': {
      const clientId = process.env.INSTAGRAM_APP_ID;
      const redirectUri = encodeURIComponent(process.env.INSTAGRAM_REDIRECT_URI || '');
      const scope = encodeURIComponent('instagram_content_publish,pages_show_list,pages_read_engagement');
      
      if (!clientId || !redirectUri) {
        console.error('Instagram OAuth configuration missing');
        return null;
      }

      return `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `response_type=code&` +
        `state=${baseState}`;
    }

    case 'youtube': {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      const redirectUri = encodeURIComponent(process.env.YOUTUBE_REDIRECT_URI || '');
      const scope = encodeURIComponent('https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube');
      
      if (!clientId || !redirectUri) {
        console.error('YouTube OAuth configuration missing');
        return null;
      }

      return `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${baseState}`;
    }

    default:
      return null;
  }
}

/**
 * Handles OAuth callback and exchanges code for access token
 */
async function handleOAuthCallback(
  platform: string, 
  searchParams: URLSearchParams, 
  userId: string
): Promise<NextResponse> {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({
      success: false,
      error: `OAuth error: ${error}`,
      description: searchParams.get('error_description')
    }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({
      success: false,
      error: 'Authorization code not provided'
    }, { status: 400 });
  }

  // Validate state parameter
  if (!state || !state.includes(`user_${userId}`)) {
    return NextResponse.json({
      success: false,
      error: 'Invalid state parameter'
    }, { status: 400 });
  }

  try {
    const tokens = await exchangeCodeForTokens(platform, code);
    
    if (!tokens.success) {
      return NextResponse.json({
        success: false,
        error: tokens.error
      }, { status: 400 });
    }

    // Store tokens securely (you might want to encrypt them)
    await storeUserTokens(userId, platform, tokens.data!);

    // Return success response with tokens
    return NextResponse.json({
      success: true,
      platform,
      accessToken: tokens.data!.access_token,
      expiresIn: tokens.data!.expires_in,
      message: `Successfully connected ${platform} account`
    });

  } catch (error) {
    console.error(`${platform} OAuth callback error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to complete OAuth flow'
    }, { status: 500 });
  }
}

/**
 * Exchanges authorization code for access tokens
 */
async function exchangeCodeForTokens(platform: string, code: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  switch (platform.toLowerCase()) {
    case 'instagram': {
      try {
        const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.INSTAGRAM_APP_ID!,
            client_secret: process.env.INSTAGRAM_APP_SECRET!,
            redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
            code: code
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.error?.message || 'Failed to exchange code'
          };
        }

        const data = await response.json();
        
        // Exchange short-lived token for long-lived token
        const longLivedResponse = await fetch(
          `https://graph.facebook.com/v18.0/oauth/access_token?` +
          `grant_type=fb_exchange_token&` +
          `client_id=${process.env.INSTAGRAM_APP_ID}&` +
          `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
          `fb_exchange_token=${data.access_token}`
        );

        if (longLivedResponse.ok) {
          const longLivedData = await longLivedResponse.json();
          return {
            success: true,
            data: longLivedData
          };
        }

        return {
          success: true,
          data: data
        };
      } catch (error) {
        return {
          success: false,
          error: 'Instagram token exchange failed'
        };
      }
    }

    case 'youtube': {
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.YOUTUBE_CLIENT_ID!,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
            redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
            grant_type: 'authorization_code',
            code: code
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.error_description || 'Failed to exchange code'
          };
        }

        const data = await response.json();
        return {
          success: true,
          data: data
        };
      } catch (error) {
        return {
          success: false,
          error: 'YouTube token exchange failed'
        };
      }
    }

    default:
      return {
        success: false,
        error: 'Unsupported platform'
      };
  }
}

/**
 * Stores user tokens securely in database
 * TODO: Implement actual database storage with encryption
 */
async function storeUserTokens(userId: string, platform: string, tokens: any): Promise<void> {
  // This is a placeholder - implement actual database storage
  console.log(`Storing tokens for user ${userId} on platform ${platform}`);
  
  // You should:
  // 1. Encrypt tokens before storing
  // 2. Store in your Supabase database
  // 3. Set expiration times
  // 4. Handle refresh token rotation
  
  // Example structure:
  // const encryptedTokens = encrypt(JSON.stringify(tokens));
  // await supabase.from('user_social_tokens').upsert({
  //   user_id: userId,
  //   platform: platform,
  //   encrypted_tokens: encryptedTokens,
  //   expires_at: new Date(Date.now() + (tokens.expires_in * 1000)),
  //   created_at: new Date()
  // });
}
