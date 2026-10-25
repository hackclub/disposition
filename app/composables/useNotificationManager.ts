import type { NotificationInstance, Notification } from "~/types/notification";

export const useNotificationManager = () => {
    const notifications = useState<NotificationInstance[]>("wm-notifications", () => []);

    function add(notification: Notification) {
        notifications.value.push({
            id: (Math.random() * 10000).toString(),
            ...notification,
        });
    }

    function remove(id: string) {
        notifications.value = notifications.value.filter(w => w.id !== id);
    }

    return {notifications, add, remove};
}