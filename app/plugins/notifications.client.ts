import type { Notification } from "~/types/notification";
export default defineNuxtPlugin(async () => {
    const session = await useUserSession();
    console.log(session)
    if (!session.loggedIn.value) return;
    const { add } = useNotificationManager();
    const { data: announcements } = await useFetch<Notification[]>("/api/announcements", { key: "notifications" });
    const { data: notifications } = await useFetch<Notification[]>("/api/notifications", { key: "notifications" });

    announcements.value!.forEach(add);
    notifications.value!.forEach(add);
})