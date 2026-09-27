// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/content', 'nuxt-auth-utils'],
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	runtimeConfig: {
		hackclub: {
			clientId: process.env.HCA_CLIENT_ID,
			clientSecret: process.env.HCA_CLIENT_SECRET,
		},

		public: {
			baseUrl: "http://localhost:3000",
			adminIds: ["U0A9S13HQF3", "U0AFWJX9CP2", "U0A9M9LC5PV"], // org slack ids

			defaultConfig: {
				welcome: {
					openNext: true,
				},

				settings: {
					showBuddy: true,
					wallpaperSource: "/wallpaper/default.png",
					configVersion: "1.0.0"
				}
			},

		},

		database: {
			url: process.env.DATABASE_URL
		}
	}
})