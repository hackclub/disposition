<script setup lang="ts">
import type { NotificationInstance } from '~/types/notification';

const props = defineProps<{ notification: NotificationInstance }>();

const maxLength = 150;
const desc = (props.notification.description.length > maxLength) ? props.notification.description.trim().substring(0, maxLength - 3).trimEnd() + "..." : props.notification.description

function close() {
    // i'm going to interpret the user closing the notif as "reading" it for now. maybe i'll add a "mark as read" button later on.


}

function more() {

}
</script>

<template>
    <div class="notification">
        <div class="bar">
            <p>{{ props.notification.title }}</p>
            <button class="close" @click="close"></button>
        </div>

        <div class="content">
            <p>{{ desc }}</p>
            <div class="see-more">
                <a @click="more">See more...</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.notification {
    border: 2px solid var(--color-border-dark);
    background-color: var(--color-panel-bg);

    display: flex;
    flex-direction: column;
    padding: 5px;

    width: 400px;
    height: fit-content;
}

.content {
    background-color: var(--color-white);
    border: 2px solid var(--color-border-dark);

    padding: 5px;

    p {
        margin: 0;
    }

    .see-more {
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;

        a {
            margin: 0;
        }

        a:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}

.bar {
    display: flex;
    flex-direction: row;
    padding: 0 5px;
    justify-content: space-between;

    p {
        margin: 0;
        font-weight: bold;
    }

    .close {
        width: 16px;
        height: 16px;
        background-image: url("~/assets/misc/notificationClose.png");
        background-size: contain;
        border: none;
    }
}
</style>