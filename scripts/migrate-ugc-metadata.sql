-- Migration script for UGC Video Metadata table
-- Run this script to add the new UGC metadata functionality

-- Create UGC Video Metadata table
CREATE TABLE IF NOT EXISTS "ugcVideoMetadata" (
  "id" SERIAL PRIMARY KEY,
  "videoId" INTEGER NOT NULL,
  "avatarId" VARCHAR NOT NULL,
  "avatarPersonality" VARCHAR,
  "productName" VARCHAR NOT NULL,
  "productDescription" TEXT,
  "productImageUrl" VARCHAR,
  "tone" VARCHAR DEFAULT 'excited',
  "language" VARCHAR DEFAULT 'en',
  "voiceStyle" VARCHAR DEFAULT 'friendly',
  "gestures" VARCHAR[] DEFAULT '{}',
  "hasProductIntegration" BOOLEAN DEFAULT FALSE,
  "enhancementType" VARCHAR DEFAULT 'standard',
  "backgroundMusicUrl" VARCHAR,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Foreign key constraint
  CONSTRAINT "fk_ugc_video" FOREIGN KEY ("videoId") REFERENCES "videoData"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_ugc_video_id" ON "ugcVideoMetadata"("videoId");
CREATE INDEX IF NOT EXISTS "idx_ugc_avatar_id" ON "ugcVideoMetadata"("avatarId");
CREATE INDEX IF NOT EXISTS "idx_ugc_product_name" ON "ugcVideoMetadata"("productName");
CREATE INDEX IF NOT EXISTS "idx_ugc_created_at" ON "ugcVideoMetadata"("createdAt");

-- Add missing columns to existing videoData table if they don't exist
ALTER TABLE "videoData" 
ADD COLUMN IF NOT EXISTS "videoUrl" VARCHAR,
ADD COLUMN IF NOT EXISTS "thumbnailUrl" VARCHAR,
ADD COLUMN IF NOT EXISTS "status" VARCHAR DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS "tags" VARCHAR[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "category" VARCHAR,
ADD COLUMN IF NOT EXISTS "isShared" BOOLEAN DEFAULT FALSE;

-- Update existing records to have default values
UPDATE "videoData" 
SET 
  "status" = 'completed' WHERE "status" IS NULL,
  "category" = 'general' WHERE "category" IS NULL,
  "isShared" = FALSE WHERE "isShared" IS NULL;

-- Insert some sample UGC metadata for testing (optional)
-- INSERT INTO "ugcVideoMetadata" (
--   "videoId", 
--   "avatarId", 
--   "avatarPersonality", 
--   "productName", 
--   "productDescription", 
--   "tone", 
--   "language", 
--   "voiceStyle",
--   "hasProductIntegration",
--   "enhancementType"
-- ) VALUES (
--   1, 
--   'sara', 
--   'enthusiastic', 
--   'Sample Product', 
--   'This is a sample product for testing UGC metadata', 
--   'excited', 
--   'en', 
--   'friendly',
--   true,
--   'did_realistic_ugc'
-- ) ON CONFLICT DO NOTHING;

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'ugcVideoMetadata' 
ORDER BY ordinal_position;
