/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/initLayers.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:49
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * This file defines the Unit Tests for the initLayers command logic. Unlike the
 * E2E test (which tests the full CLI process on a real file system), this test
 * suite imports the specific initLayers function directly and isolates it from
 * external dependencies. It uses extensive mocking (via Vitest's vi utility) to
 * simulate various file system states and user interactions.
 *
 * Key Functionality:
 * Dependency Mocking: It replaces real system modules (fs, child_process) and UI
 * libraries (@clack/prompts) with mocks. This ensures tests run fast and do not
 * modify the actual hard drive or execute real Git commands.
 *
 *   Path Verification:
 *   Missing Directory: Verifies that if the "layers" directory is missing, the
 *   function logs a warning and exits gracefully without crashing or attempting
 *   to run commands.
 *
 *   Logic Branching:
 *   Interactive Mode: Simulates a user session where uninitialized layers are
 *   found. It mocks the user clicking "Yes" on the confirmation prompt and
 *   asserts that git init is subsequently called.
 *
 * Headless/CI Mode: Verifies that passing the { force: true } option completely
 * bypasses the user prompt (asserting confirm is not called) but still executes
 * the necessary git init command.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20251221-19:40
 * Updated to use new test context utility.
 *
 * V1.0.0, 20251218-23:49
 * Initial creation and release of initLayers.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initLayers } from '../../../../app/commands/git/initLayers';
import child_process from 'child_process';
import fs from 'fs';
import { confirm } from '@clack/prompts';
import path from 'path';

// 1. Mock Dependencies
vi.mock('child_process');
vi.mock('@clack/prompts');
vi.mock('fs');
// Mock logger
vi.mock('../../../../app/services/loggerService', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
}));

describe('Unit: initLayers', () => {
	const mockRoot = '/mock/root';
	
	beforeEach(() => {
		vi.clearAllMocks();
		// Default: Layers directory exists
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p.toString().includes('layers')) return true;
			return false;
		});
		// Default: isDirectory returns true
		vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
	});
	
	it('should warn and exit if "layers" directory does not exist', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(false); // No layers dir
		
		await initLayers(mockRoot);
		
		expect(child_process.execSync).not.toHaveBeenCalled();
		const { logger } = await import('../../../../app/services/loggerService');
		expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('No "layers" directory'));
	});
	
	it('should prompt user and init if uninitialized layers found (Interactive)', async () => {
		// Setup: One layer found
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		// Setup: .git does NOT exist inside 'layer1'
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p.toString().endsWith('layers')) return true;
			if (p.toString().endsWith('.git')) return false;
			return true;
		});
		// User confirms
		vi.mocked(confirm).mockResolvedValue(true);
		
		await initLayers(mockRoot);
		
		expect(confirm).toHaveBeenCalled();
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git init'),
			expect.anything()
		);
	});
	
	it('should skip prompt and init immediately if force=true (Headless)', async () => {
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p.toString().endsWith('layers')) return true;
			if (p.toString().endsWith('.git')) return false;
			return true;
		});
		
		await initLayers(mockRoot, { force: true });
		
		// Verify NO prompt
		expect(confirm).not.toHaveBeenCalled();
		
		// Verify Init happened
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git init'),
			expect.anything()
		);
	});
	
	// --- GAP 1: User Cancellation ---
	it('should cancel operation if user declines prompt (Interactive)', async () => {
		// Setup: Candidates exist
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		vi.mocked(fs.existsSync).mockReturnValue(true); // layers dir exists
		// Specific mock for the candidate check
		vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
		// Force the .git check to fail so it looks like a valid candidate
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			return !p.toString().endsWith('.git');
		});
		
		// Setup: User says NO
		vi.mocked(confirm).mockResolvedValue(false);
		
		await initLayers(mockRoot);
		
		expect(confirm).toHaveBeenCalled();
		expect(child_process.execSync).not.toHaveBeenCalled();
		
		const { outro } = await import('@clack/prompts');
		expect(outro).toHaveBeenCalledWith('Operation Cancelled');
	});
	
	// --- GAP 2: No Candidates (Already Initialized) ---
	it('should log success if all layers are already initialized', async () => {
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		
		// Setup: .git DOES exist
		vi.mocked(fs.existsSync).mockReturnValue(true);
		
		await initLayers(mockRoot);
		
		const { logger } = await import('../../../../app/services/loggerService');
		expect(logger.success).toHaveBeenCalledWith('All layers are already initialized.');
		expect(child_process.execSync).not.toHaveBeenCalled();
	});
	
	// --- GAP 3: Git Init Failure ---
	it('should handle git init failure gracefully', async () => {
		// Setup: Valid candidate
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		vi.mocked(fs.existsSync).mockImplementation((p) => !p.toString().endsWith('.git'));
		vi.mocked(confirm).mockResolvedValue(true);
		
		// Setup: Exec throws error
		vi.mocked(child_process.execSync).mockImplementation(() => {
			throw new Error('Git not found');
		});
		
		await initLayers(mockRoot);
		
		const { logger } = await import('../../../../app/services/loggerService');
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to init layer1'));
	});
});