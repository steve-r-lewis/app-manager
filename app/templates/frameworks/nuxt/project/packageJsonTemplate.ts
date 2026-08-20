/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/frameworks/nuxt/{layer|project}/packageJsonTemplate.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 01
 * @createTime: 02:58
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Package.json Generator Template.
 *
 * This template produces the configuration file for Node.js projects. It uses a
 * discriminated union strategy ('root' vs 'layer') to generate two very different
 * file structures.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260820
 * Imported the missing 'PackageJsonContext' type. It exists in templateTypes.ts
 * but was never imported here, which caused TS2304 (Cannot find name).
 * IMPORTANT: verify the import path below actually matches this file's depth
 * in your tree (see the same note in nuxtConfigTemplate.ts).
 *
 * V1.0.0, 20260101-02:58
 * Initial creation and release of packageJsonTemplate.ts
 * Hardcoded dependencies match Nuxt 4 starter standards.
 *
 * ================================================================================
 */

import type { PackageJsonContext, TemplateFunction } from '../../../../types/index.js';

/**
 * Generates a strictly typed package.json object.
 */
export const packageJsonTemplate: TemplateFunction<PackageJsonContext, Record<string, any>> = (ctx) => {
	const isRoot = ctx.target === 'root';

	// 1. Calculate Name (Scope logic)
	const packageName = isRoot ? ctx.name : `@monorepo/${ctx.name}`;

	// 2. Base Structure (Shared by both)
	const base = {
		name: packageName,
		version: ctx.version || "0.0.0",
		description: ctx.description,
		private: ctx.isPrivate ?? true,
		type: "module",
		license: "MIT", // Standard default
		authors: ctx.authors || [{ name: ctx.author || "Unknown" }],
		repository: ctx.repository,
		bugs: ctx.bugs,
		funding: ctx.funding,
	};

	// 3. Root Specific Configuration
	if (isRoot) {
		return {
			...base,
			main: "nuxt.config.ts",
			packageManager: "pnpm@10.25.0",
			engines: {
				node: ">=20.0.0",
				npm: ">=10.0.0"
			},
			scripts: {
				"appTools": "tsx scripts/tui/app.ts",
				"dev": "nuxt dev --force",
				"build": "nuxt build"
			},
			dependencies: {
				"@faker-js/faker": "^10.1.0",
				"@iconify-json/lucide": "^1.2.80",
				"@iconify-json/uil": "^1.2.3",
				"@nuxt/icon": "^2.1.0",
				"@pinia/nuxt": "^0.11.3",
				"@tailwindcss/vite": "^4.1.18",
				"jsonwebtoken": "^9.0.3",
				"nuxt": "^4.2.2",
				"pinia": "^3.0.4",
				"tailwindcss": "^4.1.18",
				"uuidv7": "^1.1.0",
				"vue": "^3.5.25",
				"vue-router": "^4.6.4"
			},
			devDependencies: {
				"@clack/prompts": "^0.11.0",
				"@google/generative-ai": "^0.24.1",
				"@types/node": "^25.0.3",
				"consola": "^3.4.2",
				"dotenv": "^17.2.3",
				"picocolors": "^1.1.1",
				"simple-git": "^3.30.0",
				"tsx": "^4.21.0",
				"typescript": "^5.9.3",
				"vite-tsconfig-paths": "^5.1.4",
				"vitepress": "2.0.0-alpha.15",
				"vitest": "^4.0.15",
				"vue-tsc": "^3.1.8"
			}
		};
	}

	// 4. Layer Specific Configuration
	return {
		...base,
		main: "./nuxt.config.ts",
		exports: {
			".": {
				"types": "./tsconfig.json",
				"import": "./nuxt.config.ts"
			}
		},
		// Layers have empty scripts/dependencies by default
		// as they rely on the host application
		scripts: {},
		dependencies: {},
		devDependencies: {}
	};
};
