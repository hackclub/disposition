<script setup lang="ts">
const trendingCount = 3
const staffPicksCount = 3
const cdsCount = 5
const vinylsCount = 5
</script>

<template>
	<div class="content">
		<div class="header">
			<div class="striped-bg">
				<img src="~/assets/logos/Disposition.png" alt="DispoShop Logo" class="logo" />
				<span>
					<h2>DispoShop</h2>
					<p>a physical-media based shop</p>
				</span>
			</div>

			<div class="spacer"></div>
		</div>

<div class="main" style="overflow-y:auto;">
    <div class="browse">
      <section class="browse-section">
        <h2 class="section-title">Trending</h2>
        <div class="row row--3">
          <div v-for="i in trendingCount" :key="'trending-' + i" class="tile" />
        </div>
      </section>

				<section class="browse-section">
					<h2 class="section-title">Staff's Picks</h2>
					<div class="row row--3">
						<div v-for="i in staffPicksCount" :key="'staff-' + i" class="tile" />
					</div>
				</section>

				<section class="browse-section">
					<h2 class="section-title">CDs</h2>
					<div class="row row--5">
						<div v-for="i in cdsCount" :key="'cds-' + i" class="tile" />
					</div>
					<a href="#" class="see-more">See more...</a>
				</section>

				<section class="browse-section">
					<h2 class="section-title">Vinyls</h2>
					<div class="row row--5">
						<div v-for="i in vinylsCount" :key="'vinyls-' + i" class="tile" />
					</div>
					<a href="#" class="see-more">See more...</a>
				</section>

				<p class="request-text">Can't find your favourite album? Request one!</p>
				<a href="#" class="request-link">Click Here</a>
			</div>
		</div>
	</div>
</template>

<style scoped>
.main {
	padding: 10px;

	pre {
		font-family: 'Fira Sans', sans-serif;

		margin: 0;
		font-size: 14px;
		user-select: none;
	}
}

.content {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.striped-bg {
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	padding-left: 7px;
	gap: 2px;
	background: repeating-linear-gradient(0deg,
			#d7d7d7 0px,
			#d7d7d7 6px,
			#9f9f9f 6px,
			#9f9f9f 7px);
}

.striped-bg span {
	display: flex;
	justify-content: center;
	align-items: start;
	flex-direction: column;
}

.striped-bg span h2 {
	margin: 0;
	font-weight: normal;
	filter: drop-shadow(1px 1px 5px #000000);
}

.striped-bg span p {
	margin: 0;
	filter: drop-shadow(1px 1px 5px #000000);
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

.divider {
	flex: 0 0 2px;
	background-color: #d9d9d9;
}

.browse {
  max-width: 460px;
  margin: 0 auto;
  padding: 16px;
  background: #d7d7d7;
  color: black;
}

.browse-section {
	margin-bottom: 20px;
}

.section-title {
	font-size: 20px;
	font-weight: 700;
	margin: 0 0 10px;
}

.row {
	display: grid;
	gap: 10px;
}

.row--3 {
	grid-template-columns: repeat(3, 1fr);
}

.row--5 {
	grid-template-columns: repeat(5, 1fr);
}

.tile {
	aspect-ratio: 1 / 1;
	background-color: #9f9f9f;
}

.see-more {
	display: inline-block;
	margin-top: 10px;
	color: black;
	text-decoration: none;
	font-size: 15px;
}

.request-text {
	font-weight: 700;
	font-size: 17px;
	margin: 24px 0 4px;
}

.request-link {
	color: #2d6cdf;
	text-decoration: none;
	font-size: 16px;
}

.header {
    display: flex;
    flex-direction: column;

    font-family: 'Joan', serif;
    user-select: none;
}
</style>