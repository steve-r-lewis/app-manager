/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/commandRegistry.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 01:25
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
 * V1.0.0, 20260107-01:25
 * Initial creation and release of commandRegistry.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { commandRegistry } from '../../../app/commands/commandRegistry.js';
import { BaseCommand } from '../../../app/commands/baseCommand.js';
import { logger } from '../../../app/services/loggerService.js';

// Mock the logger to verify warnings
vi.mock('../../../app/services/loggerService');

// Concrete implementations for testing
class MockCommand extends BaseCommand {
	constructor(id: string, domain: string, hidden: boolean = false) {
		super({
			id,
			domain,
			// LOGIC: 'git.commit' -> name: 'commit'
			name: id.split('.')[1],
			label: `Label for ${id}`,
			description: 'Test Description',
			hidden
		});
	}
	async execute() {}
}

describe('CommandRegistry', () => {
	beforeEach(() => {
		(commandRegistry as any).commands.clear();
		vi.clearAllMocks();
	});
	
	// ========================================================================
	// Core Functionality
	// ========================================================================
	it('should register and retrieve a command by domain/name', () => {
		const cmd = new MockCommand('test.run', 'test');
		commandRegistry.register(cmd);
		
		const found = commandRegistry.get('test', 'run');
		expect(found).toBeDefined();
		expect(found?.metadata.id).toBe('test.run');
	});
	
	it('should list all available domains sorted', () => {
		commandRegistry.register(new MockCommand('a.cmd', 'app'));
		commandRegistry.register(new MockCommand('z.cmd', 'zebra'));
		commandRegistry.register(new MockCommand('b.cmd', 'app')); // Duplicate domain
		
		const domains = commandRegistry.getDomains();
		expect(domains).toEqual(['app', 'zebra']);
	});
	
	it('should return all registered commands via getAll()', () => {
		commandRegistry.register(new MockCommand('a.1', 'a'));
		commandRegistry.register(new MockCommand('b.1', 'b'));
		
		expect(commandRegistry.getAll()).toHaveLength(2);
	});
	
	// ========================================================================
	// Logic & Edge Cases
	// ========================================================================
	it('should filter out HIDDEN commands from domain lists (TUI Mode)', () => {
		// Setup: Use distinct IDs that derive to distinct names
		// 'git.visible' -> name: 'visible'
		// 'git.hidden'  -> name: 'hidden'
		commandRegistry.register(new MockCommand('git.visible', 'git', false));
		commandRegistry.register(new MockCommand('git.hidden', 'git', true));
		
		const list = commandRegistry.getByDomain('git');
		
		// 1. TUI Mode: Should only return the visible one
		expect(list).toHaveLength(1);
		expect(list[0].metadata.id).toBe('git.visible');
		
		// 2. CLI Mode: Direct lookup should still work for hidden commands
		// We look up by DOMAIN ('git') and NAME ('hidden'), NOT ID ('git.hidden')
		expect(commandRegistry.get('git', 'hidden')).toBeDefined();
	});
	
	it('should log a WARNING when overwriting a registered command', () => {
		const cmd1 = new MockCommand('test.duplicate', 'test');
		const cmd2 = new MockCommand('test.duplicate', 'test'); // Same ID
		
		commandRegistry.register(cmd1);
		commandRegistry.register(cmd2);
		
		// 1. Verify State: Length is still 1 (Overwrite)
		expect(commandRegistry.getAll()).toHaveLength(1);
		
		// 2. Verify Side Effect: Logger was warned
		expect(logger.warn).toHaveBeenCalledWith(
			expect.stringContaining('Overwriting command: test.duplicate')
		);
	});
});