/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/githubService.test.ts
 * @version:    1.0.2
 * @createDate: 2026 Jan 02
 * @createTime: 01:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the GitHub Service.
 *
 * ================================================================================
 *
 * @notes: Revision History
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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { githubService } from '../../../app/services/githubService';
import { processService } from '../../../app/services/processService';

// HOSTED MOCK: Replaces the real processService module completely.
// This ensures that when githubService imports it, it gets this mock object.
vi.mock('../../../app/services/processService', () => ({
	processService: {
		execute: vi.fn()
	}
}));

describe('GithubService', () => {
	
	beforeEach(() => {
		// Clear call history before each test, but keep the implementation
		vi.clearAllMocks();
	});
	
	describe('initRepo', () => {
		it('should initialize a new repository and rename branch', async () => {
			// Setup Mock
			const executeMock = vi.mocked(processService.execute);
			executeMock.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' });
			
			const options = { cwd: '/tmp/test', defaultBranch: 'main' };
			await githubService.initRepo(options);
			
			// 1. Verify 'git init'
			expect(executeMock).toHaveBeenCalledWith(
				'git init',
				expect.objectContaining({ cwd: '/tmp/test' })
			);
			
			// 2. Verify branch rename
			expect(executeMock).toHaveBeenCalledWith(
				'git branch -M main',
				expect.objectContaining({ cwd: '/tmp/test' })
			);
		});
		
		it('should configure local git user if provided', async () => {
			const executeMock = vi.mocked(processService.execute);
			executeMock.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' });
			
			const options = {
				cwd: '/tmp/test',
				userName: 'TestUser',
				userEmail: 'test@example.com'
			};
			
			await githubService.initRepo(options);
			
			expect(executeMock).toHaveBeenCalledWith(
				'git config user.name "TestUser"',
				expect.objectContaining({ cwd: '/tmp/test' })
			);
			expect(executeMock).toHaveBeenCalledWith(
				'git config user.email "test@example.com"',
				expect.objectContaining({ cwd: '/tmp/test' })
			);
		});
	});
	
	describe('addSubmodule', () => {
		it('should add a submodule with the correct path construction', async () => {
			const executeMock = vi.mocked(processService.execute);
			executeMock.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' });
			
			const options = {
				cwd: '/root',
				url: 'https://github.com/org/repo.git',
				path: 'layers/repo'
			};
			
			await githubService.addSubmodule(options);
			
			expect(executeMock).toHaveBeenCalledWith(
				'git submodule add https://github.com/org/repo.git layers/repo',
				expect.objectContaining({ cwd: '/root' })
			);
		});
		
		it('should throw an error if git submodule fails', async () => {
			const executeMock = vi.mocked(processService.execute);
			executeMock.mockResolvedValue({
				exitCode: 1,
				stdout: '',
				stderr: 'fatal: path already exists'
			});
			
			const options = {
				cwd: '/root',
				url: 'https://github.com/org/repo.git',
				path: 'layers/repo'
			};
			
			await expect(githubService.addSubmodule(options)).rejects.toThrow('fatal: path already exists');
		});
	});
	
	describe('stageAndCommit', () => {
		it('should stage all files and commit with safe message', async () => {
			const executeMock = vi.mocked(processService.execute);
			executeMock.mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' });
			
			await githubService.stageAndCommit('/root', 'Initial "Commit"');
			
			// Verify add
			expect(executeMock).toHaveBeenCalledWith(
				'git add .',
				expect.objectContaining({ cwd: '/root' })
			);
			
			// Verify commit with escaped quotes
			expect(executeMock).toHaveBeenCalledWith(
				'git commit -m "Initial \\"Commit\\""',
				expect.objectContaining({ cwd: '/root' })
			);
		});
	});
});