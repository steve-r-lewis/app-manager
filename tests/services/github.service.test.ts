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
	
	// --- Existing Tests ---
	
	it('should throw if GITHUB_TOKEN is missing', async () => {
		process.env.GITHUB_TOKEN = '';
		await expect(github.ensureRepoExists('any-repo')).rejects.toThrow('Missing GITHUB_TOKEN');
	});
	
	it('should return clone_url if repo exists (200 OK)', async () => {
		(global.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({ clone_url: 'https://github.com/test/repo.git' })
		});
		
		const url = await github.ensureRepoExists('my-repo');
		expect(url).toBe('https://github.com/test/repo.git');
	});
	
	it('should create repo if it does not exist (404 -> POST)', async () => {
		(global.fetch as any)
			.mockResolvedValueOnce({ ok: false, status: 404, text: async () => 'Not Found' }) // Check
			.mockResolvedValueOnce({ ok: true, json: async () => ({ clone_url: 'https://new', full_name: 'test/new' }) }); // Create
		
		await github.ensureRepoExists('new-repo');
		
		expect(global.fetch).toHaveBeenLastCalledWith(
			expect.stringContaining('/user/repos'),
			expect.objectContaining({ method: 'POST' })
		);
	});
	
	// --- New Tests for Deletion Tools ---
	
	it('should list repositories', async () => {
		(global.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ([{ name: 'repo-1' }, { name: 'repo-2' }])
		});
		
		const repos = await github.listRepos();
		expect(repos).toHaveLength(2);
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('/user/repos?sort=updated'),
			expect.objectContaining({ method: 'GET' })
		);
	});
	
	it('should delete a repository', async () => {
		(global.fetch as any).mockResolvedValue({ ok: true, json: async () => ({}) });
		
		await github.deleteRepo('steve', 'old-repo');
		
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('/repos/steve/old-repo'),
			expect.objectContaining({ method: 'DELETE' })
		);
	});
});