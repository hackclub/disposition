<script setup lang="ts">
import badge from '../assets/icons/badge.jpg'
import avatar from '../assets/icons/avatar.png'
import headerbg from '../assets/misc/header.png'
</script>

<template>
    <div class="content">
        <div class="header">
            <img class="header-bg" :src="headerbg" alt="">
        </div>

        <div class="profile-card">
            <img class="avatar" :src="avatar" alt="">
            <div class="profile-info">
                <h2>Username <img class="badge" src:="badge" alt=""></h2>
                <p>"This is a bio look at me"</p>
            </div>
        </div>
      <div class="spacer"></div>
    </div>     

    <div class="main">
        
    </div>

</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    font-family: 'Fira Sans', sans-serif;
    user-select: none;
}

.header {
    display: flex;
    flex-direction: column;
    font-family: 'Joan', serif;
}

.header-bg {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;

        > img {
            position: absoulute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: fill;
            display: block;
        }
}

.profile-card {
    position: absolute;
    top: 8px;
    left: 40px;
    width: 330px;
    max-width: calc(100% - 48px);
    display: flex;
    gap: 12px;
    padding: 6px;
    background: #e3e3e3;
    border: 1px solid #9f9f9f;

    .avatar {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border: 1px solid #777;
        background: #9f9f9f;
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        h2 {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 0;
            font-weight: 500;
            font-family: 'Joan', serif;
        }

        p {
            margin: 0 0 6px;
            font-size: 12px;
        }
    }
}

.badge {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid #c6c6c4;
    background-color: #dedede;
    box-sizing: border-box;
}

.main {
    padding: 10px;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;

    flex-grow: 1;
}

</style>