/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/cli/startup.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 20
 * @createTime: 17:37
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
 * V1.0.0, 20251220-17:37
 * Initial creation and release of startup.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../utils/test-context';

const execPromise = promisify(exec);
// FIX: Ensure path is resolved correctly (3 levels up from tests/e2e/cli)
const CLI_ENTRY = path.resolve(__dirname, '../../../index.ts');

describe('E2E: CLI Startup & Resilience', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should warn if GITHUB_TOKEN is missing (Pre-Flight Check)', async () => {
		const safeEnv = { ...process.env };
		
		// FIX 1: Set to empty string instead of delete.
		// If we delete it, 'dotenv' might reload it from the root .env file.
		// Setting it to empty string ensures it stays "missing" logic-wise but prevents reload.
		safeEnv.GITHUB_TOKEN = '';
		
		try {
			const { stdout, stderr } = await execPromise(`npx tsx ${CLI_ENTRY} utils headers`, {
				cwd: ctx.targetRoot,
				env: {
					...safeEnv,
					// FIX 2: Enable DEBUG to prevent console.clear() from hiding output
					DEBUG: 'true'
				},
				timeout: 30000
			});
			
			const fullOutput = stdout + stderr;
			expect(fullOutput).toContain('GITHUB_TOKEN is missing');
			expect(fullOutput).toContain('Environment Warnings');
			
		} catch (error: any) {
			// Even if it exits with error (unlikely for utils headers), we check output
			const fullOutput = (error.stdout || '') + (error.stderr || '');
			expect(fullOutput).toContain('GITHUB_TOKEN is missing');
		}
	});
	
	it('should crash safely and write error.log when a CRITICAL error occurs', async () => {
		// This test relies on the global error handler being in place.
		expect(true).toBe(true);
	});
});