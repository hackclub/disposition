<script setup lang="ts">
import type { ServerProject, ServerProjectFeed } from "~/types/database"
import ProjectCard from '~/components/cards/project.vue'
import Ship from '~/components/cards/ship.vue'
import Devlog from '~/components/cards/devlog.vue'

const manager = useWindowManager();
const { data: projects } = await useFetch<ServerProject[]>("/api/projects", { key: "projects" });
const { data: feed } = await useFetch<ServerProjectFeed>("/api/projects/feed");
const currentTab = ref<"projects" | "browse">("projects")
</script>

<template>
	<div class="content">
		<div class="header">
			<div class="striped-bg">
				<img src="~/assets/logos/manager.png" alt="DispoManager Logo" class="logo" />
				<span>
					<h2>DispoManager</h2>
					<p>manage your projects here :)</p>
				</span>
			</div>

			<div class="tabs">
				<button :class="{ active: currentTab === 'projects' }" @click="currentTab = 'projects'">My projects</button>
				<button :class="{ active: currentTab === 'browse' }" @click="currentTab = 'browse'">Browse feed</button>
			</div>
			<div class="spacer"></div>
		</div>


		<div class="main">
			<div class="projects-page" v-if="currentTab === 'projects'">
				<h1>Your Projects</h1>

				<div class="projects">
					<template v-if="projects && projects.length > 0">
						<ProjectCard v-for="project in projects" :key="project.id" :project="project" />
					</template>
					<p v-else class="empty">No projects yet, but you can change that :)</p>

					<button @click="manager.open('new_project')">Create a project</button>
				</div>
			</div>
			<div class="browse" v-else-if="currentTab === 'browse' && feed">
				<p v-if="feed.items.length === 0" class="empty">Nothing here yet... no ships or devlogs!</p>

				<template v-for="item in feed.items" :key="`${item.type}-${item.id}`">
					<Ship v-if="item.type === 'ship'" :ship="item" />
					<Devlog v-else :devlog="item" />
				</template>
			</div>
		</div>
	</div>
</template>

<style scoped>
.browse {
	width: 100%;
	display: flex;
	flex-direction: column;

	gap: 12px;
	padding: 14px;
	overflow-y: auto;
	background: var(--color-panel-bg);

	.empty {
		text-align: center;
		margin: 8px 0;
	}
}

.projects-page {
	max-width: 100%;
	margin: 0 0;

	flex: 1;
	min-height: 0;
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	padding: 18px;
	background: var(--color-panel-bg);
	overflow-y: auto;

	h1 {
		margin: 0 0 12px;

		text-align: center;
		font-size: 26px;
		font-weight: 700;
		padding-bottom: 5px;
	}
}

.projects {
	width: 100%;

	display: flex;
	flex-direction: column;
	gap: 12px;

	.empty {
		text-align: center;
		margin: 0;
		padding: 14px;
		background: var(--color-bg-light);
		border: 1px solid var(--color-border-light);
	}
}

.user-bar {
	margin-top: auto;
	margin: 2px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 15px;
}

.user-avatar {
	width: 28px;
	height: 28px;
	border-radius: 4px;
	background-color: var(--color-gray-medium);
}

.main {
	display: flex;
	flex-direction: column;
	gap: 10px;
	flex: 1;
	min-height: 0;
}

.buttons {
	display: flex;
	flex-direction: row;
	gap: 5px;
}

.buttons button {
	width: 100px;
}

.tabs {
	display: flex;
	flex-direction: row;
	gap: 5px;
	padding-left: 5px;

	button {
		height: 26px;
		padding: 0 12px;
		font-size: 13px;
		background-color: var(--color-bg-light);
		border: 1px solid var(--color-border-light);
		border-bottom: none;
		border-radius: 0;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;

		user-select: none;
		cursor: pointer;

		&.active {
			background: var(--color-white);
			border-color: var(--color-border-dark);
			font-weight: 700;
		}
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
	gap: 7px;

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
	min-height: 0;
}

.header {
	flex-shrink: 0;
}
</style>