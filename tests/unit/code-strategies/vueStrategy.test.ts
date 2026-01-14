/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/strategies/vueStrategy.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 23:30
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for Vue SFC parsing (delegation & offsets).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-23:30
 * Initial creation and release of vueStrategy.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { VueStrategy } from '../../../app/strategies/vueStrategy';

describe('VueStrategy', () => {
	const strategy = new VueStrategy();
	
	const vueContent = `
<template>
  <h1>Hello</h1>
</template>

<script setup lang="ts">
/**
 * @version: 2.0.0
 */
import { ref } from 'vue';

export const count = ref(0);
export function increment() { count.value++ }
</script>
`;
	
	describe('parseMetadata', () => {
		it('should extract metadata from inside the script tag', () => {
			const meta = strategy.parseMetadata(vueContent);
			expect(meta.version).toBe('2.0.0');
		});
	});
	
	describe('injectHeader', () => {
		it('should inject header INSIDE the script setup tag', () => {
			const newHeader = `/** New Vue Header */`;
			const result = strategy.injectHeader(vueContent, newHeader);
			
			expect(result).toMatch(/<script setup[^>]*>\s*\/\*\* New Vue Header \*\//);
			expect(result).toContain('<template>');
		});
		
		it('should fallback to top of file if no script tag exists', () => {
			const noScript = `<template><div>Test</div></template>`;
			const result = strategy.injectHeader(noScript, '/** Header */');
			expect(result.startsWith('/** Header */')).toBe(true);
		});
	});
	
	describe('findDocumentableBlocks', () => {
		it('should find blocks and apply line offsets', () => {
			const blocks = strategy.findDocumentableBlocks(vueContent);
			
			const func = blocks.find(b => b.name === 'increment');
			expect(func).toBeDefined();
			// Script starts after template, so line > 5
			expect(func?.startLine).toBeGreaterThan(5);
		});
	});
});