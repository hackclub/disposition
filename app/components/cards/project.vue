<script setup lang="ts">
import badge from '~/assets/icons/badge.png'
import type { ServerProject } from '~/types/database'

const props = defineProps<{ project: ServerProject }>();

const manager = useWindowManager();
const session = useUserSession();

const isAuthor = computed(() => session.user.value?.id === props.project.author.hcaId);

function limit(source: string, max: number) {
	return source.length > max ? source.slice(0, max).trimEnd() + '...' : source
}
</script>

<template>
	<div class="project">
		<div class="project-thumb"
			:style="project.icon ? { backgroundImage: `url(/images/${project.icon})` } : {}" />
		<div class="project-main">
			<span>
				<span>
					<h2>{{ limit(project.title, project.platinum ? 18 : 20) }}</h2>
					<img v-if="project.platinum" class="logged-icon" :src="badge" alt="" />
				</span>

				<b>{{ (project.hackatimeSeconds / 3600).toFixed(1) }}h logged</b>
			</span>
			<p>{{ limit(project.description, 140) }}</p>
		</div>

		<div class="project-actions">
			<button @click="manager.open('project', { id: project.id })">Open</button>
			<button v-if="isAuthor" @click="manager.open('edit_project', { id: project.id })">Edit</button>
		</div>
	</div>
</template>

<style scoped>
.project {
	border: 1px solid var(--color-gray-medium);
	background-color: var(--color-bg-light);
	padding: 10px;

	display: grid;
	grid-template-columns: 90px minmax(0, 1fr);
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
	min-width: 0;
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
			min-width: 0;

			h2 {
				margin: 0;
				overflow-wrap: anywhere;
				font-size: 19px;
				font-weight: 700;
				line-height: 1.25;
			}
		}
	}

	p {
		margin: 0;
		overflow-wrap: anywhere;
	}

	b {
		text-align: center;
		/*white-space: nowrap;*/
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

}

.logged-icon {
	width: 28px;
	height: 28px;
	object-fit: contain;
}
</style>
