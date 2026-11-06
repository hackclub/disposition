<script setup lang="ts">
function crash() {
	Promise.reject(new Error("Try Not To Get Scared: Scariest Stories"));
}
</script>

<template>
	<p>Summons <span style="color: red;">Evil Rigby</span></p>
	<button @click="crash">Summon Evil Rigby</button>
</template>

<style scoped>
</style>
