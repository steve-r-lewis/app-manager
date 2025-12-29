/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/deleteRemoteRepos.test.ts
 * @version:    2.0.8
 * @createDate: 2025 Dec 21
 * @createTime: 00:03
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Integration Test for deleteRemoteRepos.
 * converted from Black-Box to In-Process Integration to allow mocking prompts
 * and avoid timeouts.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V2.0.8, 20251226-1913
 * Refactored logic.
 *
 * V2.0.7, 20251223-00:36
 * Fixed select mock to return Object (not string) and mocked GITHUB_OWNER.
 *
 * V2.0.6, 20251223-00:35
 * Fixed expectation arguments (owner, repo) and mock data structure.
 *
 * V2.0.5, 20251223-00:34
 * Fixed confirmation prompt input (Requires "DELETE", not repo name).
 *
 * V2.0.4, 20251223-00:33
 * Verified prompt sequence matches implementation.
 *
 * V2.0.3, 20251223-00:32
 * Fixed timeout by mocking 'select' prompt.
 *
 * V2.0.2, 20251223-00:20
 * Resolved hoisting issues with GitHub service mocks.
 *
 * V2.0.1, 20251223-00:03
 * Integration Test for deleteRemoteRepos.
 * FIXED: Resolved hoisting issue by using vi.hoisted for shared mocks.
 *
 * V2.0.0, 20251222-22:48
 * - Added tests for AI provider selection and fallback
 *
 * V1.0.0, 20251221-00:03
 * Initial creation and release of deleteRemoteRepos.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { deleteRemoteRepos } from '../../../../app/commands/git/deleteRemoteRepos';
import { setupTestContext } from '../../../helpers/testContext';
import * as prompts from '@clack/prompts';

// 1. Mock Prompts
vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		intro: vi.fn(),
		outro: vi.fn(),
		text: vi.fn(),
		confirm: vi.fn(),
		select: vi.fn(),
		isCancel: vi.fn(() => false),
		spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
	};
});

// 2. Mock GitHub Service
const mocks = vi.hoisted(() => {
	return {
		deleteRepo: vi.fn(),
		listRepos: vi.fn().mockResolvedValue([]),
	};
});

vi.mock('../../../../app/services/githubService', () => ({
	github: {
		deleteRepo: mocks.deleteRepo,
		listRepos: mocks.listRepos
	}
}));

describe('Integration: Delete Remote Repo', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const originalEnv = process.env;
	
	// Define the mock repo object we expect the logic to handle
	const mockRepo = {
		name: 'my-repo',
		full_name: 'test-user/my-repo',
		html_url: 'http://git.com/my-repo',
		owner: { login: 'test-user' }
	};
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		process.env = { ...originalEnv };
		
		// CRITICAL FIX 1: Mock the Owner so it matches our expectations
		process.env.GITHUB_OWNER = 'test-user';
		
		// Mock repo list
		mocks.listRepos.mockResolvedValue([mockRepo]);
	});
	
	afterEach(() => {
		ctx.restore();
		process.env = originalEnv;
	});
	
	it('should safely ABORT deletion if confirmation mismatch occurs', async () => {
		// 1. Select: Return the OBJECT, not the string.
		// The command likely maps { value: repo }
		(prompts.select as any).mockResolvedValueOnce(mockRepo);
		
		// 2. Type WRONG input
		(prompts.text as any).mockResolvedValueOnce('wrong');
		
		await deleteRemoteRepos(ctx.targetRoot);
		
		expect(mocks.deleteRepo).not.toHaveBeenCalled();
	});
	
	it('should proceed with deletion if confirmation matches', async () => {
		// 1. Select: Return the OBJECT
		(prompts.select as any).mockResolvedValueOnce(mockRepo);
		
		// 2. Type "DELETE"
		(prompts.text as any).mockResolvedValueOnce('DELETE');
		
		await deleteRemoteRepos(ctx.targetRoot);
		
		// Expectation: deleteRepo(owner, repo)
		// With GITHUB_OWNER mocked, owner should be 'test-user'.
		// With select returning the object, repo should be 'my-repo'.
		expect(mocks.deleteRepo).toHaveBeenCalledWith('test-user', 'my-repo');
	});
});