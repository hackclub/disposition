<script setup lang="ts">
import type { WindowInstance } from '~/types/window'
import onb1 from '~/assets/misc/onboard1.png'
import onb2 from '~/assets/misc/onboard2.png'
import onb3 from '~/assets/misc/onboard3.png'
import onb4 from '~/assets/misc/onboard4.png'

const props = defineProps<{ instance: WindowInstance }>()
const manager = useWindowManager()
const slides = [
    { image: onb1, text: 'Placeholder line for the first scene.' },
    { image: onb2, text: 'Placeholder line for the second scene.' },
    { image: onb3, text: 'Placeholder line for the third scene.' },
    { image: onb4, text: 'Placeholder line for the last scene.' },
]

const typeSpeed = 35 // ms per character
const boxDelay = 400 // ms between the image changing and the subtitle box showing up

const index = ref(0)
const boxVisible = ref(false)
const typed = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

const slide = computed(() => slides[index.value]!)
const typing = computed(() => boxVisible.value && typed.value.length < slide.value.text.length)
function play() {
    clearTimeout(timer)
    boxVisible.value = false
    typed.value = ''

    timer = setTimeout(function type() {
        boxVisible.value = true
        if (typed.value.length >= slide.value.text.length) return
        typed.value = slide.value.text.slice(0, typed.value.length + 1)
        timer = setTimeout(type, typeSpeed)
    }, boxDelay)
}

function advance() {
    if (typing.value) {
        clearTimeout(timer)
        typed.value = slide.value.text
        return
    }

    if (!boxVisible.value) return
    if (index.value === slides.length - 1) {
        manager.close(props.instance.id)
        return
    }

    index.value++
    play()
}

onMounted(play)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
    <div class="cutscene" @click="advance">
        <Transition name="fade" mode="out-in">
            <img :key="index" class="scene" :src="slide.image" alt="">
        </Transition>

        <Transition name="slide">
            <div v-if="boxVisible" class="subtitle">
                <p>{{ typed }}<span v-if="typing" class="caret">_</span></p>
                <span v-if="!typing" class="hint">{{ index === slides.length - 1 ? 'Click to close' : 'Click to continue' }}</span>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.cutscene {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    cursor: pointer;
    user-select: none;
}

.scene {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.subtitle {
    position: absolute;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
    box-sizing: border-box;
    width: min(760px, calc(100% - 32px));
    min-height: 96px;
    padding: 14px 18px 10px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    color: var(--color-white);
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid var(--color-border-light);
    font-family: 'Fira Sans', sans-serif;

    p {
        margin: 0;
        font-size: 20px;
        line-height: 1.35;
        white-space: pre-line;
        overflow-wrap: anywhere;
    }

    .caret {
        animation: blink 0.8s steps(1) infinite;
    }

    .hint {
        align-self: flex-end;
        margin-top: 8px;
        font-size: 13px;
        opacity: 0.7;
    }
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translate(-50%, 10px);
}
</style>
