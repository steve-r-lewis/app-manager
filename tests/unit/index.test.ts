/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/index.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 20:56
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
 * V1.1.2, 20260107-21:21
 * Added explicit mock for LLM Service to prevent crashes.
 *
 * V1.1.1, 20260107-21:08
 * Added explicit mock for Logger Service to prevent crashes.
 *
 * V1.1.0, 20260107-20:45
 * Added test for crashing command execution.
 *
 * V1.0.0, 20260107-20:56
 * Initial creation and release of index.test.ts.
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { logger } from '../../app/services/loggerService';
import { configService } from '../../app/services/configService';
import { commandRegistry } from '../../app/commands/commandRegistry';

import { main } from '../../app/index';

import { runHeadless } from '../../app/modes/headlessMode';
import { runInteractive } from '../../app/modes/interactiveMode';

// ----------------------------------------------------------------------------
// Mocks
// ----------------------------------------------------------------------------
// We mock the modes because we are testing the *Dispatcher*, not the modes themselves.
vi.mock('../../app/modes/headlessMode', () => ({
	runHeadless: vi.fn()
}));
vi.mock('../../app/modes/interactiveMode', () => ({
	runInteractive: vi.fn()
}));
vi.mock('../../app/services/loggerService');
vi.mock('../../app/services/configService');

describe('App Entry Point (Router)', () => {
	const originalArgv = process.argv;
	
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset argv to a neutral state (just node binary and script path)
		process.argv = ['/bin/node', '/app/index.js'];
	});
	
	afterEach(() => {
		process.argv = originalArgv;
	});
	
	// ========================================================================
	// 1. Initialization Phase
	// ========================================================================
	it('should initialize core services before executing logic', async () => {
		await main('/target/root', '/tool/root');
		
		// Verify critical infrastructure is ready
		expect(logger.init).toHaveBeenCalledWith('/target/root');
		expect(configService.init).toHaveBeenCalledWith('/tool/root');
	});
	
	// ========================================================================
	// 2. Command Registration Phase
	// ========================================================================
	it('should ensure core commands are registered', async () => {
		// Since registration happens at module import time, we check the commandRegistry state
		const commands = commandRegistry.getDomains().flatMap(d => commandRegistry.getByDomain(d));
		const ids = commands.map(c => c.metadata.id);
		
		expect(ids).toContain('git.commit');
		expect(ids).toContain('git.push');
		expect(ids).toContain('git.sync');
	});
	
	// ========================================================================
	// 3. Routing Logic (The Core Responsibility)
	// ========================================================================
	it('should route to Headless Mode when user provides arguments', async () => {
		// User types: app git status
		process.argv = ['node', 'app', 'git', 'status'];
		
		await main('/target', '/tool');
		
		// Router should strip 'node' and 'app' and pass the rest
		expect(runHeadless).toHaveBeenCalledWith('/target', ['git', 'status']);
		expect(runInteractive).not.toHaveBeenCalled();
	});
	
	it('should route to Interactive Mode when arguments are empty', async () => {
		// User types: app
		process.argv = ['node', 'app'];
		
		await main('/target', '/tool');
		
		// Router should default to TUI
		expect(runInteractive).toHaveBeenCalledWith('/target');
		expect(runHeadless).not.toHaveBeenCalled();
	});
	
	it('should route to Headless Mode even for flags only', async () => {
		// User types: app --help
		process.argv = ['node', 'app', '--help'];
		
		await main('/target', '/tool');
		
		expect(runHeadless).toHaveBeenCalledWith('/target', ['--help']);
		expect(runInteractive).not.toHaveBeenCalled();
	});
});