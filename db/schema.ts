import { pgTable, numeric, integer, varchar, text, boolean, timestamp, index, unique, primaryKey, pgEnum, foreignKey, type AnyPgColumn } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
	hcaId: varchar("hca_id", { length: 16 }).primaryKey(),
	email: varchar({ length: 255 }).notNull(),
	slackId: varchar("slack_id", { length: 16 }).notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	username: text().notNull(),
	created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),

	yswsEligible: boolean("ysws_eligible").notNull(),
	verificationStatus: varchar("verification_status", { length: 16 }).notNull(),

	banner: text(),
	bio: text(),
	onboardedAt: timestamp("onboarded_at", { mode: 'date', withTimezone: true }),

	// sensitive info !!!! :scream:
	birthday: timestamp({ mode: 'string' }),
	legalFirstName: text("legal_first_name"),
	legalLastName: text("legal_last_name"),
	phoneNumber: text("phone_number"),
},
(table) => [
	unique("users_slack_id_unique").on(table.slackId),
	unique("users_username_unique").on(table.username)
]);

export const shipStatus = pgEnum("ship_status", [
	"idle",
	"claimed",
	"accepted",
	"rejected"
])

export const projects = pgTable("projects", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	author: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	title: text().notNull(),
	description: text().notNull(),

	hackatimeProjects: text("hackatime_projects").array().notNull(),

	banner: varchar({ length: 255 }),
	repository: text(),
	demo: text(),

	deletedAt: timestamp("deleted_at", { mode: 'date', withTimezone: true }),
	timestamp: timestamp("created_at", { mode: 'date', withTimezone: true }).defaultNow().notNull(),

	platinum: boolean().notNull().default(false), // super project? or not
}, (table) => [
	index("fk_projects_users1_idx").on(table.author)
]);

export const ships = pgTable("ships", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	project: integer().notNull().references(() => projects.id),

	hackatimeProjects: text("hackatime_projects").array().notNull(),
	hackatimeHours: numeric("hackatime_hours", { precision: 10, scale: 2, mode: "number" }).notNull(), // calculated when project is shipped

	status: shipStatus().notNull().default("idle"),
	statusMessage: text("status_message"), // from reviewer to user
	reviewerNote: text("reviewer_note"), // from user to reviewers

	overrideHours: numeric("override_hours", { precision: 10, scale: 2, mode: "number" }),
	overrideReason: text("override_reason"),

	internalMessage: text("internal_message"),

	ai: boolean().notNull().default(false),
	aiDeclaration: text("ai_declaration"),

	update: boolean().notNull().default(false),
	updateDeclaration: text("update_declaration"),

	timestamp: timestamp({ mode: 'date', withTimezone: true }).defaultNow().notNull()
}, (table) => [
	index("fk_ships_users1_idx").on(table.user),
	index("fk_ships_projects1_idx").on(table.project),
	unique("ships_id_project_unique").on(table.id, table.project),
]);

export const devlogs = pgTable("devlogs", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),

	project: integer().notNull().references(() => projects.id),
	linkedShip: integer("linked_ship").references(() => ships.id),
	author: varchar({ length: 16 }).notNull().references(() => users.hcaId),

	title: text().notNull(),
	description: text().notNull(),
	attachments: text().array().notNull().default([]),

	hours: numeric("hours", { precision: 10, scale: 2, mode: "number" }).default(0),

	overrideHours: numeric("override_hours", { precision: 10, scale: 2, mode: "number" }),
	overrideReason: text("override_reason")
}, (table) => [
	index("fk_devlogs_projects1_idx").on(table.project),
	index("fk_devlogs_ships1_idx").on(table.linkedShip),
	index("fk_devlogs_users1_idx").on(table.author),
	foreignKey({
		columns: [table.linkedShip, table.project],
		foreignColumns: [ships.id, ships.project],
		name: "devlogs_linked_ship_project_fk"
	}),
])

export const feedback = pgTable("feedback", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	recommend: integer().notNull(),
	well: text().notNull(),
	improve: text().notNull(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => [
	index("fk_feedback_users1_idx").on(table.user)
]);

export const addresses = pgTable("addresses", {
	id: varchar({ length: 11 }).notNull().primaryKey(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	line1: text("line_1").notNull(),
	line2: text("line2").default(""),
	city: text().notNull(),
	state: text().notNull(),
	postalCode: text("postal_code").notNull(),
	country: varchar({ length: 2 }).notNull(),
	phoneNumber: text("phone_number").notNull(),
	primary: boolean().notNull().default(false),
},
	(table) => [
		index("fk_addresses_users1_idx").on(table.user),
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
	author: varchar({ length: 16 }).references(() => users.hcaId),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
	(table) => [
		index("fk_announcements_users1_idx").on(table.author),
	]);

export const announcementReads = pgTable("announcement_reads", {
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	announcement: integer().notNull().references(() => announcements.id),
	seenAt: timestamp("seen_at", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
	(table) => [
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

export const notifications = pgTable("notifications", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	read: boolean().default(false).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
	(table) => [
		index("fk_notifications_users1_idx").on(table.user),
	]);

/////////////////////////////////////////////////////////////////
//															   //
//                    SHOP STUFF                               //
//															   //
/////////////////////////////////////////////////////////////////

export const shopItemMedia = pgEnum("shop_item_media", [
	"vinyl",
	"cassette",
	"cd",
	"other"
])

export const shopOrderStatus = pgEnum("shop_order_status", [
	"idle",
	"claimed",
	"fulfilled",
	"cancelled"
])

export const shopRequestStatus = pgEnum("shop_request_status", [
	"accepted",
	"rejected",
	"claimed",
	"idle"
])

export const shopItems = pgTable("shop_items", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	album: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }),
	genre: varchar({ length: 255 }),
	image: text().notNull(),
	description: text().notNull(),
	media: shopItemMedia().notNull(),
	urls: text().array().notNull(),
	added: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	price: integer().notNull(),
	staffPickAt: timestamp("staff_pick_at", { withTimezone: true, mode: 'date' }),
	region: varchar({ length: 2 }).array().notNull().default(["na", "sa", "eu", "af", "as", "oc"]), // all regions by default
});

export const shopOrders = pgTable("shop_orders", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	item: integer().notNull().references(() => shopItems.id),
	status: shopOrderStatus().default('idle').notNull(),
	message: text(),

	internalMessage: text("internal_message"),
	tracking: text(),
	shippingAddress: varchar({ length: 11 }).notNull().references(() => addresses.id),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
	(table) => [
		index("fk_shop_orders_users1_idx").on(table.user),
		index("fk_shop_orders_shop_items1_idx").on(table.item),
		index("fk_shop_orders_addresses1_idx").on(table.shippingAddress),
	]);

export const shopRequests = pgTable("shop_requests", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	user: varchar({ length: 16 }).notNull().references(() => users.hcaId),
	timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	album: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }).notNull(),

	media: shopItemMedia().notNull(),
	status: shopRequestStatus().default('idle').notNull(),
	message: text(),
},
	(table) => [
		index("fk_shop_requests_users_idx").on(table.user),
	]);
