-- Migration script for Short Video Generator AI
-- This script adds new columns and tables for enhanced features

-- 1. Add new columns to Users table for subscription management
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "subscriptionPlan" VARCHAR DEFAULT 'free',
ADD COLUMN IF NOT EXISTS "subscriptionStatus" VARCHAR DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS "stripeCustomerId" VARCHAR,
ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" VARCHAR,
ADD COLUMN IF NOT EXISTS "subscriptionStartDate" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "subscriptionEndDate" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "videosUsed" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "videoLimit" NUMERIC DEFAULT 5;

-- 2. Add new columns to VideoData table for analytics and enhanced features
ALTER TABLE "videoData" 
ADD COLUMN IF NOT EXISTS "views" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "downloads" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "shares" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "duration" NUMERIC DEFAULT 30,
ADD COLUMN IF NOT EXISTS "videoUrl" VARCHAR,
ADD COLUMN IF NOT EXISTS "thumbnailUrl" VARCHAR,
ADD COLUMN IF NOT EXISTS "status" VARCHAR DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS "tags" VARCHAR[],
ADD COLUMN IF NOT EXISTS "category" VARCHAR;

-- 3. Create VideoAnalytics table for tracking video interactions
CREATE TABLE IF NOT EXISTS "videoAnalytics" (
    "id" SERIAL PRIMARY KEY,
    "videoId" NUMERIC NOT NULL,
    "action" VARCHAR NOT NULL,
    "timestamp" TIMESTAMP DEFAULT NOW() NOT NULL,
    "userEmail" VARCHAR,
    "ipAddress" VARCHAR,
    "userAgent" VARCHAR,
    "referrer" VARCHAR
);

-- 4. Create Templates table for video templates
CREATE TABLE IF NOT EXISTS "templates" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "category" VARCHAR NOT NULL,
    "thumbnail" VARCHAR,
    "previewVideo" VARCHAR,
    "templateData" JSON NOT NULL,
    "isPremium" BOOLEAN DEFAULT false,
    "createdBy" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "usageCount" NUMERIC DEFAULT 0,
    "rating" NUMERIC DEFAULT 0,
    "tags" VARCHAR[]
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON users("email");
CREATE INDEX IF NOT EXISTS "idx_users_stripe_customer" ON users("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "idx_users_stripe_subscription" ON users("stripeSubscriptionId");

CREATE INDEX IF NOT EXISTS "idx_videodata_created_by" ON "videoData"("createdBy");
CREATE INDEX IF NOT EXISTS "idx_videodata_created_at" ON "videoData"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_videodata_status" ON "videoData"("status");

CREATE INDEX IF NOT EXISTS "idx_analytics_video_id" ON "videoAnalytics"("videoId");
CREATE INDEX IF NOT EXISTS "idx_analytics_action" ON "videoAnalytics"("action");
CREATE INDEX IF NOT EXISTS "idx_analytics_timestamp" ON "videoAnalytics"("timestamp");

CREATE INDEX IF NOT EXISTS "idx_templates_category" ON "templates"("category");
CREATE INDEX IF NOT EXISTS "idx_templates_is_premium" ON "templates"("isPremium");
CREATE INDEX IF NOT EXISTS "idx_templates_created_by" ON "templates"("createdBy");

-- 6. Add foreign key constraints
ALTER TABLE "videoAnalytics" 
ADD CONSTRAINT IF NOT EXISTS "fk_analytics_video" 
FOREIGN KEY ("videoId") REFERENCES "videoData"("id") ON DELETE CASCADE;

-- 7. Insert some sample templates (optional)
INSERT INTO "templates" ("name", "description", "category", "thumbnail", "templateData", "isPremium", "createdBy", "tags") 
VALUES 
    ('Marketing Promotion', 'Perfect for promoting your product or service with engaging visuals', 'marketing', '/realistic.jpeg', '{"style": "modern", "duration": 30, "format": "1080p"}', true, 'system', ARRAY['marketing', 'promotion', 'business']),
    ('Educational Tutorial', 'Great for explaining concepts and creating educational content', 'education', '/real.jpg', '{"style": "clean", "duration": 60, "format": "1080p"}', false, 'system', ARRAY['education', 'tutorial', 'learning']),
    ('Social Media Story', 'Ideal for eye-catching content on social platforms', 'social', '/comic.jpeg', '{"style": "trendy", "duration": 15, "format": "1080p"}', false, 'system', ARRAY['social', 'story', 'viral']),
    ('Business Overview', 'Showcase your company strengths and key values', 'business', '/fantasy.jpg', '{"style": "professional", "duration": 45, "format": "1080p"}', true, 'system', ARRAY['business', 'corporate', 'overview'])
ON CONFLICT DO NOTHING;

-- 8. Update existing users to have default subscription values
UPDATE users 
SET 
    "subscriptionPlan" = 'free',
    "subscriptionStatus" = 'inactive',
    "videosUsed" = 0,
    "videoLimit" = 5
WHERE "subscriptionPlan" IS NULL;

-- 9. Update existing videos to have default analytics values
UPDATE "videoData" 
SET 
    "views" = 0,
    "downloads" = 0,
    "shares" = 0,
    "duration" = 30,
    "status" = 'completed'
WHERE "views" IS NULL;

-- Migration completed successfully!
