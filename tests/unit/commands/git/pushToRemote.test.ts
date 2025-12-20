/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/pushToRemote.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:23
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
 * V1.0.0, 20251218-23:23
 * Initial creation and release of pushToRemote.test.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       tests/commands/git/pushToRemote.test.ts
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pushToRemote } from '../../../../app/commands/git/pushToRemote';
import { setupTestContext } from '../../../utils/test-context';
import * as prompts from '@clack/prompts';

const mockGit = {
	checkIsRepo: vi.fn(),
	getRemotes: vi.fn(),
	push: vi.fn(),
};

vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	multiselect: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: pushToRemote', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockMulti = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockGit.checkIsRepo.mockResolvedValue(true);
		// Default remotes
		mockGit.getRemotes.mockResolvedValue([
			{ name: 'origin', refs: { push: 'git@github.com:me/repo.git' } },
			{ name: 'upstream', refs: { push: 'git@github.com:org/repo.git' } }
		]);
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should abort if no remotes exist', async () => {
		mockGit.getRemotes.mockResolvedValue([]);
		await pushToRemote(ctx.targetRoot);
		expect(mockMulti).not.toHaveBeenCalled();
	});
	
	it('should push to selected remotes', async () => {
		mockMulti.mockResolvedValue(['origin', 'upstream']);
		
		await pushToRemote(ctx.targetRoot);
		
		expect(mockGit.push).toHaveBeenCalledTimes(2);
		expect(mockGit.push).toHaveBeenCalledWith('origin');
		expect(mockGit.push).toHaveBeenCalledWith('upstream');
	});
	
	it('should handle push failures gracefully', async () => {
		mockMulti.mockResolvedValue(['origin']);
		mockGit.push.mockRejectedValue(new Error('Auth failed'));
		
		await pushToRemote(ctx.targetRoot);
		
		// Should not throw, but log error (verified via consola logs if mocked, or implicit safe exit)
		expect(mockGit.push).toHaveBeenCalledWith('origin');
	});
});