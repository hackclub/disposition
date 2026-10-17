<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

interface RsvpStats {
    total: number,
    today: number,
    week: number
}

const info = ref<RsvpStats>();
if (admin) info.value = await $fetch<RsvpStats>("/api/rsvps/stats");
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Docs.png" alt="DispoVer Logo" class="logo" />
                <span>
                    <h2>DispoStats</h2>
                    <p>super secret stats app for super secret people 🙏</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="main">
            <AuthState v-slot="{ loggedIn, user }">
                <div v-if="loggedIn && $config.public.adminIds.includes(user.slackId) && info" class="flex">
                    <span>
                        <h1>RSVP's total</h1>
                        <p class="data">{{ info.total }}</p>
                    </span>

                    <span>
                        <h1>RSVP's this week</h1>
                        <p class="data">{{ info.week }}</p>
                    </span>

                    <span>
                        <h1>RSVP's today</h1>
                        <p class="data">{{ info.today }}</p>
                    </span>
                </div>

                <div v-else class="center">
                    sorry, not admin :(
                </div>
            </AuthState>
        </div>
    </div>
</template>

<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.main {
    padding: 10px;
}

.flex {
    display: flex;
    flex-direction: column;

    span h1 {
        margin: 0;
    }
}

.data {
    background-color: var(--color-panel-bg);
    border: 2px solid var(--color-border-dark);
    padding: 5px;
}

.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem var(--color-black));
}

.header {
    background: repeating-linear-gradient(0deg,
            var(--color-gray-light) 0px,
            var(--color-gray-light) 6px,
            var(--color-gray-medium) 6px,
            var(--color-gray-medium) 7px);

    display: flex;
    flex-direction: column;

    h2 {
        font-weight: normal;
    }

    font-family: 'Joan',
    serif;
    user-select: none;
}

.striped-bg {
    width: 100%;
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;

    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }
    }
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
}

.content {
    display: flex;
    flex-direction: column;
}
</style>