ALTER TABLE "ships" ADD COLUMN "description" text NOT NULL DEFAULT 'No description provided.';--> statement-breakpoint
ALTER TABLE "ships" ALTER COLUMN "description" DROP DEFAULT;
