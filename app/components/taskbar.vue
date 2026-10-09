<script setup lang="ts">
import { Transition, onMounted, onUnmounted } from 'vue';
import StartMenu from './startMenu.vue';

const { data: balance } = await useFetch('/api/user/balance', { key: 'balance' });
const isOpen = ref(false);
const clockState = ref('');
const dateState = ref('');

function tick() {
    const now = new Date();
    clockState.value = now.toLocaleTimeString([], { hourCycle: 'h23' });
    dateState.value = now.toLocaleDateString();
}

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
    tick();
    timer = setInterval(tick, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
    <div class="start-shell" @click.passive="isOpen = isOpen ? false : isOpen" :style="{
        zIndex: isOpen ? 9999 : 0,
    }">
        <Transition name="start">
            <StartMenu v-show="isOpen" />
        </Transition>
    </div>

    <div class="taskbar">
        <div class="left">
            <button class="start" @click="isOpen = !isOpen"></button>
        </div>

        <div class="divider"></div>

        <div class="middle">
            <slot />
        </div>

        <div class="divider"></div>

        <div class="right">
            <!-- calendar, clock, announcements, idk -->
            <div class="balance">
                {{ balance }}
            </div>

            <div class="clock">
                <div>{{ clockState }}</div>
                <div>{{ dateState }}</div>
            </div>
        </div>
    </div>
</template>

<style>
.start-enter-active,
.start-leave-active {
    transition: all 0.2s ease-out;
}

.start-enter-from,
.start-leave-to {
    transform: translateY(40px);
    opacity: 0;
}

.start-shell {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: start;
    padding-bottom: calc(35px - 2px);
}

.taskbar {
    position: absolute;
    width: 100vw;
    bottom: 0;
    left: 0;

    height: 35px;
    background: linear-gradient(180deg, #525252 0%, #000000 100%);
    border-top: 2px solid #797979;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    gap: 10px;

    padding-left: 10px;
    padding-right: 10px;

    z-index: 9997;
}

.divider {
    height: 100%;
    width: 2px;
    background-color: #797979;
}

.clock {
    display: flex;
    flex-direction: column;
    color: white;
    font-size: 10px;
    user-select: none;
}

.middle {
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;

    gap: 15px;
}

.left {
    display: flex;
    justify-content: center;
    align-items: center;
}

.right {
    display: flex;
    flex-direction: row;
    gap: 5px;

    color: white;
    font-size: 15px;
}

.start {
    height: 25px;
    width: 25px;

    background-image: url("~/assets/icons/start.png");
    border: none;
    background-color: transparent;
    background-size: contain;
}

@keyframes spinny {
    0% {
        rotate: 0deg;
    }

    100% {
        rotate: 720deg;
    }
}

.start:hover {
    animation-name: spinny;
    animation-iteration-count: 1;
    animation-duration: 0.5s;
}
</style>