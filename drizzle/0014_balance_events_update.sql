ALTER TABLE "balance_events" ADD COLUMN "author" varchar(16);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "system" boolean DEFAULT false NOT NULL;--> statement-breakpoint
INSERT INTO "users" ("hca_id", "email", "slack_id", "first_name", "last_name", "username", "ysws_eligible", "verification_status", "system") VALUES ('system', 'system@disposition.invalid', 'SYSTEM', 'System', 'User', 'system', false, 'system', true) ON CONFLICT ("hca_id") DO NOTHING;--> statement-breakpoint
ALTER TABLE "balance_events" DISABLE TRIGGER "balance_events_before_update_delete";--> statement-breakpoint
UPDATE "balance_events" SET "author" = 'system' WHERE "author" IS NULL;--> statement-breakpoint
ALTER TABLE "balance_events" ENABLE TRIGGER "balance_events_before_update_delete";--> statement-breakpoint
ALTER TABLE "balance_events" ALTER COLUMN "author" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "balance_events" ADD CONSTRAINT "balance_events_author_users_hca_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("hca_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fk_balance_events_users2_idx" ON "balance_events" USING btree ("author");