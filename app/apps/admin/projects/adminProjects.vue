<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { AdminProjectRow, AdminShipRow, AdminDevlogRow } from "~/types/database";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);
let currentTab = ref<string>("projects");

const projects = ref<AdminProjectRow[]>([]);
const ships = ref<AdminShipRow[]>([]);
const devlogs = ref<AdminDevlogRow[]>([]);

const shipStatus = ref("");
const shipWithdrawn = ref("");

async function loadShips() {
    ships.value = await $fetch<AdminShipRow[]>("/api/ships", {
        query: { status: shipStatus.value || undefined, withdrawn: shipWithdrawn.value || undefined }
    });
}

if (admin) {
    await Promise.all([
        $fetch<AdminProjectRow[]>("/api/projects", { query: { user: "all" } }).then(r => projects.value = r),
        $fetch<AdminDevlogRow[]>("/api/devlogs").then(r => devlogs.value = r),
        loadShips(),
    ]);
}

watch([shipStatus, shipWithdrawn], loadShips);
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/manager.png" alt="DispoAdminProjectThing Logo" class="logo" />
                <span>
                    <h2>DispoAdminProjectThing</h2>
                    <p>super secret admin app for super secret people 🙏</p>
                </span>
            </div>

            <div class="tabs">
                <button @click="currentTab = 'projects'">Projects</button>
                <button @click="currentTab = 'ships'">Ships</button>
                <button @click="currentTab = 'devlogs'">Devlogs</button>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <AuthState v-slot="{ loggedIn, user }">
                <div v-if="loggedIn && user && user.slackId && $config.public.adminIds.includes(user.slackId)" class="flex">
                    <div v-if="currentTab === 'projects'">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Platinum</th>
                                    <th>Deleted</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="project in projects" :key="project.id">
                                    <td><a @click="manager.open('project', { id: project.id })">{{ project.id }}</a></td>
                                    <td>{{ project.title }}</td>
                                    <td><a @click="manager.open('profile', { id: project.author.hcaId })">@{{ project.author.username }}</a></td>
                                    <td>{{ project.platinum ? "yes" : "" }}</td>
                                    <td>{{ project.deletedAt ? formatTimestamp(project.deletedAt) : "" }}</td>
                                    <td>{{ formatTimestamp(project.timestamp) }}</td>
                                    <td>
                                        <button @click="manager.open('admin_project', { id: project.id })">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="currentTab === 'ships'">
                        <div class="filter-bar">
                            <label for="ship-status">Status</label>
                            <select id="ship-status" v-model="shipStatus">
                                <option value="">All statuses</option>
                                <option value="idle">Idle</option>
                                <option value="claimed">Claimed</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <label for="ship-withdrawn">Withdrawn</label>
                            <select id="ship-withdrawn" v-model="shipWithdrawn">
                                <option value="">Hide withdrawn</option>
                                <option value="include">Show withdrawn</option>
                                <option value="only">Only withdrawn</option>
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project</th>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th>Update</th>
                                    <th>Withdrawn</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ship in ships" :key="ship.id">
                                    <td>{{ ship.id }}</td>
                                    <td><a @click="manager.open('admin_project', { id: ship.project.id })">{{ ship.project.title }}</a></td>
                                    <td><a @click="manager.open('profile', { id: ship.user.hcaId })">@{{ ship.user.username }}</a></td>
                                    <td>{{ ship.status }}</td>
                                    <td>{{ formatDuration(ship.hackatimeSeconds) }}</td>
                                    <td>{{ ship.update ? "yes" : "" }}</td>
                                    <td>{{ ship.withdrawnAt ? formatTimestamp(ship.withdrawnAt) : "" }}</td>
                                    <td>{{ formatTimestamp(ship.timestamp) }}</td>
                                    <td>
                                        <button @click="manager.open('admin_ship', { projectId: ship.project.id, id: ship.id })">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="currentTab === 'devlogs'">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Project</th>
                                    <th>User</th>
                                    <th>Ship</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="devlog in devlogs" :key="devlog.id">
                                    <td><a @click="manager.open('devlog', { projectId: devlog.project.id, id: devlog.id })">{{ devlog.id }}</a></td>
                                    <td>{{ devlog.title }}</td>
                                    <td><a @click="manager.open('admin_project', { id: devlog.project.id })">{{ devlog.project.title }}</a></td>
                                    <td><a @click="manager.open('profile', { id: devlog.user.hcaId })">@{{ devlog.user.username }}</a></td>
                                    <td>
                                        <a v-if="devlog.linkedShip" @click="manager.open('admin_ship', { projectId: devlog.project.id, id: devlog.linkedShip })">{{ devlog.linkedShip }}</a>
                                    </td>
                                    <td>{{ formatTimestamp(devlog.timestamp) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-else class="center">
                    sorry, not admin :(
                </div>
            </AuthState>
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