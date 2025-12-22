/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/system/appRouter.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 22
 * @createTime: 13:07
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for the Application Router.
 * Verifies that CLI arguments (process.argv) are correctly parsed and routed
 * to the specific command modules (Headless Mode) vs falling back to the
 * Interactive Menu (TUI).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251222-13:07
 * Initial creation and release of appRouter.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '../../../app/app';
import { setupTestContext } from '../../helpers/testContext';
import * as prompts from '@clack/prompts';

// --- Mocks ---
// We mock the commands to ensure they are CALLED, without running them.
vi.mock('../../../app/commands/app/runApp', () => ({ runApp: vi.fn() }));
vi.mock('../../../app/commands/git/initLayers', () => ({ initLayers: vi.fn() }));
vi.mock('../../../app/commands/utils/validateHeaders', () => ({ validateHeaders: vi.fn() }));
vi.mock('../../../app/services/loggerService', () => ({
	logger: { init: vi.fn(), error: vi.fn(), warn: vi.fn() }
}));

// Mock Prompts to detect if Interactive Mode is entered
vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	intro: vi.fn(),
	outro: vi.fn(),
	select: vi.fn(),
	multiselect: vi.fn(),
}));

// Import mocks for assertion
import { runApp } from '../../../app/commands/app/runApp';
import { initLayers } from '../../../app/commands/git/initLayers';
import { validateHeaders } from '../../../app/commands/utils/validateHeaders';

describe('Unit: App Router (Headless)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const originalArgv = process.argv;
	// We verify interactive mode by checking if 'intro' was called
	const mockIntro = prompts.intro as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Mock process.exit to prevent test runner termination
		vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
	});
	
	afterEach(() => {
		ctx.restore();
		// CRITICAL: Restore original argv so other tests aren't affected
		process.argv = originalArgv;
		vi.restoreAllMocks();
	});
	
	it('should route "app dev" directly to runApp', async () => {
		// Simulate: node index.ts app dev
		process.argv = ['node', 'index.ts', 'app', 'dev'];
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(runApp).toHaveBeenCalledWith(ctx.targetRoot, 'dev');
		// Should NOT show interactive menu
		expect(mockIntro).not.toHaveBeenCalled();
	});
	
	it('should route "git init FORCE" directly to initLayers', async () => {
		// Simulate: node index.ts git init FORCE
		process.argv = ['node', 'index.ts', 'git', 'init', 'FORCE'];
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(initLayers).toHaveBeenCalledWith(ctx.targetRoot, { force: true });
		expect(mockIntro).not.toHaveBeenCalled();
	});
	
	it('should route "utils headers" directly to validateHeaders', async () => {
		// Simulate: node index.ts utils headers
		process.argv = ['node', 'index.ts', 'utils', 'headers'];
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(validateHeaders).toHaveBeenCalledWith(ctx.targetRoot);
		expect(mockIntro).not.toHaveBeenCalled();
	});
	
	it('should Fallback to Interactive Mode for unknown commands', async () => {
		// Simulate: node index.ts unknown command
		process.argv = ['node', 'index.ts', 'unknown', 'command'];
		
		// Mock the prompt sequence so it doesn't hang
		(prompts.multiselect as any).mockResolvedValue([]); // Session config
		(prompts.select as any).mockResolvedValue('exit'); // Main menu
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		// Should enter interactive mode
		expect(mockIntro).toHaveBeenCalled();
	});
});