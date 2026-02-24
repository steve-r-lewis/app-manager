/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/packageJsonTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 02:57
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Package.json Template Generator.
 *
 * This suite verifies the "Contract" of the template engine, ensuring it produces
 * valid, strictly-typed configuration objects for two distinct scenarios:
 *
 * 1. Root Application ('root'):
 * - Verifies presence of standard scripts (dev, build, appTools).
 * - Verifies 'engines' and 'packageManager' definitions.
 * - Verifies the standard Nuxt/Tailwind dependency stack.
 *
 * 2. Nuxt Layer ('layer'):
 * - Verifies the naming convention (scoped: @monorepo/...).
 * - Verifies the specific 'exports' structure required for Nuxt Layers.
 * - Ensures unnecessary fields (scripts, large dependencies) are omitted.
 *
 * 3. Metadata Injection:
 * - Verifies that author, repository, and funding data is correctly mapped.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-02:57
 * Initial creation and release of packageJsonTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet (Red Phase)
import { packageJsonTemplate, type PackageJsonContext } from '../../../app/templates/packageJsonTemplate.js';

describe('packageJsonTemplate', () => {
	
	// ----------------------------------------------------------------------------
	// Shared Test Data
	// ----------------------------------------------------------------------------
	const baseContext = {
		projectName: 'my-test-app',
		description: 'A test description',
		year: '2026',
		author: 'Test Author',
		authors: [{ name: 'Test Author', email: 'test@example.com', url: 'https://test.com' }],
		repository: { type: 'git', url: 'https://github.com/test/repo.git' },
		bugs: { url: 'https://github.com/test/repo/issues' },
		funding: { type: 'individual', url: 'https://patreon.com/test' }
	};
	
	describe('Scenario: Root Application (Target="root")', () => {
		
		const rootContext: PackageJsonContext = {
			...baseContext,
			target: 'root',
			name: 'my-nuxty-app', // Should remain 'my-nuxty-app'
		};
		
		it('should generate a standard Nuxt Root configuration', () => {
			const result = packageJsonTemplate(rootContext);
			
			// Identity
			expect(result.name).toBe('my-nuxty-app');
			expect(result.private).toBe(true);
			expect(result.type).toBe('module');
			expect(result.main).toBe('nuxt.config.ts');
			
			// Engines & Manager
			expect(result.engines).toEqual({ node: '>=20.0.0', npm: '>=10.0.0' });
			expect(result.packageManager).toMatch(/^pnpm@/); // Expect pnpm
		});
		
		it('should include standard lifecycle scripts', () => {
			const result = packageJsonTemplate(rootContext);
			
			expect(result.scripts).toBeDefined();
			expect(result.scripts?.dev).toBe('nuxt dev --force');
			expect(result.scripts?.build).toBe('nuxt build');
			expect(result.scripts?.appTools).toBe('tsx scripts/tui/app.ts');
		});
		
		it('should include core dependencies (Nuxt, Tailwind, Pinia)', () => {
			const result = packageJsonTemplate(rootContext);
			
			// Dependencies
			const deps = result.dependencies || {};
			expect(deps).toHaveProperty('nuxt');
			expect(deps).toHaveProperty('tailwindcss');
			expect(deps).toHaveProperty('pinia');
			expect(deps).toHaveProperty('vue');
			
			// Dev Dependencies
			const devDeps = result.devDependencies || {};
			expect(devDeps).toHaveProperty('typescript');
			expect(devDeps).toHaveProperty('vitest');
			expect(devDeps).toHaveProperty('tsx');
		});
	});
	
	describe('Scenario: Nuxt Layer (Target="layer")', () => {
		
		const layerContext: PackageJsonContext = {
			...baseContext,
			target: 'layer',
			name: 'accounting', // Should become '@monorepo/accounting'
		};
		
		it('should scope the package name automatically', () => {
			const result = packageJsonTemplate(layerContext);
			expect(result.name).toBe('@monorepo/accounting');
		});
		
		it('should configure exports for Nuxt Layer discovery', () => {
			const result = packageJsonTemplate(layerContext);
			
			expect(result.main).toBe('./nuxt.config.ts');
			expect(result.exports).toEqual({
				".": {
					"types": "./tsconfig.json",
					"import": "./nuxt.config.ts"
				}
			});
		});
		
		it('should have minimal/empty scripts', () => {
			const result = packageJsonTemplate(layerContext);
			// Layers usually don't run independently
			expect(Object.keys(result.scripts || {}).length).toBe(0);
		});
		
		it('should NOT include heavy dependencies (inherited from root)', () => {
			const result = packageJsonTemplate(layerContext);
			
			// Should be empty or minimal
			expect(Object.keys(result.dependencies || {}).length).toBe(0);
			expect(Object.keys(result.devDependencies || {}).length).toBe(0);
		});
	});
	
	describe('Scenario: Metadata Injection', () => {
		it('should correctly map author, repository, and funding', () => {
			const result = packageJsonTemplate({ ...baseContext, target: 'root', name: 'meta-test' } as any);
			
			expect(result.description).toBe('A test description');
			
			// Authors Array
			expect(result.authors).toHaveLength(1);
			expect(result.authors[0].name).toBe('Test Author');
			
			// Repository & Bugs
			expect(result.repository?.url).toBe('https://github.com/test/repo.git');
			expect(result.bugs?.url).toBe('https://github.com/test/repo/issues');
			
			// Funding
			expect(result.funding?.url).toBe('https://patreon.com/test');
		});
	});
});