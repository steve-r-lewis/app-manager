/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/nuxtTypes.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 01:05
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Nuxt 4 Framework Domain.
 *
 * These interfaces define the configuration and command arguments for
 * Nuxt-specific operations, such as scaffolding new Layers (sub-applications)
 * and managing framework-specific environment configurations.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20251231-01:46
 * Refactored to namespaced types (NuxtPrefix) for clarity.
 *
 * V1.0.0, 20251231-01:05
 * Initial creation and release of nuxtTypes.ts
 *
 * ================================================================================
 */

/**
 * Options for the "nuxt create layer" command.
 */
export interface NuxtCreateLayerOptions {
	/** The name of the new layer (will be used for the directory and package.json name) */
	name?: string;
	
	/** A brief description of the layer's role (e.g. "Auth Module", "UI Kit") */
	purpose?: string;
}
