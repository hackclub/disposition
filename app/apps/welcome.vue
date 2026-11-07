<script setup lang="ts">
const { loggedIn } = useUserSession();
const { read, write, has } = useConfiguration("welcome");

const funFacts = [
    "I love eating shawarma!",
    "The fetuccini sequence or something like that",
    "Embrace physical, Slander digital",
    "You should make a project",
    "Benji is inspired by games on Newgrounds",
    "Fear Rigby...",
    "Try not to slop ;p",
    "for every burnt cd, an angel regains it's wings",
    "I love you!",
    "I hate YOU!",
    "Respect your elders!",
    "Help!! my cat has been possesed by the cruel evil!",
    "Optical media GOOD!"
];

const funFact = ref(funFacts[Math.floor(Math.random() * funFacts.length)]);

const openNext = ref(read("openNext"));
const manager = useWindowManager();
const config = useRuntimeConfig();
const launch = computed(() => Date.now() >= config.public.startDate * 1000)

const rsvpButton = ref<HTMLElement>();
async function rsvp() {
    if (loggedIn.value) {
        try {
            await $fetch('/api/rsvps', { method: "POST" });
            rsvpButton.value!.innerText = "RSVP'd!";
        } catch (err: any) {
            if (err.statusCode === 409) {
                rsvpButton.value!.innerText = "Already RSVP'd!";
            } else {
                rsvpButton.value!.innerText = "Error :(";
            }
        }
    } else {
        manager.open("auth", { rsvp: true });
    }

    setTimeout(() => {
        rsvpButton.value!.innerText = "RSVP";
    }, 5000);
}

async function login() {
    manager.open("auth", { rsvp: true });
}

async function logout() {
    useUserSession().clear();
    navigateTo("/", { external: true });
}

function openNextChanged() {
    write("openNext", openNext.value);
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/disposition.png" alt="Disposition Logo" class="logo" />
                <span>
                    <h2>Welcome to Disposition!</h2>
                    <p>a physical-media based ysws sponsored by Archer (shoutout Archer)</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="main">
            <h2>Build projects & build your music collection!</h2>

            <div class="horizontal">
                <div class="fun-fact">
                    <span>
                        <img src="~/assets/logos/docs.png" alt="Information Icon" width="40px" height="40px" />
                        <h3>Fun Fact!</h3>
                    </span>
                    <p>{{ funFact }}</p>
                </div>

                <div class="buttons">
                    <AuthState v-slot="{ loggedIn }">
                        <button ref="rsvpButton" v-if="!launch" @click="rsvp">RSVP</button>
                        <button v-else-if="launch && loggedIn" @click="logout">Log out</button>
                        <button v-else-if="launch && !loggedIn" @click="login">Log in</button>
                    </AuthState>
                    <button @click="manager.open('documentation')">What's this about?</button>
                    <button @click="manager.open('shop')">Shop</button>

                    <AuthState v-slot="{ loggedIn }">
                        <button v-if="!launch" @click="manager.open('countdown')">Countdown</button>
                        <button v-else-if="launch && loggedIn" @click="manager.open('manager')">DispoManager</button>
                        <button v-else-if="launch && !loggedIn" @click="manager.open('config')">Config</button>
                    </AuthState>
                </div>
            </div>

            <label>
                <input type="checkbox" v-model="openNext" @change="openNextChanged" />
                Open this welcome screen the next time you open Disposition
            </label>
        </div>
    </div>
</template>

<style scoped>
.fun-fact {
    flex-grow: 5;

    border-style: none;
    border: 2px solid var(--color-border-light);
    background-color: var(--color-panel-bg);

    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;

    p {
        margin: 0;
        padding-left: 10px;
        padding-bottom: 10px;
    }

    span {
        margin: 0;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
        gap: 5px;
    }
}

.logo {
    width: 88px;
    height: 88px;

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
    gap: 2px;
}

.main {
    margin: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 5px;

    display: flex;
    flex-direction: column;
    gap: 4px;

    h2 {
        margin: 5px;
        /* what the fuck?? why does this have so much margin bro :sob: */
        margin-left: 0;
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

.buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;

    flex-grow: 1;
}

.horizontal {
    display: flex;
    flex-direction: row;

    gap: 3px;
}
</style>