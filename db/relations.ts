import { relations } from "drizzle-orm/relations";
import { announcements, announcementReads, users, pendingNotifications, shopRequests } from "./schema";

export const announcementReadsRelations = relations(announcementReads, ({one}) => ({
	announcement: one(announcements, {
		fields: [announcementReads.announcementsId],
		references: [announcements.id]
	}),
	user: one(users, {
		fields: [announcementReads.usersHcaId],
		references: [users.hcaId]
	}),
}));

export const announcementsRelations = relations(announcements, ({many}) => ({
	announcementReads: many(announcementReads),
}));

export const usersRelations = relations(users, ({many}) => ({
	announcementReads: many(announcementReads),
	pendingNotifications: many(pendingNotifications),
	shopRequests: many(shopRequests),
}));

export const pendingNotificationsRelations = relations(pendingNotifications, ({one}) => ({
	user: one(users, {
		fields: [pendingNotifications.usersHcaId],
		references: [users.hcaId]
	}),
}));

export const shopRequestsRelations = relations(shopRequests, ({one}) => ({
	user: one(users, {
		fields: [shopRequests.user],
		references: [users.hcaId]
	}),
}));