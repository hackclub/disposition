import type { Notification } from "~/types/notification";
export default defineNuxtPlugin(async () => {
    const session = await useUserSession();
    console.log(session)
    if (!session.loggedIn.value) return;
    const { add } = useNotificationManager();
    const { data: announcements } = await useFetch<Notification[]>("/api/announcements", { key: "announcements" });
    const { data: notifications } = await useFetch<Notification[]>("/api/notifications", { key: "notifications" });

    console.log(announcements.value!);
    console.log(notifications.value!);

    announcements.value!.forEach(add);
    notifications.value!.forEach(add);
})