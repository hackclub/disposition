<script setup lang="ts">
import type { NotificationInstance } from '~/types/notification';

const props = defineProps<{ notification: NotificationInstance }>();
const windowManager = useWindowManager();
const notifManager = useNotificationManager();

const maxLength = 150;
const desc = (props.notification.description.length > maxLength) ? props.notification.description.trim().substring(0, maxLength - 3).trimEnd() + "..." : props.notification.description

async function close() {
    if (props.notification.type == "notification") {
        await $fetch(`/api/notifications/${props.notification.serverId}/read`, { method: "POST" });
        notifManager.remove(props.notification.id);
    } else {
        await $fetch(`/api/announcements/${props.notification.serverId}/read`, { method: "POST" });
        notifManager.remove(props.notification.id);
    }
}

async function more() {
    await close();

    // TODO: open notif viewer
}
</script>

<template>
    <div class="notification" v-if="props.notification.type === 'notification'">
        <div class="bar">
            <p>{{ props.notification.title }}</p>
            <button class="close" @click="close"></button>
        </div>

        <div class="content">
            <p>{{ desc }}</p>
            <div class="see-more">
                <a @click="more">See more...</a>
            </div>
        </div>
    </div>
    <div class="announcement" v-else>
        <div class="bar">
            <p>{{ props.notification.title }}</p>
            <button class="announcement-close" @click="close"></button>
        </div>
        <p class="from">From <a @click="windowManager.open('profile', { id: props.notification.author!.id })">@{{
            props.notification.author!.username }}</a></p>

        <div class="announcement-content">
            <p>{{ desc }}</p>
            <div class="see-more">
                <a @click="more">See more...</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.announcement {
    background-color: #050505BF;
    border: 2px solid #8E8F90;
    color: var(--color-white);

    display: flex;
    flex-direction: column;
    padding: 5px;

    width: 400px;
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

    p {
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

    width: 400px;
    height: fit-content;
}

.content {
    background-color: var(--color-white);
    border: 1px solid var(--color-border-dark);

    padding: 5px;

    p {
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
</style>