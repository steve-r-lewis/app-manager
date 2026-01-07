/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/codeService.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 06
 * @createTime: 22:17
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Full Unit Test Suite for the Code Service.
 *
 * Coverage:
 * 1. Strategy Dispatch (File extension routing).
 * 2. TypeScript Strategy (Metadata, Inspection, Injection).
 * 3. Vue Strategy (Sandwich architecture, Offset calculation, Header placement).
 * 4. Header Management (Replacement, Prepending, Safety).
 * 5. LLM Integration (Flow verification).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260106-22:17
 * Initial creation and release of codeService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { codeService } from '../../../app/services/codeService';
import { fileService } from '../../../app/services/fileService';
import { llmService } from '../../../app/services/llmService';
import { logger } from '../../../app/services/loggerService';

// Mock dependencies
vi.mock('../../../app/services/fileService');
vi.mock('../../../app/services/llmService');
vi.mock('../../../app/services/loggerService');

describe('CodeService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
	});
	
	// ========================================================================
	// Group 1: General & Dispatching
	// ========================================================================
	describe('Initialization & Dispatch', () => {
		it('should throw error for unsupported file extensions', () => {
			expect(() => codeService.inspect('image.png'))
				.toThrow('Unsupported file type: .png');
		});
		
		it('should throw error if file does not exist', () => {
			vi.mocked(fileService.read).mockReturnValue(null);
			expect(() => codeService.inspect('missing.ts'))
				.toThrow('File not found: missing.ts');
		});
	});
	
	// ========================================================================
	// Group 2: TypeScript Strategy
	// ========================================================================
	describe('Strategy: TypeScript', () => {
		const tsContent = `
/**
 * @version: 1.0.0
 * @author: Steve
 */
import { foo } from 'bar';

/** Existing Docs */
export function documentedFunc() {}

export const undocumentedVar = 10;

export class MyClass {}
`;
		
		it('should parse metadata from header', () => {
			vi.mocked(fileService.read).mockReturnValue(tsContent);
			// We can test metadata parsing implicitly via inspect or expose it if needed.
			// Currently inspect returns CodeBlocks, not metadata.
			// Testing metadata update flow:
			codeService.updateHeader('test.ts', '/** New Header */');
			
			const call = vi.mocked(fileService.write).mock.calls[0];
			expect(call[1]).toContain('/** New Header */');
			expect(call[1]).not.toContain('@version: 1.0.0'); // Replaced
		});
		
		it('should find all documentable blocks', () => {
			vi.mocked(fileService.read).mockReturnValue(tsContent);
			const blocks = codeService.inspect('test.ts');
			
			expect(blocks).toHaveLength(3); // func, var, class
			
			const func = blocks.find(b => b.name === 'documentedFunc');
			expect(func?.hasDoc).toBe(true);
			expect(func?.type).toBe('function');
			
			const variable = blocks.find(b => b.name === 'undocumentedVar');
			expect(variable?.hasDoc).toBe(false);
			expect(variable?.type).toBe('const');
		});
		
		it('should prepend header if none exists', () => {
			vi.mocked(fileService.read).mockReturnValue('export const x = 1;');
			codeService.updateHeader('test.ts', '/** Header */');
			
			const content = vi.mocked(fileService.write).mock.calls[0][1];
			expect(content).toBe('/** Header */\n\nexport const x = 1;');
		});
	});
	
	// ========================================================================
	// Group 3: Vue Strategy (The Complex One)
	// ========================================================================
	describe('Strategy: Vue SFC', () => {
		// New Layout: Header inside Script Setup
		const vueContent = `
<script setup lang="ts">
/**
 * @project: Demo
 * @file: demo.vue
 */

import { ref } from 'vue';

export function vueFunc() {
  return true;
}
</script>

<template>
  <div></div>
</template>
`;
		
		it('should find functions inside script and calculate offsets', () => {
			vi.mocked(fileService.read).mockReturnValue(vueContent);
			const blocks = codeService.inspect('demo.vue');
			
			const func = blocks.find(b => b.name === 'vueFunc');
			expect(func).toBeDefined();
			
			// Critical Check: Line Number Offset
			// <script> is on line 1 (index 1).
			// Header takes ~4 lines.
			// Function is around line 8 in the raw file.
			expect(func?.startLine).toBeGreaterThan(5);
			expect(func?.signature).toContain('export function vueFunc');
		});
		
		it('should replace header INSIDE the script tag', () => {
			vi.mocked(fileService.read).mockReturnValue(vueContent);
			
			codeService.updateHeader('demo.vue', '/** New Vue Header */');
			
			const content = vi.mocked(fileService.write).mock.calls[0][1];
			
			// 1. Verify Structure Integrity
			expect(content).toContain('<script setup lang="ts">');
			expect(content).toContain('<template>');
			
			// 2. Verify Replacement
			expect(content).toContain('/** New Vue Header */');
			expect(content).not.toContain('@project: Demo'); // Old header gone
			
			// 3. Verify Code Preservation
			expect(content).toContain('export function vueFunc');
		});
		
		it('should prepend header inside script if missing', () => {
			const noHeaderVue = `<script setup lang="ts">\nconst x = 1;\n</script>`;
			vi.mocked(fileService.read).mockReturnValue(noHeaderVue);
			
			codeService.updateHeader('demo.vue', '/** New Header */');
			
			const content = vi.mocked(fileService.write).mock.calls[0][1];
			
			// Should look like: <script ...>\n/** New Header */\n\nconst x = 1;...
			expect(content).toMatch(/<script[^>]*>\n\/\*\* New Header \*\/\n\nconst x/);
		});
		
		it('should fallback gracefully if no script tag exists', () => {
			const noScript = `<template><div>Hello</div></template>`;
			vi.mocked(fileService.read).mockReturnValue(noScript);
			
			codeService.updateHeader('demo.vue', '/** Header */');
			
			const content = vi.mocked(fileService.write).mock.calls[0][1];
			// Just prepend to top of file
			expect(content).startsWith('/** Header */');
			expect(content).toContain('<template>');
		});
		
		it('should inject JSDoc inside the script block', async () => {
			vi.mocked(fileService.read).mockReturnValue(vueContent);
			vi.mocked(llmService.generate).mockResolvedValue('/** AI Docs */');
			
			await codeService.generateDocFor('demo.vue', 'vueFunc');
			
			const content = vi.mocked(fileService.write).mock.calls[0][1];
			
			expect(content).toContain('/** AI Docs */\nexport function vueFunc');
			expect(content).toContain('<template>'); // Validates we didn't lose the rest of the file
		});
	});
	
	// ========================================================================
	// Group 4: Workflow Integration
	// ========================================================================
	describe('Workflow Integration', () => {
		it('should throw if function not found during doc generation', async () => {
			vi.mocked(fileService.read).mockReturnValue('export const x = 1;');
			
			await expect(codeService.generateDocFor('file.ts', 'ghostFunc'))
				.rejects.toThrow("Function 'ghostFunc' not found");
		});
		
		it('should log success on successful update', async () => {
			vi.mocked(fileService.read).mockReturnValue('export function f() {}');
			vi.mocked(llmService.generate).mockResolvedValue('/** Doc */');
			
			await codeService.generateDocFor('file.ts', 'f');
			
			expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Injected docs for f'));
		});
	});
});