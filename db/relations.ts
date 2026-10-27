import { relations } from "drizzle-orm/relations";
import { announcements, feedback, announcementReads, users, balanceEvents, notifications, shopItems, shopOrders, shopRequests, addresses, projects, ships, devlogs, projectHackatimeLinks } from "./schema";

export const announcementReadsRelations = relations(announcementReads, ({one}) => ({
	announcement: one(announcements, {
		fields: [announcementReads.announcement],
		references: [announcements.id]
	}),
	user: one(users, {
		fields: [announcementReads.user],
		references: [users.hcaId]
	}),
}));

export const addressesRelations = relations(addresses, ({one, many}) => ({
	user: one(users, {
		fields: [addresses.user],
		references: [users.hcaId]
	}),
	shopOrders: many(shopOrders),
}));

export const announcementsRelations = relations(announcements, ({one, many}) => ({
	announcementReads: many(announcementReads),
	users: one(users, {
		fields: [announcements.author],
		references: [users.hcaId]
	}),
}));

export const feedbackRelations = relations(feedback, ({one}) => ({
	users: one(users)
}))

export const usersRelations = relations(users, ({many, one}) => ({
	announcementReads: many(announcementReads),
	balanceEvents: many(balanceEvents),
	notifications: many(notifications),
	shopOrders: many(shopOrders),
	shopRequests: many(shopRequests),
	addresses: many(addresses),
	announcements: many(announcements),
	feedback: one(feedback),
	projects: many(projects),
	ships: many(ships),
	devlogs: many(devlogs),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(users, {
		fields: [projects.author],
		references: [users.hcaId]
	}),
	ships: many(ships),
	devlogs: many(devlogs),
	projectHackatimeLinks: many(projectHackatimeLinks),
}));

export const shipsRelations = relations(ships, ({one, many}) => ({
	user: one(users, {
		fields: [ships.user],
		references: [users.hcaId]
	}),
	project: one(projects, {
		fields: [ships.project],
		references: [projects.id]
	}),
	devlogs: many(devlogs),
}));

export const devlogsRelations = relations(devlogs, ({one}) => ({
	user: one(users, {
		fields: [devlogs.author],
		references: [users.hcaId]
	}),
	project: one(projects, {
		fields: [devlogs.project],
		references: [projects.id]
	}),
	ship: one(ships, {
		fields: [devlogs.linkedShip],
		references: [ships.id]
	}),
}));

export const projectHackatimeLinksRelations = relations(projectHackatimeLinks, ({one}) => ({
	project: one(projects, {
		fields: [projectHackatimeLinks.project],
		references: [projects.id]
	}),
}));

export const balanceEventsRelations = relations(balanceEvents, ({one}) => ({
	user: one(users, {
		fields: [balanceEvents.user],
		references: [users.hcaId]
	}),
}));

export const pendingNotificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.user],
		references: [users.hcaId]
	}),
}));

export const shopOrdersRelations = relations(shopOrders, ({one}) => ({
	shopItem: one(shopItems, {
		fields: [shopOrders.item],
		references: [shopItems.id]
	}),
	user: one(users, {
		fields: [shopOrders.user],
		references: [users.hcaId]
	}),
	shippingAddress: one(addresses, {
		fields: [shopOrders.shippingAddress],
		references: [addresses.id]
	}),
}));

export const shopItemsRelations = relations(shopItems, ({many}) => ({
	shopOrders: many(shopOrders),
}));

export const shopRequestsRelations = relations(shopRequests, ({one}) => ({
	user: one(users, {
		fields: [shopRequests.user],
		references: [users.hcaId]
	}),
}));
