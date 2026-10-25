import type { Notification } from "~/types/notification";



export default defineNuxtPlugin(async () => {
    const session = await useUserSession();
    if(!session.loggedIn) return;
    const {add} = useNotificationManager();
    const announcements = await $fetch<Notification>("/api/announcements");
    const notifications = await $fetch<Notification>("/api/notifications");
})