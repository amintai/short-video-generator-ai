// Simple script to add name field to existing videos
// Run this once after updating the schema

import { db } from '../configs/db.js';
import { VideoData } from '../configs/schema.js';
import { generateSimpleVideoName } from '../lib/videoUtils.js';

async function addNameToExistingVideos() {
  try {
    console.log('Starting migration: Adding name field to existing videos...');
    
    // Get all videos without names
    const videos = await db.select().from(VideoData);
    console.log(`Found ${videos.length} videos to process`);
    
    for (const video of videos) {
      if (!video.name) {
        // Generate a name based on script content or use a default
        let generatedName = 'AI Generated Video';
        
        if (video.script && Array.isArray(video.script) && video.script.length > 0) {
          const firstContent = video.script[0]?.contentText || '';
          if (firstContent) {
            const words = firstContent.split(' ').slice(0, 6).join(' ');
            generatedName = words.length > 3 ? words : 'AI Generated Video';
          }
        }
        
        // Update the video with the generated name
        await db
          .update(VideoData)
          .set({ 
            name: generatedName.substring(0, 50) + (generatedName.length > 50 ? '...' : ''),
            createdAt: video.createdAt || new Date()
          })
          .where(eq(VideoData.id, video.id));
        
        console.log(`Updated video ${video.id} with name: "${generatedName}"`);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Uncomment to run the migration
// addNameToExistingVideos();
