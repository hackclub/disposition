import { pgTable, integer, varchar, text, boolean, timestamp, jsonb, index, unique, primaryKey } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
	hcaId: varchar("hca_id", { length: 16 }).primaryKey(),
	email: varchar({ length: 255 }).notNull(),
	slackId: varchar("slack_id", { length: 16 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	yswsEligible: boolean("ysws_eligible").notNull(),
	verificationStatus: varchar("verification_status", { length: 16 }).notNull(),
},
(table) => [
	unique("users_slack_id_unique").on(table.slackId),
]);

export const rsvps = pgTable("rsvps", {
	hcaId: varchar("hca_id", { length: 16 }).primaryKey(),
	email: varchar({ length: 255 }).notNull(),
	slackId: varchar("slack_id", { length: 16 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	yswsEligible: boolean("ysws_eligible").notNull(),
	verificationStatus: varchar("verification_status", { length: 16 }).notNull(),
});

export const announcements = pgTable("announcements", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const announcementReads = pgTable("announcement_reads", {
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	announcement: integer().notNull().references(() => announcements.id),
	seenAt: timestamp("seen_at", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
(table) => [
	// the PK's leading column already covers lookups by user
	primaryKey({ columns: [table.user, table.announcement] }),
	index("fk_announcement_reads_announcements1_idx").on(table.announcement),
]);

export const balanceEvents = pgTable("balance_events", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	value: integer().notNull(),
	description: varchar({ length: 255 }).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
(table) => [
	index("fk_balance_events_users1_idx").on(table.user),
]);

export const pendingNotifications = pgTable("pending_notifications", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	read: boolean().default(false).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
(table) => [
	index("fk_pending_notifications_users1_idx").on(table.user),
]);

export const shopItems = pgTable("shop_items", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	album: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }).notNull(),
	genre: varchar({ length: 255 }).notNull(),
	image: text().notNull(),
	description: text().notNull(),
	// vinyl | cassette | cd | other
	media: varchar({ length: 45 }).notNull(),
	urls: jsonb().$type<string[]>().notNull(),
	added: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	price: integer().notNull(),
	staffPickAt: timestamp("staff_pick_at", { withTimezone: true, mode: 'date' }),
});

export const shopOrders = pgTable("shop_orders", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	item: integer().notNull().references(() => shopItems.id),
	// idle | claimed | fulfilled | cancelled
	status: varchar({ length: 64 }).default('idle').notNull(),
	message: text(),
	adminMessage: text("admin_message"),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
(table) => [
	index("fk_shop_orders_users1_idx").on(table.user),
	index("fk_shop_orders_shop_items1_idx").on(table.item),
]);

export const shopRequests = pgTable("shop_requests", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	album: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }).notNull(),
	// cd | vinyl | cassette
	media: varchar({ length: 45 }).notNull(),
	// accepted | rejected | claimed | idle
	status: varchar({ length: 24 }).default('idle').notNull(),
	message: text(),
},
(table) => [
	index("fk_shop_requests_users_idx").on(table.user),
]);
