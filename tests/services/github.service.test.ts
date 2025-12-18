/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/services/github.service.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 20:57
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
 * V1.0.0, 20251218-20:57
 * Initial creation and release of github.service.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { github } from '../../app/services/github.service';

describe('GitHub Service', () => {
	const originalEnv = process.env;
	
	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv, GITHUB_TOKEN: 'fake-token', GITHUB_ORG: 'test-org' };
		
		// Mock global fetch
		global.fetch = vi.fn();
	});
	
	afterEach(() => {
		process.env = originalEnv;
		vi.restoreAllMocks();
	});
	
	it('should throw if GITHUB_TOKEN is missing', async () => {
		process.env.GITHUB_TOKEN = ''; // Clear token
		await expect(github.ensureRepoExists('any-repo')).rejects.toThrow('Missing GITHUB_TOKEN');
	});
	
	it('should return clone_url if repo exists (200 OK)', async () => {
		// Mock API Response: Repo Exists
		(global.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({ clone_url: 'https://github.com/test/repo.git' })
		});
		
		const url = await github.ensureRepoExists('my-repo');
		expect(url).toBe('https://github.com/test/repo.git');
		
		// Verify we called the GET endpoint, not POST
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('/repos/test-org/my-repo'),
			expect.objectContaining({ method: 'GET' })
		);
	});
	
	it('should create repo if it does not exist (404 -> POST)', async () => {
		// Mock Sequence:
		// 1st Call (GET) -> 404 Not Found
		// 2nd Call (POST) -> 201 Created
		(global.fetch as any)
			.mockResolvedValueOnce({
				ok: false,
				status: 404,
				text: async () => 'Not Found'
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ clone_url: 'https://github.com/new/repo.git', full_name: 'test/new' })
			});
		
		const url = await github.ensureRepoExists('new-repo');
		
		expect(url).toBe('https://github.com/new/repo.git');
		
		// Check that we attempted to create it
		expect(global.fetch).toHaveBeenCalledTimes(2);
		expect(global.fetch).toHaveBeenLastCalledWith(
			expect.stringContaining('/user/repos'), // Defaults to user repo
			expect.objectContaining({ method: 'POST' })
		);
	});
});