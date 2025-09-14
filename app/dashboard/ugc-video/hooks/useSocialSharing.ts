import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { SocialPlatform, VideoUploadRequest, VideoUploadResponse } from '../../../../types/social-sharing';

/**
 * Custom hook for social media sharing functionality
 * 
 * Provides methods for:
 * - Authenticating with social platforms
 * - Uploading videos to Instagram Reels and YouTube Shorts
 * - Managing upload progress and states
 * - Handling errors and fallbacks
 * 
 * Usage:
 * ```tsx
 * const { 
 *   shareToInstagram, 
 *   shareToYouTube, 
 *   connectPlatform, 
 *   isUploading, 
 *   uploadProgress 
 * } = useSocialSharing();
 * ```
 */
export const useSocialSharing = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState(new Set());

  // Available social platforms configuration
  const socialPlatforms = [
    {
      id: 'instagram',
      name: 'Instagram Reels',
      icon: '📷',
      color: '#E4405F',
      isEnabled: true
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      icon: '📺',
      color: '#FF0000',
      isEnabled: true
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: '#000000',
      isEnabled: false // Coming soon
    }
  ];

  /**
   * Updates upload progress state
   */
  const updateProgress = useCallback((progress) => {
    setUploadProgress(prev => prev ? { ...prev, ...progress } : null);
  }, []);

  /**
   * Connects user account to a social media platform via OAuth
   */
  const connectPlatform = useCallback(async (platform) => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Get OAuth authorization URL
      const authResponse = await fetch(`/api/social/auth?platform=${platform}`);
      const authData = await authResponse.json();

      if (!authData.success) {
        return { success: false, error: authData.error };
      }

      // Open OAuth popup window
      const popup = window.open(
        authData.authUrl,
        'social-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        return { success: false, error: 'Popup blocked. Please allow popups and try again.' };
      }

      // Wait for OAuth completion
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Check if authorization was successful
            // You might implement postMessage communication here
            resolve({ success: false, error: 'Authorization window was closed' });
          }
        }, 1000);

        // Listen for OAuth completion (you'd implement this with postMessage)
        const handleMessage = (event: any) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'OAUTH_SUCCESS') {
            clearInterval(checkClosed);
            popup.close();
            window.removeEventListener('message', handleMessage);
            setConnectedPlatforms(prev => new Set([...prev, platform]));
            resolve({ 
              success: true, 
              accessToken: event.data.accessToken 
            });
          } else if (event.data.type === 'OAUTH_ERROR') {
            clearInterval(checkClosed);
            popup.close();
            window.removeEventListener('message', handleMessage);
            resolve({ success: false, error: event.data.error });
          }
        };

        window.addEventListener('message', handleMessage);
      });

    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      return { 
        success: false, 
        error: 'Failed to initiate OAuth flow' 
      };
    }
  }, [userId]);

  /**
   * Shares video to Instagram Reels
   */
  const shareToInstagram = useCallback(async (
    videoData: {
      videoUrl: string;
      title: string;
      description: string;
      hashtags?: string[];
    },
    accessToken?: string
  ) => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Connect to Instagram if not already connected and no access token provided
    if (!accessToken && !connectedPlatforms.has('instagram')) {
      const connectionResult = await connectPlatform('instagram');
      if (!connectionResult.success) {
        return { success: false, error: connectionResult.error };
      }
      accessToken = connectionResult.accessToken;
    }

    if (!accessToken) {
      return { success: false, error: 'Instagram access token required' };
    }

    setIsUploading(true);
    setUploadProgress({
      platform: 'instagram',
      status: 'preparing',
      progress: 0,
      message: 'Preparing Instagram upload...'
    });

    try {
      const uploadRequest = {
        ...videoData,
        platform: 'instagram',
        accessToken
      };

      updateProgress({ status: 'uploading', progress: 25, message: 'Uploading to Instagram...' });

      const response = await fetch('/api/social/instagram/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadRequest)
      });

      updateProgress({ progress: 75, message: 'Processing upload...' });

      const result: VideoUploadResponse = await response.json();

      if (result.success) {
        updateProgress({ 
          status: 'completed', 
          progress: 100, 
          message: 'Successfully shared to Instagram Reels!' 
        });
        toast.success('Video shared to Instagram Reels!');
      } else {
        updateProgress({ 
          status: 'failed', 
          progress: 0, 
          message: result.error || 'Upload failed',
          error: result.error 
        });
        toast.error(`Instagram upload failed: ${result.error}`);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateProgress({ 
        status: 'failed', 
        progress: 0, 
        message: 'Upload failed',
        error: errorMessage 
      });
      toast.error(`Instagram upload failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => setUploadProgress(null), 3000);
    }
  }, [userId, connectedPlatforms, connectPlatform, updateProgress]);

  /**
   * Shares video to YouTube Shorts
   */
  const shareToYouTube = useCallback(async (
    videoData: {
      videoUrl: string;
      title: string;
      description: string;
      hashtags?: string[];
    },
    accessToken?: string
  ): Promise<VideoUploadResponse> => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Connect to YouTube if not already connected and no access token provided
    if (!accessToken && !connectedPlatforms.has('youtube')) {
      const connectionResult = await connectPlatform('youtube');
      if (!connectionResult.success) {
        return { success: false, error: connectionResult.error };
      }
      accessToken = connectionResult.accessToken;
    }

    if (!accessToken) {
      return { success: false, error: 'YouTube access token required' };
    }

    setIsUploading(true);
    setUploadProgress({
      platform: 'youtube',
      status: 'preparing',
      progress: 0,
      message: 'Preparing YouTube upload...'
    });

    try {
      const uploadRequest: VideoUploadRequest = {
        ...videoData,
        platform: 'youtube',
        accessToken
      };

      updateProgress({ status: 'uploading', progress: 25, message: 'Uploading to YouTube...' });

      const response = await fetch('/api/social/youtube/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadRequest)
      });

      updateProgress({ progress: 75, message: 'Processing upload...' });

      const result: VideoUploadResponse = await response.json();

      if (result.success) {
        updateProgress({ 
          status: 'completed', 
          progress: 100, 
          message: 'Successfully shared to YouTube Shorts!' 
        });
        toast.success('Video shared to YouTube Shorts!');
      } else {
        updateProgress({ 
          status: 'failed', 
          progress: 0, 
          message: result.error || 'Upload failed',
          error: result.error 
        });
        toast.error(`YouTube upload failed: ${result.error}`);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateProgress({ 
        status: 'failed', 
        progress: 0, 
        message: 'Upload failed',
        error: errorMessage 
      });
      toast.error(`YouTube upload failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => setUploadProgress(null), 3000);
    }
  }, [userId, connectedPlatforms, connectPlatform, updateProgress]);

  /**
   * Downloads video locally as fallback
   */
  const downloadVideo = useCallback(async (videoUrl: string, filename?: string): Promise<void> => {
    try {
      toast.loading('Preparing download...');
      
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `video-${Date.now()}.mp4`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Video download started!');
      
    } catch (error) {
      toast.dismiss();
      toast.error('Download failed. Please try again.');
      console.error('Download error:', error);
    }
  }, []);

  /**
   * Checks if a platform is connected
   */
  const isPlatformConnected = useCallback((platform: SocialPlatform['id']): boolean => {
    return connectedPlatforms.has(platform);
  }, [connectedPlatforms]);

  /**
   * Gets available platforms for sharing
   */
  const getAvailablePlatforms = useCallback(() => {
    return socialPlatforms.filter(platform => platform.isEnabled);
  }, []);

  return {
    // State
    isUploading,
    uploadProgress,
    connectedPlatforms,
    socialPlatforms: getAvailablePlatforms(),
    
    // Methods
    shareToInstagram,
    shareToYouTube,
    connectPlatform,
    downloadVideo,
    isPlatformConnected,
    
    // Utils
    updateProgress
  };
};
