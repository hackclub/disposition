<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WindowInstance } from '~/types/window'
import onboardingLogo from '~/assets/icons/onboarding-logo.png'
import headerbg from '~/assets/misc/header.png'
import avatar from '~/assets/icons/avatar.png'

const props = defineProps<{
    instance: WindowInstance
}>()




const step = ref<1 | 2>(1)

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'finish'): void
}>()

function next() {
    if (step.value === 1) {
        step.value = 2
    } else {
        emit('finish')
    }
}
</script>

<template>
    <div class="onboarding">
        <div class="body">
            <div class="side" :class="step === 1 ? 'blue' : 'red'">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div v-if="step === 1" class="page">
                <h2 class="title">Welcome to Disposition!</h2>

                <p>
                    Welcome to the first physical-media based YSWS! Let's get you started
                    with the basics of setting you up for the event!
                </p>

                <p>
                    lorem ipsum dolor sit amet sit sit sit sit sits its itsi sits istis isit
                    sit sit sit sit sit sit sit sit sit si sit sit sit sit stit sit sit sit sit
                    sit si sit sits its isit sit sit sit sit sit sit sit sit sit sit sit sit sit
                    sit sit sit sit sit sit sits it sit sit sit sit sit sits sit
                </p>

                <p class="hint">Click "Next" in order to start the onboarding</p>
            </div>

            <div v-else class="page">
                <h2 class="title">Link your Hack Club account</h2>

                <p>
                    To continue participation you must link your Hack Club account. If you
                    don't have one yet you can make one <a class="link" href="#">here</a>.
                </p>

                <div class="link-box">
                    <a class="link" href="#">Link your Hack Club account here</a>
                    <span class="status">Account not linked yet</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="emit('cancel')">Cancel</button>
            <button class="btn" @click="next">Next</button>
        </div>
    </div>
</template>

<style scoped>
.onboarding {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 14px;
    user-select: none;
}

.body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.side {
    position: relative;
    flex: 0 0 39%;
}

.side.blue {
    background: linear-gradient(160deg, #1a0a8c 0%, #2a00ff 100%);
}

.side.red {
    background: linear-gradient(180deg, #b4306f 0%, #ff2d2d 100%);
}

.side-logo {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 27%;
    aspect-ratio: 1;
    object-fit: contain;
    display: block;
}

.page {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    padding: 20px 16px 14px;
    overflow-y: auto;
    background: var(--color-panel-bg);

    p {
        margin: 0 0 14px;
        font-size: 14px;
        line-height: 1.3;
    }
}

.page h2.title {
    display: block;
    margin: 0 0 16px;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    color: inherit;
}

.hint {
    margin: auto 0 0;
}

.link {
    color: #1a1aff;
    text-decoration: none;
    cursor: pointer;
}

.link-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 8px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-medium);
}

.status {
    font-weight: 600;
    color: #b00000;
}

.footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
    padding: 6px 10px;
    background: var(--color-bg-light);
    border-top: 1px solid var(--color-border-light);
}

.btn {
    width: 23%;
    min-width: 90px;
}
</style>