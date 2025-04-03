CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"imageUrl" varchar,
	"subscription" boolean DEFAULT false,
	"coins" numeric DEFAULT 1000
);
--> statement-breakpoint
CREATE TABLE "videoData" (
	"id" serial PRIMARY KEY NOT NULL,
	"script" json NOT NULL,
	"audioFileUrl" varchar NOT NULL,
	"captions" json NOT NULL,
	"imageList" varchar[],
	"createdBy" varchar NOT NULL
);
