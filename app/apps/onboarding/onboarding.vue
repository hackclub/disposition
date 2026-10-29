<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WindowInstance } from '~/types/window'
import onboardingLogo from '~/assets/icons/onboarding-logo.png'
import headerbg from '~/assets/misc/header.png'
import avatar from '~/assets/icons/avatar.png'

const props = defineProps<{
    instance: WindowInstance
}>()

const config = useConfiguration("onboarding");
const step = computed(() => (config.has("step") ? config.read("step") : 1));

// first screen
function cancel() {

}

function advance() {
    config.write("step", 2);
}

// second screen
const sensitiveAuth = ref<boolean>(false);
function cancel1() {

}

function advance1() {

}
</script>

<template>
    <div class="onboarding" v-if="step === 1">
        <div class="body">
            <div class="side blue">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Welcome to Disposition!</h2>

                <p>
                    Welcome to the Disposition, a physical-media based YSWS!
                </p>

                <p>
                    lorem ipsum dolor sit amet sit sit sit sit sits its itsi sits istis isit
                    sit sit sit sit sit sit sit sit sit si sit sit sit sit stit sit sit sit sit
                    sit si sit sits its isit sit sit sit sit sit sit sit sit sit sit sit sit sit
                    sit sit sit sit sit sit sits it sit sit sit sit sit sits sit
                </p>

                <p class="hint">Click "Next" in order to start the onboarding</p>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" @click="advance">Next</button>
        </div>
    </div>

    <div class="onboarding" v-if="step === 2">
        <div class="body">
            <div class="side red">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Link your Hack Club Auth account</h2>

                <p>
                    To participate in Disposition, you must link your Hack Club Auth account first.
                </p>

                <b>Sensitive Information</b>
                <p>
                    Do you want to authorize Disposition to access sensitive info (such as addresses, legal name and
                    birthdate) now? You can do this later.
                </p>

                <label>
                    <input type="checkbox" v-model="sensitiveAuth" />
                    Authorize Disposition to access sensitive information
                </label>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel1">Cancel</button>
            <button class="btn" @click="advance1">Authorize</button>
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