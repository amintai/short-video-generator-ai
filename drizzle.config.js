import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:PCGFb8oJrW5z@ep-raspy-night-a5lk6jhr.us-east-2.aws.neon.tech/ai-short-video-generator?sslmode=require",
  },
});
