import type { Notification } from "~/types/notification";

export default defineNuxtPlugin(async () => {
    const session = await useUserSession();
    const { add } = useNotificationManager();

    const { data: announcements, refresh: refreshAnnouncements } = await useFetch<Notification[]>("/api/announcements", { key: "announcements" });
    // personal notifications need a session, so only pull them while logged in
    const { data: notifications, refresh: refreshNotifications } = await useFetch<Notification[]>("/api/notifications", {
        key: "notifications",
        immediate: session.loggedIn.value,
    });

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
            if (session.loggedIn.value) refreshNotifications();
        }, 5 * 60 * 1000);

        // logged-in state changes what announcements return, and whether notifications exist
        watch(session.loggedIn, (loggedIn) => {
            refreshAnnouncements();
            if (loggedIn) refreshNotifications();
        });
    }
})