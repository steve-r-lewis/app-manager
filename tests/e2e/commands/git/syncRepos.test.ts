/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/syncRepos.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 21
 * @createTime: 18:51
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
 * V1.0.0, 20251221-18:51
 * Initial creation and release of syncRepos.test.ts
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

describe('E2E: Git Sync (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	let remotePath: string;
	let otherRepoPath: string;
	
	beforeEach(() => {
		ctx = setupTestContext();
		
		// 1. Setup "Remote" (Bare)
		remotePath = path.join(ctx.targetRoot, '../remote.git');
		fs.mkdirSync(remotePath, { recursive: true });
		execSync('git init --bare', { cwd: remotePath, stdio: 'ignore' });
		
		// 2. Setup "Local A" (Our App Context)
		execSync('git init', { cwd: ctx.targetRoot, stdio: 'ignore' });
		execSync('git config user.email "test@example.com"', { cwd: ctx.targetRoot });
		execSync('git config user.name "Tester A"', { cwd: ctx.targetRoot });
		execSync(`git remote add origin "${remotePath}"`, { cwd: ctx.targetRoot });
		
		// Initial Commit & Push from A
		fs.writeFileSync(path.join(ctx.targetRoot, 'readme.md'), '# Initial');
		execSync('git add . && git commit -m "init"', { cwd: ctx.targetRoot });
		execSync('git branch -M main', { cwd: ctx.targetRoot });
		execSync('git push -u origin main', { cwd: ctx.targetRoot });
		
		// 3. Setup "Local B" (The simulator)
		otherRepoPath = path.join(ctx.targetRoot, '../other-repo');
		execSync(`git clone "${remotePath}" "${otherRepoPath}"`, { stdio: 'ignore' });
		execSync('git config user.email "other@example.com"', { cwd: otherRepoPath });
		execSync('git config user.name "Tester B"', { cwd: otherRepoPath });
	});
	
	afterEach(() => {
		if (fs.existsSync(remotePath)) try { fs.rmSync(remotePath, { recursive: true, force: true }); } catch (e) {}
		if (fs.existsSync(otherRepoPath)) try { fs.rmSync(otherRepoPath, { recursive: true, force: true }); } catch (e) {}
		ctx.restore();
	});
	
	it('should pull changes from remote via CLI', async () => {
		// 1. "Other" dev prepares a change
		fs.writeFileSync(path.join(otherRepoPath, 'new-feature.txt'), 'Coming from upstream');
		
		// FIX: Robust Branch Sync
		// Ensure we are on 'main' and fully up-to-date with remote before working
		try {
			execSync('git checkout main', { cwd: otherRepoPath, stdio: 'ignore' });
		} catch (e) {
			execSync('git checkout -b main', { cwd: otherRepoPath, stdio: 'ignore' });
		}
		execSync('git pull origin main', { cwd: otherRepoPath, stdio: 'ignore' });
		
		// 2. Commit and Push from "Other"
		execSync('git add . && git commit -m "Add feature"', { cwd: otherRepoPath });
		execSync('git push origin main', { cwd: otherRepoPath });
		
		// 3. Verify "Our App" doesn't have it yet
		expect(fs.existsSync(path.join(ctx.targetRoot, 'new-feature.txt'))).toBe(false);
		
		// 4. Run CLI Sync
		await execPromise(`npx tsx ${CLI_ENTRY} git sync FORCE`, {
			cwd: ctx.targetRoot,
			env: { ...process.env, DEBUG: 'true' },
			timeout: 30000
		});
		
		// 5. Verify "Our App" received the file
		expect(fs.existsSync(path.join(ctx.targetRoot, 'new-feature.txt'))).toBe(true);
	});
});