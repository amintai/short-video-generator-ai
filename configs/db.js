import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(
  "postgresql://neondb_owner:PCGFb8oJrW5z@ep-raspy-night-a5lk6jhr.us-east-2.aws.neon.tech/ai-short-video-generator?sslmode=require"
);

export const db = drizzle(sql);
