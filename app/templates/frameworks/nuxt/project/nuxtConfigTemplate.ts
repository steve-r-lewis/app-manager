/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/nuxtConfigTemplate.ts
 * @version:    1.0.0
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
 * Key Behaviors:
 * 1. Root Mode ('root'):
 * - Injects 'tailwindcss' import and Vite plugin.
 * - Configures strict HMR settings (Port 11500, WebSocket, Timeout) to ensure
 * stability in a Monorepo environment.
 * - Registers global modules (Pinia, Nuxt Icon).
 * - Enables Nitro development mode.
 *
 * 2. Layer Mode ('layer'):
 * - Generates a lightweight config.
 * - Only defines compatibility dates, devtools, and layer extensions.
 * - Omits server/build configuration to rely on the host application.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-16:56
 * Initial creation and release of nuxtConfigTemplate.ts to pass unit tests.
 * Implements specific HMR port locking (11500) and IPv4 forcing.
 *
 * ================================================================================
 */

import type { BaseTemplateContext, TemplateFunction } from '../types/index.js';

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
	// - Registers TailwindCSS
	// - Locks HMR port to avoid conflicts
	// - Forces IPv4 (127.0.0.1) for Windows/Mac stability
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
	// Formats the array into a clean TypeScript string list
	const extendsContent = layers.length > 0
		? `[\n    ${layers.map(l => `"${l}"`).join(',\n    ')}\n  ]`
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