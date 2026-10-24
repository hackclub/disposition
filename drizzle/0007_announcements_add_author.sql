ALTER TABLE "announcements" ADD COLUMN "author" varchar(16);--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_users_hca_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("hca_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fk_announcements_users1_idx" ON "announcements" USING btree ("author");