ALTER TABLE "pending_notifications" RENAME TO "notifications";--> statement-breakpoint

-- rename the identity sequence and primary key to match what drizzle expects
ALTER SEQUENCE IF EXISTS "pending_notifications_id_seq" RENAME TO "notifications_id_seq";--> statement-breakpoint
ALTER INDEX IF EXISTS "pending_notifications_pkey" RENAME TO "notifications_pkey";--> statement-breakpoint

-- recreate the foreign key under its new name
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "pending_notifications_user_users_hca_id_fk";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_users_hca_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("hca_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- recreate the index under its new name
DROP INDEX IF EXISTS "fk_pending_notifications_users1_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_notifications_users1_idx" ON "notifications" USING btree ("user");