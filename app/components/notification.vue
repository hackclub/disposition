<script setup lang="ts">
const props = defineProps<{ title: string, description: string }>();

function close() {

}
</script>

<template>
    <div class="notification">
        <div class="title-bar">
            <p>{{ props.title }}</p>
            <button class="close" @click="close"></button>
        </div>

        <div class="content">
            <p>{{ props.description }}</p>
            <div class="see-more">
                <a>See more...</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.notification {
    background-color: var(--color-panel-bg);
    border: 2px solid var(--color-border-dark);
}

.title-bar {
    display: flex;
    flex-direction: row;
    padding: 0 5px;
    justify-content: space-around;

    p {
        font-weight: bold;    
    }

    .close {
        width: 16px;
        height: 16px;
        background-image: url("~/assets/window/close.png");
    }
}
</style>