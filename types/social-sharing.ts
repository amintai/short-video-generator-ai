/**
 * TypeScript definitions for social media sharing functionality
 */

export interface SocialPlatform {
  id: 'instagram' | 'youtube' | 'tiktok';
  name: string;
  icon: string;
  color: string;
  isEnabled: boolean;
}

export interface VideoUploadRequest {
  videoUrl: string;
  title: string;
  description: string;
  hashtags?: string[];
  platform: SocialPlatform['id'];
  accessToken?: string;
  videoId?: string; // Our internal video ID
}

export interface VideoUploadResponse {
  success: boolean;
  platformVideoId?: string;
  platformUrl?: string;
  error?: string;
  message?: string;
}

export interface InstagramUploadResponse extends VideoUploadResponse {
  instagramMediaId?: string;
  instagramUrl?: string;
}

export interface YouTubeUploadResponse extends VideoUploadResponse {
  youtubeVideoId?: string;
  youtubeUrl?: string;
  status?: 'uploaded' | 'processed' | 'published';
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scope?: string;
  tokenType?: string;
}

export interface SocialAuthSession {
  platform: SocialPlatform['id'];
  userId: string;
  tokens: OAuthTokens;
  createdAt: Date;
  expiresAt?: Date;
}

export interface UploadProgress {
  platform: SocialPlatform['id'];
  status: 'preparing' | 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
  error?: string;
}
