<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import logo from '~/assets/logos/dispositionAlt.png'
import countdownTile from '~/assets/misc/countdownTile.png'

const config = useRuntimeConfig();
const LAUNCH_DATE = new Date(config.public.startDate * 1000)

const now = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
    now.value = Date.now()
    timer = setInterval(() => {
        now.value = Date.now()
    }, 1000)
})

onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
})

function pad(n: number) {
    return String(n).padStart(2, '0')
}

const tiles = computed(() => {
    const diff = now.value === null
        ? 0
        : Math.max(0, LAUNCH_DATE.getTime() - now.value)

    const days = Math.floor(diff / 86_400_000)
    const hours = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)
    const seconds = Math.floor((diff % 60_000) / 1000)

    return [
        { label: 'Days', value: pad(days) },
        { label: 'Hours', value: pad(hours) },
        { label: 'Minutes', value: pad(minutes) },
        { label: 'Seconds', value: pad(seconds) },
    ]
})
</script>

<template>
    <div class="header">
        <div class="striped-bg">
            <img src="~/assets/logos/countdown.png" alt="tick tock" class="logo" />
            <span>
                <h2>Countdown</h2>
                <p>time left until the platform unlocks!</p>
            </span>
        </div>

        <div class="spacer"></div>
    </div>

    <div class="countdown">
        <div class="tiles">
            <template v-for="(tile, i) in tiles" :key="tile.label">
                <div class="tile">
                    <img class="tile-bg" :src="countdownTile" alt="" draggable="false">
                    <span class="value" :class="{ long: tile.value.length > 2 }">{{ tile.value }}</span>
                    <span class="caption">{{ tile.label }}</span>
                </div>
                <div v-if="i < tiles.length - 1" class="colon">
                    <span></span>
                    <span></span>
                </div>
            </template>
        </div>

        <h2 class="label">Time left until we launch!</h2>
        <p class="text">
            Get ready for the coolest YSWS that you’ve ever seen in your entire life! (source: trust me)
        </p>
    </div>
</template>

<style scoped>
.countdown {
    --col: 340px;

    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 30px 20px 16px;
    overflow-y: auto;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    user-select: none;
}

.logo {
    flex-shrink: 0;
    width: var(--col);
    max-width: 100%;
    height: 112px;
    object-fit: contain;
}

.tiles {
    display: flex;
    align-items: center;
    width: var(--col);
    max-width: 100%;
    margin-top: 28px;
}

.tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    height: 72px;
    overflow: hidden;

    .tile-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        pointer-events: none;
    }

    .value,
    .caption {
        position: relative;
    }

    .value {
        font-size: 30px;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }

    .value.long {
        font-size: 20px;
    }

    .caption {
        margin-top: 4px;
        font-size: 10px;
        line-height: 1;
    }
}

.colon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex: 0 0 12px;

    span {
        width: 6px;
        height: 6px;
        background: var(--color-gray-dark);
    }
}

.label {
    width: var(--col);
    max-width: 100%;
    margin: 12px 0 0;
    text-align: center;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
}

.text {
    width: var(--col);
    max-width: 100%;
    margin: 6px 0 0;
    text-align: center;
    font-size: 14px;
    line-height: 1.45;
}

.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem var(--color-black));
}

.header {
    display: flex;
    flex-direction: column;

    font-family: 'Joan', serif;
    user-select: none;
}

.striped-bg {
    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }
    }

    width: 100%;

    background: repeating-linear-gradient(0deg,
        var(--color-gray-light) 0px,
        var(--color-gray-light) 6px,
        var(--color-gray-medium) 6px,
        var(--color-gray-medium) 7px);
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
}
</style>