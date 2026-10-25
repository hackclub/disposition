import type { Notification } from "~/types/notification";

export default defineNuxtPlugin(async () => {
    const {add} = useNotificationManager();
    const announcements = await $fetch<Notification>("/api/announcements");
    const notifications = await $fetch<Notification>("/api/notifications");
})