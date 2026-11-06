<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

export type DialogBoxOptions = {
	info?: boolean,
	warning?: boolean,
	error?: boolean,
	question?: boolean
}

const manager = useWindowManager();

const props = defineProps<{
	instance: WindowInstance,
	message: string,
	callback: Function,
	options?: DialogBoxOptions,
}>();
</script>

<template>
	<div class="dialogbox">
		<div class="content">
			<img v-if="props.options?.info" src="~/assets/icons/info.png" />
			<img v-else-if="props.options?.warning" src="~/assets/icons/warning.png" />
			<img v-else-if="props.options?.error" src="~/assets/icons/error.png" />
			<img v-else-if="props.options?.question" src="~/assets/icons/question.png" />

			<p>{{ props.message }}</p>
		</div>

		<div class="buttons">
			<button @click="callback(true); manager.close(instance.id)">Yes</button>
			<button @click="callback(false); manager.close(instance.id)">No</button>
		</div>
	</div>
</template>

<style scoped>
.dialogbox {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.content {
	flex: 1;
	min-height: 0;
	padding: 16px;

	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;

	img {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		object-fit: contain;
	}

	p {
		margin: 0;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
}

.buttons {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	gap: 8px;

	padding: 10px 12px;

	background: var(--color-surface-dark, #e5e5e5);
	border-top: 1px solid var(--color-border, #ccc);

	button {
		min-width: 80px;
		max-width: 120px;
	}
}
</style>