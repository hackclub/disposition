ALTER TABLE "devlog_comments" RENAME COLUMN "tiemstamp" TO "timestamp";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "ships" ADD COLUMN "withdrawn_at" timestamp with time zone;