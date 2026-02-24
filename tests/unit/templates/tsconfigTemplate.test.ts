/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/tsconfigTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 19:43
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the TSConfig Template Generator.
 *
 * This suite verifies that the generated tsconfig.json files adhere to the
 * monorepo's strict compilation standards.
 *
 * Scenarios:
 * 1. Root Application ('root'):
 * - Verifies the master "compilerOptions" (CommonJS, ES2016, strict mode).
 * - Ensures the explicit "include" list covers all Nuxt 4 app/ and layer/ folders.
 * - Verifies path mapping for "#imports".
 *
 * 2. Nuxt Layer ('layer'):
 * - Verifies that it extends the central .nuxt configuration.
 * - Checks for correct relative path resolution.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-19:43
 * Initial creation and release of tsconfigTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet
import { tsconfigTemplate } from '../../../app/templates/tsconfigTemplate.js';
import type { TSConfigContext } from '../../../app/types/index.js';

describe('tsconfigTemplate', () => {
	
	const baseContext = {
		projectName: 'test-project',
		author: 'TestUser',
		year: '2026'
	};
	
	describe('Scenario: Root Application (Target="root")', () => {
		
		const rootContext: TSConfigContext = {
			...baseContext,
			target: 'root'
		};
		
		// We cast to 'any' because strict typing of the template output
		// might not be fully inferred in the test file yet
		const result = tsconfigTemplate(rootContext);
		
		it('should define master compilerOptions', () => {
			expect(result.compilerOptions).toBeDefined();
			expect(result.compilerOptions.target).toBe('es2016');
			expect(result.compilerOptions.module).toBe('commonjs');
			expect(result.compilerOptions.strict).toBe(true);
			expect(result.compilerOptions.baseUrl).toBe('.');
		});
		
		it('should configure path aliases', () => {
			const paths = result.compilerOptions.paths;
			expect(paths).toHaveProperty('#imports');
			expect(paths['#imports']).toContain('.nuxt/imports.d.ts');
		});
		
		it('should include all standard Nuxt 4 directories', () => {
			const includes = result.include;
			
			// Core
			expect(includes).toContain('index.ts');
			expect(includes).toContain('.nuxt/nuxt.d.ts');
			
			// App Structure
			expect(includes).toContain('app/pages');
			expect(includes).toContain('app/components'); // Standard assumption
			expect(includes).toContain('app/layouts');
			
			// Layers
			expect(includes).toContain('layers/*');
			expect(includes).toContain('server');
		});
	});
	
	describe('Scenario: Nuxt Layer (Target="layer")', () => {
		
		const layerContext: TSConfigContext = {
			...baseContext,
			target: 'layer',
			relativePath: '../../.nuxt/tsconfig.json'
		};
		
		const result = tsconfigTemplate(layerContext);
		
		it('should extend the root/nuxt configuration', () => {
			expect(result.extends).toBe('../../.nuxt/tsconfig.json');
		});
		
		it('should NOT redefine compiler options', () => {
			// Layers should inherit settings to ensure consistency
			expect(result.compilerOptions).toBeUndefined();
		});
		
		it('should NOT define an include array', () => {
			// Layers rely on the root or their own context implicitly
			// (Per your provided sample file which only had "extends")
			expect(result.include).toBeUndefined();
		});
	});
});