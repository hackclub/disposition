DROP TABLE "feedback" CASCADE;--> statement-breakpoint
DROP TABLE "project_hackatime_links" CASCADE;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hackatime_projects" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hackatime_token" text;