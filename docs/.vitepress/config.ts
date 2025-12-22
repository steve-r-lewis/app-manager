// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'Nuxt 4 App Manager',
	description: 'TUI-driven monorepo management for Nuxt 4 layers',
	
	cleanUrls: true,
	
	themeConfig: {
		logo: '/logo.svg',
		
		nav: [
			{ text: 'Guide', link: '/guide/introduction' },
			{ text: 'Layers', link: '/layers/overview' },
			{ text: 'Commands', link: '/commands' },
			{ text: 'Architecture', link: '/architecture' }
		],
		
		sidebar: {
			'/layers/': [
				{
					text: 'Nuxt Layers',
					items: [
						{ text: 'Overview', link: '/layers/overview' },
						{ text: 'Creating Layers', link: '/layers/create' },
						{ text: 'Composing Layers', link: '/layers/compose' },
						{ text: 'Layer Conventions', link: '/layers/conventions' }
					]
				}
			],
			'/commands': [
				{
					text: 'CLI / TUI Commands',
					items: [
						{ text: 'Overview', link: '/commands' },
						{ text: 'create-layer', link: '/commands/create-layer' },
						{ text: 'sync', link: '/commands/sync' }
					]
				}
			]
		},
		
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/your-org/nuxt-app-manager' }
		]
	}
})
