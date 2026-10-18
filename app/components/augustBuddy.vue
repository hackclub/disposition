<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import idleImg from "~/assets/augustBuddy/idleAugust.png"
import walkImg from "~/assets/augustBuddy/walkAugust.png"
import emoteImg from "~/assets/augustBuddy/emoteAugust.png"

const emojis = [ 'Hi!!', 'What\'s up?', 'Doing much?' ]

const BOTTOM_OFFSET = 17
const BUDDY_SIZE = 100

const pos = reactive ({ x: 1000 })

const isMoving = ref<boolean>(false)
const emote = ref<string>("")
const facingLeft = ref<boolean>(false)
const buddyRef = ref<HTMLElement | null>(null)

const currentFrame = computed(() => {
    if (isMoving.value) return walkImg
    if (emote.value) return emoteImg
    return idleImg
})

const MIN_STEP = 50
const MAX_STEP = 200
const LEFT_BOUNDARY = 400;

const MIN_MOVE_DELAY = 4000
const MAX_MOVE_DELAY = 14000
const MIN_EMOTE_DELAY = 8000
const MAX_EMOTE_DELAY = 25000

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min)
}

function moveSomewhere() {
    if (emote.value) return
    const margin = 20
    const maxX = window.innerWidth - BUDDY_SIZE - margin
    const distance = MIN_STEP + Math.random() * (MAX_STEP - MIN_STEP)
    const direction = Math.random() < 0.5 ? -1 : 1
    const nextX = Math.min(maxX, Math.max(margin, pos.x + distance * direction))
    const targetX = Math.max(nextX, LEFT_BOUNDARY)
    if (targetX === pos.x) return
    facingLeft.value = targetX < pos.x
    pos.x = targetX

    isMoving.value = true
}

function onTransitionEnd(e: TransitionEvent) {
    if (e.propertyName === 'left') {
        isMoving.value = false
    }
}

let moveTimer: ReturnType<typeof setTimeout>
let emoteTimer: ReturnType<typeof setTimeout>
let emoteClearTimer: ReturnType<typeof setTimeout>

function doEmote() {
    if (isMoving.value) return
    const nextEmote = emojis[Math.floor(Math.random() * emojis.length)] ?? ''
    emote.value = nextEmote
    clearTimeout(emoteClearTimer)
    emoteClearTimer = setTimeout(() => (emote.value = ''), 1500)
}

function scheduleMove() {
    moveTimer = setTimeout(() => {
        moveSomewhere()
        scheduleMove()
    }, randomBetween(MIN_MOVE_DELAY, MAX_MOVE_DELAY))
}

function scheduleEmote() {
    emoteTimer = setTimeout(() => {
        doEmote()
        scheduleEmote()
    }, randomBetween(MIN_EMOTE_DELAY, MAX_EMOTE_DELAY))
}

onMounted(() => {
    buddyRef.value!.addEventListener('transitionend', onTransitionEnd)
    scheduleMove()
    scheduleEmote()
})

onBeforeUnmount(() => {
    buddyRef.value?.removeEventListener('transitionend', onTransitionEnd)
    clearTimeout(moveTimer)
    clearTimeout(emoteTimer)
    clearTimeout(emoteClearTimer)
})
</script>

<template>
      <div ref="buddyRef" class="desktop-buddy" :style="{ left: pos.x + 'px', bottom: BOTTOM_OFFSET + 'px' }">
        <div class="buddy-sprite" :class="{ 'facing-left': facingLeft && !emote, hopping: isMoving, bouncing: !!emote }"
            :style="{ backgroundImage: `url(${currentFrame})` }" />

        <div v-if="emote" class="emote-bubble">{{ emote }}</div>
    </div>
</template>

<style scoped>
.emote-bubble {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    animation: pop-in 0.2s ease-out;
    user-select: none;

    text-shadow:
        -1px -1px 0 var(--color-white),
        0 -1px 0 var(--color-white),
        1px -1px 0 var(--color-white),
        1px 0 0 var(--color-white),
        1px 1px 0 var(--color-white),
        0 1px 0 var(--color-white),
        -1px 1px 0 var(--color-white),
        -1px 0 0 var(--color-white);
}

.desktop-buddy {
    position: fixed;
    width: 200px;
    height: 200px;
    z-index: 9998;
    transition: left 0.35s ease-in-out;
}

.buddy-sprite {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform-origin: center;
    filter: drop-shadow(2px 5px 4px var(--color-shadow-dark));
    user-select: none;
    pointer-events: none;

    &.facing-left {
        transform: scaleX(-1);
    }

    &.hopping {
        animation: hop 0.35s ease-in-out infinite;

        &.facing-left {
            animation: hop-flipped 0.35s ease-in-out infinite;
        }
    }

    &.bouncing {
        animation: emote-bounce 0.8s ease-in-out;
    }
}

@keyframes hop {
    0% {
        transform: scaleX(1) translateY(0);
    }

    50% {
        transform: scaleX(1) translateY(-10px);
    }

    100% {
        transform: scaleX(1) translateY(0);
    }
}

@keyframes hop-flipped {
    0% {
        transform: scaleX(-1) translateY(0);
    }

    50% {
        transform: scaleX(-1) translateY(-10px);
    }

    100% {
        transform: scaleX(-1) translateY(0);
    }
}

@keyframes emote-bounce {
    0% {
        transform: scale(1) translateY(0);
    }

    15% {
        transform: scale(1.15, 0.85) translateY(4px);
    }

    40% {
        transform: scale(0.92, 1.12) translateY(-35px);
    }

    58% {
        transform: scale(1) translateY(0);
    }

    68% {
        transform: scale(1.15, 0.85) translateY(4px);
    }

    84% {
        transform: scale(0.95, 1.1) translateY(-8px);
    }

    100% {
        transform: scale(1) translateY(0);
    }
}

@keyframes pop-in {
    from {
        transform: translateX(-50%) scale(0.4);
        opacity: 0;
    }

    to {
        transform: translateX(-50%) scale(1);
        opacity: 1;
    }
}
</style>