<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { ServerProject } from "~/types/database";
const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

// as an admin this comes back with every column, deleted projects and withdrawn ships included
const project = ref<ServerProject & { hackatimeProjects: string[], deletedAt: Date | null }>();
if (admin) project.value = await $fetch(`/api/projects/${props.id}`);
</script>

<template>
    <div class="content" v-if="admin && project">
        <div class="horizontal">
            <div class="vertical">
                <img v-if="project.icon" class="image" :src="`/images/${project.icon}`" alt="Project icon" />
            </div>
            <div class="vertical fields">
                <label>Title:</label>
                <p>{{ project.title }}</p>

                <label>Author:</label>
                <p>@{{ project.author.username }} ({{ project.author.hcaId }})</p>

                <label>Created:</label>
                <p>{{ formatTimestamp(project.timestamp) }}</p>

                <label v-if="project.deletedAt">Deleted:</label>
                <p v-if="project.deletedAt">{{ formatTimestamp(project.deletedAt) }}</p>

                <label>Platinum:</label>
                <p>{{ project.platinum ? "yes" : "no" }}</p>

                <label>Hackatime:</label>
                <p>{{ formatDuration(project.hackatimeSeconds) || "none / couldn't fetch" }} ({{ project.hackatimeProjects.join(", ") || "no projects linked" }})</p>

                <button @click="manager.open('profile', { id: project.author.hcaId })">Open User Profile</button>
                <button @click="manager.open('project', { id: project.id })">Open Project Page</button>
            </div>
        </div>
        <div class="vertical">
            <label>Description</label>
            <p>{{ project.description }}</p>

            <label>Repository</label>
            <a v-if="project.repository" :href="project.repository" target="_blank">{{ project.repository }}</a>
            <p v-else>none</p>

            <label>Demo</label>
            <a v-if="project.demo" :href="project.demo" target="_blank">{{ project.demo }}</a>
            <p v-else>none</p>

            <label>Banner</label>
            <img v-if="project.banner" class="banner" :src="`/images/${project.banner}`" alt="Project banner" />
            <p v-else>none</p>

            <label>Ships</label>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Withdrawn</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ship in project.ships" :key="ship.id">
                        <td>{{ ship.id }}</td>
                        <td>{{ ship.status }}</td>
                        <td>{{ formatDuration(ship.hackatimeSeconds) }}</td>
                        <td>{{ ship.withdrawnAt ? formatTimestamp(ship.withdrawnAt) : "" }}</td>
                        <td>{{ formatTimestamp(ship.timestamp) }}</td>
                        <td>
                            <button @click="manager.open('admin_ship', { projectId: project.id, id: ship.id })">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <label>Devlogs</label>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Ship</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="devlog in project.devlogs" :key="devlog.id">
                        <td>{{ devlog.id }}</td>
                        <td>{{ devlog.title }}</td>
                        <td>{{ devlog.linkedShip ?? "" }}</td>
                        <td>{{ formatTimestamp(devlog.timestamp) }}</td>
                        <td>
                            <button @click="manager.open('devlog', { projectId: project.id, id: devlog.id })">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else style="text-align: center;">
        <p>sorry, not admin :(</p>
    </div>
</template>

<style scoped>
.image {
    width: 200px;
    height: 200px;
}

.banner {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
    align-self: start;
}

.upload-div {
    display: flex;
    justify-content: end;
    align-items: end;
    width: 100%;
}

.description {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
}

.fields {
    width: 100%;
    gap: 6px !important;
    /* best css oat */
}

.horizontal {
    display: flex;
    flex-direction: row;
    gap: 3px;
}

.vertical {
    display: flex;
    flex-direction: column;

    gap: 3px;

    label {
        margin: 0;
        font-weight: bold;
    }

    p {
        margin: 0;
    }
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}
</style>
