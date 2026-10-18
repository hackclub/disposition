CREATE TABLE "addresses" (
	"id" varchar(11) PRIMARY KEY NOT NULL,
	"user" varchar(16) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"line_1" text NOT NULL,
	"line2" text DEFAULT '',
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" varchar(2) NOT NULL,
	"phone_number" text NOT NULL,
	"primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banner" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_users_hca_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("hca_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fk_addresses_users1_idx" ON "addresses" USING btree ("user");