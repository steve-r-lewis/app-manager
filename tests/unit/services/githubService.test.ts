/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/githubService.test.ts
 * @version:    1.2.1
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
 * 2. Status & Diffs (getStatus, getStagedDiff)
 * 3. Commits & Pushes (createCommit, push)
 * 4. Sync & Submodules (syncRepo, addSubmodule, getRemotes)
 * 5. Remote API (deleteRemoteRepo, listRemoteRepos)
 *
 * ================================================================================
 *
 * @notes: Revision History
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

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { githubService } from '../../../app/services/githubService';

// ----------------------------------------------------------------------------
// 1. Mock simple-git
// ----------------------------------------------------------------------------
const mockGit = {
	init: vi.fn(),
	branchLocal: vi.fn().mockResolvedValue({ current: 'master' }),
	branch: vi.fn(),
	addConfig: vi.fn(),
	status: vi.fn(),
	add: vi.fn(),
	commit: vi.fn(),
	push: vi.fn(),
	pull: vi.fn(),
	submoduleUpdate: vi.fn(),
	submodule: vi.fn(),
	getRemotes: vi.fn(),
	diff: vi.fn(),
	outputHandler: vi.fn() // Added for Headless Sync support
};

// Factory function to return our mock instance
vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

// ----------------------------------------------------------------------------
// 2. Mock Fetch (for Remote API)
// ----------------------------------------------------------------------------
const fetchMock = vi.fn();

describe('GithubService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('fetch', fetchMock);
		process.env.GITHUB_TOKEN = 'mock-token';
	});
	
	afterEach(() => {
		vi.unstubAllGlobals();
	});
	
	// ========================================================================
	// Group 1: Repository Lifecycle (Init, Config)
	// ========================================================================
	describe('Initialization', () => {
		it('initRepo should initialize, rename branch, and set config', async () => {
			await githubService.initRepo({
				cwd: '/test',
				userName: 'Steve',
				userEmail: 'steve@example.com'
			});
			
			expect(mockGit.init).toHaveBeenCalled();
			expect(mockGit.branch).toHaveBeenCalledWith(['-M', 'main']); // Renamed master -> main
			expect(mockGit.addConfig).toHaveBeenCalledWith('user.name', 'Steve');
			expect(mockGit.addConfig).toHaveBeenCalledWith('user.email', 'steve@example.com');
		});
	});
	
	// ========================================================================
	// Group 2: Status & Information
	// ========================================================================
	describe('Status & Info', () => {
		it('getStatus should parse complex git status', async () => {
			mockGit.status.mockResolvedValue({
				current: 'feat/login',
				isClean: () => false,
				modified: ['app.ts'],
				staged: ['index.ts'],
				ahead: 2,
				behind: 0
			});
			
			const status = await githubService.getStatus('/test');
			
			expect(status.branch).toBe('feat/login');
			expect(status.isDirty).toBe(true);
			expect(status.modified).toContain('app.ts');
			expect(status.ahead).toBe(2);
		});
		
		it('getStagedDiff should request cached diffs', async () => {
			mockGit.diff.mockResolvedValue('diff --git a/file.ts...');
			
			const diff = await githubService.getStagedDiff('/test');
			
			expect(mockGit.diff).toHaveBeenCalledWith(['--cached']);
			expect(diff).toContain('diff --git');
		});
		
		it('getRemotes should return remote list', async () => {
			mockGit.getRemotes.mockResolvedValue([{ name: 'origin', refs: {} }]);
			
			const remotes = await githubService.getRemotes('/test');
			
			expect(mockGit.getRemotes).toHaveBeenCalledWith(true);
			expect(remotes[0].name).toBe('origin');
		});
	});
	
	// ========================================================================
	// Group 3: Core Workflow (Stage, Commit, Push, Sync)
	// ========================================================================
	describe('Workflow', () => {
		it('createCommit should stage specific files and commit', async () => {
			await githubService.createCommit('/test', 'chore: wip', ['.']);
			
			expect(mockGit.add).toHaveBeenCalledWith(['.']);
			expect(mockGit.commit).toHaveBeenCalledWith('chore: wip');
		});
		
		it('push should handle default and explicit branches', async () => {
			// Case 1: Default
			await githubService.push('/test');
			expect(mockGit.push).toHaveBeenCalledWith('origin');
			
			// Case 2: Explicit
			await githubService.push('/test', 'upstream', 'develop');
			expect(mockGit.push).toHaveBeenCalledWith('upstream', 'develop');
		});
		
		describe('syncRepo', () => {
			it('should pull and recursively update submodules (Interactive Default)', async () => {
				// Default silent = true
				await githubService.syncRepo('/test');
				
				// Verify standard sync ops
				expect(mockGit.pull).toHaveBeenCalled();
				expect(mockGit.submoduleUpdate).toHaveBeenCalledWith(['--init', '--recursive']);
				
				// Verify outputHandler is NOT called (Interactive/Silent mode)
				expect(mockGit.outputHandler).not.toHaveBeenCalled();
			});
			
			it('should attach outputHandler in Headless mode (silent=false)', async () => {
				await githubService.syncRepo('/test', false);
				
				// Verify output handler is attached for stdout streaming
				expect(mockGit.outputHandler).toHaveBeenCalled();
				
				// Verify sync ops still run
				expect(mockGit.pull).toHaveBeenCalled();
				expect(mockGit.submoduleUpdate).toHaveBeenCalledWith(['--init', '--recursive']);
			});
		});
		
		it('addSubmodule should construct correct submodule command', async () => {
			await githubService.addSubmodule({
				cwd: '/test',
				url: 'https://github.com/a/b.git',
				path: 'layers/b',
				branch: 'dev'
			});
			
			// args: add -b dev <url> <path>
			expect(mockGit.submodule).toHaveBeenCalledWith([
				'add', '-b', 'dev', 'https://github.com/a/b.git', 'layers/b'
			]);
		});
	});
	
	// ========================================================================
	// Group 4: Remote API (GitHub)
	// ========================================================================
	describe('Remote API', () => {
		it('deleteRemoteRepo should send DELETE request', async () => {
			fetchMock.mockResolvedValue({ ok: true });
			
			await githubService.deleteRemoteRepo('user', 'repo');
			
			expect(fetchMock).toHaveBeenCalledWith(
				'https://api.github.com/repos/user/repo',
				expect.objectContaining({
					method: 'DELETE',
					headers: expect.objectContaining({ 'Authorization': 'Bearer mock-token' })
				})
			);
		});
		
		it('listRemoteRepos should return JSON list', async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				json: async () => [{ name: 'repo-1' }]
			});
			
			// Case 1: User repos
			const userRepos = await githubService.listRemoteRepos();
			expect(fetchMock).toHaveBeenCalledWith(
				'https://api.github.com/user/repos',
				expect.any(Object)
			);
			expect(userRepos).toHaveLength(1);
			
			// Case 2: Org repos
			await githubService.listRemoteRepos('my-org');
			expect(fetchMock).toHaveBeenCalledWith(
				'https://api.github.com/orgs/my-org/repos',
				expect.any(Object)
			);
		});
		
		it('should throw error if GITHUB_TOKEN is missing', async () => {
			delete process.env.GITHUB_TOKEN;
			await expect(githubService.deleteRemoteRepo('u', 'r'))
				.rejects.toThrow('Missing GITHUB_TOKEN');
		});
	});
});