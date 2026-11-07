<script setup lang="ts">
const manager = useWindowManager();

function crash() {
	Promise.reject(new Error("Try Not To Get Scared: Scariest Stories"));
}
</script>

<template>
	<p>Summons <span style="color: red;">Evil Rigby</span></p>
	<button @click="crash">Summon Evil Rigby</button>


	<button @click="manager.messageBox('hi', 'hello', { info: true })">Hello</button>
	<button @click="manager.messageBox('hi', 'hello', { warning: true })">Hello</button>
	<button @click="manager.messageBox('hi', 'hello', { error: true })">Hello</button>
</template>

<style scoped>
</style>
