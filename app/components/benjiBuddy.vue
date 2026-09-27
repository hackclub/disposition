<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import idleImg from "~/assets/benjiBuddy/idle.jpg"
import walkImg from "~/assets/benjiBuddy/walk.jpg"
import emoteImg from "~/assets/benjiBuddy/emote.jpg"

const emojis = ['hello!', '👀', 'hi...', 'what\'cha cooking?']

// how far up from the very bottom of the screen he sits (px)
const BOTTOM_OFFSET = 25
const BUDDY_SIZE = 64

const pos = reactive({ x: 625 })

const isMoving = ref<boolean>(false)
const emote = ref<string>("")
const facingLeft = ref<boolean>(false)
const buddyRef = ref<HTMLElement | null>(null)

const currentFrame = computed(() => {
    if (isMoving.value) return walkImg
    if (emote.value) return emoteImg
    return idleImg
})

// how far he can wander in a single move (px)
const MIN_STEP = 50
const MAX_STEP = 200
const LEFT_BOUNDARY = 400; // kinda self explanatory idk

function moveSomewhere() {
    if (emote.value) return
    const margin = 20
    const maxX = window.innerWidth - BUDDY_SIZE - margin
    const distance = MIN_STEP + Math.random() * (MAX_STEP - MIN_STEP) // always between min step and max step
    const direction = Math.random() < 0.5 ? -1 : 1
    const nextX = Math.min(maxX, Math.max(margin, pos.x + distance * direction))
    facingLeft.value = nextX < pos.x
    pos.x = Math.max(nextX, LEFT_BOUNDARY);

    isMoving.value = true
}

function onTransitionEnd(e: TransitionEvent) {
    if (e.propertyName === 'left') {
        isMoving.value = false
    }
}

function doEmote() {
    if (isMoving.value) return
    const nextEmote = emojis[Math.floor(Math.random() * emojis.length)] ?? ''
    emote.value = nextEmote
    setTimeout(() => (emote.value = ''), 1500)
}

let moveTimer: ReturnType<typeof setInterval>
let emoteTimer: ReturnType<typeof setInterval>

onMounted(() => {
    buddyRef.value!.addEventListener('transitionend', onTransitionEnd)
    moveTimer = setInterval(moveSomewhere, 10000)
    emoteTimer = setInterval(doEmote, 30000)
})

onBeforeUnmount(() => {
    buddyRef.value?.removeEventListener('transitionend', onTransitionEnd)
    clearInterval(moveTimer)
    clearInterval(emoteTimer)
})
</script>

<template>
    <div ref="buddyRef" class="desktop-buddy" :style="{ left: pos.x + 'px', bottom: BOTTOM_OFFSET + 'px' }"
        @click="doEmote">
        <div class="buddy-sprite" :class="{ 'facing-left': facingLeft && !emote, hopping: isMoving, bouncing: !!emote }"
            :style="{ backgroundImage: `url(${currentFrame})` }" />

        <div v-if="emote" class="emote-bubble">{{ emote }}</div>
    </div>
</template>


<style scoped>
.emote-bubble {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    animation: pop-in 0.2s ease-out;

    text-shadow:
        -1px -1px 0 #FFF,
        0 -1px 0 #FFF,
        1px -1px 0 #FFF,
        1px 0 0 #FFF,
        1px 1px 0 #FFF,
        0 1px 0 #FFF,
        -1px 1px 0 #FFF,
        -1px 0 0 #FFF;
}

.desktop-buddy {
    position: fixed;
    width: 150px;
    height: 150px;
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
    filter: drop-shadow(2px 5px 4px #070707);
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
        animation: emote-bounce 0.4s ease-in-out;
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

    30% {
        transform: scale(1.15, 0.85) translateY(4px);
    }

    60% {
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