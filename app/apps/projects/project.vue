<script setup lang="ts">
import { Markdown } from '@comark/vue'
import projectImage from '~/assets/misc/project.jpg'
import badge from '~/assets/icons/badge.png'
import type { ServerProject } from '~/types/database'
import type { WindowInstance } from '~/types/window'
import Ship from '~/components/cards/ship.vue'
import Devlog from '~/components/cards/devlog.vue'

const props = defineProps<{ instance: WindowInstance, id: number }>();
const manager = useWindowManager();
const session = useUserSession();
const { data: project } = await useFetch<ServerProject>(`/api/projects/${props.id}`);

const timeline = computed(() => {
    if (!project.value) return [];
    const { author } = project.value;
    return [
        ...project.value.ships.map(ship => ({ type: 'ship' as const, item: { ...ship, project: project.value!, author } })),
        ...project.value.devlogs.map(devlog => ({ type: 'devlog' as const, item: { ...devlog, project: project.value!, author } })),
    ].sort((a, b) => new Date(b.item.timestamp).getTime() - new Date(a.item.timestamp).getTime());
});

const isAuthor = computed(() => !!project.value && session.user.value?.id === project.value.author.hcaId);

function link(url: string) {
    window.open(url, '_blank', 'noopener');
}
</script>

<template>
    <div class="content" v-if="project">
        <div class="header">
            <div class="header-bg">
                <img v-if="project.banner" class="banner" :src="`/images/${project.banner}`" alt="">
                <div class="project-card">
                    <img class="avatar" :src="project.icon ? `/images/${project.icon}` : projectImage" alt="">
                    <div class="profile-info">
                        <h2>{{ project.title }} <img v-if="project.platinum" class="badge" :src="badge" alt=""></h2>
                        <p>By <a class="author-link" @click="manager.open('profile', { id: project.author.hcaId })">@{{
                            project.author.username }}</a></p>
                    </div>
                </div>
            </div>

        </div>
        <div class="spacer"></div>

        <div class="about-page">
            <h2 class="heading">About</h2>

            <div class="panel about">
                <div class="about-text">
                    <Markdown>{{ project.description }}</Markdown>
                </div>
                <div v-if="project.repository || project.demo" class="links">
                    <button v-if="project.repository" @click="link(project.repository)">GitHub repo</button>
                    <button v-if="project.demo" @click="link(project.demo)">Demo</button>
                    <button v-if="session.user.value?.id === project.author.hcaId" @click="manager.open('edit_project', { id: project.id })">Edit</button>
                </div>
            </div>

            <h2 class="heading">Devlogs</h2>

            <div v-if="isAuthor" class="actions">
                <button @click="manager.open('new_devlog', { id: project.id })">Add devlog</button>
                <button @click="manager.open('ship', { id: project.id })">Ship</button>
            </div>

            <div class="devlogs">
                <p v-if="timeline.length === 0" class="empty">No devlogs or ships yet!</p>
                <template v-for="entry in timeline" :key="`${entry.type}-${entry.item.id}`">
                    <Ship v-if="entry.type === 'ship'" :ship="entry.item" :show-project="false" :show-open="false"
                        see-more="expand" />
                    <Devlog v-else :devlog="entry.item" :show-project="false" see-more="expand" />
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    flex-direction: column;
    font-family: 'Joan', serif;
}

.header-bg {
    position: relative;
    width: 100%;
    height: 110px;
    overflow: hidden;

    .banner {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        display: block;
    }
}

.project-card {
    height: 80px;
    position: absolute;
    top: 8px;
    left: 8px;
    width: fit-content;

    display: flex;
    gap: 12px;
    padding: 6px;
    justify-content: center;
    align-items: center;

    background: var(--color-panel-bg);
    border: 1px solid var(--color-gray-medium);

    .avatar {
        width: 70px;
        height: 70px;
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
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.about-page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 4px 13px 14px;
    overflow-y: auto;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 15px;
    user-select: none;
}

.heading {
    flex-shrink: 0;
    margin: 0 0 6px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Inter', 'Fira Sans', sans-serif;
}

.panel {
    box-sizing: border-box;
    flex-shrink: 0;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-light);
}

.about {
    margin-bottom: 8px;
    padding: 8px;

}

.about-text {
    margin-top: 2px;
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.25;
}

.links {
    display: flex;
    gap: 8px;

    button {
        flex: 1;
    }
}

.actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    margin-bottom: 8px;

    button {
        flex: 1;
    }
}

.devlogs {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .empty {
        text-align: center;
        margin: 0;
    }
}

.author-link {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.about-text :deep(p) {
    margin: 0;
    white-space: pre-line;
}
</style>
