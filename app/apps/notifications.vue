<script setup lang="ts">
import { computed } from 'vue'
import type { Notification } from '~/types/notification'
import type { WindowInstance } from '~/types/window';
import { Markdown } from '@comark/vue';

const windowManager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, notificationId?: number, announcementId?: number }>();

const announcements = ref<Notification[]>(
    await $fetch<Notification[]>("/api/announcements?readFilter=all")
)
const notifications = ref<Notification[]>(
    await $fetch<Notification[]>("/api/notifications?readFilter=all")
)

const feed = computed(() =>
    [...announcements.value, ...notifications.value].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
)

const feedRef = ref<HTMLElement | null>(null);

onMounted(() => {
    const key = props.notificationId
        ? `notification-${props.notificationId}`
        : props.announcementId
            ? `announcement-${props.announcementId}`
            : null;
    if (!key) return;

    const target = feedRef.value?.querySelector<HTMLElement>(`[data-feed-key="${key}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
})
</script>

<template>
    <div class="notifications-app">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Disposition.png" alt="Disposition Logo" class="logo" />
                <!-- todo change to bell icon -->
                <span>
                    <h2>Notifications</h2>
                    <p>your shop order was just lost at sea! sorry...</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="notifications" ref="feedRef">
            <template v-for="notif in feed">
                <div class="notification" v-if="notif.type === 'notification'"
                    :data-feed-key="`notification-${notif.serverId}`">
                    <div class="bar">
                        <p>{{ notif.title }}</p>
                    </div>

                    <div class="notification-content">
                        <Markdown>{{ notif.description }}</Markdown>
                    </div>
                </div>
                <div class="announcement" v-else :data-feed-key="`announcement-${notif.serverId}`">
                    <div class="bar">
                        <p>{{ notif.title }}</p>
                    </div>
                    <p class="from">From <a @click="windowManager.open('profile', { id: notif.author!.id })">@{{
                        notif.author!.username }}</a></p>

                    <div class="announcement-content">
                        <Markdown>{{ notif.description }}</Markdown>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.notification-content :deep(p),
.announcement-content :deep(p) {
    margin: 0;
    white-space: pre-line;
}

.notifications-app {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.notifications-app .header {
    flex-shrink: 0;
}

.notifications {
    flex: 1;
    display: flex;
    flex-direction: column;

    justify-content: safe center;
    align-items: center;

    min-height: 0;
    overflow-y: auto;
    padding: 10px 10px 10px 10px;

    gap: 10px;
}

/* notif css */

.announcement {
    background-color: #050505BF;
    border: 2px solid #8E8F90;
    color: var(--color-white);

    display: flex;
    flex-direction: column;
    padding: 5px;

    width: 100%;
    height: fit-content;

    .from {
        margin: 0;
        padding: 5px 5px;
        color: var(--color-gray-medium);

        a:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}

.announcement-content {
    background-color: #00000051;
    border: 1px solid var(--color-white);

    padding: 5px;

    :deep(p) {
        margin: 0;
    }

    .see-more {
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;

        a {
            margin: 0;
        }

        a:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}

.notification {
    border: 2px solid var(--color-border-dark);
    background-color: var(--color-panel-bg);

    display: flex;
    flex-direction: column;
    padding: 5px;

    width: 100%;
    height: fit-content;
}

.notification-content {
    background-color: var(--color-white);
    border: 1px solid var(--color-border-dark);

    padding: 5px;

    :deep(p) {
        margin: 0;
    }

    .see-more {
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;

        a {
            margin: 0;
        }

        a:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}

.bar {
    display: flex;
    flex-direction: row;
    padding: 0 5px;
    justify-content: space-between;

    p {
        margin: 0;
        font-weight: bold;
    }

    .close {
        width: 16px;
        height: 16px;
        background-image: url("~/assets/misc/notificationClose.png");
        background-size: contain;
        border: none;
    }

    .announcement-close {
        width: 16px;
        height: 16px;
        background-image: url("~/assets/window/close.png");
        background-size: contain;
        border: none;
    }
}

/* window css */

.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem var(--color-black));
}

.header {
    display: flex;
    flex-direction: column;

    font-family: 'Joan', serif;
    user-select: none;
}

.striped-bg {
    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }
    }

    width: 100%;

    background: repeating-linear-gradient(0deg,
        var(--color-gray-light) 0px,
        var(--color-gray-light) 6px,
        var(--color-gray-medium) 6px,
        var(--color-gray-medium) 7px);
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
}
</style>