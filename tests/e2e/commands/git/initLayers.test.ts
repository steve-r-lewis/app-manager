/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/initLayers.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 21
 * @createTime: 19:39
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * E2E test for the 'git init' command. Verifies that the CLI correctly identifies
 * and initializes git repositories in sub-directories.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251221-19:39
 * Initial creation and release of initLayers.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../../utils/test-context';

const execPromise = promisify(exec);
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Git Init Layers (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should find non-repo layers and initialize them', async () => {
		// 1. Setup Structure
		const layerPath = path.join(ctx.targetRoot, 'layers', 'new-layer');
		fs.mkdirSync(layerPath, { recursive: true });
		
		// Ensure it is NOT a git repo yet
		expect(fs.existsSync(path.join(layerPath, '.git'))).toBe(false);
		
		// 2. Run CLI (Headless Force)
		await execPromise(`npx tsx ${CLI_ENTRY} git init FORCE`, {
			cwd: ctx.targetRoot,
			env: { ...process.env, DEBUG: 'true' },
			timeout: 30000
		});
		
		// 3. Verify
		expect(fs.existsSync(path.join(layerPath, '.git'))).toBe(true);
	});
	
	it('should ignore layers that are already initialized', async () => {
		const layerPath = path.join(ctx.targetRoot, 'layers', 'existing-layer');
		fs.mkdirSync(layerPath, { recursive: true });
		
		// Manually init to simulate existing repo
		// We create a dummy file inside .git to verify it wasn't wiped
		const gitDir = path.join(layerPath, '.git');
		fs.mkdirSync(gitDir);
		fs.writeFileSync(path.join(gitDir, 'marker'), 'original');
		
		// Run CLI
		await execPromise(`npx tsx ${CLI_ENTRY} git init FORCE`, {
			cwd: ctx.targetRoot,
			timeout: 30000
		});
		
		// Verify marker still exists (didn't overwrite)
		expect(fs.existsSync(path.join(gitDir, 'marker'))).toBe(true);
	});
});