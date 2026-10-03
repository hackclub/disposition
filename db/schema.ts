import { mysqlTable, mysqlSchema, AnyMySqlColumn, char, datetime, int, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const rsvps = mysqlTable("rsvps", {
	hcaId: char("hca_id", { length: 16 }).notNull(),
	email: char({ length: 255 }).notNull(),
	slackId: char("slack_id", { length: 16 }).notNull(),
	name: char({ length: 255 }).notNull(),
	timestamp: datetime({ mode: 'string'}).default('current_timestamp()').notNull(),
	yswsEligible: tinyint("ysws_eligible").notNull(),
	verificationStatus: char("verification_status", { length: 16 }).notNull(),
});

export const shopItems = mysqlTable("shop_items", {
	id: int().notNull(),
	album: char({ length: 255 }).notNull(),
	artist: char({ length: 255 }).notNull(),
	genre: char({ length: 255 }).notNull(),
	category: char({ length: 255 }).notNull(),
	image: text().notNull(),
	description: text().notNull(),
	media: char({ length: 45 }).notNull(),
	urls: text().notNull(),
});
