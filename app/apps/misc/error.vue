<script setup lang="ts">
import type {WindowInstance} from '~/types/window';
import errorIcon from '~/assets/icons/error.png';

const dev = import.meta.dev;
const reload = () => window.location.reload();
const manager = useWindowManager();

const props = defineProps<{
	instance: WindowInstance,
	title?: string,
	message?: string,
	statusCode?: number,
	details?: string
}>();
</script>

<template>
	<div class="error-app">
		<div class="dialog">
			<img class="icon" :src="errorIcon" alt="">

			<div class="content">
				<h1>{{ props.title ?? "Something went wrong" }}</h1>
				<span v-if="props.statusCode" class="code">{{ props.statusCode }}</span>

				<p class="message">{{ props.message ?? "An unexpected error occurred." }}</p>

				<pre v-if="props.details" class="details">{{ props.details }}</pre>

				<div class="actions">
					<button v-if="dev" @click="manager.close(props.instance.id)">
						Dismiss
					</button>

					<button @click="reload">
						Restart
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.error-app {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 48px;

	display: flex;
	align-items: center;
	justify-content: center;

	background: repeating-linear-gradient(0deg,
	var(--color-gray-light) 0px,
	var(--color-gray-light) 6px,
	var(--color-gray-medium) 6px,
	var(--color-gray-medium) 7px);
}

.dialog {
	display: flex;
	align-items: flex-start;
	gap: 18px;
	box-sizing: border-box;
	width: min(620px, 100%);
	max-height: 100%;
	padding: 24px;

	background: var(--color-panel-bg);
	border: 2px solid var(--color-border-dark);
	box-shadow: 5px 5px 0 var(--color-shadow-dark);

	font-family: 'Fira Sans', sans-serif;
	user-select: none;
}

.icon {
	flex-shrink: 0;
	width: 64px;
	height: 64px;
	object-fit: contain;
}

.content {
	display: flex;
	flex-direction: column;
	gap: 10px;
	min-width: 0;
	flex: 1;
}

h1 {
	margin: 0;
	font-size: 24px;
	line-height: 1.2;
}

.code {
	font-size: 12px;
	color: var(--color-gray-dark);
}

.message {
	margin: 0;
	font-size: 16px;
	line-height: 1.35;
	overflow-wrap: anywhere;
}

.details {
	margin: 0;
	max-height: 240px;
	overflow: auto;
	padding: 8px;
	background: var(--color-bg-light);
	border: 1px solid var(--color-border-light);
	font-size: 12px;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}

.actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 6px;
	gap: 10px;
}

.actions button {
	min-width: 100px;
}
</style>
