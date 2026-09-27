<script setup lang="ts">
const { loggedIn } = useUserSession();
const { read, write, has } = useConfiguration("welcome");

let funFacts = [
    "I love eating shawarma!",
    "The fetuccini sequence or something like that",
    "Embrace physical, Slander digital",
    "You should make a project",
    "Benji is inspired by Newgrounds",
    "Fear Rigby...",
    "Try not to slop ;p",
    "for every burnt cd, an angel regains it's wings",
    "I love you!",
    "I hate YOU!",
    "Respect your elders!",
    "Help my cat has been possesed by the crude evil!",
];

const openNext = ref(read("openNext"));
const manager = useWindowManager();
async function rsvp() {
    const rsvp = document.getElementById("rsvp");

    if (loggedIn.value) {
        const rsvpResponse = await fetch('/rsvp');
        if (rsvpResponse.status == 200) {
            rsvp!.innerText = "RSVP'd!";
        } else if (rsvpResponse.status == 409) {
            rsvp!.innerText = "Already RSVP'd!";
        } else {
            rsvp!.innerText = "Error :(";
        }
    } else {
        manager.open("auth");
    }

    setTimeout(() => {
        rsvp!.innerText = "RSVP";
    }, 5000);
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
                    <p>a physical-media based ysws</p>
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
                    <p>{{ funFacts[Math.floor(Math.random() * (funFacts.length - 1))] }}</p>
                </div>

                <div class="buttons">
                    <button @click="rsvp" id="rsvp">RSVP</button>
                    <button @click="manager.open('documentation')">What's this about?</button>
                    <button @click="manager.open('winver')">Information</button>
                    <button>Coming soon</button>
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
    background-color: #D9D9D9;

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

    filter: drop-shadow(0 0 0.2rem black);
}

.header {
    display: flex;
    flex-direction: column;

    font-family: 'Joan', serif;
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
            filter: drop-shadow(1px 1px 5px #000000);
        }

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px #000000);
        }
    }

    width: 100%;

    background: repeating-linear-gradient(0deg,
        #d7d7d7 0px,
        #d7d7d7 6px,
        #9f9f9f 6px,
        #9f9f9f 7px);
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
    border: 1px solid #c6c6c4;
    background-color: #dedede;
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