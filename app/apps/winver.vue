<script setup lang="ts">
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Docs.png" alt="DispoVer Logo" class="logo" />
                <span>
                    <h2>DispoVer</h2>
                    <p>hey kid, you want some... information?</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="main">
            <AuthState v-slot="{ loggedIn, user }">
                <pre v-if="loggedIn">Hack Club Disposition
Version 0.1 (Build 15: Service Pack 1)
Copyright (c) 2026 Absolutely no one. Some rights reserved.
The Disposition operating system and its user interface are protected by the wonderful MIT license.



This product is licensed under the MIT license to:
    {{ user.name }}
                </pre>
                <pre v-else>Hack Club Disposition
Version 0.1 (Build 15: Service Pack 1)
Copyright (c) 2026 Absolutely no one. Some rights reserved.
The Disposition operating system and its user interface are protected by the wonderful MIT license.



This product is licensed under the MIT license to:
    you!!
                </pre>
            </AuthState>
        </div>
    </div>
</template>

<style scoped>
.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem black);
}

.header {
    display: flex;
    flex-direction: column;

    font-family: 'Joan', serif;
    user-select: none;

    h2 {
        font-weight: normal;
    }
}

.striped-bg {
    width: 100%;

    background: repeating-linear-gradient(0deg,
            #d7d7d7 0px,
            #d7d7d7 6px,
            #9f9f9f 6px,
            #9f9f9f 7px);
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
            filter: drop-shadow(1px 1px 5px #000000);
        }

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px #000000);
        }
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

.main {
    padding: 10px;

    pre {
        font-family: 'Fira Sans', sans-serif;

        margin: 0;
        font-size: 14px;
        user-select: none;
    }
}
</style>