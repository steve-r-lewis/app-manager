/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/app/runApp.test.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 18
 * @createTime: 22:37
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit test suite for the 'runApp' command, responsible for validating the
 * abstraction logic between the CLI and the target project's script execution.
 *
 * Key Validation Areas:
 * 1. Package Manager Detection:
 * Mocks file system checks (fs.existsSync) to ensure the logic correctly
 * identifies Bun, pnpm, Yarn, or npm based on the presence of specific
 * lockfiles (e.g., bun.lockb, pnpm-lock.yaml).
 *
 * 2. Process Execution:
 * Verifies that 'child_process.spawn' is invoked with the correct arguments,
 * command structures (e.g., ['run', 'dev']), and exit handling logic.
 *
 * 3. Resilience & Feedback:
 * Ensures that process exit codes (0 vs non-zero) are correctly interpreted
 * and routed to the appropriate Logger Service method (success vs error).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251223-00:07
 * Unit Tests for runApp command.
 * Verifies:
 * - Package Manager detection (Bun, PNPM, Yarn, NPM).
 * - Strict Error Handling.
 *
 * V1.0.0, 20251218-22:37
 * Initial creation and release of runApp.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runApp } from '../../../../app/commands/app/runApp';
import { logger } from '../../../../app/services/loggerService';
import fs from 'fs';
import { execSync } from 'child_process';

// --- Mocks ---
vi.mock('fs');
vi.mock('child_process');
vi.mock('../../../../app/services/loggerService');

describe('Command: Run App', () => {
	const targetRoot = '/mock/root';
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Default Mock Behavior
		// 1. execSync does nothing
		(execSync as any).mockImplementation(() => {});
		
		// 2. fs.readFileSync returns a valid package.json with 'dev' and 'build' scripts
		(fs.readFileSync as any).mockReturnValue(JSON.stringify({
			scripts: { dev: 'vite', build: 'vite build' }
		}));
		
		// 3. fs.existsSync defaults to TRUE for package.json, FALSE for others
		// This is crucial for the new validation logic.
		(fs.existsSync as any).mockImplementation((p: string) => {
			if (p.endsWith('package.json')) return true;
			return false;
		});
	});
	
	it('should detect BUN and use "bun run dev"', async () => {
		// Setup: Bun lockfile exists
		(fs.existsSync as any).mockImplementation((p: string) => {
			if (p.endsWith('package.json')) return true;
			if (p.endsWith('bun.lockb')) return true;
			return false;
		});
		
		await runApp(targetRoot, 'dev');
		
		expect(execSync).toHaveBeenCalledWith('bun run dev', expect.anything());
		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('bun run dev'));
	});
	
	it('should detect PNPM and use "pnpm run dev"', async () => {
		// Setup: PNPM lockfile exists
		(fs.existsSync as any).mockImplementation((p: string) => {
			if (p.endsWith('package.json')) return true;
			if (p.endsWith('pnpm-lock.yaml')) return true;
			return false;
		});
		
		await runApp(targetRoot, 'dev');
		
		expect(execSync).toHaveBeenCalledWith('pnpm run dev', expect.anything());
	});
	
	it('should detect YARN and use "yarn run dev"', async () => {
		(fs.existsSync as any).mockImplementation((p: string) => {
			if (p.endsWith('package.json')) return true;
			if (p.endsWith('yarn.lock')) return true;
			return false;
		});
		
		await runApp(targetRoot, 'dev');
		expect(execSync).toHaveBeenCalledWith('yarn run dev', expect.anything());
	});
	
	it('should default to NPM if no lockfile found', async () => {
		// Default mock (only package.json exists)
		await runApp(targetRoot, 'dev');
		expect(execSync).toHaveBeenCalledWith('npm run dev', expect.anything());
	});
	
	it('should run custom scripts (e.g. "build")', async () => {
		await runApp(targetRoot, 'build');
		expect(execSync).toHaveBeenCalledWith('npm run build', expect.anything());
	});
	
	it('should throw error if process exits with non-zero code', async () => {
		(execSync as any).mockImplementation(() => { throw new Error('Failed'); });
		
		await expect(runApp(targetRoot, 'dev')).rejects.toThrow('Script "dev" failed execution');
	});
	
	it('should throw error if package.json is missing', async () => {
		// Force package.json missing
		(fs.existsSync as any).mockReturnValue(false);
		
		await expect(runApp(targetRoot, 'dev')).rejects.toThrow('package.json not found');
	});
	
	it('should throw error if script is missing in package.json', async () => {
		// Return pkg without 'missing-script'
		(fs.readFileSync as any).mockReturnValue(JSON.stringify({ scripts: { dev: 'vite' } }));
		
		await expect(runApp(targetRoot, 'missing-script')).rejects.toThrow('Missing script: "missing-script"');
	});
	
	it('should spawn with correct CWD, Stdio, and Shell options', async () => {
		await runApp(targetRoot, 'dev');
		
		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining('npm run dev'),
			expect.objectContaining({
				cwd: targetRoot,
				stdio: 'inherit'
			})
		);
	});
});