import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../configs/db";
import { Favorites, VideoData } from "../../../configs/schema";
import { eq, and } from "drizzle-orm";
import { toast } from "react-hot-toast";

const useFavorites = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Load user's favorites from database
  const loadFavorites = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    setIsLoading(true);
    try {
      const userFavorites = await db
        .select({ videoId: Favorites.videoId })
        .from(Favorites)
        .where(eq(Favorites.userEmail, user.primaryEmailAddress.emailAddress));

      const favoriteIds = new Set(userFavorites.map(fav => Number(fav.videoId)));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load favorites when user is available
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  // Add video to favorites
  const addToFavorites = useCallback(async (videoId) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please sign in to add favorites");
      return false;
    }

    try {
      // Check if already favorited
      const existing = await db
        .select()
        .from(Favorites)
        .where(
          and(
            eq(Favorites.userEmail, user.primaryEmailAddress.emailAddress),
            eq(Favorites.videoId, videoId)
          )
        );

      if (existing.length > 0) {
        toast.info("Video is already in favorites");
        return true;
      }

      // Add to database
      await db.insert(Favorites).values({
        userEmail: user.primaryEmailAddress.emailAddress,
        videoId: videoId
      });

      // Update local state
      setFavorites(prev => new Set([...prev, videoId]));
      toast.success("Added to favorites!");
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Failed to add to favorites");
      return false;
    }
  }, [user]);

  // Remove video from favorites
  const removeFromFavorites = useCallback(async (videoId) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      return false;
    }

    try {
      // Remove from database
      await db
        .delete(Favorites)
        .where(
          and(
            eq(Favorites.userEmail, user.primaryEmailAddress.emailAddress),
            eq(Favorites.videoId, videoId)
          )
        );

      // Update local state
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.delete(videoId);
        return newFavorites;
      });

      toast.success("Removed from favorites");
      return true;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove from favorites");
      return false;
    }
  }, [user]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (videoId) => {
    if (favorites.has(videoId)) {
      return await removeFromFavorites(videoId);
    } else {
      return await addToFavorites(videoId);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  // Check if video is favorited
  const isFavorite = useCallback((videoId) => {
    return favorites.has(videoId);
  }, [favorites]);

  // Get favorite videos with details
  const getFavoriteVideos = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return [];

    try {
      const favoriteVideos = await db
        .select({
          video: VideoData,
          favoriteId: Favorites.id,
          favoritedAt: Favorites.createdAt
        })
        .from(Favorites)
        .innerJoin(VideoData, eq(Favorites.videoId, VideoData.id))
        .where(eq(Favorites.userEmail, user.primaryEmailAddress.emailAddress))
        .orderBy(Favorites.createdAt);

      return favoriteVideos.map(item => ({
        ...item.video,
        favoriteId: item.favoriteId,
        favoritedAt: item.favoritedAt,
        isFavorite: true
      }));
    } catch (error) {
      console.error("Error getting favorite videos:", error);
      return [];
    }
  }, [user]);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    getFavoriteVideos,
    refreshFavorites: loadFavorites
  };
};

export default useFavorites;
