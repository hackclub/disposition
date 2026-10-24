import { relations } from "drizzle-orm/relations";
import { announcements, announcementReads, users, balanceEvents, notifications, shopItems, shopOrders, shopRequests, addresses } from "./schema";

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

export const usersRelations = relations(users, ({many}) => ({
	announcementReads: many(announcementReads),
	balanceEvents: many(balanceEvents),
	notifications: many(notifications),
	shopOrders: many(shopOrders),
	shopRequests: many(shopRequests),
	addresses: many(addresses),
	announcements: many(announcements)
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
