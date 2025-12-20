/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/manageCommits.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:47
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
 * V1.0.0, 20251219-23:47
 * Initial creation and release of manageCommits.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { simpleGit } from 'simple-git';
import { manageCommits } from '../../../../app/commands/git/manageCommits';
import { logger } from '../../../../app/services/logger.service';

// 1. Hoist the mock response to avoid ReferenceErrors
const { mockGenerate } = vi.hoisted(() => ({
	mockGenerate: vi.fn().mockResolvedValue('feat: e2e test commit')
}));

// 2. Mock LLM Service
vi.mock('../../../../app/services/llm.service', () => ({
	llm: { generate: mockGenerate }
}));

describe('E2E: Manage Commits', () => {
	let tempDir: string;
	
	beforeEach(async () => {
		// Setup Temp Dir
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'am-e2e-commits-'));
		
		// 3. Initialize Logger (Critical for command stability)
		(logger as any).root = tempDir;
		logger.init();
		
		// Setup Git Repo
		const git = simpleGit(tempDir);
		await git.init();
		await git.addConfig('user.name', 'Tester');
		await git.addConfig('user.email', 'test@test.com');
	});
	
	afterEach(() => {
		logger.close();
		try {
			fs.rmSync(tempDir, { recursive: true, force: true });
		} catch {}
	});
	
	it('should stage files and create a git commit', async () => {
		// 1. Setup: Create a new file
		fs.writeFileSync(path.join(tempDir, 'README.md'), '# New Content');
		
		// 2. Mock Inputs
		globalThis.mockMultiselect.mockResolvedValue(['README.md']); // Select files
		
		// CRITICAL FIX: Mock the menu selection to prevent Infinite Loop
		globalThis.mockSelect.mockResolvedValue('commit'); // Choose 'commit' action
		
		globalThis.mockConfirm.mockResolvedValue(true); // Confirm message
		
		// 3. Execute
		await manageCommits(tempDir);
		
		// 4. Verify Git Log
		const git = simpleGit(tempDir);
		const log = await git.log();
		
		expect(log.total).toBe(1);
		expect(log.latest?.message).toContain('feat: e2e test commit');
	});
});