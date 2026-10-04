<script setup lang="ts">
import { APPS } from '~/registry/apps';
import { ICONS } from '~/registry/icons';
const { loggedIn, user } = await useUserSession()
const manager = useWindowManager();

let info;
if (loggedIn.value) {
    interface CachetResponse {
        id: string,
        userId: string,
        displayName: string,
        realName: string,
        pronouns: string,
        imageUrl: string,
    }

    //@ts-ignore
    info = await $fetch<CachetResponse>(`https://cachet.hackclub.com/users/${user.value.slackId}`);
}
</script>

<template>
    <div class="startMenu">
        <div class="left">
            <div class="header">
                <img src="~/assets/logos/Disposition.png" alt="Disposition logo" />
                <span>
                    <h1>Disposition</h1>
                    <p>a physical-media based ysws</p>
                </span>
            </div>

            <div class="apps">
                <template v-for="app in APPS">
                    <div v-if="!app.tool && !app.hidden" class="app" @click="manager.open(app.appId)">
                        <img :src="ICONS[app.appId]" />
                        <p>{{ app.title }}</p>
                    </div>
                </template>

            </div>
        </div>

        <div class="right">
            <!-- here we can put some tool apps like dispover. not all of the tool apps tho -->
            <div class="menu-item" @click="manager.open('rigby')">Secret...</div>
            <div class="menu-item" @click="manager.open('winver')">DispoVer</div>
            <AuthState v-slot="{ loggedIn, clear }">
                <div v-if="loggedIn" class="menu-item" @click="clear">Sign Out</div>
                <div v-else class="menu-item" @click="manager.open('auth')">Sign In</div>
            </AuthState>

            <div class="menu-profile">
                <AuthState v-slot="{ loggedIn }">
                    <span v-if="loggedIn && info">
                        <b>{{ info.displayName }}</b>
                        <img class="profile-pic" :src="info.imageUrl"></img>
                    </span>
                    <span v-else>
                        <b>Guest</b>
                        <img class="profile-pic" src="~/assets/misc/pfp.png"></img>
                    </span>
                </AuthState>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-pic {
    height: 25px;
    width: 25px;
    object-fit: fill;
}

.startMenu {
    background: linear-gradient(0deg, #525252 0%, #050505 100%);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 2px solid #797979;

    width: 350px;
    height: 450px;

    display: flex;
    flex-direction: row;
}

.left {
    height: 100%;
    width: 65%;

    padding: 2px;

    color: white;

    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    flex-direction: row;
    gap: 5px;

    span {
        h1 {
            margin: 0;
            font-size: 26px;
        }

        p {
            margin: 0;
            font-size: 12px;
        }
    }

    img {
        height: 80px;
        width: 80px;
    }
}

.right {
    height: 100%;
    width: 35%;

    color: white;

    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: end;
    padding-bottom: 10px;
}

.menu-profile {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    padding: 2px;
    width: 90%;

    user-select: none;

    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
}

.menu-item {
    padding: 2px;
    width: 90%;
    text-align: center;
    transition: 0.2s;

    user-select: none;

    &:hover {
        font-size: larger;
        font-weight: bold;
        cursor: pointer;
    }
}

.apps {
    border: 2px solid #797979;
    background-color: white;
    color: black;
    display: flex;
    flex-direction: column;

    width: 95%;
    height: 80%;

    user-select: none;
    overflow-y: auto;
}

.app {
    display: flex;
    flex-direction: row;
    gap: 15px;

    margin: 0;
    font-size: 20px;

    padding: 5px;
    padding-left: 10px;
    justify-content: start;
    align-items: center;
    transition: 0.2s;

    user-select: none;

    p {
        margin: 0;
    }

    img {
        width: 30px;
        height: 30px;
    }

    &:hover {
        background-color: #1F1F1F;
        font-weight: bold;
        color: white;
        cursor: pointer;
    }
}
</style>