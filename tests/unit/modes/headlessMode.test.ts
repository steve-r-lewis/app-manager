/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/modes/headlessMode.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 08
 * @createTime: 15:15
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
 * V1.0.0, 20260108-15:15
 * Initial creation and release of headlessMode.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runHeadless } from '../../../app/modes/headlessMode';
import { commandRegistry } from '../../../app/commands/commandRegistry';
import { BaseCommand } from '../../../app/commands/baseCommand';
import { configService } from '../../../app/services/configService';
import { logger } from '../../../app/services/loggerService';

// ----------------------------------------------------------------------------
// Mocks & Helpers
// ----------------------------------------------------------------------------
vi.mock('../../../app/services/configService');
vi.mock('../../../app/services/loggerService');

// Custom Error to intercept process.exit
class ExitError extends Error {
	constructor(public code: number) {
		super(`EXIT_${code}`);
	}
}

// Mock Command Implementation
class MockCommand extends BaseCommand {
	public executed = false;
	public capturedOptions: any = {};
	private _shouldFail = false;
	
	// We ensure the name matches what we call in tests ('run')
	constructor(id: string = 'test.run', shouldFail = false) {
		super({
			id,
			domain: 'test',
			name: 'run',  // <--- CRITICAL FIX: Name matches action 'run'
			label: 'Mock',
			description: 'Desc'
		});
		this._shouldFail = shouldFail;
	}
	
	async execute(root: string, options: any) {
		if (this._shouldFail) throw new Error('Execution Boom');
		this.executed = true;
		this.capturedOptions = options;
	}
}

describe('Headless Mode', () => {
	let mockExit: any;
	let mockCmd: MockCommand;
	
	// Helper to run code that might exit
	const runSafely = async (args: string[]) => {
		try {
			await runHeadless('/root', args);
		} catch (e: any) {
			// Rethrow only if it's NOT our expected exit error
			if (!(e instanceof ExitError)) throw e;
		}
	};
	
	beforeEach(() => {
		vi.clearAllMocks();
		(commandRegistry as any).commands.clear();
		
		// 1. Register a valid command
		mockCmd = new MockCommand('test.run');
		commandRegistry.register(mockCmd);
		
		// 2. Mock process.exit to throw ExitError instead of killing process
		mockExit = vi.spyOn(process, 'exit').mockImplementation((code?: number) => {
			throw new ExitError(code ?? 0);
		});
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
	});
	
	// ========================================================================
	// Happy Paths
	// ========================================================================
	
	it('should dispatch valid commands', async () => {
		// Args: domain=test, action=run
		await runSafely(['test', 'run', '--flag', 'value']);
		
		expect(mockCmd.executed).toBe(true);
		expect(mockCmd.capturedOptions.flag).toBe('value');
		expect(mockExit).not.toHaveBeenCalled();
	});
	
	it('should set verbose flag if provided', async () => {
		await runSafely(['test', 'run', '--verbose']);
		
		expect(configService.setFlag).toHaveBeenCalledWith('verbose', true);
		expect(mockCmd.executed).toBe(true);
	});
	
	it('should handle boolean flags correctly', async () => {
		// --force should be parsed as { force: true }
		await runSafely(['test', 'run', '--force']);
		
		expect(mockCmd.capturedOptions.force).toBe(true);
	});
	
	// ========================================================================
	// Error / Edge Cases
	// ========================================================================
	
	it('should exit(1) if command is unknown', async () => {
		// Args: domain=unknown, action=cmd
		await runSafely(['unknown', 'cmd']);
		
		expect(mockExit).toHaveBeenCalledWith(1);
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unknown command'));
	});
	
	it('should exit(1) if command execution fails', async () => {
		// Setup a command that crashes
		const failCmd = new MockCommand('test.crash', true);
		// Overwrite the name to match the action 'crash'
		(failCmd.metadata as any).name = 'crash';
		commandRegistry.register(failCmd);
		
		await runSafely(['test', 'crash']);
		
		expect(mockExit).toHaveBeenCalledWith(1);
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Execution failed: Execution Boom'));
	});
	
	it('should exit(1) if command is disabled', async () => {
		// Mock isEnabled to return false
		vi.spyOn(mockCmd, 'isEnabled').mockResolvedValue(false);
		
		await runSafely(['test', 'run']);
		
		expect(mockExit).toHaveBeenCalledWith(1);
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('is not available'));
		expect(mockCmd.executed).toBe(false);
	});
});