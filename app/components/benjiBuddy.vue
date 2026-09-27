<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import idleImg from "~/assets/benjiBuddy/idle.jpg"
import walkImg from "~/assets/benjiBuddy/walk.jpg"
import emoteImg from "~/assets/benjiBuddy/emote.jpg"

const emojis = ['💭', '✨', '♪', '💤', '❓']


const BOTTOM_OFFSET = 90
const BUDDY_SIZE = 64

const pos = reactive({ x: 200, y: BOTTOM_OFFSET })

const isMoving = ref<boolean>(false)
const emote = ref<string>("")
const facingLeft = ref<boolean>(false)
const buddyRef = ref<HTMLElement | null>(null)

const currentFrame = computed(() => {
    if (isMoving.value) return walkImg
    if (emote.value) return emoteImg
    return idleImg
})


const MAX_STEP = 150

function moveSomewhere() {
    if (emote.value) return
    const margin = 20
    const maxX = window.innerWidth - BUDDY_SIZE - margin
    const step = (Math.random() * 2 - 1) * MAX_STEP // random between -MAX_STEP and +MAX_STEP
    const nextX = Math.min(maxX, Math.max(margin, pos.x + step))
    facingLeft.value = nextX < pos.x
    pos.x = nextX
    
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
    onResize() 
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
    :class="{ 'facing-left': facingLeft }"
    :style="{ left: pos.x + 'px', top: pos.y + 'px', backgroundImage: `url(${currentFrame})` }"
    @click="doEmote"
  >

  <div v-if="emote" class="emote-bubble">{{ emote }}</div>
  </div>
</template>


<style scoped>
.desktop-buddy {
    position: fixed;
    width: 64px;
    height: 64px;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
    z-index: 1000000;
    transition: left 1s ease-in-out;
    filter: drop-shadow(5px 2px 2px #080808);
}

.desktop-buddy.facing-left {
    transform: scaleX(-1);
}

.emote-bubble {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
}
</style>