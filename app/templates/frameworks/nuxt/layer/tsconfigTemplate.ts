/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/tsconfigTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 20:07
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The TypeScript Configuration Template Generator.
 *
 * This template produces the 'tsconfig.json' file. It handles two distinct
 * architectural needs within the Monorepo:
 *
 * 1. Root Mode ('root'):
 * - Defines the "Master" compiler options (ES2016, CommonJS, Strict).
 * - explicitly includes all standard Nuxt 4 directory structures (app/*, layers/*).
 * - Maps the '#imports' alias to the .nuxt generated types.
 *
 * 2. Layer Mode ('layer'):
 * - Defines a "Consumer" config that simply extends the Root/Nuxt config.
 * - Uses the 'extends' property with a calculated relative path.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-20:07
 * Initial creation to pass unit tests.
 * Matches configuration from uploaded 'tsconfig.json-ROOT' and 'tsconfig.json-LAYERS'.
 *
 * ================================================================================
 */

import type { TSConfigContext, TemplateFunction } from '../../../../types/index.js';

/**
 * Generates a strictly typed tsconfig.json object.
 */
export const tsconfigTemplate: TemplateFunction<TSConfigContext, Record<string, any>> = (ctx) => {
	const isRoot = ctx.target === 'root';
	
	// --------------------------------------------------------------------------
	// 1. Root Configuration (The "Universe")
	// --------------------------------------------------------------------------
	if (isRoot) {
		return {
			"compilerOptions": {
				"baseUrl": ".",
				"target": "es2016",
				"module": "commonjs",
				"esModuleInterop": true,
				"forceConsistentCasingInFileNames": true,
				"strict": true,
				"skipLibCheck": true,
				"outDir": "dist",
				"paths": {
					"#imports": [
						".nuxt/imports.d.ts"
					]
				}
			},
			"include": [
				// File Types
				"**/*.css",
				"**/*.ts",
				"**/*.vue",
				"index.ts",
				
				// Nuxt Internals
				".nuxt/nuxt.d.ts",
				".nuxt/tsconfig.json",
				
				// App Structure (Standard Nuxt 4)
				"app/assets",
				"app/components", // Added to ensure test compliance and standard patterns
				"app/composables",
				"app/layouts",
				"app/middleware",
				"app/pages",
				"app/plugins",
				"app/types",
				"app/utils",
				"content",
				
				// Monorepo Structure
				"layers/*",
				"layers/ui/components",
				"server",
				"shared"
			]
		};
	}
	
	// --------------------------------------------------------------------------
	// 2. Layer Configuration (The "Consumer")
	// --------------------------------------------------------------------------
	// Defaults to extending the generated .nuxt config relative to a standard layer depth
	const extendsPath = ctx.relativePath || "../../.nuxt/tsconfig.json";
	
	return {
		"extends": extendsPath
	};
};