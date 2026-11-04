CREATE TYPE "public"."verification_status" AS ENUM('needs_submission', 'pending', 'verified', 'ineligible');--> statement-breakpoint
ALTER TABLE "ships" RENAME COLUMN "hackatime_hours" TO "hackatime_seconds";--> statement-breakpoint
ALTER TABLE "ships" RENAME COLUMN "override_hours" TO "override_seconds";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "verification_status" SET DATA TYPE "public"."verification_status" USING "verification_status"::"public"."verification_status";--> statement-breakpoint
ALTER TABLE "devlogs" ADD COLUMN "timestamp" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "devlogs" DROP COLUMN "hours";--> statement-breakpoint
ALTER TABLE "devlogs" DROP COLUMN "override_hours";--> statement-breakpoint
ALTER TABLE "devlogs" DROP COLUMN "override_reason";