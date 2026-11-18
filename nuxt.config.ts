// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/content', 'nuxt-auth-utils', '@nuxthub/core', "@nuxt/image"],
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	typescript: {
		strict: true,
		tsConfig: {
			compilerOptions: {
				noUncheckedIndexedAccess: true,
				noImplicitOverride: true,
				noFallthroughCasesInSwitch: true
			}
		}
	},

	hub: {
		blob: true
	},

	runtimeConfig: {
		hackclub: {
			clientId: process.env.NUXT_HACKCLUB_CLIENT_ID || process.env.HCA_CLIENT_ID || '',
			clientSecret: process.env.NUXT_HACKCLUB_CLIENT_SECRET || process.env.HCA_CLIENT_SECRET || '',
		},

		hackatime: {
			clientId: process.env.HACKATIME_CLIENT_ID,
			clientSecret: process.env.HACKATIME_CLIENT_SECRET,
		},

		lastfm: {
			apiKey: process.env.LASTFM_API_KEY
		},

		slack: {
			token: process.env.SLACK_TOKEN,
			appToken: process.env.SLACK_APP_TOKEN
		},

		ari: {
			inboundSecret: process.env.ARI_INBOUND_SECRET,
			outboundSecret: process.env.ARI_OUTBOUND_SECRET,
			programId: process.env.ARI_PROGRAM_ID
		},

		public: {
			baseUrl: process.env.BASE_URL,
			adminIds: JSON.parse(process.env.ADMIN_IDS ?? '[]'),
			startDate: Number(process.env.START_DATE ?? 0),

			defaultConfig: {
				onboarding: {}, // step doesn't exist => onboarding doesn't auto launch

				welcome: {
					openNext: true,
				},

				settings: {
					showBuddies: true,
					streamerMode: false,
					
					wallpaperSource: "/wallpaper/default.png",
					configVersion: "1.0.3"
				}
			},

		},

		database: {
			url: process.env.DATABASE_URL
		}
	}
})