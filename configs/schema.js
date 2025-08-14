import { boolean, pgTable, serial, varchar, json, numeric, timestamp } from "drizzle-orm/pg-core";
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  imageUrl: varchar("imageUrl"),

  role: varchar("role").default("user"), // 'user' or 'admin'

  subscription: boolean("subscription").default(false),
  subscriptionPlan: varchar("subscriptionPlan").default("free"), // 'free', 'basic', 'pro', etc.
  subscriptionStatus: varchar("subscriptionStatus").default("inactive"), // 'active', 'inactive', etc.

  stripeCustomerId: varchar("stripeCustomerId"),
  stripeSubscriptionId: varchar("stripeSubscriptionId"),
  subscriptionStartDate: timestamp("subscriptionStartDate"),
  subscriptionEndDate: timestamp("subscriptionEndDate"),

  coins: numeric("coins").default("1000"),
  videosUsed: numeric("videosUsed").default("0"),
  videoLimit: numeric("videoLimit").default("5"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastActive: timestamp("lastActive").defaultNow().notNull()
});

export const VideoData = pgTable("videoData", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  script: json("script").notNull(),
  audioFileUrl: varchar("audioFileUrl").notNull(),
  captions: json("captions").notNull(),
  imageList: varchar("imageList").array(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  views: numeric('views').default(0),
  downloads: numeric('downloads').default(0),
  shares: numeric('shares').default(0),
  duration: numeric('duration').default(30),
  videoUrl: varchar("videoUrl"),
  thumbnailUrl: varchar("thumbnailUrl"),
  status: varchar("status").default("completed"), // processing, completed, failed
  tags: varchar("tags").array(),
  category: varchar("category"),
  isShared: boolean("isShared").default(false),
  
  // Enhanced video generation options
  topic: varchar("topic"),
  imageStyle: varchar("imageStyle"),
  language: varchar("language").default("en"),
  voiceStyle: varchar("voiceStyle"),
  voiceName: varchar("voiceName"),
  transitionStyle: varchar("transitionStyle"),
  visualEffects: json("visualEffects"), // Array of applied effects
  contentType: varchar("contentType"), // AI Story, Horror, etc.
  mood: varchar("mood"), // energetic, calm, professional
  targetAudience: varchar("targetAudience"), // general, kids, business
  backgroundColor: varchar("backgroundColor"),
  textStyle: json("textStyle"), // font, color, size settings
  musicUrl: varchar("musicUrl"),
  musicVolume: numeric("musicVolume").default(0.5),
  generationSettings: json("generationSettings") // All form settings for regeneration
});

export const VideoAnalytics = pgTable("videoAnalytics", {
  id: serial("id").primaryKey(),
  videoId: numeric('videoId').notNull(),
  action: varchar("action").notNull(), // view, download, share
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userEmail: varchar("userEmail"),
  ipAddress: varchar("ipAddress"),
  userAgent: varchar("userAgent"),
  referrer: varchar("referrer")
});

export const Templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  category: varchar("category").notNull(), // business, education, entertainment, social, marketing
  thumbnail: varchar("thumbnail"),
  previewVideo: varchar("previewVideo"),
  templateData: json("templateData").notNull(), // Contains style, format, duration settings
  isPremium: boolean("isPremium").default(false),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  usageCount: numeric('usageCount').default(0),
  rating: numeric('rating').default(0),
  tags: varchar("tags").array()
});

export const Favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userEmail: varchar("userEmail").notNull(),
  videoId: numeric("videoId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

export const UGCVideoMetadata = pgTable("ugcVideoMetadata", {
  id: serial("id").primaryKey(),
  videoId: numeric("videoId").notNull(), // FK to VideoData
  avatarId: varchar("avatarId").notNull(),
  avatarPersonality: varchar("avatarPersonality"),
  productName: varchar("productName").notNull(),
  productDescription: varchar("productDescription"),
  productImageUrl: varchar("productImageUrl"),
  tone: varchar("tone").default("excited"),
  language: varchar("language").default("en"),
  voiceStyle: varchar("voiceStyle").default("friendly"), // friendly, corporate, excited, serious
  gestures: varchar("gestures").array(), // Available gestures used
  hasProductIntegration: boolean("hasProductIntegration").default(false),
  enhancementType: varchar("enhancementType").default("standard"), // standard, realistic_ugc_style
  backgroundMusicUrl: varchar("backgroundMusicUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
