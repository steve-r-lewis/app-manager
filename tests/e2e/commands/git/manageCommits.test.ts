/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/manageCommits.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:47
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
 * V1.0.0, 20251219-23:47
 * Initial creation and release of manageCommits.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../../utils/test-context';

const execPromise = promisify(exec);
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Manage Commits (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		// Init Real Git Repo
		execSync('git init', { cwd: ctx.targetRoot, stdio: 'ignore' });
		execSync('git config user.email "test@example.com"', { cwd: ctx.targetRoot });
		execSync('git config user.name "Test User"', { cwd: ctx.targetRoot });
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should stage files and create a git commit via CLI args (Headless)', async () => {
		const testFile = path.join(ctx.targetRoot, 'test.txt');
		fs.writeFileSync(testFile, 'Clean change');
		
		const commitMsg = 'feat: headless commit';
		await execPromise(`npx tsx ${CLI_ENTRY} git commit "${commitMsg}"`, {
			cwd: ctx.targetRoot,
			env: { ...process.env, AM_DEBUG_ARGS: 'true' }
		});
		
		const log = execSync('git log -1 --pretty=%B', { cwd: ctx.targetRoot }).toString().trim();
		expect(log).toBe(commitMsg);
	});
});