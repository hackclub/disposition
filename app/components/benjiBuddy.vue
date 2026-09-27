<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import idleImg from "~/assets/benjiBuddy/idle.jpg"
import walkImg from "~/assets/benjiBuddy/walk.jpg"
import emoteImg from "~/assets/benjiBuddy/emote.jpg"

const emojis = [' ', ' ', ' ', ' ', ' ']

// how far up from the very bottom of the screen he sits (px)
const BOTTOM_OFFSET = 165
const BUDDY_SIZE = 64

const pos = reactive({ x: 625, y: BOTTOM_OFFSET })

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

function moveSomewhere() {
    if (emote.value) return
    const margin = 20
    const maxX = window.innerWidth - BUDDY_SIZE - margin
    const distance = MIN_STEP + Math.random() * (MAX_STEP - MIN_STEP) // always between MIN_STEP and MAX_STEP
    const direction = Math.random() < 0.5 ? -1 : 1
    const nextX = Math.min(maxX, Math.max(margin, pos.x + distance * direction))
    facingLeft.value = nextX < pos.x
    pos.x = nextX
    // y stays pinned near the bottom — never changes
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

function onResize() {
    pos.y = window.innerHeight - BOTTOM_OFFSET
}

let moveTimer: ReturnType<typeof setInterval>
let emoteTimer: ReturnType<typeof setInterval>

onMounted(() => {
    onResize() // set real position now that window exists
    buddyRef.value!.addEventListener('transitionend', onTransitionEnd)
    window.addEventListener('resize', onResize)
    moveTimer = setInterval(moveSomewhere, 5000)
    emoteTimer = setInterval(doEmote, 4000)
})

onBeforeUnmount(() => {
    buddyRef.value?.removeEventListener('transitionend', onTransitionEnd)
    window.removeEventListener('resize', onResize)
    clearInterval(moveTimer)
    clearInterval(emoteTimer)
})
</script>

<template>
   <div
    ref="buddyRef"
    class="desktop-buddy"
    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
  >
    <!--
      Positioning (left/top) lives on the OUTER div.
      Flipping + hopping + the sprite image live on this INNER div,
      so mirroring never shifts the box the position styles control,
      and the emote bubble (a sibling, not a child of this) never flips.
    -->
    <div
      class="buddy-sprite"
      :class="{ 'facing-left': facingLeft && !emote, hopping: isMoving, bouncing: !!emote }"
      :style="{ backgroundImage: `url(${currentFrame})` }"
      
    />

    <div v-if="emote" class="emote-bubble">{{ emote }}</div>
  </div>
</template>


<style scoped>
.desktop-buddy {
    position: fixed;
    width: 150px;
    height: 150px;
    z-index: 10000;
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
}

.buddy-sprite.facing-left {
    transform: scaleX(-1);
}


/* hop: quick up-down bounce, timed to roughly match the 0.35s move */
.buddy-sprite.hopping {
    animation: hop 0.35s ease-in-out infinite;
}
.buddy-sprite.hopping.facing-left {
    animation: hop-flipped 0.35s ease-in-out infinite;
}

@keyframes hop {
    0%   { transform: scaleX(1) translateY(0); }
    50%  { transform: scaleX(1) translateY(-10px); }
    100% { transform: scaleX(1) translateY(0); }
}
@keyframes hop-flipped {
    0%   { transform: scaleX(-1) translateY(0); }
    50%  { transform: scaleX(-1) translateY(-10px); }
    100% { transform: scaleX(-1) translateY(0); }
}

/* little bounce/pop when emoting */
.buddy-sprite.bouncing {
    animation: emote-bounce 0.4s ease-in-out;
}

@keyframes emote-bounce {
    0%   { transform: scale(1) translateY(0); }
    30%  { transform: scale(1.15, 0.85) translateY(4px); }
    60%  { transform: scale(0.95, 1.1) translateY(-8px); }
    100% { transform: scale(1) translateY(0); }
}

.emote-bubble {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    animation: pop-in 0.2s ease-out;
}
@keyframes pop-in {
    from { transform: translateX(-50%) scale(0.4); opacity: 0; }
    to   { transform: translateX(-50%) scale(1); opacity: 1; }
}
</style>