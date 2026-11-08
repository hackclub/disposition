<script setup lang="ts">
import "./window.css"
import type {WindowInstance} from "~/types/window"

const manager = useWindowManager();
const props = withDefaults(defineProps<{
	instance: WindowInstance
}>(), {})

let resizeDir: string | null = null;
let startX = 0, startY = 0;
let startWidth = 0, startHeight = 0;
let startPosX = 0, startPosY = 0;
let drag = false;

const windowStyle = computed(() => props.instance.fullscreen
	? {
		width: '100vw',
		height: '100vh',
		left: '0px',
		top: '0px',
		zIndex: props.instance.z
	}
	: {
		width: props.instance.width + 'px',
		height: props.instance.height + 'px',
		left: props.instance.posX + 'px',
		top: props.instance.posY + 'px',
		zIndex: props.instance.z
	});

function startResize(event: MouseEvent) {
	event.preventDefault();
	const target = event.currentTarget;
	if (!(target instanceof HTMLElement)) return;

	resizeDir = target.dataset.dir ?? null;
	if (!resizeDir) return;

	startX = event.clientX;
	startY = event.clientY;
	startWidth = props.instance.width;
	startHeight = props.instance.height;
	startPosX = props.instance.posX;
	startPosY = props.instance.posY;

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(event: MouseEvent) {
	event.preventDefault();
	if (!resizeDir) return;
	const id = props.instance.id;
	const dx = event.clientX - startX;
	const dy = event.clientY - startY;

	if (resizeDir.includes("right")) {
		manager.resize(id, {width: startWidth + dx});
	}
	if (resizeDir.includes("bottom")) {
		manager.resize(id, {height: startHeight + dy});
	}
	if (resizeDir.includes("left")) {
		const width = Math.max(props.instance.minWidth, startWidth - dx);
		manager.resize(id, {width});
		manager.move(id, {posX: startPosX + (startWidth - width)});
	}
	if (resizeDir.includes("top")) {
		const height = Math.max(props.instance.minHeight, startHeight - dy);
		manager.resize(id, {height});
		manager.move(id, {posY: startPosY + (startHeight - height)});
	}
}

function onMouseUp(event: MouseEvent) {
	event.preventDefault();
	resizeDir = null;
	document.removeEventListener("mousemove", onMouseMove);
	document.removeEventListener("mouseup", onMouseUp);
}

function startDrag(event: MouseEvent) {
	event.preventDefault();
	if (props.instance.fullscreen) return;

	drag = true;
	startX = event.clientX;
	startY = event.clientY;
	startPosX = props.instance.posX;
	startPosY = props.instance.posY;

	document.addEventListener("mousemove", onDragMove);
	document.addEventListener("mouseup", onDragEnd);
}

function onDragMove(event: MouseEvent) {
	event.preventDefault();
	if (!drag) return;
	const dx = event.clientX - startX;
	const dy = event.clientY - startY;
	manager.move(props.instance.id, {posX: startPosX + dx, posY: startPosY + dy});
}

function onDragEnd(event: MouseEvent) {
	event.preventDefault();
	drag = false;
	document.removeEventListener("mousemove", onDragMove);
	document.removeEventListener("mouseup", onDragEnd);
}
</script>

<template>
	<Transition name="window">
		<div class="window active" :class="{ fullscreen: instance.fullscreen }" :style="windowStyle"
		     @mousedown="manager.focus(instance.id)" v-show="!instance.minimized">
			<div class="resize-bars" v-if="props.instance.resizeable && !instance.fullscreen">
				<div class="resize-bar left" data-dir="left" @mousedown="startResize"></div>
				<div class="resize-bar right" data-dir="right" @mousedown="startResize"></div>
				<div class="resize-bar top" data-dir="top" @mousedown="startResize"></div>
				<div class="resize-bar bottom" data-dir="bottom" @mousedown="startResize"></div>
				<div class="resize-bar top-left" data-dir="top-left" @mousedown="startResize"></div>
				<div class="resize-bar top-right" data-dir="top-right" @mousedown="startResize"></div>
				<div class="resize-bar bottom-left" data-dir="bottom-left" @mousedown="startResize"></div>
				<div class="resize-bar bottom-right" data-dir="bottom-right" @mousedown="startResize"></div>
			</div>

			<div v-if="!instance.fullscreen" class="title-bar" @mousedown="startDrag"
			     style="background-attachment: local;">
				<div class="title-bar-text">{{ instance.title }}</div>
				<div class="title-bar-controls">
					<button v-if="!props.instance.tool && !instance.fullscreen" class="minimize" @mousedown.stop
					        @click="manager.minimize(instance.id)"></button>
					<button class="close" @mousedown.stop @click="manager.close(instance.id)"></button>
				</div>
			</div>

			<div class="window-body">
				<slot/>
			</div>
		</div>
	</Transition>
</template>

<style>
.window-enter-active,
.window-leave-active {
	transition: all 0.2s ease;
}

.window-enter-from,
.window-leave-to {
	transform-origin: bottom center;
	transform: scale(0.2) translateY(400px);
	opacity: 0;
}

.window-spawn-enter-active,
.window-spawn-leave-active {
	transform-origin: center;
	transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
	opacity 200ms ease,
	filter 200ms ease;
	will-change: transform, opacity, filter;
}

.window-spawn-enter-from,
.window-spawn-leave-to {
	transform: scale(0.92);
	opacity: 0;
}

.window-spawn-enter-to,
.window-spawn-leave-from {
	transform: scale(1);
	opacity: 1;
}
</style>
