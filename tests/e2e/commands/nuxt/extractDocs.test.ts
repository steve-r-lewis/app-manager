/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/nuxt/extractDocs.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 23:56
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
 * V1.0.0, 20251228-23:56
 * Initial creation and release of extractDocs.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { extractDocs } from '../../../../app/commands/nuxt/extractDocs';
import { llm } from '../../../../app/services/llmService';
import * as prompts from '@clack/prompts';
import { consola } from 'consola';

// --- Mocks ---
vi.mock('../../../../app/services/llmService');
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_extract_docs');

describe('extractDocs (E2E - Mocked LLM)', () => {
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// 1. Mock Prompts
		// Assume user accepts default output path if prompted
		vi.mocked(prompts.text).mockResolvedValue('docs/generated.md');
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		// 2. Mock LLM Service
		// We want to verify the command sends code and saves the response.
		// We don't care about the *actual* quality of docs here, just the plumbing.
		vi.mocked(llm.generate).mockResolvedValue('# AI Generated Documentation\n\nThis is a test.');
	});
	
	afterEach(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should read source files and write LLM output to markdown', async () => {
		// 1. Setup Source Files
		const srcDir = path.join(TEST_ROOT, 'components');
		fs.mkdirSync(srcDir);
		
		// Create a dummy Vue component
		const vueFile = path.join(srcDir, 'Button.vue');
		fs.writeFileSync(vueFile, '<template><button>Click me</button></template>');
		
		// Create a dummy TypeScript file
		const tsFile = path.join(srcDir, 'utils.ts');
		fs.writeFileSync(tsFile, 'export const add = (a, b) => a + b;');
		
		// 2. Execute
		// Pass default options or empty
		await extractDocs(TEST_ROOT);
		
		// 3. Assertions
		
		// Verify LLM was called
		expect(llm.generate).toHaveBeenCalled();
		
		// Verify Output File Creation
		// The mock prompt returned 'docs/generated.md'
		const expectedOutput = path.join(TEST_ROOT, 'docs/generated.md');
		expect(fs.existsSync(expectedOutput)).toBe(true);
		
		const content = fs.readFileSync(expectedOutput, 'utf-8');
		expect(content).toContain('# AI Generated Documentation');
	});
	
	it('should skip node_modules and hidden files', async () => {
		// 1. Setup "Bad" Files
		const nodeModules = path.join(TEST_ROOT, 'node_modules');
		fs.mkdirSync(nodeModules);
		fs.writeFileSync(path.join(nodeModules, 'bad.ts'), 'should not read');
		
		// 2. Execute
		await extractDocs(TEST_ROOT);
		
		// 3. Verify
		// We check the arguments passed to llm.generate to ensure 'bad.ts' content isn't there
		const callArgs = vi.mocked(llm.generate).mock.calls[0][0]; // First arg of first call
		expect(callArgs).not.toContain('should not read');
	});
	
	it('should handle LLM failure gracefully', async () => {
		// 1. Setup
		vi.mocked(llm.generate).mockRejectedValue(new Error('API Rate Limit'));
		fs.writeFileSync(path.join(TEST_ROOT, 'test.ts'), 'console.log("hi")');
		
		// 2. Execute
		await extractDocs(TEST_ROOT);
		
		// 3. Verify
		expect(consola.error).toHaveBeenCalledWith(expect.stringContaining('Rate Limit'));
		// Should NOT create file on failure
		const expectedOutput = path.join(TEST_ROOT, 'docs/generated.md');
		expect(fs.existsSync(expectedOutput)).toBe(false);
	});
});