/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/rootConfigTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 23:47
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Root Configuration Template Generators.
 *
 * This module contains the generators for the essential root-level configuration
 * files required by the Monorepo architecture.
 *
 * Includes:
 * 1. editorConfigTemplate  -> .editorconfig (Formatting rules)
 * 2. npmrcTemplate         -> .npmrc (Package manager rules)
 * 3. nuxtrcTemplate        -> .nuxtrc (Nuxt framework settings)
 * 4. pnpmWorkspaceTemplate -> pnpm-workspace.yaml (Workspace definitions)
 * 5. gitModulesTemplate    -> .gitmodules (Submodule tracking)
 * 6. vitestConfigTemplate  -> vitest.config.ts (Test runner config)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-23:47
 * Initial creation and release of rootConfigTemplate.ts
 *
 * ================================================================================
 */

import type {
	BaseTemplateContext,
	PnpmWorkspaceContext,
	GitModulesContext,
	TemplateFunction
} from '../types/index.js';

/**
 * Generates .editorconfig content.
 * Enforces consistent coding styles between editors.
 */
export const editorConfigTemplate: TemplateFunction<BaseTemplateContext, string> = () => {
	return `root = true

[*]
indent_size = 2
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`;
};

/**
 * Generates .npmrc content.
 * Configures pnpm behavior (hoisting) for compatibility.
 */
export const npmrcTemplate: TemplateFunction<BaseTemplateContext, string> = () => {
	return `shamefully-hoist=true
`;
};

/**
 * Generates .nuxtrc content.
 * Configures Nuxt-specific runtime/build settings.
 */
export const nuxtrcTemplate: TemplateFunction<BaseTemplateContext, string> = () => {
	return `typescript.includeWorkspace = true
`;
};

/**
 * Generates pnpm-workspace.yaml content.
 * Defines the monorepo structure and build dependencies.
 */
export const pnpmWorkspaceTemplate: TemplateFunction<PnpmWorkspaceContext, string> = (ctx) => {
	const packages = ctx.packages.map(p => `  - '${p}'`).join('\n');
	
	let content = `packages:\n${packages}\n\n`;
	
	if (ctx.builtDependencies && ctx.builtDependencies.length > 0) {
		content += `onlyBuiltDependencies:\n`;
		content += ctx.builtDependencies.map(d => `  - ${d}`).join('\n') + '\n';
	}
	
	return content;
};

/**
 * Generates .gitmodules content.
 * Maps submodule paths to their remote repositories.
 */
export const gitModulesTemplate: TemplateFunction<GitModulesContext, string> = (ctx) => {
	if (!ctx.modules || ctx.modules.length === 0) {
		return '';
	}
	
	return ctx.modules.map(mod => `[submodule "${mod.name}"]
\tpath = ${mod.path}
\turl = ${mod.url}`).join('\n\n');
};

/**
 * Generates vitest.config.ts content.
 * Configures the test runner to scan the entire monorepo.
 */
export const vitestConfigTemplate: TemplateFunction<BaseTemplateContext, string> = (ctx) => {
	// Safety Fence for code blocks
	const importBlock = `import { defineVitestConfig } from '@nuxt/test-utils/config'`;
	
	return `/**
 * ================================================================================
 *
 * @project:    ${ctx.projectName}
 * @file:       ~/vitest.config.ts
 * @version:    V1.0.0
 * @createDate: ${ctx.year || new Date().getFullYear()} Dec 10
 * @author:     ${ctx.author || 'Maintainer'}
 *
 * ================================================================================
 *
 * @description:
 * Configurations for Vitest unit testing.
 *
 * ================================================================================
 */

${importBlock}

export default defineVitestConfig({
  test: {
    // Ensure we scan the root tests AND the layer tests
    include: [
      'tests/**/*.test.ts',
      'layers/**/*.test.ts'
    ],
  }
})
`;
};