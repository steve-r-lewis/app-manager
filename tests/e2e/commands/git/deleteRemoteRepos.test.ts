/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/deleteRemoteRepos.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 21
 * @createTime: 00:03
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
 * V1.0.0, 20251221-00:03
 * Initial creation and release of deleteRemoteRepos.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs'; // Added for debug reading
import { exec } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../../helpers/testContext';

const execPromise = promisify(exec);
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Delete Remote Repo (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should safely ABORT deletion if confirmation mismatch occurs', async () => {
		try {
			const { stdout, stderr } = await execPromise(
				`npx tsx ${CLI_ENTRY} git delete "mock-owner/mock-repo" "WRONG_CODE"`,
				{
					cwd: ctx.targetRoot,
					env: {
						...process.env,
						LOG_TO_FILE: 'false',
						DEBUG: 'true',       // Keep console logs visible
						AM_DEBUG_ARGS: 'true' // Enable debug_args.json generation
					}
				}
			);
			
			const fullOutput = stdout + stderr;
			
			// 1. Check for "Targeting repo"
			expect(fullOutput).toContain('Targeting repo: mock-owner/mock-repo');
			
			// 2. Check for "Deletion cancelled"
			expect(fullOutput).toContain('Deletion cancelled: Confirmation mismatch');
			
		} catch (error: any) {
			// DEBUG BLOCK: If test fails, read the debug file
			const debugFile = path.join(ctx.targetRoot, 'debug_args.json');
			if (fs.existsSync(debugFile)) {
				console.log('\n🔍 DEBUG ARGS FOUND:', fs.readFileSync(debugFile, 'utf-8'));
			}
			throw new Error(`CLI failed unexpectedly: ${error.message}`);
		}
	});
	
	it('should fail if repo argument is missing', async () => {
		try {
			await execPromise(`npx tsx ${CLI_ENTRY} git delete`, {
				cwd: ctx.targetRoot,
				env: { ...process.env, DEBUG: 'true' }
			});
			throw new Error('Should have failed');
		} catch (error: any) {
			expect(error.code).toBe(1);
			const fullOutput = (error.stdout || '') + (error.stderr || '');
			expect(fullOutput).toContain('Usage:');
		}
	});
});