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
 * This file contains the End-to-End (E2E) test suite for the initLayers command
 * using the Vitest framework. It adopts a "Black Box" testing approach, meaning
 * it executes the compiled CLI tool from the outside to verify actual behavior
 * rather than testing internal functions in isolation.
 *
 * Key Functionality:
 * - Test Environment Setup: Uses a setupTestContext helper to create a temporary,
 *   isolated file system for each test run to prevent side effects.
 * - Initialization Test: Verifies that the command correctly identifies a new,
 *   empty directory and initializes a .git folder when run with the FORCE flag.
 * - Idempotency Test: Verifies that the command ignores directories that are
 *   already Git repositories. It proves this by creating a "marker" file inside
 *   an existing .git directory and asserting that the marker remains intact after
 *   the command runs, ensuring the CLI does not overwrite existing data.
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
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts')

describe('E2E: Git Init Layers (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	// --- Scenario 1: Missing Directory ---
	it('should warn if "layers" directory is missing', async () => {
		// Do NOT create 'layers' directory in ctx.targetRoot
		
		// Run CLI
		// Update: Destructure stderr to capture warnings/errors
		const { stdout, stderr } = await execPromise(`npx tsx ${CLI_ENTRY} git init FORCE`, {
			cwd: ctx.targetRoot,
			env: { ...process.env, DEBUG: 'true' },
			timeout: 30000
		});
		
		// Verify Output
		// We combine them because the warning likely appeared in stderr
		expect(stdout + stderr).toContain('No "layers" directory found');
	});
	
	// --- Scenario 2: Standard Initialization ---
	it('should find non-repo layers and initialize them', async () => {
		// 1. Setup Structure
		const layerPath = path.join(ctx.targetRoot, 'layers', 'new-layer');
		fs.mkdirSync(layerPath, { recursive: true });
		
		// Ensure it is NOT a git repo yet
		expect(fs.existsSync(path.join(layerPath, '.git'))).toBe(false);
		
		// 2. Run CLI
		const { stdout } = await execPromise(`npx tsx ${CLI_ENTRY} git init FORCE`, {
			cwd: ctx.targetRoot,
			env: { ...process.env, DEBUG: 'true' },
			timeout: 30000
		});
		
		// 3. Verify File System
		expect(fs.existsSync(path.join(layerPath, '.git'))).toBe(true);
		
		// 4. Verify CLI Output (Enhancement)
		expect(stdout).toContain('Initialized: new-layer');
	});
	
	// --- Scenario 3: Idempotency (Ignore Existing) ---
	it('should ignore layers that are already initialized', async () => {
		const layerPath = path.join(ctx.targetRoot, 'layers', 'existing-layer');
		fs.mkdirSync(layerPath, { recursive: true });
		
		// Manually init to simulate existing repo
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