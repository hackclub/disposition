ALTER TABLE "rsvps" ALTER COLUMN "ysws_eligible" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "rsvps" ALTER COLUMN "verification_status" SET DEFAULT 'needs_submission';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "ysws_eligible" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "verification_status" SET DEFAULT 'needs_submission';