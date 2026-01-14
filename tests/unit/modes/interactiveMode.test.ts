/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/modes/interactiveMode.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 08
 * @createTime: 15:16
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
 * V1.0.0, 20260108-15:16
 * Initial creation and release of interactiveMode.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runInteractive } from '../../../app/modes/interactiveMode';
import { commandRegistry } from '../../../app/commands/commandRegistry';
import { BaseCommand } from '../../../app/commands/baseCommand';
import * as clack from '@clack/prompts';
import { logger } from '../../../app/services/loggerService';
import { configService } from '../../../app/services/configService';

// ----------------------------------------------------------------------------
// Mocks & Helpers
// ----------------------------------------------------------------------------
vi.mock('@clack/prompts');
vi.mock('../../../app/services/loggerService');
vi.mock('../../../app/services/llmService');
vi.mock('../../../app/services/configService');

class ExitError extends Error {
	constructor(public code: number) { super(`EXIT_${code}`); }
}

class MockCommand extends BaseCommand {
	public executed = false;
	private _enabled = true;
	
	constructor(id: string, enabled: boolean = true) {
		super({ id, domain: 'test', name: 'mock', label: 'Mock', description: 'Desc' });
		this._enabled = enabled;
	}
	
	async isEnabled() { return this._enabled; }
	
	async execute() {
		this.executed = true;
		if (this.metadata.id === 'test.crash') throw new Error('Command Boom');
	}
}

describe('Interactive Mode', () => {
	let validCmd: MockCommand;
	let disabledCmd: MockCommand;
	let crashCmd: MockCommand;
	let mockExit: any;
	
	const runSafely = async () => {
		try {
			await runInteractive('/root');
		} catch (e: any) {
			if (!(e instanceof ExitError)) throw e;
		}
	};
	
	beforeEach(() => {
		vi.clearAllMocks();
		(commandRegistry as any).commands.clear();
		
		validCmd = new MockCommand('test.run', true);
		disabledCmd = new MockCommand('test.blocked', false);
		crashCmd = new MockCommand('test.crash', true);
		
		commandRegistry.register(validCmd);
		commandRegistry.register(disabledCmd);
		commandRegistry.register(crashCmd);
		
		(clack.spinner as any).mockReturnValue({ start: vi.fn(), stop: vi.fn() });
		
		mockExit = vi.spyOn(process, 'exit').mockImplementation((code?: number) => {
			throw new ExitError(code ?? 0);
		});
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
	});
	
	// ========================================================================
	// 1. Core Workflow
	// ========================================================================
	
	it('should execute command selected from menu', async () => {
		vi.mocked(clack.multiselect).mockResolvedValueOnce([]); // Config
		vi.mocked(clack.select)
			.mockResolvedValueOnce('test')      // Domain
			.mockResolvedValueOnce('test.run')  // Command
			.mockResolvedValueOnce('exit');     // Exit Loop
		
		await runSafely();
		
		expect(validCmd.executed).toBe(true);
		expect(mockExit).toHaveBeenCalledWith(0);
	});
	
	// ========================================================================
	// 2. Navigation & Resilience (Niche Cases)
	// ========================================================================
	
	it('should handle "Back" navigation without exiting', async () => {
		vi.mocked(clack.multiselect).mockResolvedValueOnce([]);
		vi.mocked(clack.select)
			.mockResolvedValueOnce('test') // Enter Domain
			.mockResolvedValueOnce('back') // Click Back (Should return to Domain select)
			.mockResolvedValueOnce('exit'); // Then Exit
		
		await runSafely();
		
		// If 'back' worked, we didn't crash and we eventually exited cleanly
		expect(validCmd.executed).toBe(false);
		expect(mockExit).toHaveBeenCalledWith(0);
	});
	
	it('should stay alive if a command crashes (Resilience)', async () => {
		vi.mocked(clack.multiselect).mockResolvedValueOnce([]);
		vi.mocked(clack.select)
			.mockResolvedValueOnce('test')
			.mockResolvedValueOnce('test.crash') // This throws Error('Command Boom')
			.mockResolvedValueOnce('exit');      // Should still prompt this after crash
		
		await runSafely();
		
		expect(logger.error).toHaveBeenCalledWith('Command failed: Command Boom');
		expect(mockExit).toHaveBeenCalledWith(0);
	});
	
	// ========================================================================
	// 3. Access Control & Config (Necessary Cases)
	// ========================================================================
	
	it('should block disabled commands', async () => {
		vi.mocked(clack.multiselect).mockResolvedValueOnce([]);
		vi.mocked(clack.select)
			.mockResolvedValueOnce('test')
			.mockResolvedValueOnce('test.blocked') // isEnabled = false
			.mockResolvedValueOnce('exit');
		
		await runSafely();
		
		expect(disabledCmd.executed).toBe(false);
		expect(logger.warn).toHaveBeenCalledWith('This command is currently disabled.');
	});
	
	it('should apply session configuration (Verbose/File)', async () => {
		// User selects both options
		vi.mocked(clack.multiselect).mockResolvedValueOnce(['verbose', 'file']);
		vi.mocked(clack.select).mockResolvedValueOnce('exit');
		
		await runSafely();
		
		expect(configService.setFlag).toHaveBeenCalledWith('verbose', true);
		expect(logger.init).toHaveBeenCalled(); // Triggered by 'file' option
		expect(process.env.LOG_TO_FILE).toBe('true');
	});
	
	it('should exit gracefully if commandRegistry is empty', async () => {
		(commandRegistry as any).commands.clear();
		vi.mocked(clack.multiselect).mockResolvedValueOnce([]);
		vi.mocked(clack.select).mockResolvedValueOnce('exit');
		
		await runSafely();
		
		expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('System is empty'));
	});
});