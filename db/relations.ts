import { relations } from "drizzle-orm/relations";
import { announcements, announcementReads, users, balanceEvents, pendingNotifications, shopItems, shopOrders, shopRequests } from "./schema";

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

export const announcementsRelations = relations(announcements, ({many}) => ({
	announcementReads: many(announcementReads),
}));

export const usersRelations = relations(users, ({many}) => ({
	announcementReads: many(announcementReads),
	balanceEvents: many(balanceEvents),
	pendingNotifications: many(pendingNotifications),
	shopOrders: many(shopOrders),
	shopRequests: many(shopRequests),
}));

export const balanceEventsRelations = relations(balanceEvents, ({one}) => ({
	user: one(users, {
		fields: [balanceEvents.user],
		references: [users.hcaId]
	}),
}));

export const pendingNotificationsRelations = relations(pendingNotifications, ({one}) => ({
	user: one(users, {
		fields: [pendingNotifications.user],
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
