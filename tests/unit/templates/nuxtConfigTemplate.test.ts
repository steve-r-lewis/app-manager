/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/nuxtConfigTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 16:19
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Nuxt Config Template Generator.
 *
 * Unlike the package.json template (which returns an Object), this template
 * returns a String of raw TypeScript code. Therefore, these tests verify
 * the presence of specific code blocks and configuration signatures.
 *
 * Scenarios:
 * 1. Root Application ('root'):
 * - Verifies 'tailwindcss' import and usage.
 * - Checks for specific HMR server settings (Port 11500, WS protocol).
 * - Verifies global modules (Pinia, Icon).
 *
 * 2. Nuxt Layer ('layer'):
 * - Verifies a minimalist 'defineNuxtConfig' block.
 * - Ensures heavy server config is absent.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-16:19
 * Initial creation and release of nuxtConfigTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet (Red Phase)
import { nuxtConfigTemplate, type NuxtConfigContext } from '../../../app/templates/nuxtConfigTemplate.js';

describe('nuxtConfigTemplate', () => {
	
	const baseContext = {
		projectName: 'test-project',
		compatibilityDate: '2025-10-08',
		// BaseTemplateContext required fields
		author: 'TestUser',
		year: '2026'
	};
	
	describe('Scenario: Root Application (Target="root")', () => {
		
		const rootContext: NuxtConfigContext = {
			...baseContext,
			target: 'root',
			layers: ['@monorepo/ui-library', '@monorepo/auth'],
			port: 11500
		};
		
		const result = nuxtConfigTemplate(rootContext);
		
		it('should import and register TailwindCSS', () => {
			expect(result).toContain("import tailwindcss from '@tailwindcss/vite'");
			expect(result).toContain('tailwindcss()');
		});
		
		it('should configure specific HMR server settings', () => {
			// Critical for Monorepo stability
			expect(result).toContain('port: 11500');
			expect(result).toContain("protocol: 'ws'");
			expect(result).toContain('timeout: 30000');
		});
		
		it('should extend the provided layers', () => {
			expect(result).toContain('"@monorepo/ui-library"');
			expect(result).toContain('"@monorepo/auth"');
		});
		
		it('should register global modules (Pinia, Icon)', () => {
			expect(result).toContain("'@pinia/nuxt'");
			expect(result).toContain("'@nuxt/icon'");
		});
		
		it('should configure Nitro for dev', () => {
			expect(result).toContain('nitro: {');
			expect(result).toContain('dev: true');
		});
	});
	
	describe('Scenario: Nuxt Layer (Target="layer")', () => {
		
		const layerContext: NuxtConfigContext = {
			...baseContext,
			target: 'layer',
			layers: ['@monorepo/utils'] // Layers can extend other layers
		};
		
		const result = nuxtConfigTemplate(layerContext);
		
		it('should NOT include TailwindCSS import', () => {
			// Layers usually consume CSS, not define the compiler
			expect(result).not.toContain("import tailwindcss from '@tailwindcss/vite'");
		});
		
		it('should NOT include HMR Server settings', () => {
			// Layers are passive; they don't run a server
			expect(result).not.toContain('server: {');
			expect(result).not.toContain('port: 11500');
		});
		
		it('should still support extending other layers', () => {
			expect(result).toContain('"@monorepo/utils"');
		});
		
		it('should be minimal', () => {
			// Ensure modules block is absent or empty if not needed
			// (Assuming layers don't hardcode modules by default in this pattern)
			expect(result).not.toContain('modules: [');
			// OR if it exists, it shouldn't have the root defaults
			expect(result).not.toContain("'@pinia/nuxt'");
		});
	});
});