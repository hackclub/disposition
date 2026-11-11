<script setup lang="ts">
import { ref } from 'vue'
import badge from '~/assets/icons/badge.png'
import defaultBanner from '~/assets/misc/banner.png'
import projectImage from '~/assets/misc/project.jpg'
import type { ServerFeed, ServerUser, ServerUserProject } from '~/types/database'
import type { WindowInstance } from '~/types/window'

const props = defineProps<{ instance: WindowInstance, id?: string }>();
const session = useUserSession();
const manager = useWindowManager();

const userId = computed(() => props.id ?? session.user.value?.id);
const { data: user } = await useFetch<ServerUser>(() => `/api/user/${userId.value}`, { immediate: !!userId.value });
const { data: feed } = await useFetch<ServerFeed>(() => `/api/user/${userId.value}/feed`, { default: () => [], immediate: !!userId.value });

// lazy because hackatime slow
const { data: projects, status: projectsStatus } = useLazyFetch<ServerUserProject[]>(() => `/api/user/${userId.value}/projects`, { default: () => [], immediate: !!userId.value });
const activeTab = ref<'projects' | 'feed'>('feed')

const isOwner = computed(() => !!userId.value && session.user.value?.id === userId.value);
const avatar = (await getUserInfo(user.value!.slackId)).imageUrl

function hoursLogged(seconds: number) {
    if (seconds < 0) return null; // no hackatime token / couldn't fetch
    return `${Math.floor(seconds / 3600)}h Logged`;
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img :src="user?.banner ? `/images/${user.banner}` : defaultBanner" alt="">

                <div class="profile-card">
                    <img class="avatar" :src="avatar" alt="">
                    <div class="profile-info">
                        <h2>{{ user?.username ?? "Unknown user" }} <img class="badge" :src="badge" alt=""></h2>
                        <p v-if="user?.bio">"{{ user.bio }}"</p>
                        <button v-if="isOwner" class="btn" @click="manager.open('profile_edit')">Edit profile</button>
                    </div>
                </div>

                <div class="tabs">
                    <button :class="{ active: activeTab === 'feed' }" @click="activeTab = 'feed'">Feed</button>
                    <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">Projects</button>
                </div>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main projects" v-if="activeTab === 'projects'">
            <h2 class="section-title">{{ user?.username ?? "User" }}'s Projects</h2>

            <p v-if="projectsStatus === 'pending'" class="empty">Loading projects...</p>
            <p v-else-if="projects.length === 0" class="empty">No projects yet!</p>

            <div v-else v-for="project in projects" :key="project.id" class="project-card">
                <img class="thumb" :src="project.icon ? `/images/${project.icon}` : projectImage" alt="">
                <div class="project-title">
                    <h3>{{ project.title }}</h3>
                    <p>By {{ user?.username }}</p>
                </div>
                <div class="project-footer">
                    <button class="btn open" @click="manager.open('project', { id: project.id })">Open</button>
                    <span v-if="hoursLogged(project.hackatimeSeconds)" class="logged">
                        {{ hoursLogged(project.hackatimeSeconds) }}
                        <img class="badge" :src="badge" alt="">
                    </span>
                </div>
            </div>
        </div>

        <div class="main feed" v-else>
            <p v-if="feed.length === 0" class="empty">Nothing here yet... no ships or devlogs!</p>

            <template v-for="item in feed" :key="`${item.type}-${item.id}`">
                <ShipCard v-if="item.type === 'ship'" :ship="item" :project="item.project" :author="user?.username" :show-author="false" />
                <DevlogCard v-else :devlog="item" :project="item.project" :author="user?.username" :show-author="false" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    font-family: 'Fira Sans', sans-serif;
    user-select: none;
}

.header {
    display: flex;
    flex-direction: column;
    font-family: 'Joan', serif;
}

.header-bg {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;

    > img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        display: block;
    }
}

.back-btn {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 30px;
    height: 30px;
    background: var(--color-white);
    border: 1px solid var(--color-gray-dark);
    font-weight: bold;
    cursor: pointer;
}

.profile-card {
    position: absolute;
    top: 8px;
    left: 40px;
    width: 330px;
    max-width: calc(100% - 48px);
    display: flex;
    gap: 12px;
    padding: 6px;
    background: var(--color-panel-bg);
    border: 1px solid var(--color-gray-medium);

    .avatar {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border: 1px solid var(--color-gray-dark);
        background: var(--color-gray-medium);
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        h2 {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 0;
            font-weight: 500;
            font-family: 'Joan', serif;
        }

        p {
            margin: 0 0 6px;
            font-size: 12px;
        }
    }
}

.badge {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
}

.tabs {
    position: absolute;
    left: 10px;
    bottom: 0;
    display: flex;
    gap: 6px;

    button {
        width: 90px;
        height: 18px;
        font-size: 12px;
        background: var(--color-bg-light);
        border-bottom: none;
        cursor: pointer;
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;

        &.active {
            background: var(--color-white);
        }
    }
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.main {
    padding: 10px;
}

.section-title {
    text-align: center;
    margin: 0 0 10px;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;

    flex-grow: 1;
}

.project-card {
    display: grid;
    grid-template-columns: 72px 1fr;
    grid-template-areas:
        "thumb title"
        "footer footer";
    gap: 6px 12px;
    padding: 10px;
    background: var(--color-panel-bg-light);
    border: 1px solid var(--color-gray-medium);

    .thumb {
        grid-area: thumb;
        width: 72px;
        height: 72px;
        object-fit: cover;
        background: var(--color-gray-medium);
    }

    .project-title {
        grid-area: title;
        text-align: center;

        h3 {
            margin: 0;
            font-size: 18px;
        }

        p {
            margin: 0;
        }
    }

    .project-footer {
        grid-area: footer;
        display: flex;
        align-items: center;
        gap: 6px;

        .open {
            flex: 1;
        }

        .logged {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            white-space: nowrap;
        }
    }
}

.projects {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .section-title {
        margin: 0;
    }

    .empty {
        text-align: center;
        margin: 0;
    }
}

/* the cards themselves live in components/devlogCard.vue + shipCard.vue */
.feed {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 14px;

    .empty {
        text-align: center;
        margin: 0;
    }
}
</style>
