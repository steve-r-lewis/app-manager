/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/services/githubService.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 22
 * @createTime: 14:24
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * End-to-End (E2E) test suite for GitHubService.
 *
 * This suite verifies integration with the REAL GitHub API.
 * WARNING: These tests perform actual network requests.
 *
 * Safeguards:
 * 1. Skips entirely if GITHUB_TOKEN is missing in the environment.
 * 2. Uses a temporary repository name to avoid collisions.
 * 3. Attempts to clean up (delete) the repository after the test.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251222-14:24
 * Initial creation and release of githubService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { github } from '../../../app/services/githubService';
import dotenv from 'dotenv';
import path from 'path';

// FIX: Explicitly load .env from project root before checking for the token
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Skip suite if no credentials are present
const hasToken = !!process.env.GITHUB_TOKEN;

describe.skipIf(!hasToken)('E2E: GitHub Service (Real API)', () => {
	
	const TEST_REPO_NAME = `app-manager-e2e-${Date.now()}`;
	let owner: string;
	
	beforeAll(async () => {
		// Determine the owner (User or Org) to ensure we can target deletions correctly
		if (process.env.GITHUB_ORG) {
			owner = process.env.GITHUB_ORG;
		} else {
			// Fallback: Infer owner from existing repos
			try {
				const repos = await github.listRepos();
				if (repos.length > 0) {
					owner = repos[0].owner?.login || repos[0].full_name.split('/')[0];
				}
			} catch (e) {
				console.warn('[E2E Setup] Could not list repos to determine owner.');
			}
		}
		
		if (!owner) {
			console.warn('[E2E Setup] Owner could not be determined. Cleanup might fail.');
		} else {
			console.log(`[E2E] Targeting Owner/Org: ${owner}`);
		}
		console.log(`[E2E] Test Repo: ${TEST_REPO_NAME}`);
	});
	
	afterAll(async () => {
		if (owner) {
			try {
				console.log(`[E2E] Cleaning up ${TEST_REPO_NAME}...`);
				await github.deleteRepo(owner, TEST_REPO_NAME);
			} catch (e) {
				console.warn('[E2E] Cleanup warning (Test might have failed before creation):', e);
			}
		}
	});
	
	it('should Create, Verify, and List a real repository', async () => {
		// 1. Create (ensureRepoExists handles creation)
		const cloneUrl = await github.ensureRepoExists(TEST_REPO_NAME);
		expect(cloneUrl).toContain('github.com');
		expect(cloneUrl).toContain(TEST_REPO_NAME);
		
		// 2. Verify it exists via List
		// Small delay to ensure API consistency
		await new Promise(r => setTimeout(r, 1500));
		
		const repos = await github.listRepos();
		const found = repos.find((r: any) => r.name === TEST_REPO_NAME);
		expect(found).toBeDefined();
		expect(found?.name).toBe(TEST_REPO_NAME);
	}, 45000); // Increased timeout for network latency
});