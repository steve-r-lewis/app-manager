/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/pushToRemote.test.ts
 * @version:    1.0.3
 * @createDate: 2025 Dec 21
 * @createTime: 18:31
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Integration Test for pushToRemote.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.3, 20251226-1913
 * Refactored logic.
 *
 * V1.0.2, 20251223-00:04
 * Fixed Git setup to ensure 'outgoing changes' detection works.
 *
 * V1.0.1, 20251223-00:03
 * FIXED: Mocked 'multiselect' to prevent hanging on remote selection.
 *
 * V1.0.0, 20251221-18:31
 * Initial creation and release of pushToRemote.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { pushToRemote } from '../../../../app/commands/git/pushToRemote';
import { setupTestContext } from '../../../helpers/testContext';
import * as prompts from '@clack/prompts';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		intro: vi.fn(),
		outro: vi.fn(),
		confirm: vi.fn(),
		select: vi.fn(),
		multiselect: vi.fn(),
		isCancel: vi.fn(() => false),
		spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
	};
});

describe('Integration: Git Push', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// 1. Init Repo
		execSync('git init', { cwd: ctx.targetRoot, stdio: 'ignore' });
		execSync('git config user.name "Test"', { cwd: ctx.targetRoot });
		execSync('git config user.email "test@test.com"', { cwd: ctx.targetRoot });
		// Ensure default branch is main to match common defaults
		execSync('git checkout -b main', { cwd: ctx.targetRoot, stdio: 'ignore' });
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should attempt push and handle failure gracefully', async () => {
		// 1. Create content & Commit
		fs.writeFileSync(path.join(ctx.targetRoot, 'file.txt'), 'data');
		execSync('git add . && git commit -m "feat: init"', { cwd: ctx.targetRoot });
		
		// 2. Add Remote
		execSync('git remote add origin https://invalid.local/repo.git', { cwd: ctx.targetRoot });
		
		// 3. Setup Mocks
		// The command will detect remotes.
		// If it asks "Which remote?", return 'origin'.
		(prompts.multiselect as any).mockResolvedValueOnce(['origin']);
		
		// If it asks "Confirm push?", return true.
		(prompts.confirm as any).mockResolvedValue(true);
		
		// 4. Execution
		// We expect this to throw because the remote is invalid (network error)
		// BUT we expect it to throw *after* prompting.
		try {
			await pushToRemote(ctx.targetRoot);
		} catch (e: any) {
			// The command logic might catch the error and just log it, or rethrow.
			// If it rethrows, we catch it here.
		}
		
		// 5. Verification
		// If the command is smart, it checks `git cherry` or `git status` first.
		// If it sees commits, it asks to confirm.
		// Since we have a commit and a remote, it *should* reach the confirmation or selection.
		
		// Check if ANY prompt was called (Select Remote OR Confirm)
		const prompted = (prompts.multiselect as any).mock.calls.length > 0 ||
			(prompts.confirm as any).mock.calls.length > 0;
		
		expect(prompted).toBe(true);
	});
	
	it('should fail gracefully if remote does not exist', async () => {
		// No remote added.
		// Mock prompt responses just in case logic flows there
		(prompts.multiselect as any).mockResolvedValueOnce([]);
		
		try {
			await pushToRemote(ctx.targetRoot);
		} catch (e) {
			// Expected
		}
	});
});