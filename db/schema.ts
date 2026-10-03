import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, char, text, datetime, index, foreignKey, timestamp, unique, tinyint, json } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const announcements = mysqlTable("announcements", {
	id: int().autoincrement().notNull(),
	title: char({ length: 255 }).notNull(),
	description: text().notNull(),
	timestamp: datetime({ mode: 'string'}).default('current_timestamp()').notNull(),
});

export const announcementReads = mysqlTable("announcement_reads", {
	usersHcaId: char("users_hca_id", { length: 16 }).notNull().references(() => users.hcaId),
	announcementsId: int("announcements_id").notNull().references(() => announcements.id),
	seenAt: timestamp("seen_at", { mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	index("fk_announcement_reads_users1_idx").on(table.usersHcaId),
	index("fk_announcement_reads_announcements1_idx").on(table.announcementsId),
]);

export const pendingNotifications = mysqlTable("pending_notifications", {
	id: int().autoincrement().notNull(),
	usersHcaId: char("users_hca_id", { length: 16 }).notNull().references(() => users.hcaId),
	title: char({ length: 255 }).notNull(),
	description: text().notNull(),
	read: tinyint().default(0).notNull(),
	timestamp: datetime({ mode: 'string'}).default('current_timestamp()').notNull(),
},
(table) => [
	index("fk_pending_notifications_users1_idx").on(table.usersHcaId),
]);

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
	id: int().autoincrement().notNull(),
	album: char({ length: 255 }).notNull(),
	artist: char({ length: 255 }).notNull(),
	genre: char({ length: 255 }).notNull(),
	category: char({ length: 255 }).notNull(),
	image: text().notNull(),
	description: text().notNull(),
	media: char({ length: 45 }).notNull(),
	urls: json("urls").$type<string[]>().notNull(),
	added: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
});

export const shopRequests = mysqlTable("shop_requests", {
	id: int().autoincrement().notNull(),
	user: char({ length: 16 }).notNull().references(() => users.hcaId),
	timestamp: datetime({ mode: 'string'}).default('current_timestamp()').notNull(),
	album: char({ length: 255 }).notNull(),
	artist: char({ length: 255 }).notNull(),
	media: char({ length: 45 }).notNull(),
},
(table) => [
	index("fk_shop_requests_users_idx").on(table.user),
]);

export const users = mysqlTable("users", {
	hcaId: char("hca_id", { length: 16 }).notNull(),
	email: char({ length: 255 }).notNull(),
	slackId: char("slack_id", { length: 16 }).notNull(),
	name: char({ length: 255 }).notNull(),
	created: datetime({ mode: 'string'}).default('current_timestamp()').notNull(),
	yswsEligible: tinyint("ysws_eligible").notNull(),
	verificationStatus: char("verification_status", { length: 16 }).notNull(),
},
(table) => [
	unique("slack_id_UNIQUE").on(table.slackId),
	unique("hca_id_UNIQUE").on(table.hcaId),
]);
