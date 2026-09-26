<script setup lang="ts">
import "./window.css"
import type {WindowInstance} from "~/types/window"

const manager = useWindowManager();
const props = withDefaults(defineProps<{
  instance: WindowInstance
}>(), {
})

const instanceId = useId();
const width = useState(`width-${instanceId}`, () => props.instance.width);
const height = useState(`height-${instanceId}`, () => props.instance.height);
const posX = useState(`posX-${instanceId}`, () => props.instance.posX);
const posY = useState(`posY-${instanceId}`, () => props.instance.posY);
const minWidth = useState(`minWidth-${instanceId}`, () => props.instance.minWidth);
const minHeight = useState(`minHeight-${instanceId}`, () => props.instance.minHeight);

let resizeDir: string | null = null;
let startX = 0, startY = 0;
let startWidth = 0, startHeight = 0;
let startPosX = 0, startPosY = 0;
let drag = false;

function resize(event: MouseEvent) {
    event.preventDefault();
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    resizeDir = target.dataset.dir ?? null;
    if (!resizeDir) return;

    startX = event.clientX;
    startY = event.clientY;
    startWidth = width.value;
    startHeight = height.value;
    startPosX = posX.value;
    startPosY = posY.value;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (!resizeDir) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (resizeDir.includes("right")) width.value = Math.max(minWidth.value, startWidth + dx);
    if (resizeDir.includes("bottom")) height.value = Math.max(minHeight.value, startHeight + dy);
    if (resizeDir.includes("left")) {
        width.value = Math.max(minWidth.value, startWidth - dx);
        if (width.value > minWidth.value) {
            posX.value = startPosX + dx;
        }
    }
    if (resizeDir.includes("top")) {
        height.value = Math.max(minHeight.value, startHeight - dy);
        if (height.value > minHeight.value) posY.value = startPosY + dy;
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

    drag = true;
    startX = event.clientX;
    startY = event.clientY;
    startPosX = posX.value;
    startPosY = posY.value;

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
}

function onDragMove(event: MouseEvent) {
    event.preventDefault();
    if (!drag) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    posX.value = startPosX + dx;
    posY.value = startPosY + dy;
}

function onDragEnd(event: MouseEvent) {
    event.preventDefault();
    drag = false;
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
}
</script>

<template>
    <div class="window active" :style="{
        width: width + 'px',
        height: height + 'px',
        left: posX + 'px',
        top: posY + 'px',
        zIndex: instance.z
    }" @mousedown="manager.focus(instance.id)" v-show="!instance.minimized">
        <div class="resize-bars" v-if="props.instance.resizeable">
            <div class="resize-bar left" data-dir="left" @mousedown="resize"></div>
            <div class="resize-bar right" data-dir="right" @mousedown="resize"></div>
            <div class="resize-bar top" data-dir="top" @mousedown="resize"></div>
            <div class="resize-bar bottom" data-dir="bottom" @mousedown="resize"></div>
            <div class="resize-bar top-left" data-dir="top-left" @mousedown="resize"></div>
            <div class="resize-bar top-right" data-dir="top-right" @mousedown="resize"></div>
            <div class="resize-bar bottom-left" data-dir="bottom-left" @mousedown="resize"></div>
            <div class="resize-bar bottom-right" data-dir="bottom-right" @mousedown="resize"></div>
        </div>

        <div class="title-bar" @mousedown="startDrag" style="background-attachment: local;">
            <div class="title-bar-text">{{ instance.title }}</div>
            <div class="title-bar-controls">
                <button v-if="!props.instance.tool" class="minimize" @mousedown.stop @click="manager.minimize(instance.id)"></button>
                <button class="close" @mousedown.stop @click="manager.close(instance.id)"></button>
            </div>
        </div>

        <div class="window-body">
            <slot />
        </div>
    </div>
</template>

<style>
.title-bar-text {
    user-select: none;
}
</style>