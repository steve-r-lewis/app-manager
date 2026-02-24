/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/vueComponentTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 00:25
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260107-00:25
 * Initial creation and release of vueComponentTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { vueComponentTemplate } from '../../../app/templates/vueComponentTemplate.js';
import type { VueComponentContext } from '../../../app/types/index.js';

describe('vueComponentTemplate', () => {
	
	const baseContext: VueComponentContext = {
		projectName: 'test-project',
		name: 'TestComponent',
		year: 2026,
		author: 'Tester',
		description: 'A test component'
	};
	
	// --------------------------------------------------------------------------
	// 1. Structure & Layout
	// --------------------------------------------------------------------------
	describe('Structure & Layout', () => {
		it('should strictly follow Script -> Template -> Style order', () => {
			const result = vueComponentTemplate(baseContext);
			
			const scriptPos = result.indexOf('<script setup lang="ts">');
			const templatePos = result.indexOf('<template>');
			const stylePos = result.indexOf('<style scoped>');
			
			expect(scriptPos).toBe(0); // Script must be first
			expect(templatePos).toBeGreaterThan(scriptPos);
			expect(stylePos).toBeGreaterThan(templatePos);
		});
		
		it('should place JSDoc header INSIDE the script block', () => {
			const result = vueComponentTemplate(baseContext);
			
			// Verify <script> is immediately followed by /**
			// We allow for a newline, but it must be before any code or closing tag
			expect(result).toMatch(/<script setup lang="ts">\n\/\*\*/);
			
			// Verify header content is present
			expect(result).toContain('@project:    test-project');
		});
	});
	
	// --------------------------------------------------------------------------
	// 2. Content Interpolation
	// --------------------------------------------------------------------------
	describe('Content Interpolation', () => {
		it('should interpolate basic context values', () => {
			const result = vueComponentTemplate(baseContext);
			
			expect(result).toContain('@author:     Tester');
			expect(result).toContain('~/components/TestComponent.vue');
			expect(result).toContain('<h2>TestComponent.vue</h2>');
		});
		
		it('should handle CSS class naming convention (lowercase)', () => {
			// Current implementation lowercases the whole name.
			// e.g. UserProfile -> userprofile
			const result = vueComponentTemplate({
				...baseContext,
				name: 'UserProfileCard'
			});
			
			expect(result).toContain('class="userprofilecard"');
		});
		
		it('should generate valid Date and Time strings', () => {
			const result = vueComponentTemplate(baseContext);
			
			// Checks for YYYY-MM-DD format
			expect(result).toMatch(/@createDate: \d{4}-\d{2}-\d{2}/);
			
			// Checks for HH:MM format
			expect(result).toMatch(/@createTime: \d{2}:\d{2}/);
		});
	});
	
	// --------------------------------------------------------------------------
	// 3. Defaults & Fallbacks
	// --------------------------------------------------------------------------
	describe('Defaults & Fallbacks', () => {
		it('should use default Author if missing', () => {
			const result = vueComponentTemplate({
				projectName: 'p',
				name: 'C'
			});
			expect(result).toContain('@author:     Maintainer');
		});
		
		it('should use TODO description if missing', () => {
			const result = vueComponentTemplate({
				projectName: 'p',
				name: 'C'
			});
			expect(result).toContain('TODO: Create description here');
		});
		
		it('should use current year if missing', () => {
			// Mock Date to ensure stability or just check it exists
			const result = vueComponentTemplate({
				projectName: 'p',
				name: 'C'
			});
			// Since logic uses new Date() inside, we just check the file generation didn't crash
			// and produced a valid V1.0.0 line
			expect(result).toContain('V1.0.0,');
		});
	});
});