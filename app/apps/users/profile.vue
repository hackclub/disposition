<script setup lang="ts">
import { ref } from 'vue'
import badge from '~/assets/icons/badge.png'
import defaultBanner from '~/assets/misc/banner.png'
import projectImage from '~/assets/misc/project.jpg'
import Ship from '~/components/cards/ship.vue'
import type { ServerFeed, ServerProject, ServerUser } from '~/types/database'
import type { WindowInstance } from '~/types/window'
import Devlog from '~/components/cards/devlog.vue'
import Project from '~/components/cards/project.vue'

const props = defineProps<{ instance: WindowInstance, id?: string }>();
const session = useUserSession();
const manager = useWindowManager();

const userId = computed(() => props.id ?? session.user.value?.id);
const { data: user } = await useFetch<ServerUser>(() => `/api/user/${userId.value}`, { immediate: !!userId.value });
const { data: feed } = await useFetch<ServerFeed>(() => `/api/user/${userId.value}/feed`, { default: () => [], immediate: !!userId.value });

// lazy because hackatime slow
const { data: projects, status: projectsStatus } = useLazyFetch<ServerProject[]>(() => `/api/user/${userId.value}/projects`, { default: () => [], immediate: !!userId.value });
const activeTab = ref<'projects' | 'feed'>('feed')

const isOwner = computed(() => !!userId.value && session.user.value?.id === userId.value);
const avatar = (await getUserInfo(user.value!.slackId)).imageUrl

function openSlack() {
    if (user.value?.slackId) window.open(`https://hackclub.slack.com/team/${user.value.slackId}`, '_blank', 'noopener');
}

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
                        <h2>{{ user?.username ?? "Unknown user" }}</h2>
                        <p v-if="user?.bio">"{{ user.bio }}"</p>
                        <button v-if="user?.slackId" class="btn" @click="openSlack">Slack profile</button>
                        <button v-if="isOwner" class="btn" @click="manager.open('edit_profile')">Edit profile</button>
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

            <Project v-for="project in projects" :project="project"></Project>
        </div>

        <div class="main feed" v-else>
            <p v-if="feed.length === 0" class="empty">Nothing here yet... no ships or devlogs!</p>

            <template v-for="item in feed" :key="`${item.type}-${item.id}`">
                <Ship v-if="item.type === 'ship'" :ship="item" :show-author="false" />
                <Devlog v-else :devlog="item" :show-author="false" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    font-family: 'Fira Sans', sans-serif;
    user-select: none;
}

.header {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    font-family: 'Joan', serif;
}

.header-bg {
	position: relative;
	width: 100%;
	min-height: 150px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	> img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		z-index: 0;
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
	position: relative;
	z-index: 1;
	margin: 8px 8px 12px;
	width: fit-content;
	max-width: calc(100% - 16px);

	display: flex;
	gap: 12px;
	padding: 6px;
	background: var(--color-panel-bg);
	border: 2px solid var(--color-border-dark);
	box-shadow: 4px 4px 0 var(--color-shadow-dark);

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
        gap: 4px;

        h2 {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 0;
            font-weight: 500;
            font-family: 'Joan', serif;
        }

        p {
            margin: 0 0 4px;
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
	position: relative;
	z-index: 1;
	display: flex;
	gap: 8px;
	padding: 4px 10px 0;
	background: var(--color-panel-bg);
	border-top: 1px solid var(--color-border-dark);
	border-bottom: 1px solid var(--color-border-light);

	button {
		width: 90px;
		height: 22px;
		font-size: 12px;
		background: var(--color-bg-light);
		cursor: pointer;
		border: 1px solid var(--color-border-light);
		border-bottom: none;
		border-radius: 5px 5px 0 0;
		user-select: none;

		&.active {
			background: var(--color-white);
			border-color: var(--color-border-dark);
			font-weight: 700;
			position: relative;
			margin-bottom: -1px;
			height: 23px;
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
    padding: 14px 16px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background: var(--color-panel-bg);
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

.projects {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    .section-title {
        margin: 0;
    }

    .empty {
        text-align: center;
        margin: 0;
    }
}

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
