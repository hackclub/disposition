<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { Item, Order, Request } from "~/types/database";
import type { Notification } from '~/types/notification';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const session = await useUserSession();
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);
let currentTab = ref<string>("notifications");

const announcements = ref<Notification[]>([]);
const allAnnouncements = ref<Notification[]>([]);
const notifications = ref<Notification[]>([]);

const announcementAuthor = ref("");
const announcementAuthors = computed(() => {
    const authors = new Map<string, string>();
    for (const announcement of allAnnouncements.value) {
        if (announcement.author) authors.set(announcement.author.id, announcement.author.username);
    }

    return [...authors]
        .map(([id, username]) => ({ id, username }))
        .sort((a, b) => a.username.localeCompare(b.username));
});

async function loadAnnouncements() {
    const result = await $fetch<Notification[]>("/api/announcements", {
        query: { readFilter: "all", author: announcementAuthor.value || undefined }
    });

    announcements.value = result;
    if (!announcementAuthor.value) allAnnouncements.value = result;
}

if (admin) {
    await loadAnnouncements();
    notifications.value = await $fetch<Notification[]>("/api/notifications?user=all");
}

watch(announcementAuthor, loadAnnouncements);
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/notifications.png" alt="DispoAdminNotificationsThing Logo" class="logo" />
                <span>
                    <h2>DispoAdminNotifications</h2>
                    <p>super secret admin app for super secret people 🙏</p>
                </span>
            </div>

            <div class="tabs">
                <button @click="currentTab = 'notifications'">Notifications</button>
                <button @click="currentTab = 'announcements'">Announcements</button>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <div v-if="admin" class="flex">
                <div v-if="currentTab === 'notifications'">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>
                                    <button @click="manager.open('admin_add_notification')">Create notification</button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="notification in notifications" :key="notification.serverId">
                                <td>{{ notification.serverId }}</td>
                                <td>{{ notification.title }}</td>
                                <td>{{ formatTimestamp(notification.timestamp) }}</td>
                                <td><a @click="manager.open('profile', { id: notification.user!.id })">@{{
                                    notification.user!.username }}</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="currentTab === 'announcements'">
                    <div class="filter-bar">
                        <label for="announcement-author">Author</label>
                        <select id="announcement-author" v-model="announcementAuthor">
                            <option value="">All authors</option>
                            <option v-for="author in announcementAuthors" :key="author.id" :value="author.id">
                                @{{ author.username }}
                            </option>
                        </select>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Timestamp</th>
                                <th>Author</th>
                                <th>
                                    <button @click="manager.open('admin_add_announcement')">Create announcement</button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="announcement in announcements" :key="announcement.serverId">
                                <td>{{ announcement.serverId }}</td>
                                <td>{{ announcement.title }}</td>
                                <td>{{ formatTimestamp(announcement.timestamp) }}</td>
                                <td><a @click="manager.open('profile', { id: announcement.author!.id })">@{{
                                    announcement.author!.username }}</a></td>
                                <td>
                                    <button v-if="session.user.value!.id === announcement.author!.id" @click="manager.open('admin_edit_announcement', { id: announcement.serverId })">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="center">
                sorry, not admin :(
            </div>
        </div>
    </div>
</template>

<style scoped>
a {
    color: blue;
    text-decoration: underline;
}

a:hover {
    cursor: pointer;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.main {
    padding: 10px;

    min-height: 0;
    max-height: 100%;
    overflow-y: auto;
}

.flex {
    display: flex;
    flex-direction: column;
    width: 100%;

    span h1 {
        margin: 0;
    }
}

.filter-bar {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 0;
}

.tabs {
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding-left: 5px;

    button {
        background-color: var(--color-bg-light);
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;
    }
}

.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem var(--color-black));
}

.header {
    background: repeating-linear-gradient(0deg,
            var(--color-gray-light) 0px,
            var(--color-gray-light) 6px,
            var(--color-gray-medium) 6px,
            var(--color-gray-medium) 7px);

    display: flex;
    flex-direction: column;

    h2 {
        font-weight: normal;
    }

    font-family: 'Joan',
    serif;
    user-select: none;
}

.striped-bg {
    width: 100%;
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;

    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }
    }
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
}

.content {
    display: flex;
    flex-direction: column;

    height: 100%;
}
</style>