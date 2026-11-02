import type { Notification } from "~/types/notification";

export default defineNuxtPlugin(async () => {
    const session = await useUserSession();
    if (!session.loggedIn.value) return;

    const { add } = useNotificationManager();

    const { data: announcements, refresh: refreshAnnouncements } = await useFetch<Notification[]>("/api/announcements", { key: "announcements" });
    const { data: notifications, refresh: refreshNotifications } = await useFetch<Notification[]>("/api/notifications", { key: "notifications" });

    const seen = new Set<string | number>();

    const addNew = (list?: Notification[] | null) => {
        list?.forEach((n) => {
            if (seen.has(n.serverId)) return;
            seen.add(n.serverId);
            add(n);
        });
    };

    // initial load
    addNew(announcements.value);
    addNew(notifications.value);

    // every time the data is refreshed
    watch(announcements, addNew);
    watch(notifications, addNew);

    // refresh announcements every 5 minutes (client only)
    if (import.meta.client) {
        const interval = setInterval(() => {
            if (document.hidden) return; // skip while the tab is in the background
            refreshAnnouncements();
            refreshNotifications();
        }, 5 * 60 * 1000);

        // stop polling if the user logs out
        watch(session.loggedIn, (loggedIn) => {
            if (!loggedIn) clearInterval(interval);
        });
    }
})