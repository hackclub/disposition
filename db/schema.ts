import { mysqlTable, int, char, text, datetime, index, timestamp, unique, tinyint, primaryKey } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const announcements = mysqlTable("announcements", {
	id: int().autoincrement().primaryKey(),
	title: char({ length: 255 }).notNull(),
	description: text().notNull(),
	timestamp: datetime({ mode: 'string'}).default(sql`current_timestamp()`).notNull(),
});

export const announcementReads = mysqlTable("announcement_reads", {
	user: char({ length: 16 }).notNull().references(() => users.hcaId),
	announcement: int().notNull().references(() => announcements.id),
	seenAt: timestamp("seen_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.user, table.announcement] }),
	index("fk_announcement_reads_users1_idx").on(table.user),
	index("fk_announcement_reads_announcements1_idx").on(table.announcement),
]);

export const balanceEvents = mysqlTable("balance_events", {
	id: int().autoincrement().primaryKey(),
	user: char({ length: 16 }).notNull().references(() => users.hcaId),
	value: int().notNull(),
	description: char({ length: 255 }).notNull(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("fk_balance_events_users1_idx").on(table.user),
]);

export const pendingNotifications = mysqlTable("pending_notifications", {
	id: int().autoincrement().primaryKey(),
	user: char({ length: 16 }).notNull().references(() => users.hcaId),
	title: char({ length: 255 }).notNull(),
	description: text().notNull(),
	read: tinyint().default(0).notNull(),
	timestamp: datetime({ mode: 'string'}).default(sql`current_timestamp()`).notNull(),
},
(table) => [
	index("fk_pending_notifications_users1_idx").on(table.user),
]);

export const rsvps = mysqlTable("rsvps", {
	hcaId: char("hca_id", { length: 16 }).primaryKey(),
	email: char({ length: 255 }).notNull(),
	slackId: char("slack_id", { length: 16 }).notNull(),
	name: char({ length: 255 }).notNull(),
	timestamp: datetime({ mode: 'string'}).default(sql`current_timestamp()`).notNull(),
	yswsEligible: tinyint("ysws_eligible").notNull(),
	verificationStatus: char("verification_status", { length: 16 }).notNull(),
});

export const shopItems = mysqlTable("shop_items", {
	id: int().autoincrement().primaryKey(),
	album: char({ length: 255 }).notNull(),
	artist: char({ length: 255 }).notNull(),
	genre: char({ length: 255 }).notNull(),
	image: text().notNull(),
	description: text().notNull(),
	media: char({ length: 45 }).notNull(),
	urls: text().notNull(),
	added: timestamp({ mode: 'string' }).defaultNow().notNull(),
	price: int().notNull(),
	staffPickAt: timestamp("staff_pick_at", { mode: 'string' }),
});

export const shopOrders = mysqlTable("shop_orders", {
	id: int().autoincrement().primaryKey(),
	user: char({ length: 16 }).notNull().references(() => users.hcaId),
	item: int().notNull().references(() => shopItems.id),
	status: char({ length: 64 }).default('idle').notNull(),
	message: text(),
	adminMessage: text("admin_message"),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("fk_shop_orders_users1_idx").on(table.user),
	index("fk_shop_orders_shop_items1_idx").on(table.item),
]);

export const shopRequests = mysqlTable("shop_requests", {
	id: int().autoincrement().primaryKey(),
	user: char({ length: 16 }).notNull().references(() => users.hcaId),
	timestamp: datetime({ mode: 'string'}).default(sql`current_timestamp()`).notNull(),
	album: char({ length: 255 }).notNull(),
	artist: char({ length: 255 }).notNull(),
	media: char({ length: 45 }).notNull(),
	status: char({ length: 24 }).default('idle').notNull(),
	message: text(),
},
(table) => [
	index("fk_shop_requests_users_idx").on(table.user),
]);

export const users = mysqlTable("users", {
	hcaId: char("hca_id", { length: 16 }).primaryKey(),
	email: char({ length: 255 }).notNull(),
	slackId: char("slack_id", { length: 16 }).notNull(),
	name: char({ length: 255 }).notNull(),
	created: datetime({ mode: 'string'}).default(sql`current_timestamp()`).notNull(),
	yswsEligible: tinyint("ysws_eligible").notNull(),
	verificationStatus: char("verification_status", { length: 16 }).notNull(),
},
(table) => [
	unique("slack_id_UNIQUE").on(table.slackId),
	unique("hca_id_UNIQUE").on(table.hcaId),
]);
