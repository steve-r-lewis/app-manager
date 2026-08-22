/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/gitignoreTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 21:44
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the .gitignore Template Generator.
 *
 * This suite verifies that the generated ignore files adhere to the security and
 * hygiene standards of the monorepo.
 *
 * Scenarios:
 * 1. Root Application ('root'):
 * - Verifies "Fortress" protection: blocking OS noise (Mac/Windows), IDE settings,
 * and Environment Secrets.
 * - Checks for Monorepo-specific build artifact blocking (.nuxt, dist, etc.).
 *
 * 2. Nuxt Layer ('layer'):
 * - Verifies minimal footprint.
 * - Ensures local dependency stores (node_modules) are ignored.
 * - Ensures nested git repositories are handled.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-21:44
 * Initial creation and release of gitignoreTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet
import { gitignoreTemplate } from '../../../app/templates/gitignoreTemplate.js';
import type { GitIgnoreContext } from '../../../app/types/index.js';

describe('gitignoreTemplate', () => {
	
	const baseContext = {
		projectName: 'test-project',
		author: 'TestUser',
		year: '2026'
	};
	
	describe('Scenario: Root Application (Target="root")', () => {
		
		const rootContext: GitIgnoreContext = {
			...baseContext,
			target: 'root'
		};
		
		const result = gitignoreTemplate(rootContext);
		
		it('should include Package Manager & Dependency blocks', () => {
			expect(result).toContain('# 1. Package Managers & Dependency Stores');
			expect(result).toContain('**/node_modules/');
			expect(result).toContain('**/.pnpm-store/');
		});
		
		it('should strictly ignore Environment & Secrets', () => {
			expect(result).toContain('# 2. Environment & Secrets');
			expect(result).toContain('**/.env');
			// Ensure we allow example files
			expect(result).toContain('!**/.env.example');
		});
		
		it('should ignore System & OS Noise', () => {
			expect(result).toContain('# 3. System / OS Noise');
			expect(result).toContain('**/Thumbs.db'); // Windows
			expect(result).toContain('**/.DS_Store'); // Mac
		});
		
		it('should ignore Nuxt/Nitro Build Artifacts', () => {
			expect(result).toContain('# 5. Nuxt / Nitro / Vite Build & Cache Artefacts');
			expect(result).toContain('**/.nuxt/');
			expect(result).toContain('**/.output/');
		});
		
		it('should ignore Editor/IDE metadata', () => {
			expect(result).toContain('# 9. IDE / Editor Project Metadata');
			expect(result).toContain('.idea/');
			expect(result).toContain('.vscode/');
		});
	});
	
	describe('Scenario: Nuxt Layer (Target="layer")', () => {
		
		const layerContext: GitIgnoreContext = {
			...baseContext,
			target: 'layer'
		};
		
		const result = gitignoreTemplate(layerContext);
		
		it('should be minimal', () => {
			// Should NOT contain the massive headers from root
			expect(result).not.toContain('# 3. System / OS Noise');
			expect(result).not.toContain('# 9. IDE / Editor Project Metadata');
		});
		
		it('should ignore basic dependency and git files', () => {
			expect(result).toContain('**/.git');
			expect(result).toContain('**/node_modules/');
		});
	});
});