<script setup lang="ts">
import type { Item } from '~/types/database';

const manager = useWindowManager();

const data = ref<Record<string, Item[]>>();
data.value = await $fetch<Record<string, Item[]>>("/api/shop/items/shelves");
</script>

<template>
	<div class="content">
		<div class="header">
			<div class="striped-bg">
				<div class="app-logo">
					<img src="~/assets/logos/Shop.png" alt="DispoShop Logo" class="logo" />
					<span>
						<h2>DispoShop</h2>
						<p>a physical-media based shop</p>
					</span>
				</div>

				<div class="app-buttons">
					<button @click="manager.open('orders')">My orders</button>
					<button @click="manager.open('requests')">My requests</button>
				</div>
			</div>

			<div class="spacer"></div>
		</div>

		<div class="main" v-if="data">
			<template v-for="(items, name) in data">
				<section class="browse-section" v-if="items.length > 0">
					<h2>{{ name }}</h2>
					<div class="items">
						<div v-for="item in items" class="item" @click="manager.open('item', { id: item.id })" :key="item.id">
							<img class="cover" :src="`/images/${item.image}`" :alt="`${item.artist} - ${item.album}`" />
							<p class="album" v-if="item.media == 'other'">{{ item.album }}</p>
							<p class="album" v-else>{{ item.album }} ({{ item.media }})</p>
							<p class="artist" v-if="item.media != 'other'">{{ item.artist }}</p>
							<p class="price">{{ item.price }} C</p>
						</div>
					</div>
				</section>
			</template>
		</div>
		<div class="flex-center" v-else>
			<p>Error fetching shop data :(</p>
		</div>
	</div>
</template>

<style scoped>
.browse-section {
	display: flex;
	flex-direction: column;

	align-items: start;
	justify-content: center;

	gap: 10px;

	h2 {
		margin: 0;
	}

	.items {
		display: flex;
		flex-direction: row;

		.item {
			border: 2px solid #c6c6c4;
			background-color: #dedede;
			padding: 5px;

			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 2px;

			.cover {
				width: 100px;
				height: 100px;
			}

			.album {
				margin: 0;
				font-weight: bold;
			}

			.artist {
				margin: 0;
			}

			.price {
				margin: 0;
				text-align: right;
			}
		}

		.item:hover {
			cursor: pointer;
		}
	}
}

.main {
	padding: 10px;
	overflow-y: auto;

	display: flex;
	flex-direction: column;
	gap: 10px;
}

.content {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

/* i love css */
.striped-bg {
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	padding-left: 7px;
	gap: 2px;
	background: repeating-linear-gradient(0deg,
			#d7d7d7 0px,
			#d7d7d7 6px,
			#9f9f9f 6px,
			#9f9f9f 7px);

	.app-buttons {
		display: flex;
		flex-direction: column;
		justify-content: start;
		justify-items: end;
		width: 30%;
		padding-right: 10px;
		gap: 5px;
	}

	.app-logo {
		display: flex;
		flex-direction: row;
		justify-content: start;
		width: 100%;

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
	}
}

.logo {
	width: 60px;
	height: 60px;
	filter: drop-shadow(0 0 0.2rem black);
}

.spacer {
	width: 100%;
	height: 12px;
	border: 1px solid #c6c6c4;
	background-color: #dedede;
}

.header {
	display: flex;
	flex-direction: column;

	font-family: 'Joan', serif;
	user-select: none;
}
</style>