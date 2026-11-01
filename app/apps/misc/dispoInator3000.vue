<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import frame1 from '~/assets/misc/DispoInator3000.png'
import frame2 from '~/assets/misc/DispoInator3000-2.png'
import frame3 from '~/assets/misc/DispoInator3000-3.png'

const FPS = 20
const FRAME_MS = 1000 / FPS

const frames = [frame1, frame2, frame3]
const current = ref(0)
const playing = ref(false)

const spins = useState('dispo-inator-spins', () => 0)

let timers: ReturnType<typeof setTimeout>[] = []

function play() {
    if (playing.value) return
    playing.value = true
    spins.value++

    current.value = 1
    timers.push(setTimeout(() => { current.value = 2 }, FRAME_MS))
    timers.push(setTimeout(() => {
        current.value = 0
        playing.value = false
    }, FRAME_MS * 2))
}

onBeforeUnmount(() => {
    timers.forEach(clearTimeout)
    timers = []
})
</script>

<template>
    <div class="dispo-inator">
        <div class="intro">
            <h2 class="question">Don’t know what albums to order?</h2>
            <p class="sub">Press on the Dispo-Inator 3000 to get recommended new albums</p>
        </div>

        <div class="stage">
            <span class="click-me">Click me</span>

            <button type="button" class="machine" @click="play">
                <img
                    v-for="(src, i) in frames"
                    :key="i"
                    class="frame"
                    :class="{ visible: current === i }"
                    :src="src"
                    alt=""
                    draggable="false"
                >
            </button>
        </div>
    </div>
</template>

<style scoped>
.dispo-inator {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px 12px 12px;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    user-select: none;
}

.intro {
    flex-shrink: 0;
}

.question {
    margin: 0;
    font-family: inherit;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
}

.sub {
    margin: 0;
    font-size: 15px;
    line-height: 1.2;
}

.stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-height: 0;
    gap: 14px;
    padding-top: 24px;
}

.click-me {
    flex-shrink: 0;
    font-size: 22px;
    font-weight: 700;
}

.machine {
    --machine-shadow: drop-shadow(3px 6px 5px var(--color-black));

    position: relative;
    flex: 0 1 280px;
    width: 240px;
    min-height: 0;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    filter: var(--machine-shadow);
    cursor: pointer;
    outline: none;
}

.machine:hover,
.machine:active,
.machine:focus,
.machine:focus-visible {
    background: none;
    border: none;
    box-shadow: none;
    filter: var(--machine-shadow);
    transform: none;
    outline: none;
}


.frame {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100%;
    height: auto;
    transform: translateX(-50%);
    visibility: hidden;
    pointer-events: none;
}

.frame.visible {
    visibility: visible;
}
</style>