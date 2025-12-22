/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/app/runApp.test.ts
 * @version:    1.0.0
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
 * V1.0.0, 20251218-22:37
 * Initial creation and release of runApp.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runApp } from '../../../../app/commands/app/runApp';
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

// Mock dependencies
vi.mock('child_process');
vi.mock('fs');
vi.mock('../../../../app/services/logger.service', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn()
	}
}));

describe('Command: Run App', () => {
	const mockRoot = '/mock/root';
	let spawnMock: any;
	let exitCallback: (code: number) => void;
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup sophisticated Spawn Mock
		exitCallback = () => {};
		spawnMock = {
			on: vi.fn((event, cb) => {
				if (event === 'close') {
					// Capture the callback so we can trigger it manually in tests if needed
					// or let it run immediately for simple cases
					exitCallback = cb;
					cb(0);
				}
			}),
			stdout: { on: vi.fn() },
			stderr: { on: vi.fn() }
		};
		vi.mocked(child_process.spawn).mockReturnValue(spawnMock as any);
	});
	
	// --- Package Manager Detection Tests ---
	
	it('should detect BUN and use "bun run dev"', async () => {
		vi.mocked(fs.existsSync).mockImplementation((p) => (p as string).endsWith('bun.lockb'));
		await runApp(mockRoot);
		expect(child_process.spawn).toHaveBeenCalledWith('bun', ['run', 'dev'], expect.anything());
	});
	
	it('should detect PNPM and use "pnpm run dev"', async () => {
		vi.mocked(fs.existsSync).mockImplementation((p) => (p as string).endsWith('pnpm-lock.yaml'));
		await runApp(mockRoot);
		expect(child_process.spawn).toHaveBeenCalledWith('pnpm', ['run', 'dev'], expect.anything());
	});
	
	it('should detect YARN and use "yarn run dev"', async () => {
		vi.mocked(fs.existsSync).mockImplementation((p) => (p as string).endsWith('yarn.lock'));
		await runApp(mockRoot);
		expect(child_process.spawn).toHaveBeenCalledWith('yarn', ['run', 'dev'], expect.anything());
	});
	
	it('should default to NPM if no lockfile found', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(false);
		await runApp(mockRoot);
		expect(child_process.spawn).toHaveBeenCalledWith('npm', ['run', 'dev'], expect.anything());
	});
	
	// --- Functionality Tests ---
	
	it('should run custom scripts (e.g. "build")', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(false); // Default npm
		await runApp(mockRoot, 'build');
		expect(child_process.spawn).toHaveBeenCalledWith(
			'npm',
			['run', 'build'],
			expect.anything()
		);
	});
	
	it('should log error if process exits with non-zero code', async () => {
		// Override default mock to fail
		spawnMock.on = vi.fn((event, cb) => {
			if (event === 'close') cb(1); // Exit code 1
		});
		
		await runApp(mockRoot);
		
		// We can't easily import the logger mock here to check expectation without
		// assigning it to a variable, but we can rely on coverage or
		// import the mocked module. For now, we assume if it runs without throw, it handled it.
		// Or strictly:
		const { logger } = await import('../../../../app/services/logger.service');
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('code 1'));
	});
	
	it('should log success if process exits with 0', async () => {
		await runApp(mockRoot);
		const { logger } = await import('../../../../app/services/logger.service');
		expect(logger.success).toHaveBeenCalledWith('App stopped.');
	});
	
	it('should spawn with correct CWD, Stdio, and Shell options', async () => {
		// Mock FS to default to npm
		vi.mocked(fs.existsSync).mockReturnValue(false);
		
		await runApp(mockRoot, 'dev');
		
		// Strictly verify the options object (3rd argument)
		expect(child_process.spawn).toHaveBeenCalledWith(
			'npm',
			['run', 'dev'],
			expect.objectContaining({
				cwd: mockRoot,
				stdio: 'inherit',
				shell: true
			})
		);
	});
	
	it('should log startup information and the command being executed', async () => {
		await runApp(mockRoot);
		
		// Import logger to verify expectations
		const { logger } = await import('../../../../app/services/logger.service');
		
		// Verify strict start-up logs
		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Starting App in ${mockRoot}`));
		
		// Verify command echo (e.g. "> npm run dev")
		// Note: We use stringContaining because the actual log might contain color codes from picocolors
		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('npm run dev'));
	});
});