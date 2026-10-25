import type { Notification } from "~/types/notification";
export default defineNuxtPlugin(async () => {
    const session = await useUserSession();
    console.log(session)
    if(!session.loggedIn.value) return;
    const {add} = useNotificationManager();
    const announcements = await $fetch<Notification[]>("/api/announcements");
    const notifications = await $fetch<Notification[]>("/api/notifications");

    announcements.forEach(add);
    notifications.forEach(add);
})