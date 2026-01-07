/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/registry.test.ts
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
 * Initial creation and release of registry.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registry } from '../../../app/commands/registry';
import { BaseCommand } from '../../../app/commands/baseCommand';
import { logger } from '../../../app/services/loggerService';

// Mock the logger to verify warnings
vi.mock('../../../app/services/loggerService');

// Concrete implementations for testing
class MockCommand extends BaseCommand {
	constructor(id: string, domain: string, hidden: boolean = false) {
		super({
			id,
			domain,
			name: id.split('.')[1], // derive name from id for simplicity
			label: `Label for ${id}`,
			description: 'Test Description',
			hidden
		});
	}
	async execute() {}
}

describe('CommandRegistry', () => {
	beforeEach(() => {
		(registry as any).commands.clear();
		vi.clearAllMocks();
	});
	
	// ========================================================================
	// Core Functionality
	// ========================================================================
	it('should register and retrieve a command by domain/name', () => {
		const cmd = new MockCommand('test.run', 'test');
		registry.register(cmd);
		
		const found = registry.get('test', 'run');
		expect(found).toBeDefined();
		expect(found?.metadata.id).toBe('test.run');
	});
	
	it('should list all available domains sorted', () => {
		registry.register(new MockCommand('a.cmd', 'app'));
		registry.register(new MockCommand('z.cmd', 'zebra'));
		registry.register(new MockCommand('b.cmd', 'app')); // Duplicate domain
		
		const domains = registry.getDomains();
		expect(domains).toEqual(['app', 'zebra']);
	});
	
	it('should return all registered commands via getAll()', () => {
		registry.register(new MockCommand('a.1', 'a'));
		registry.register(new MockCommand('b.1', 'b'));
		
		expect(registry.getAll()).toHaveLength(2);
	});
	
	// ========================================================================
	// Logic & Edge Cases (The Missing Tests)
	// ========================================================================
	it('should filter out HIDDEN commands from domain lists (TUI Mode)', () => {
		registry.register(new MockCommand('visible.cmd', 'git', false));
		registry.register(new MockCommand('hidden.cmd', 'git', true));
		
		const list = registry.getByDomain('git');
		
		// Should only return the visible one
		expect(list).toHaveLength(1);
		expect(list[0].metadata.id).toBe('visible.cmd');
		
		// However, direct lookup (CLI Mode) should still work for hidden commands
		expect(registry.get('git', 'hidden.cmd')).toBeDefined();
	});
	
	it('should log a WARNING when overwriting a registered command', () => {
		const cmd1 = new MockCommand('test.duplicate', 'test');
		const cmd2 = new MockCommand('test.duplicate', 'test'); // Same ID
		
		registry.register(cmd1);
		registry.register(cmd2);
		
		// 1. Verify State: Length is still 1 (Overwrite)
		expect(registry.getAll()).toHaveLength(1);
		
		// 2. Verify Side Effect: Logger was warned
		expect(logger.warn).toHaveBeenCalledWith(
			expect.stringContaining('Overwriting command: test.duplicate')
		);
	});
});