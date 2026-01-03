/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/templateTypes.ts
 * @version:    1.2.0
 * @createDate: 2026 Jan 01
 * @createTime: 01:24
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Template Engine Domain.
 *
 * This file defines the "Contract" for the Code-as-Templates architecture.
 * Unlike traditional text-based templating (e.g., Mustache, Handlebars) which
 * parse strings at runtime, this system uses TypeScript functions to generate
 * output.
 *
 * Architecture:
 * 1. Context (Input): A strictly typed interface defining the variables needed.
 * 2. Template (Logic): A pure function that accepts Context and returns Output.
 * 3. Output (Result): A string (for text files) or Object (for JSON files).
 * 4. Base Context: Metadata shared by ALL templates (author, year).
 * 5. Targeted Context: Metadata shared by Strategy-based templates (root vs layer).
 * 6. Specific Contexts: Unique requirements for individual files.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0, 20260101-21:53
 * Refactored 'target' property into reusable TargetedTemplateContext interface.
 *
 * V1.1.0, 20260101-17:35
 * Moved specific template contexts (PackageJson, NuxtConfig) here for
 * global availability.
 *
 * V1.0.0, 20260101-01:24
 * Initial creation and release of templateTypes.ts
 *
 * ================================================================================
 */

/**
 * The Standard Context available to ALL templates.
 *
 * This base interface ensures that core project metadata is universally available
 * to every template without needing to be manually passed every time.
 * Specific templates should extend this interface to add their own unique requirements.
 */
export interface BaseTemplateContext {
	/**
	 * The name of the project or module being generated.
	 * Used for titles, package names, and documentation headers.
	 */
	projectName: string;
	
	/**
	 * The author's name to credit in file headers or package.json.
	 * Defaults to the system configuration if not provided.
	 */
	author?: string;
	
	/**
	 * The current copyright year.
	 * Useful for license headers and copyright notices.
	 */
	year?: string;
}

/**
 * A Context for templates that switch logic based on Monorepo Location.
 * This enforces that all config files must handle both 'Root' and 'Layer' strategies.
 */
export interface TargetedTemplateContext extends BaseTemplateContext {
	/**
	 * Determines the output strategy:
	 * - 'root': Configuration for the Monorepo Root (The "Host").
	 * - 'layer': Configuration for a Nuxt Layer Package (The "Guest").
	 */
	target: 'root' | 'layer';
}


/**
 * The Universal Template Signature.
 *
 * A "Template" is simply a pure function that transforms a Context into an Output.
 *
 * @template TInput - The specific context interface (extends BaseTemplateContext).
 * @template TOutput - The result type (string for Text/Code, object for JSON).
 *
 * @example
 * // A template that generates a package.json object
 * const pkgTemplate: TemplateFunction<PackageContext, object> = (ctx) => ({ name: ctx.name });
 */
export type TemplateFunction<TInput extends BaseTemplateContext, TOutput> =
	(context: TInput) => TOutput;

// --------------------------------------------------------------------------------
// Specific Template Contexts
// --------------------------------------------------------------------------------

/**
 * Inputs for package.json generation.
 */
export interface PackageJsonContext extends TargetedTemplateContext {
	/**
	 * The raw name of the project.
	 * - If target='layer', this will be automatically prefixed with '@monorepo/'.
	 */
	name: string;
	
	description: string;
	version?: string;
	isPrivate?: boolean;
	
	authors?: { name: string; email?: string; url?: string }[];
	repository?: { type: string; url: string };
	bugs?: { url: string };
	funding?: { type: string; url: string };
}

/**
 * Inputs for nuxt.config.ts generation.
 */
export interface NuxtConfigContext extends TargetedTemplateContext {
	layers?: string[];
	port?: number;
	compatibilityDate?: string;
}

/**
 * Inputs for tsconfig.json generation.
 */
export interface TSConfigContext extends TargetedTemplateContext {
	/**
	 * The relative path to the .nuxt directory or root tsconfig.
	 * Required only for 'layer' targets.
	 */
	relativePath?: string;
}

/**
 * Inputs for README.md generation.
 */
export interface ReadmeContext extends TargetedTemplateContext {
	features?: string[];
	requirements?: string[];
}

/**
 * Inputs for .gitignore generation.
 */
export interface GitIgnoreContext extends TargetedTemplateContext {
	// No additional fields needed yet, but keeping the interface allows extension
}

/**
 * Inputs for LICENSE file generation.
 */
export interface LicenseContext extends TargetedTemplateContext {
	/**
	 * The type of license to generate:
	 * - 'MIT': Permissive. Users can do anything (including close-source).
	 * - 'GPLv3': Copyleft. Derivative works must remain open source.
	 */
	licenseType: 'MIT' | 'GPLv3';
	
	/**
	 * The email contact for the copyright holder.
	 * Required for standard license headers (e.g., "Copyright 2026 Name <email>").
	 */
	email: string;
}

// --------------------------------------------------------------------------------
// Root Configuration Contexts
// --------------------------------------------------------------------------------

/**
 * Inputs for pnpm-workspace.yaml generation.
 */
export interface PnpmWorkspaceContext extends BaseTemplateContext {
	/**
	 * List of package globs (e.g., "layers/*").
	 */
	packages: string[];
	
	/**
	 * List of dependencies that must be built (e.g., "esbuild").
	 * Matches the 'onlyBuiltDependencies' field.
	 */
	builtDependencies?: string[];
}

/**
 * Inputs for .gitmodules generation.
 */
export interface GitModulesContext extends BaseTemplateContext {
	/**
	 * List of submodules to register.
	 */
	modules: {
		name: string; // e.g., "layers/company-console"
		path: string; // e.g., "layers/company-console"
		url: string;  // e.g., "https://github.com/..."
	}[];
}