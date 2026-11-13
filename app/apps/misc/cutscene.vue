<script setup lang="ts">
import type { WindowInstance } from '~/types/window'
import c1 from '~/assets/misc/cutscene/1.png'
import c2 from '~/assets/misc/cutscene/2.png'
import c3 from '~/assets/misc/cutscene/3.png'
import c4 from '~/assets/misc/cutscene/4.png'
import c5 from '~/assets/misc/cutscene/5.png'
import c6 from '~/assets/misc/cutscene/6.png'
import c7 from '~/assets/misc/cutscene/7.png'
import c8 from '~/assets/misc/cutscene/8.png'
import c9 from '~/assets/misc/cutscene/9.png'
import c10 from '~/assets/misc/cutscene/10.png'

const props = defineProps<{ instance: WindowInstance }>()
const manager = useWindowManager()
const slides: { image: string, text?: string, position?: string }[] = [
    { image: c1, position: 'top', text: 'Hack Club presents...' },
    { image: c1, position: 'bottom', text: '(Benji\'s House)' },
    { image: c2, text: 'One faithful day, OUR boy Benji is trying to put his NEW CD in his player.' },
    { image: c3, text: 'He takes a good look at his unit.' },
    { image: c4, text: 'He opens it and inserts the CD in. Just the usual stuff when playing a music CD.' },
    { image: c5, text: 'but KABOOM!!! KABLOW!!! (Insert big explosion here!!!) No more CD player..' },
    { image: c6, text: '"Just great man. I had my CD in."' },
    { image: c7, text: '(BOOM!!! violent door open) "BENJI BENJI BENJI BENJI BENJI BENJI BENJI BENJI BENJI BENJI BENJI BENJI BENJI!!!!"' },
    { image: c8, text: '"Dude how do you keep doing that I lock that thing with 3 locks-"' },
    { image: c9, text: '"LOOK LOOK LOOK HAVE YOU HEARD OF DISPOSITION?! IT\'S THIS GREAT ONLINE EVENT AND AND YOU GET FREE STUFF-"' },
    { image: c9, text: '"Bro... my CD player just blew up..."' },
    { image: c10, text: '"what..."' },
]

const typeSpeed = 35 // ms per character
const boxDelay = 400 // ms between the image changing and the subtitle box showing up

const index = ref(0)
const boxVisible = ref(false)
const typed = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

const slide = computed(() => slides[index.value]!)
const text = computed(() => slide.value.text ?? '')
const typing = computed(() => boxVisible.value && typed.value.length < text.value.length)
// panning keeps the box up and just types the next line, a new image hides it until the image is in
function play(pan = false) {
    clearTimeout(timer)
    boxVisible.value = pan
    typed.value = ''

    timer = setTimeout(function type() {
        boxVisible.value = true
        if (typed.value.length >= text.value.length) return
        typed.value = text.value.slice(0, typed.value.length + 1)
        timer = setTimeout(type, typeSpeed)
    }, pan ? 0 : boxDelay)
}

function advance() {
    if (typing.value) {
        clearTimeout(timer)
        typed.value = text.value
        return
    }

    if (!boxVisible.value) return
    if (index.value === slides.length - 1) {
        manager.close(props.instance.id)
        return
    }

    const pan = slides[index.value + 1]!.image === slide.value.image
    index.value++
    play(pan)
}

onMounted(play)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
    <div class="cutscene" @click="advance">
        <Transition name="bounce">
            <!-- keyed by image so the same image stays mounted and object-position animates -->
            <img :key="slide.image" class="scene" :src="slide.image" alt=""
                :style="{ objectFit: slide.position ? 'cover' : 'contain', objectPosition: slide.position ?? 'center' }">
        </Transition>

        <Transition name="slide">
            <!-- boxVisible still gates clicks on text-less slides, there's just nothing to show -->
            <div v-if="boxVisible && text" class="subtitle">
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
    display: block;
    transition: object-position 1.2s ease-in-out;
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

/* the new image pops in over the old one with a bit of overshoot, no black in between */
.bounce-enter-active {
    z-index: 1;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.bounce-leave-active {
    z-index: 0;
    transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}

.bounce-enter-from {
    opacity: 0;
    transform: scale(0.85);
}

.bounce-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.slide-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translate(-50%, 10px);
}
</style>
