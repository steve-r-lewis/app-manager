// .vitepress/config.ts
import { defineConfig } from 'vitepress'

const detailedDesignOverview = '/detailed-design'

const dd1Items = [
	{ text: 'DD-1.1 — Application Invocation', link: '/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01' },
	{ text: 'DD-1.2 — Execution Outcomes', link: '/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01' },
	{ text: 'DD-1.3 — Managed Project', link: '/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01' },
	{ text: 'DD-1.4 — Configuration Resolution', link: '/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01' },
	{ text: 'DD-1.5 — Application Engine', link: '/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01' }
]

const dd1ClarificationItems = [
	{ text: 'Bootstrap Resolution', link: '/dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01' },
	{ text: 'Outcome & Diagnostic Ownership', link: '/dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01' }
]

const dd2Items = [
	{ text: 'DD-2.1 — Resource Access', link: '/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01' },
	{ text: 'DD-2.2 — Process Execution', link: '/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01' },
	{ text: 'DD-2.3 — Repository Capability', link: '/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01' },
	{ text: 'DD-2.4 — Source Intelligence', link: '/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01' },
	{ text: 'DD-2.5 — Source Transformation', link: '/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01' },
	{ text: 'DD-2.6 — Resource Registry & Template', link: '/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01' },
	{ text: 'DD-2.7 — AI Capability', link: '/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01' },
	{ text: 'DD-2.8 — Quality Capability', link: '/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01' },
	{ text: 'DD-2.9 — Documentation Capability', link: '/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01' },
	{ text: 'DD-2.10 — Nuxt Capability', link: '/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01' }
]

const dd2ClarificationItems = [
	{ text: 'Repository / Source Intelligence', link: '/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01' },
	{ text: 'Nuxt Scaffold Artefact Ownership', link: '/dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01' }
]

const dd3Items = [
	{ text: 'DD-3.1 — App Domain', link: '/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01' },
	{ text: 'DD-3.2 — Git Domain', link: '/dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01' },
	{ text: 'DD-3.3 — Nuxt Domain', link: '/dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01' },
	{ text: 'DD-3.4 — Docs Domain', link: '/dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01' }
]

const dd4Items = [
	{ text: 'DD-4.1 — Quality Domain', link: '/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01' },
	{ text: 'DD-4.2 — Settings Domain', link: '/dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01' },
	{ text: 'DD-4.3 — AI Domain', link: '/dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01' },
	{ text: 'DD-4.4 — Utils Domain', link: '/dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01' }
]

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
			{ text: 'Architecture', link: '/architecture' },
			{
				text: 'Detailed Design',
				items: [
					{ text: 'Overview', link: detailedDesignOverview },
					{ text: 'DD-1 — Application Core', link: '/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01' },
					{ text: 'DD-2 — Shared Capabilities', link: '/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01' },
					{ text: 'DD-3 — High-Coupling Domains', link: '/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01' },
					{ text: 'DD-4 — Policy & Resource Domains', link: '/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01' }
				]
			}
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
			],
			'/detailed-design': [
				{ text: 'Detailed Design', items: [{ text: 'Overview', link: detailedDesignOverview }] },
				{ text: 'DD-1 — Application Core', collapsed: true, items: dd1Items },
				{ text: 'DD-2 — Shared Capabilities', collapsed: true, items: dd2Items },
				{ text: 'DD-3 — High-Coupling Domains', collapsed: true, items: dd3Items },
				{ text: 'DD-4 — Policy & Resource Domains', collapsed: true, items: dd4Items }
			],
			'/dd_1_application_core/': [
				{ text: 'Detailed Design', items: [{ text: 'Overview', link: detailedDesignOverview }] },
				{ text: 'DD-1 — Application Core', items: dd1Items },
				{ text: 'Clarifications', collapsed: true, items: dd1ClarificationItems },
				{ text: 'Other Families', collapsed: true, items: [
					{ text: 'DD-2 — Shared Capabilities', link: '/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01' },
					{ text: 'DD-3 — High-Coupling Domains', link: '/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01' },
					{ text: 'DD-4 — Policy & Resource Domains', link: '/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01' }
				] }
			],
			'/dd_2_shared_capabilities/': [
				{ text: 'Detailed Design', items: [{ text: 'Overview', link: detailedDesignOverview }] },
				{ text: 'DD-2 — Shared Capabilities', items: dd2Items },
				{ text: 'Clarifications', collapsed: true, items: dd2ClarificationItems },
				{ text: 'Other Families', collapsed: true, items: [
					{ text: 'DD-1 — Application Core', link: '/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01' },
					{ text: 'DD-3 — High-Coupling Domains', link: '/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01' },
					{ text: 'DD-4 — Policy & Resource Domains', link: '/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01' }
				] }
			],
			'/dd_3_high_coupling_domains/': [
				{ text: 'Detailed Design', items: [{ text: 'Overview', link: detailedDesignOverview }] },
				{ text: 'DD-3 — High-Coupling Domains', items: dd3Items },
				{ text: 'Other Families', collapsed: true, items: [
					{ text: 'DD-1 — Application Core', link: '/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01' },
					{ text: 'DD-2 — Shared Capabilities', link: '/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01' },
					{ text: 'DD-4 — Policy & Resource Domains', link: '/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01' }
				] }
			],
			'/dd_4_policy_and_resource_domains/': [
				{ text: 'Detailed Design', items: [{ text: 'Overview', link: detailedDesignOverview }] },
				{ text: 'DD-4 — Policy & Resource Domains', items: dd4Items },
				{ text: 'Other Families', collapsed: true, items: [
					{ text: 'DD-1 — Application Core', link: '/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01' },
					{ text: 'DD-2 — Shared Capabilities', link: '/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01' },
					{ text: 'DD-3 — High-Coupling Domains', link: '/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01' }
				] }
			]
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/your-org/nuxt-app-manager' }
		]
	}
})