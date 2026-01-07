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

import { describe, it, expect, beforeEach } from 'vitest';
import { registry } from '../../../app/commands/registry';
import { BaseCommand } from '../../../app/commands/baseCommand';

// Concrete implementation for testing
class MockCommand extends BaseCommand {
	constructor() {
		super({
			id: 'test.mock',
			domain: 'test',
			name: 'mock',
			label: 'Mock Command',
			description: 'A test command'
		});
	}
	async execute() {}
}

describe('CommandRegistry', () => {
	beforeEach(() => {
		// Clear registry before each test to ensure isolation
		(registry as any).commands.clear();
	});
	
	it('should register and retrieve a command', () => {
		const cmd = new MockCommand();
		registry.register(cmd);
		
		// Test Lookup
		const found = registry.get('test', 'mock');
		expect(found).toBeDefined();
		expect(found?.metadata.label).toBe('Mock Command');
	});
	
	it('should retrieve commands by domain (for TUI menus)', () => {
		registry.register(new MockCommand());
		
		const list = registry.getByDomain('test');
		expect(list).toHaveLength(1);
		expect(list[0].metadata.id).toBe('test.mock');
	});
	
	it('should list all available domains', () => {
		registry.register(new MockCommand());
		
		const domains = registry.getDomains();
		expect(domains).toContain('test');
	});
	
	it('should prevent duplicates or warn (implementation detail)', () => {
		const cmd1 = new MockCommand();
		const cmd2 = new MockCommand();
		
		registry.register(cmd1);
		registry.register(cmd2); // Overwrite
		
		const list = registry.getByDomain('test');
		expect(list).toHaveLength(1); // Should still only be 1
	});
});