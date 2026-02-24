/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/baseCommand.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 01:29
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
 * V1.0.0, 20260107-01:29
 * Initial creation and release of baseCommand.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { BaseCommand } from '../../../app/commands/baseCommand.js';
import type { CommandOptions } from '../../../app/types/index.js';

// 1. Create a concrete implementation for testing
class TestCommand extends BaseCommand {
	constructor() {
		super({
			id: 'test.cmd',
			domain: 'test',
			name: 'run',
			label: 'Test Command',
			description: 'Unit test command'
		});
	}
	
	// minimal implementation
	async execute(targetRoot: string, options: CommandOptions, ...args: string[]): Promise<void> {
		// no-op
	}
}

describe('BaseCommand', () => {
	
	it('should correctly store metadata in the constructor', () => {
		const cmd = new TestCommand();
		
		expect(cmd.metadata.id).toBe('test.cmd');
		expect(cmd.metadata.domain).toBe('test');
		expect(cmd.metadata.label).toBe('Test Command');
	});
	
	it('should be enabled by default', async () => {
		const cmd = new TestCommand();
		const isEnabled = await cmd.isEnabled('/some/path');
		
		expect(isEnabled).toBe(true);
	});
	
	it('should allow metadata to be accessed publicly (Read-Only)', () => {
		const cmd = new TestCommand();
		
		// This test verifies the 'public readonly' modifier in the constructor
		// ensures properties are accessible but immutable if we were to try assigning (TS would block assignment).
		expect(cmd.metadata).toBeDefined();
	});
});