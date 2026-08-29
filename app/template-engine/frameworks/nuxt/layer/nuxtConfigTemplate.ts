/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/frameworks/nuxt/{layer|project}/nuxtConfigTemplate.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 01
 * @createTime: 16:56
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Nuxt Configuration Template Generator.
 *
 * This template produces the 'nuxt.config.ts' file. Unlike the JSON templates,
 * this generates a raw TypeScript code string. It assembles "Micro-Templates"
 * (chunks of configuration) based on the target context.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260820
 * - Imported the missing 'NuxtConfigContext' type. It exists in templateTypes.ts
 *   but was never imported here, which caused TS2304 (Cannot find name).
 * - Added an explicit 'string' type to the 'l' callback parameter in the
 *   .map() call to satisfy noImplicitAny (TS7006).
 * - IMPORTANT: verify the import path below ('../../../../types/index.js')
 *   actually matches this file's depth in your tree. It's correct for
 *   app/templates/frameworks/nuxt/{layer|project}/nuxtConfigTemplate.ts
 *   (4 levels up to app/, then into types/). If your build already resolved
 *   the OLD import fine, keep whatever relative path you're currently using
 *   and just add 'NuxtConfigContext' to it.
 *
 * V1.0.0, 20260101-16:56
 * Initial creation and release of nuxtConfigTemplate.ts to pass unit tests.
 * Implements specific HMR port locking (11500) and IPv4 forcing.
 *
 * ================================================================================
 */

import type { NuxtConfigContext, TemplateFunction } from '../../../../types/index.js';

/**
 * Generates the source code string for nuxt.config.ts.
 */
export const nuxtConfigTemplate: TemplateFunction<NuxtConfigContext, string> = (ctx) => {
	const isRoot = ctx.target === 'root';
	const layers = ctx.layers || [];
	const port = ctx.port || 11500;
	const compatDate = ctx.compatibilityDate || '2025-10-08';

	// --------------------------------------------------------------------------
	// 1. Imports Block
	// --------------------------------------------------------------------------
	const imports = isRoot
		? `import { defineNuxtConfig } from 'nuxt/config'\nimport tailwindcss from '@tailwindcss/vite'`
		: `import { defineNuxtConfig } from 'nuxt/config'`;

	// --------------------------------------------------------------------------
	// 2. Modules Block (Root Only)
	// --------------------------------------------------------------------------
	const modulesBlock = isRoot
		? `
  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
  ],`
		: '';

	// --------------------------------------------------------------------------
	// 3. Vite Configuration Block (Root Only)
	// --------------------------------------------------------------------------
	const viteBlock = isRoot
		? `
  vite: {
    plugins: [
      tailwindcss()
    ],
    server: {
      hmr: {
        port: ${port},
        host: '127.0.0.1',
        protocol: 'ws',
        timeout: 30000,
        overlay: true,
      },
    },
    css: {
      devSourcemap: true
    },
    build: {
      cssMinify: true
    }
  },`
		: '';

	// --------------------------------------------------------------------------
	// 4. Nitro Configuration Block (Root Only)
	// --------------------------------------------------------------------------
	const nitroBlock = isRoot
		? `
  nitro: {
    dev: true,
  },`
		: '';

	// --------------------------------------------------------------------------
	// 5. Extends Block (Layers)
	// --------------------------------------------------------------------------
	const extendsContent = layers.length > 0
		? `[\n    ${layers.map((l: string) => `"${l}"`).join(',\n    ')}\n  ]`
		: '[]';

	// --------------------------------------------------------------------------
	// 6. Assembly
	// --------------------------------------------------------------------------
	return `${imports}

export default defineNuxtConfig({
  compatibilityDate: '${compatDate}',
  devtools: { enabled: true },

  extends: ${extendsContent},${modulesBlock}${viteBlock}${nitroBlock}
});
`;
};
