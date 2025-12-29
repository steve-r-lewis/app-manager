/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/services/githubService.test.ts
 * @version:    1.0.1
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
 * V1.0.1, 20251226-1913
 * Updated author info.
 *
 * - 2.0.1: Added polling (vi.waitUntil) to handle GitHub API eventual consistency.
 * - 2.0.0: Fixed env path resolution.
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
import fs from 'fs';

// Resolve .env relative to this file
const envPath = path.resolve(__dirname, '../../../.env');

if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

describe('E2E: GitHub Service (Real API)', () => {
	const TEST_REPO_NAME = `app-manager-e2e-${Date.now()}`;
	const TEST_OWNER = process.env.GITHUB_OWNER || process.env.GITHUB_ORG || 'steve-r-lewis';
	
	beforeAll(() => {
		if (!process.env.GITHUB_TOKEN) {
			throw new Error(`❌ E2E Test Aborted: GITHUB_TOKEN not found. Checked: ${envPath}`);
		}
		console.log(`[E2E] Targeting Owner/Org: ${TEST_OWNER}`);
	});
	
	afterAll(async () => {
		if (process.env.GITHUB_TOKEN) {
			try {
				console.log(`[E2E] Cleaning up ${TEST_REPO_NAME}...`);
				await github.deleteRepo(TEST_OWNER, TEST_REPO_NAME);
			} catch (e) {
				console.warn('[E2E] Cleanup Warning:', e);
			}
		}
	});
	
	it('should Create and Verify a real repository', async () => {
		// 1. Create
		// This sends a POST. If successful, it returns the URL.
		const cloneUrl = await github.ensureRepoExists(TEST_REPO_NAME);
		
		expect(cloneUrl).toBeDefined();
		expect(cloneUrl).toContain('github.com');
		expect(cloneUrl).toContain(TEST_REPO_NAME);
		
		// 2. Verify (Direct Access / Idempotency)
		// instead of listing all repos (slow/flaky), we check this specific repo again.
		// Calling this again triggers a GET /repos/{owner}/{name}.
		// If the API works, it returns the existing URL immediately.
		const verifiedUrl = await github.ensureRepoExists(TEST_REPO_NAME);
		
		expect(verifiedUrl).toBe(cloneUrl);
		console.log(`[E2E] Verified Repo Exists: ${verifiedUrl}`);
	}, 30000);
});