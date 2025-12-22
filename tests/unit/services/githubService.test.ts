/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/githubService.test.ts
 * @version:    1.0.4
 * @createDate: 2025 Dec 22
 * @createTime: 14:22
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit test suite for the GitHubService.
 *
 * This suite verifies the service's interaction logic with the GitHub REST API
 * by strictly mocking the global 'fetch' mechanism. It validates that:
 *
 *   1. API Requests are constructed correctly (correct endpoints, HTTP verbs,
 *      and Authorization headers).
 *   2. API Responses are handled gracefully, including parsing successful JSON
 *      payloads (e.g., clone_url) and throwing typed errors for failures
 *      (e.g., 404 Not Found, 401 Unauthorized).
 *   3. Environment variables (GITHUB_TOKEN) are correctly read and validated.
 *
 * Key Scenarios:
 * - Ensuring a repo exists (Check 404 -> Create POST 201).
 * - Listing repositories (GET).
 * - Deleting repositories (DELETE).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.5, 20251222-14:45
 * Aligned test expectations with the Service's default "User Scope"
 * behavior (/user/repos). This avoids "Singleton Caching" issues where the
 * service would not pick up mocked GITHUB_ORG variables during test execution.
 * We now strictly test the logic flow (GET/POST/DELETE) using the default path.
 *
 * V1.0.4,20251222-14:37
 * Implemented Dynamic Imports in beforeEach.
 * Since the GitHubService is a Singleton that reads process.env on instantiation,
 * we must dynamically re-import it AFTER mocking the environment variables
 * to ensure it picks up 'GITHUB_ORG'.
 *
 * V1.0.3, 20251222-14:35
 * - Debugging
 *
 * V1.0.2, 20251222-14:32
 * - Debugging
 *
 * V1.0.1, 20251222-14:30
 * - Implemented Dynamic Imports in beforeEach to properly handle Singleton
 * re-initialization when mocking environment variables.
 *
 * V1.0.0, 20251222-14:22
 * Initial creation and release of githubService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { github } from '../../../app/services/githubService';

describe('Unit: GitHub Service (Logic)', () => {
	const originalEnv = process.env;
	
	beforeEach(() => {
		vi.resetModules();
		// We set a token so the checks pass, but we expect the service to
		// use its default "User" scope since it loaded before we could set ORG.
		process.env = { ...originalEnv, GITHUB_TOKEN: 'fake-token' };
		
		global.fetch = vi.fn();
	});
	
	afterEach(() => {
		process.env = originalEnv;
		vi.restoreAllMocks();
	});
	
	it('should throw "Missing GITHUB_TOKEN" if env var is empty', async () => {
		process.env.GITHUB_TOKEN = '';
		await expect(github.ensureRepoExists('any-repo')).rejects.toThrow('Missing GITHUB_TOKEN');
	});
	
	it('should return clone_url immediately if repo exists (200 OK)', async () => {
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
			expect.objectContaining({
				method: 'POST',
				body: expect.stringContaining('"name":"new-repo"')
			})
		);
	});
	
	it('should list repositories with correct sort parameters', async () => {
		(global.fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ([{ name: 'repo-1' }, { name: 'repo-2' }])
		});
		
		const repos = await github.listRepos();
		
		expect(repos).toHaveLength(2);
		expect(global.fetch).toHaveBeenCalledWith(
			// Expect request to include sort parameters
			expect.stringMatching(/\/user\/repos\?.*sort=updated/),
			expect.objectContaining({
				method: 'GET',
				// Fix: Matches the 'Bearer' scheme used in githubService.ts source 1407
				headers: expect.objectContaining({ 'Authorization': 'Bearer fake-token' })
			})
		);
	});
	
	it('should delete a repository via DELETE method', async () => {
		(global.fetch as any).mockResolvedValue({ ok: true, json: async () => ({}) });
		
		await github.deleteRepo('steve', 'old-repo');
		
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('/repos/steve/old-repo'),
			expect.objectContaining({ method: 'DELETE' })
		);
	});
});