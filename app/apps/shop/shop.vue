<script setup lang="ts">
import type { Item } from '~/types/database';
import ItemCard from '~/components/cards/item.vue';

const manager = useWindowManager();
const { data } = await useFetch<Record<string, Record<string, Item[]>>>("/api/shop/items/shelves");
</script>

<template>
	<AuthState v-slot="{ loggedIn, user }">
		<div class="content">
			<div class="header">
				<div class="striped-bg">
					<div class="app-logo">
						<img src="~/assets/logos/shop.png" alt="DispoShop Logo" class="logo" />
						<span>
							<h2>DispoShop</h2>
							<p>a physical-media based shop</p>
						</span>
					</div>

					<div class="app-buttons" v-if="loggedIn">
						<button @click="manager.open('orders')">My orders</button>
						<button @click="manager.open('requests')">My requests</button>
					</div>
				</div>

				<div class="spacer"></div>
			</div>

			<div class="main" v-if="data">
				<template v-for="(categories, section) in data">
					<div class="browse-section">
						<h1>{{ section }}</h1>
						<div class="divider"></div>

						<template v-for="(items, name) in categories">
							<section class="browse-category" v-if="items.length > 0">
								<h2 v-if="section == 'By Genre'" @click="manager.open('category', { category: name })"
									class="a">{{ name }}↗</h2>
								<h2 v-else>{{ name }}</h2>
								<div class="items">
									<ItemCard v-for="item in items" :item="item"></ItemCard>
								</div>
							</section>
						</template>

					</div>
				</template>
			</div>
			<div class="flex-center" v-else>
				<p>Error fetching shop data :(</p>
			</div>
		</div>
	</AuthState>
</template>

<style scoped>
.a:hover {
	cursor: pointer;
	text-decoration: underline;
}

.divider {
	width: 100%;
	height: 2px;
	background-color: var(--color-border-dark);
}

.browse-section {
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	gap: 5px;

	h1 {
		margin: 0;
	}
}

.browse-category {
	width: 100%;
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
		gap: 5px;
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
			var(--color-gray-light) 0px,
			var(--color-gray-light) 6px,
			var(--color-gray-medium) 6px,
			var(--color-gray-medium) 7px);

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
				filter: drop-shadow(1px 1px 5px var(--color-black));
			}

			p {
				margin: 0;
				filter: drop-shadow(1px 1px 5px var(--color-black));
			}
		}
	}
}

.logo {
	width: 60px;
	height: 60px;
	filter: drop-shadow(0 0 0.2rem var(--color-black));
}

.spacer {
	width: 100%;
	height: 12px;
	border: 1px solid var(--color-border-light);
	background-color: var(--color-panel-bg);
}

.header {
	display: flex;
	flex-direction: column;

	font-family: 'Joan', serif;
	user-select: none;
}
</style>