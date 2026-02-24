/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/githubService.test.ts
 * @version:    2.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 01:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Full Unit Test Suite for the GitHub Service.
 *
 * Coverage:
 * 1. Initialization (initRepo)
 * 2. Cloning (cloneRepo) - NEW
 * 3. Status & Diffs (getStatus, getStagedDiff)
 * 4. Commits & Pushes (createCommit, push)
 * 5. Sync & Submodules (syncRepo, addSubmodule, getRemotes)
 * 6. Remote API (deleteRemoteRepo, listRemoteRepos)
 * 7. Observability (Logger verification)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20260110-22:06
 * - Updated to use new Logger Service.
 * - Updated to use new Simple-Git API.
 * - Added tests for 'getRemotes' and 'deleteRemoteRepo'.
 * - Added tests for gitCloneOptions.
 *
 * V1.2.1, 20260108-23:10
 * Updated 'sync' tests to 'syncRepo'.
 * Added coverage for Headless mode (silent=false) via outputHandler mock.
 *
 * V1.2.0, 20260106-00:06
 * Provided a complete test suite for the GitHub Service.
 *
 * V1.0.2, 20260102-02:20
 * - Changed from vi.spyOn to vi.mock (Module Mocking).
 * - This prevents "mockResolvedValue is not a function" errors by ensuring
 * the dependency is replaced at the module level before the test runs.
 *
 * V1.0.1, 20260102-02:20
 * - Updated mocks to return strict ProcessResult objects ({ exitCode: 0 }).
 * - Verifies that high-level calls (initRepo, addSubmodule) correctly construct
 * low-level git commands passed to ProcessService.
 *
 * V1.0.0, 20260102-01:08
 * Initial creation and release of githubService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { githubService } from '../../../app/services/githubService.js';
import { logger } from '../../../app/services/loggerService.js';

// --- Mocks ---

// 1. Mock Logger Service
vi.mock('../../../app/services/loggerService', () => ({
	logger: {
		info: vi.fn(),
		debug: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
}));

// 2. Mock Simple-Git
const mockGitInstance = {
	init: vi.fn(),
	branchLocal: vi.fn(),
	branch: vi.fn(),
	addConfig: vi.fn(),
	clone: vi.fn(),
	status: vi.fn(),
	add: vi.fn(),
	commit: vi.fn(),
	push: vi.fn(),
	pull: vi.fn(),
	submoduleUpdate: vi.fn(),
	outputHandler: vi.fn(),
	submodule: vi.fn(),
	getRemotes: vi.fn(),
	diff: vi.fn()
};

// Handle both simpleGit(cwd) and simpleGit() factory calls
vi.mock('simple-git', () => ({
	simpleGit: vi.fn(() => mockGitInstance)
}));

// 3. Mock Global Fetch
global.fetch = vi.fn();

describe('GithubService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.GITHUB_TOKEN = 'mock-token'; // Default valid token
	});
	
	afterEach(() => {
		delete process.env.GITHUB_TOKEN;
	});
	
	// ========================================================================
	// Group 1: Initialization & Cloning
	// ========================================================================
	describe('Initialization & Cloning', () => {
		
		it('initRepo should initialize and rename branch if needed', async () => {
			// Setup: Current branch is 'master', want 'main'
			mockGitInstance.branchLocal.mockResolvedValue({ current: 'master' });
			
			await githubService.initRepo({ cwd: '/tmp/test' });
			
			expect(mockGitInstance.init).toHaveBeenCalled();
			expect(mockGitInstance.branch).toHaveBeenCalledWith(['-M', 'main']);
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Initializing Git'));
		});
		
		it('initRepo should configure user identity if provided', async () => {
			mockGitInstance.branchLocal.mockResolvedValue({ current: 'main' });
			
			await githubService.initRepo({
				cwd: '/tmp/test',
				userName: 'Test User',
				userEmail: 'test@example.com'
			});
			
			expect(mockGitInstance.addConfig).toHaveBeenCalledWith('user.name', 'Test User');
			expect(mockGitInstance.addConfig).toHaveBeenCalledWith('user.email', 'test@example.com');
		});
		
		it('cloneRepo should call git clone with correct arguments', async () => {
			await githubService.cloneRepo({
				url: 'https://github.com/test/repo.git',
				destination: '/tmp/repo'
			});
			
			// Verify call to global instance
			expect(mockGitInstance.clone).toHaveBeenCalledWith(
				'https://github.com/test/repo.git',
				'/tmp/repo',
				[]
			);
			expect(logger.info).toHaveBeenCalledWith('Clone operation successful.');
		});
		
		it('cloneRepo should handle advanced options (branch, depth)', async () => {
			await githubService.cloneRepo({
				url: 'https://github.com/test/repo.git',
				destination: '/tmp/repo',
				branch: 'develop',
				depth: 1
			});
			
			expect(mockGitInstance.clone).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				['--branch', 'develop', '--depth', '1']
			);
		});
		
		it('cloneRepo should log and throw error on failure', async () => {
			mockGitInstance.clone.mockRejectedValue(new Error('Clone failed'));
			
			await expect(githubService.cloneRepo({
				url: 'bad-url',
				destination: 'nowhere'
			})).rejects.toThrow('Clone failed');
			
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Clone failed'));
		});
	});
	
	// ========================================================================
	// Group 2: Status & Diffs
	// ========================================================================
	describe('Status & Diffs', () => {
		
		it('getStatus should return mapped status object', async () => {
			mockGitInstance.status.mockResolvedValue({
				current: 'feature/login',
				isClean: () => false,
				modified: ['file1.ts'],
				staged: ['file2.ts'],
				ahead: 1,
				behind: 2
			});
			
			const result = await githubService.getStatus('/tmp/test');
			
			expect(result).toEqual({
				branch: 'feature/login',
				isDirty: true,
				modified: ['file1.ts'],
				staged: ['file2.ts'],
				ahead: 1,
				behind: 2
			});
			// Should verify debug log is called (low noise)
			expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Checking git status'));
		});
		
		it('getStagedDiff should return diff string', async () => {
			mockGitInstance.diff.mockResolvedValue('diff content');
			
			const result = await githubService.getStagedDiff('/tmp/test');
			
			expect(result).toBe('diff content');
			expect(mockGitInstance.diff).toHaveBeenCalledWith(['--cached']);
		});
	});
	
	// ========================================================================
	// Group 3: Operations (Commit, Push, Sync)
	// ========================================================================
	describe('Operations', () => {
		
		it('createCommit should add and commit files', async () => {
			await githubService.createCommit('/tmp/test', 'feat: update', ['src']);
			
			expect(mockGitInstance.add).toHaveBeenCalledWith(['src']);
			expect(mockGitInstance.commit).toHaveBeenCalledWith('feat: update');
			expect(logger.info).toHaveBeenCalled();
		});
		
		it('push should push to origin by default', async () => {
			await githubService.push('/tmp/test');
			expect(mockGitInstance.push).toHaveBeenCalledWith('origin');
		});
		
		it('push should push specific branch if provided', async () => {
			await githubService.push('/tmp/test', 'upstream', 'main');
			expect(mockGitInstance.push).toHaveBeenCalledWith('upstream', 'main');
		});
		
		it('syncRepo should pull and update submodules (Silent Mode)', async () => {
			await githubService.syncRepo('/tmp/test', true);
			
			expect(mockGitInstance.outputHandler).not.toHaveBeenCalled();
			expect(mockGitInstance.pull).toHaveBeenCalled();
			expect(mockGitInstance.submoduleUpdate).toHaveBeenCalledWith(['--init', '--recursive']);
			expect(logger.info).toHaveBeenCalledWith('Sync complete.');
		});
		
		it('syncRepo should attach output handler in Interactive Mode', async () => {
			await githubService.syncRepo('/tmp/test', false);
			
			expect(mockGitInstance.outputHandler).toHaveBeenCalled();
			expect(mockGitInstance.pull).toHaveBeenCalled();
		});
		
		it('addSubmodule should construct correct args', async () => {
			await githubService.addSubmodule({
				cwd: '/tmp',
				url: 'http://git',
				path: 'libs/mod',
				branch: 'stable'
			});
			
			expect(mockGitInstance.submodule).toHaveBeenCalledWith([
				'add', '-b', 'stable', 'http://git', 'libs/mod'
			]);
		});
		
		it('getRemotes should return typed remote list', async () => {
			const mockRemotes = [{ name: 'origin', refs: { fetch: 'url', push: 'url' } }];
			mockGitInstance.getRemotes.mockResolvedValue(mockRemotes);
			
			const result = await githubService.getRemotes('/tmp');
			
			expect(result).toEqual(mockRemotes);
			expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Found 1 remote'));
		});
	});
	
	// ========================================================================
	// Group 4: Remote API (GitHub)
	// ========================================================================
	describe('Remote API', () => {
		
		it('should throw error if GITHUB_TOKEN is missing', async () => {
			delete process.env.GITHUB_TOKEN;
			
			await expect(githubService.listRemoteRepos()).rejects.toThrow('Missing GITHUB_TOKEN');
			expect(logger.error).toHaveBeenCalled();
		});
		
		it('deleteRemoteRepo should send DELETE request and log success', async () => {
			(fetch as Mock).mockResolvedValue({ ok: true });
			
			await githubService.deleteRemoteRepo('user', 'repo');
			
			expect(fetch).toHaveBeenCalledWith(
				'https://api.github.com/repos/user/repo',
				expect.objectContaining({
					method: 'DELETE',
					headers: expect.objectContaining({ 'Authorization': 'Bearer mock-token' })
				})
			);
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Successfully deleted'));
		});
		
		it('deleteRemoteRepo should throw and log on API failure', async () => {
			(fetch as Mock).mockResolvedValue({
				ok: false,
				statusText: 'Not Found'
			});
			
			await expect(githubService.deleteRemoteRepo('user', 'repo'))
				.rejects.toThrow('Failed to delete repo');
			
			expect(logger.error).toHaveBeenCalled();
		});
		
		it('listRemoteRepos should return parsed JSON', async () => {
			const mockRepos = [{ id: 1, name: 'repo-1' }];
			(fetch as Mock).mockResolvedValue({
				ok: true,
				json: async () => mockRepos
			});
			
			// Case 1: User repos
			const userRepos = await githubService.listRemoteRepos();
			expect(fetch).toHaveBeenCalledWith(
				'https://api.github.com/user/repos',
				expect.any(Object)
			);
			expect(userRepos).toEqual(mockRepos);
			
			// Case 2: Org repos
			await githubService.listRemoteRepos('my-org');
			expect(fetch).toHaveBeenCalledWith(
				'https://api.github.com/orgs/my-org/repos',
				expect.any(Object)
			);
		});
		
		it('listRemoteRepos should throw and log on error', async () => {
			(fetch as Mock).mockResolvedValue({
				ok: false,
				status: 401,
				statusText: 'Unauthorized'
			});
			
			await expect(githubService.listRemoteRepos()).rejects.toThrow('GitHub API Error (401)');
			expect(logger.error).toHaveBeenCalled();
		});
	});
});