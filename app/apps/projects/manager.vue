<script setup lang="ts">
import type { ServerProject } from "~/types/database"
import { Markdown } from '@comark/vue';
import { parseMarkdown } from 'comark';
import { renderMarkdown } from 'comark/render';
import { truncateComark, visibleLength } from '~/utils/index';
import badge from '~/assets/icons/badge.png'

const manager = useWindowManager();
const { data: projects } = await useFetch<ServerProject[]>("/api/projects", { key: "projects" });
function limit(source: string, max: number) {
	return source.length > max ? source.slice(0, max).trimEnd() + '...' : source
}

function formatHours(seconds: number) {
	return `${(seconds / 3600).toFixed(1)}h logged`
}

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
				<button @click="currentTab = 'projects'">My projects</button>
				<button @click="currentTab = 'browse'">Browse projects</button>
			</div>
			<div class="spacer"></div>
		</div>


		<div class="main">
			<div class="projects-page" v-if="currentTab === 'projects'">
				<h1>Your Projects</h1>

				<div class="projects">
					<div class="project" v-if="projects && projects.length > 0" v-for="(project, i) in projects" :key="i">
						<div class="project-thumb"
							:style="project.icon ? { backgroundImage: `url(/images/${project.icon})` } : {}" />
						<div class="project-main">
							<span>
								<span>
									<h2>{{ limit(project.title, project.platinum ? 18 : 20) }}</h2>
									<img v-if="project.platinum" class="logged-icon" :src="badge" alt="" />
								</span>

								<b>{{ formatHours(project.hackatimeSeconds) }}</b>
							</span>
							<p>{{ limit(project.description, 140) }}</p>
						</div>



						<div class="project-actions">
							<!-- <p>by <a @click="manager.open('profile', { id: project.author.hcaId })">@{{
								project.author.username }}</a></p> -->

							<button @click="manager.open('project', { id: project.id })">Open</button>
							<button @click="manager.open('project_edit', { id: project.id })">Edit</button>
						</div>
					</div>
					<div v-else>No projects yet, but you can change that :)</div>

					<button @click="manager.open('new_project')">Create a project</button>
				</div>
			</div>
			<div class="browse" v-else-if="currentTab === 'browse'">

			</div>
		</div>
	</div>
</template>

<style scoped>
.projects-page {
	max-width: 100%;
	margin: 0 0;

	flex: 1;
	min-height: 0;
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	padding: 16px;
	background: white;
	overflow-y: auto;

	h1 {
		margin: 0;

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
	gap: 10px;
}

.project {
	border: 1px solid var(--color-gray-medium);
	background-color: var(--color-bg-light);
	padding: 10px;

	display: grid;
	grid-template-columns: 90px 1fr;
	grid-template-areas:
		"thumb title"
		"actions actions";
	gap: 10px 14px;
	align-items: start;
}

.project-thumb {
	grid-area: thumb;
	width: 90px;
	height: 90px;
	background-color: var(--color-gray-medium);
	background-size: cover;
	background-position: center;
	border: 1px solid var(--color-gray-medium);
}

.project-main {
	grid-area: title;
	width: 100%;
	display: flex;
	flex-direction: column;

	span {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		span {
			display: flex;
			flex-direction: row;
			gap: 5px;

			h2 {
				margin: 0;
				font-size: 19px;
				font-weight: 700;
				line-height: 1.25;
			}
		}
	}

	p {
		margin: 0;
	}

	b {
		text-align: center;
		white-space: nowrap;
		flex-shrink: 0;
	}
}

.project-actions {
	grid-area: actions;
	display: flex;
	align-items: center;
	gap: 10px;

	button {
		flex: 1;
	}

	p {
		margin: 0;
	}
}

.logged-time {
	font-size: 14px;
	white-space: nowrap;
}

.logged-icon {
	width: 28px;
	height: 28px;
	object-fit: contain;
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

.tabs {
	display: flex;
	flex-direction: row;
	gap: 5px;
	padding-left: 5px;
}

.tabs button {
	background-color: var(--color-bg-light);
	border: none;
	border-radius: 0;
	user-select: none;
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