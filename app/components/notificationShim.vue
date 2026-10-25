<template>
    <div class="shim">
        <slot></slot>
    </div>
</template>

<style scoped>
.shim {
    width: 100vw;
    height: 100vh;

    margin: 0;
    padding: calc(35px + 10px) 10px;

    user-select: none;
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;
}
</style>