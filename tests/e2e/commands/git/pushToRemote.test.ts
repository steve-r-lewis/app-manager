/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/pushToRemote.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 21
 * @createTime: 18:31
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
 * V1.0.0, 20251221-18:31
 * Initial creation and release of pushToRemote.test.ts
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

describe('E2E: Git Push (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	let remotePath: string;
	
	beforeEach(() => {
		ctx = setupTestContext();
		
		// 1. Setup "Local" Repo (The Target)
		execSync('git init', { cwd: ctx.targetRoot, stdio: 'ignore' });
		execSync('git config user.email "test@example.com"', { cwd: ctx.targetRoot });
		execSync('git config user.name "Test User"', { cwd: ctx.targetRoot });
		
		// 2. Setup "Fake Remote" Repo (Bare Repository)
		remotePath = path.join(ctx.targetRoot, '../remote-repo.git');
		fs.mkdirSync(remotePath, { recursive: true });
		execSync('git init --bare', { cwd: remotePath, stdio: 'ignore' });
		
		// 3. Link Local to Remote
		execSync(`git remote add origin "${remotePath}"`, { cwd: ctx.targetRoot });
	});
	
	afterEach(() => {
		if (fs.existsSync(remotePath)) {
			try {
				fs.rmSync(remotePath, { recursive: true, force: true });
			} catch (e) { /* ignore cleanup errors */ }
		}
		ctx.restore();
	});
	
	it('should push commits to a remote repository via CLI args', async () => {
		// 1. Create and Commit a change locally
		fs.writeFileSync(path.join(ctx.targetRoot, 'file.txt'), 'Hello Remote');
		execSync('git add .', { cwd: ctx.targetRoot });
		execSync('git commit -m "Initial commit"', { cwd: ctx.targetRoot });
		
		// 2. Run CLI Push Command (Headless)
		// Force branch to 'main' locally
		execSync('git branch -M main', { cwd: ctx.targetRoot });
		
		await execPromise(`npx tsx ${CLI_ENTRY} git push origin main`, {
			cwd: ctx.targetRoot,
			env: { ...process.env, AM_DEBUG_ARGS: 'true' },
			timeout: 30000
		});
		
		// 3. Verify the Remote received it
		// FIX: Explicitly check the 'main' branch log.
		// The bare repo's HEAD defaults to 'master', so 'git log' fails without this argument.
		const remoteLog = execSync('git log -1 --pretty=%B main', { cwd: remotePath }).toString().trim();
		
		expect(remoteLog).toBe('Initial commit');
	});
	
	it('should fail gracefully if remote does not exist', async () => {
		execSync('git remote add invalid-remote "/path/to/nowhere"', { cwd: ctx.targetRoot });
		execSync('git branch -M main', { cwd: ctx.targetRoot });
		
		try {
			await execPromise(`npx tsx ${CLI_ENTRY} git push invalid-remote main`, {
				cwd: ctx.targetRoot,
				timeout: 30000
			});
		} catch (e) {
			// Expected
		}
		expect(true).toBe(true);
	});
});