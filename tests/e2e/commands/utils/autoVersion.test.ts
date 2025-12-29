/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/autoVersion.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 29
 * @createTime: 00:11
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
 * V1.0.0, 20251229-00:11
 * Initial creation and release of autoVersion.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { autoVersion } from '../../../../app/commands/utils/autoVersion';
import { simpleGit } from 'simple-git';
import { llm } from '../../../../app/services/llmService';
import * as prompts from '@clack/prompts';
import { consola } from 'consola';

// --- Mocks ---
vi.mock('simple-git');
vi.mock('../../../../app/services/llmService');
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_auto_version');

describe('autoVersion (E2E - AI Semantic Versioning)', () => {
	let gitMock: any;
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// 1. Mock Git
		gitMock = {
			// Diff returns a dummy change string
			diff: vi.fn().mockResolvedValue('diff --git a/file.ts b/file.ts\n+ const x = 1;'),
			status: vi.fn().mockResolvedValue({ modified: ['file.ts'] })
		};
		vi.mocked(simpleGit).mockReturnValue(gitMock);
		
		// 2. Mock Prompts
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		// 3. Mock LLM (Default: Patch Bump)
		// The command expects JSON from the LLM
		vi.mocked(llm.generate).mockResolvedValue(JSON.stringify({
			type: "patch",
			summary: "Fixed critical bug in logic."
		}));
	});
	
	afterEach(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should parse diff, bump version, and update history', async () => {
		// 1. Setup Fixture
		const filePath = path.join(TEST_ROOT, 'file.ts');
		const originalContent = `/**
 * @version:    1.0.0
 * @notes: Revision History
 *
 * V1.0.0, 20250101-12:00
 * Initial Release
 */
export const x = 1;`;
		fs.writeFileSync(filePath, originalContent);
		
		// 2. Execute
		await autoVersion(TEST_ROOT);
		
		// 3. Verify
		// A. Git Diff was called
		expect(gitMock.diff).toHaveBeenCalled();
		
		// B. LLM was consulted
		expect(llm.generate).toHaveBeenCalled();
		
		// C. File Content Updated
		const newContent = fs.readFileSync(filePath, 'utf-8');
		
		// Check Version Bump (1.0.0 -> 1.0.1)
		expect(newContent).toContain('@version:    1.0.1');
		
		// Check History Injection
		expect(newContent).toContain('V1.0.1');
		expect(newContent).toContain('Fixed critical bug in logic.');
		
		// Ensure old history remains
		expect(newContent).toContain('V1.0.0');
	});
	
	it('should handle "Minor" updates correctly', async () => {
		// 1. Setup Fixture
		const filePath = path.join(TEST_ROOT, 'feature.ts');
		const originalContent = `/**
 * @version:    1.1.0
 * @notes: Revision History
 */`;
		fs.writeFileSync(filePath, originalContent);
		
		// 2. Mock LLM to return MINOR
		vi.mocked(llm.generate).mockResolvedValue(JSON.stringify({
			type: "minor",
			summary: "Added new feature."
		}));
		
		// 3. Execute
		await autoVersion(TEST_ROOT);
		
		// 4. Verify (1.1.0 -> 1.2.0)
		const content = fs.readFileSync(filePath, 'utf-8');
		expect(content).toContain('@version:    1.2.0');
		expect(content).toContain('Added new feature.');
	});
	
	it('should do nothing if git reports no changes', async () => {
		// 1. Mock Git: No diff
		gitMock.diff.mockResolvedValue('');
		
		// 2. Execute
		await autoVersion(TEST_ROOT);
		
		// 3. Verify
		expect(llm.generate).not.toHaveBeenCalled();
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining('No changes'));
	});
	
	it('should handle malformed LLM response gracefully', async () => {
		// 1. Setup Fixture
		const filePath = path.join(TEST_ROOT, 'file.ts');
		fs.writeFileSync(filePath, '/** @version: 1.0.0 */');
		
		// 2. Mock Bad JSON from LLM
		vi.mocked(llm.generate).mockResolvedValue("Not JSON");
		
		// 3. Execute
		await autoVersion(TEST_ROOT);
		
		// 4. Verify
		// Should catch error and log it
		expect(consola.error).toHaveBeenCalled();
		// File should be untouched
		const content = fs.readFileSync(filePath, 'utf-8');
		expect(content).toContain('1.0.0');
	});
});