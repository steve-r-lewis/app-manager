/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/autoDoc.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 29
 * @createTime: 00:05
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
 * V1.0.0, 20251229-00:05
 * Initial creation and release of autoDoc.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { autoDoc } from '../../../../app/commands/utils/autoDoc';
import { llm } from '../../../../app/services/llmService';
import * as prompts from '@clack/prompts';
import { consola } from 'consola';

// --- Mocks ---
vi.mock('../../../../app/services/llmService');
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_auto_doc');

describe('autoDoc (E2E - Mocked LLM)', () => {
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup: Default Prompts
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		// Setup: Mock LLM Response
		// We pretend the LLM returns a standard JSDoc block
		vi.mocked(llm.generate).mockResolvedValue(`/**
 * @function add
 * @description Adds two numbers together.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */`);
	});
	
	afterEach(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should inject JSDoc into undocumented source files', async () => {
		// 1. Setup Fixture
		const filePath = path.join(TEST_ROOT, 'math.ts');
		const originalContent = `export function add(a: number, b: number) { return a + b; }`;
		fs.writeFileSync(filePath, originalContent);
		
		// 2. Execute
		// Running on TEST_ROOT should scan, find math.ts, and process it
		await autoDoc(TEST_ROOT);
		
		// 3. Verify
		// Ensure LLM was called
		expect(llm.generate).toHaveBeenCalled();
		
		// Check File Content Update
		const newContent = fs.readFileSync(filePath, 'utf-8');
		
		// Should contain the injected JSDoc
		expect(newContent).toContain('/**');
		expect(newContent).toContain('@description Adds two numbers together.');
		
		// Should still contain the original code
		expect(newContent).toContain('export function add');
	});
	
	it('should handle LLM failures without corrupting files', async () => {
		// 1. Setup Fixture
		const filePath = path.join(TEST_ROOT, 'fail.ts');
		const originalContent = `const x = 1;`;
		fs.writeFileSync(filePath, originalContent);
		
		// 2. Mock Failure
		vi.mocked(llm.generate).mockRejectedValue(new Error('API Down'));
		
		// 3. Execute
		await autoDoc(TEST_ROOT);
		
		// 4. Verify
		// Error logged
		expect(consola.error).toHaveBeenCalled();
		
		// File should be unchanged
		const currentContent = fs.readFileSync(filePath, 'utf-8');
		expect(currentContent).toBe(originalContent);
	});
});