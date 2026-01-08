/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/syncCommand.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 08
 * @createTime: 23:43
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Git Sync Command.
 *
 * Test Coverage:
 * 1. Command Metadata (Registration integrity)
 * 2. Interactive Mode (Default flow with Spinner/UI)
 * 3. Headless Mode (Automation flow with forced output)
 * 4. Error Handling (Graceful failure states in both modes)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.3, 20260108-23:58
 * Changed mocking strategy from Module Mocking to vi.spyOn() for Singletons.
 * This fixes the issue where the real simple-git instance was executing.
 *
 * V1.0.2, 20260108-23:52
 * Added test coverage for error handling in headless mode.
 *
 * V1.0.1, 20260108-23:43
 * Added test coverage for interactive mode.
 *
 * V1.0.0, 20260108-23:43
 * Initial creation and release of syncCommand.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SyncCommand } from '../../../../app/commands/git/syncCommand';
import { githubService } from '../../../../app/services/githubService';
import { logger } from '../../../../app/services/loggerService';
import * as clack from '@clack/prompts';

// ----------------------------------------------------------------------------
// Mocks (UI Module)
// ----------------------------------------------------------------------------

// Mock Object for Spinner
const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
	message: vi.fn()
};

// Module Mock for @clack/prompts
vi.mock('@clack/prompts', () => ({
	intro: vi.fn(),
	outro: vi.fn(),
	spinner: vi.fn(() => mockSpinner)
}));

describe('SyncCommand', () => {
	let command: SyncCommand;
	const mockTargetRoot = '/mock/root';
	
	beforeEach(() => {
		// ------------------------------------------------------------------------
		// Spy on Singletons
		// ------------------------------------------------------------------------
		// We use spyOn because githubService is a Singleton Object exported by value.
		// This ensures we intercept the exact same object instance used by SyncCommand.
		
		// 1. Spy on githubService.syncRepo and prevent actual execution
		vi.spyOn(githubService, 'syncRepo').mockResolvedValue(undefined);
		
		// 2. Spy on logger to prevent console noise and verify calls
		vi.spyOn(logger, 'success').mockImplementation(() => {});
		vi.spyOn(logger, 'error').mockImplementation(() => {});
		
		// 3. Clear call history before each test
		vi.clearAllMocks();
		
		command = new SyncCommand();
	});
	
	afterEach(() => {
		// Restore original implementations to avoid polluting other tests
		vi.restoreAllMocks();
	});
	
	// ========================================================================
	// 1. Metadata Checks
	// ========================================================================
	describe('Metadata', () => {
		it('should have correct command registration details', () => {
			expect(command.metadata.id).toBe('git.sync');
			expect(command.metadata.domain).toBe('git');
			expect(command.metadata.name).toBe('sync');
			expect(command.metadata.label).toContain('Sync Repo');
		});
	});
	
	// ========================================================================
	// 2. Interactive Mode (Default)
	// ========================================================================
	describe('Interactive Mode', () => {
		it('should execute full UI flow when force is false', async () => {
			// Execute
			await command.execute(mockTargetRoot, { force: false });
			
			// 1. Verify UI Lifecycle
			expect(clack.intro).toHaveBeenCalledWith(expect.stringContaining('Sync Repositories'));
			expect(clack.spinner).toHaveBeenCalled();
			expect(mockSpinner.start).toHaveBeenCalledWith(expect.stringContaining('Pulling root'));
			
			// 2. Verify Service Call (silent = true)
			expect(githubService.syncRepo).toHaveBeenCalledWith(mockTargetRoot, true);
			
			// 3. Verify Completion
			expect(mockSpinner.stop).toHaveBeenCalledWith(expect.stringContaining('Sync complete'));
			expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('match remote'));
			expect(clack.outro).toHaveBeenCalled();
		});
		
		it('should handle service errors gracefully', async () => {
			const errorMsg = 'Network Error';
			// Mock a failure for this specific test
			vi.mocked(githubService.syncRepo).mockRejectedValueOnce(new Error(errorMsg));
			
			await command.execute(mockTargetRoot, {});
			
			// Verify Failure Flow
			expect(mockSpinner.stop).toHaveBeenCalledWith('Sync Failed.');
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(errorMsg));
			expect(clack.outro).toHaveBeenCalled(); // UI should still close neatly
		});
	});
	
	// ========================================================================
	// 3. Headless Mode (Force)
	// ========================================================================
	describe('Headless Mode', () => {
		it('should bypass UI and pipe output when force is true', async () => {
			// Execute
			await command.execute(mockTargetRoot, { force: true });
			
			// 1. Verify UI Suppressed
			expect(clack.intro).not.toHaveBeenCalled();
			expect(clack.spinner).not.toHaveBeenCalled();
			expect(clack.outro).not.toHaveBeenCalled();
			
			// 2. Verify Service Call (silent = false)
			// This ensures output is piped to stdout/stderr
			expect(githubService.syncRepo).toHaveBeenCalledWith(mockTargetRoot, false);
			
			// 3. Verify Logger
			expect(logger.success).toHaveBeenCalledWith('Sync completed.');
		});
		
		it('should log error without UI on failure', async () => {
			const errorMsg = 'Git Fatal Error';
			vi.mocked(githubService.syncRepo).mockRejectedValueOnce(new Error(errorMsg));
			
			await command.execute(mockTargetRoot, { force: true });
			
			// Verify Error Log
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(errorMsg));
			
			// Verify UI Suppressed
			expect(mockSpinner.start).not.toHaveBeenCalled();
			expect(mockSpinner.stop).not.toHaveBeenCalled();
		});
	});
});