/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/rootConfigTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 23:46
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for Root Configuration Templates.
 *
 * Verifies the generation of:
 * 1. .editorconfig (Static formatting rules)
 * 2. .npmrc (PNPM hoisting rules)
 * 3. .nuxtrc (TypeScript workspace inclusion)
 * 4. pnpm-workspace.yaml (Package globs and build deps)
 * 5. .gitmodules (Submodule definitions)
 * 6. vitest.config.ts (Test runner setup)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-23:46
 * Initial creation and release of rootConfigTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet
import * as templates from '../../../app/templates/rootConfigTemplate';
import type { PnpmWorkspaceContext, GitModulesContext } from '../../../app/types/index';

const baseCtx = { projectName: 'test', author: 'Steve', year: '2026' };

describe('Root Config Templates', () => {
	
	describe('.editorconfig', () => {
		it('should generate standard formatting rules', () => {
			const result = templates.editorConfigTemplate(baseCtx);
			expect(result).toContain('root = true');
			expect(result).toContain('indent_size = 2');
			expect(result).toContain('[*.md]');
			expect(result).toContain('trim_trailing_whitespace = false');
		});
	});
	
	describe('.npmrc', () => {
		it('should enforce hoisting', () => {
			const result = templates.npmrcTemplate(baseCtx);
			expect(result).toContain('shamefully-hoist=true');
		});
	});
	
	describe('.nuxtrc', () => {
		it('should include workspace typescript', () => {
			const result = templates.nuxtrcTemplate(baseCtx);
			expect(result).toContain('typescript.includeWorkspace = true');
		});
	});
	
	describe('pnpm-workspace.yaml', () => {
		it('should list packages and built dependencies', () => {
			const ctx: PnpmWorkspaceContext = {
				...baseCtx,
				packages: ['layers/*'],
				builtDependencies: ['esbuild', 'vue-demi']
			};
			const result = templates.pnpmWorkspaceTemplate(ctx);
			
			expect(result).toContain('packages:');
			expect(result).toContain("- 'layers/*'");
			expect(result).toContain('onlyBuiltDependencies:');
			expect(result).toContain('- esbuild');
			expect(result).toContain('- vue-demi');
		});
	});
	
	describe('.gitmodules', () => {
		it('should generate submodule entries', () => {
			const ctx: GitModulesContext = {
				...baseCtx,
				modules: [{
					name: 'layers/company-console',
					path: 'layers/company-console',
					url: 'https://github.com/test/repo.git'
				}]
			};
			const result = templates.gitModulesTemplate(ctx);
			
			expect(result).toContain('[submodule "layers/company-console"]');
			expect(result).toContain('path = layers/company-console');
			expect(result).toContain('url = https://github.com/test/repo.git');
		});
		
		it('should handle empty modules list gracefully', () => {
			const result = templates.gitModulesTemplate({ ...baseCtx, modules: [] });
			expect(result).toBe('');
		});
	});
	
	describe('vitest.config.ts', () => {
		it('should configure include paths for root and layers', () => {
			const result = templates.vitestConfigTemplate(baseCtx);
			expect(result).toContain('export default defineVitestConfig');
			expect(result).toContain('tests/**/*.test.ts');
			expect(result).toContain('layers/**/*.test.ts');
		});
	});
});