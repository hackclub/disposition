<script setup lang="ts">
import keyIcon from '~/assets/logos/key.png'

defineProps({
    rsvp: {
        type: Boolean,
        required: false,
        default: false
    }
})
</script>

<template>
   <div class="content">
    <div class="header">
        <div class="striped-bg">
            <div class="login-card">
                <img class="key" :src="keyIcon" alt="">
                <h1>Login to<br>Disposition</h1>
            </div>
        </div>

        <div class="spacer"></div>
    </div>

    <div class="main">
        <h2 class="heading">Log in with Hack Club Auth</h2>

        <form action="/oauth" method="get">
            <input id="email" name="login_hint" type="email" placeholder="Input Email" class="streamer-sensitive"
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$">
            <input type="hidden" id="rsvp" name="rsvp" :value="rsvp ? 'true' : 'false'" />
            <input class="login-btn" type="submit" value="Log in" />
        </form>
    </div>
   </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-family:'Inter', 'Fira Sans', sans-serif;
    user-select: none;

}

.header {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.striped-bg {
    box-sizing: border-box;
    width: 100%;
    height: 110px;
    padding: 13px 16px;
    background: repeating-linear-gradient(0deg,
    var(--color-gray-light) 0px,
        var(--color-gray-light) 6px,
        var(--color-gray-medium) 6px,
        var(--color-gray-medium) 7px);
}

.login-card {
    display: flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 12px 0 24px;
    background: var(--color-panel-bg);
    border: 1px solid var(--color-gray-medium);

        .key {
            flex-shrink: 0;
            width: 70px;
            height: 70px;
            object-fit: contain;
        }

        h1 {
            margin: 0 0 0 4px;
            font-family: inherit;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.15;
            white-space: nowrap;
        }
}

.spacer {
    width: 100%;
    height: 14px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    padding: 19px 17px 14px;

    .heading {
        margin: 0 0 11px;
        text-align: center;
        font-family: inherit;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.2;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    Input[type="email"] {
        box-sizing: border-box;
        width: 100%;
        height: 21px;
        padding: 1px 5px;
        font-family: inherit;
        font-size: 12px;
    }

    input[type="submit"] {
        width: 179px;
        height: 28px;
        font-family: inherit; 
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
    }
}
</style>