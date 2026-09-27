// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/content', 'nuxt-auth-utils'],
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	runtimeConfig: {
		hackclub: {
			clientId: process.env.HCA_CLIENT_ID,
			clientSecret: process.env.HCA_CLIENT_SECRET,
			
			adminIds: "",
		},

		public: {
			baseUrl: "http://localhost:3000"
		},

		database: {
			url: process.env.DATABASE_URL
		}
	}
})