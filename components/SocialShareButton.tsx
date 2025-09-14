'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../@/components/ui/select';
import { Input } from '../@/components/ui/input';
import { Textarea } from '../@/components/ui/textarea';
import { Badge } from '../@/components/ui/badge';
import { Progress } from '../@/components/ui/progress';
import {
  Share2,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocialSharing } from '../app/dashboard/ugc-video/hooks/useSocialSharing';

interface SocialShareButtonProps {
  videoData: {
    videoUrl: string;
    name: string;
    description?: string;
  };
  className?: string;
}

/**
 * Social Share Button Component
 *
 * Provides a comprehensive interface for sharing videos to social media platforms.
 * Features:
 * - Platform selection (Instagram Reels, YouTube Shorts)
 * - OAuth authentication flow
 * - Custom title, description, and hashtags
 * - Upload progress tracking
 * - Error handling and fallback download
 * - Responsive design with animations
 */
export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  videoData,
  className = '',
}) => {
  const {
    shareToInstagram,
    shareToYouTube,
    connectPlatform,
    downloadVideo,
    isUploading,
    uploadProgress,
    socialPlatforms,
    isPlatformConnected,
  } = useSocialSharing();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [shareData, setShareData] = useState({
    title: videoData.name || 'My AI Generated Video',
    description:
      videoData.description ||
      'Check out this amazing video created with AI!',
    hashtags: ['AI', 'Video', 'Creative', 'AIGenerated'],
  });
  const [newHashtag, setNewHashtag] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successUrl, setSuccessUrl] = useState('');

  /** Add new hashtag */
  const handleAddHashtag = () => {
    if (
      newHashtag.trim() &&
      !shareData.hashtags.includes(newHashtag.trim())
    ) {
      setShareData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag.trim()],
      }));
      setNewHashtag('');
    }
  };

  /** Remove hashtag */
  const handleRemoveHashtag = (tag: string) => {
    setShareData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((h) => h !== tag),
    }));
  };

  /** Share action */
  const handleShare = async () => {
    if (!selectedPlatform) {
      toast.error('Please select a platform to share to');
      return;
    }

    const uploadData = {
      videoUrl: videoData.videoUrl,
      title: shareData.title,
      description: shareData.description,
      hashtags: shareData.hashtags,
    };

    let result;

    try {
      switch (selectedPlatform) {
        case 'instagram':
          result = await shareToInstagram(uploadData);
          break;
        case 'youtube':
          result = await shareToYouTube(uploadData);
          break;
        default:
          toast.error('Unsupported platform');
          return;
      }

      if (result.success) {
        setShowSuccess(true);
        setSuccessUrl(result.platformUrl || '');
        setTimeout(() => {
          setIsOpen(false);
          setShowSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Share error:', err);
      toast.error('Failed to share video');
    }
  };

  /** Download fallback */
  const handleDownloadFallback = async () => {
    await downloadVideo(videoData.videoUrl, `${videoData.name || 'video'}.mp4`);
  };

  /** Platform icon */
  const getPlatformIcon = (platformId: string): string => {
    const platform = socialPlatforms.find((p) => p.id === platformId);
    return platform?.icon || '📱';
  };
  

  console.log('videoData',videoData)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
          disabled={!videoData.videoUrl}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share to Social Media
          </DialogTitle>
          <DialogDescription>
            Share your AI-generated video directly to Instagram Reels or YouTube
            Shorts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Platform Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Platform
            </label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex items-center gap-2">
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                      {isPlatformConnected(platform.id) && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Connected
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Video Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              value={shareData.title}
              onChange={(e) =>
                setShareData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter video title"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 text-right">
              {shareData.title.length}/100
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              value={shareData.description}
              onChange={(e) =>
                setShareData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter video description"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {shareData.description.length}/500
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Hashtags
            </label>
            <div className="flex gap-2">
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="Add hashtag"
                onKeyDown={(e) => e.key === 'Enter' && handleAddHashtag()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddHashtag}
                disabled={!newHashtag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {shareData.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {shareData.hashtags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveHashtag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploadProgress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 p-4 bg-blue-50 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  {uploadProgress.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : uploadProgress.status === 'failed' ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  <span className="text-sm font-medium">
                    {getPlatformIcon(uploadProgress.platform)}{' '}
                    {uploadProgress.message}
                  </span>
                </div>

                {uploadProgress.status !== 'completed' &&
                  uploadProgress.status !== 'failed' && (
                    <Progress value={uploadProgress.progress} className="w-full" />
                  )}

                {uploadProgress.error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {uploadProgress.error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Successfully shared!</span>
                </div>
                {successUrl && (
                  <a
                    href={successUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-green-600 hover:text-green-800"
                  >
                    View on platform
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleShare}
              disabled={!selectedPlatform || isUploading || showSuccess}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Share to {selectedPlatform && getPlatformIcon(selectedPlatform)}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadFallback}
              disabled={isUploading}
              title="Download video as backup"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 text-center pt-2">
            If upload fails, you can download the video and upload manually
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareButton;
