<script setup lang="ts">
const { loggedIn } = useUserSession();
const { read, write, has } = useConfiguration("welcome");

let funFacts = [
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

const openNext = ref(read("openNext"));
const manager = useWindowManager();
async function login() {
    manager.open("auth", { rsvp: true });
}

function openNextChanged() {
    write("openNext", openNext.value);
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Disposition.png" alt="Disposition Logo" class="logo" />
                <span>
                    <h2>Welcome to Disposition!</h2>
                    <p>a physical-media based ysws sponsored by Archer</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="main">
            <h2>Build projects & build your music collection!</h2>

            <div class="horizontal">
                <div class="fun-fact">
                    <span>
                        <img src="~/assets/logos/Docs.png" alt="Information Icon" width="40px" height="40px" />
                        <h3>Fun Fact!</h3>
                    </span>
                    <p>{{ funFacts[Math.floor(Math.random() * (funFacts.length))] }}</p>
                </div>

                <div class="buttons">
                    <button @click="login">Log in</button>
                    <button @click="manager.open('documentation')">What's this about?</button>
                    <button @click="manager.open('winver')">Information</button>
                    <button @click="manager.open('config')">Config</button>
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