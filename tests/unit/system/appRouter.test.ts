/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/system/appRouter.test.ts
 * @version:    2.0.1
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
 * V2.0.1, 20251226-1913
 * Refactored logic.
 *
 * V2.0.0, 20251222-23:32
 * Unit tests for Headless Mode Routing (CLI Arguments).
 * FIXED: Mocked logger methods correctly.
 *
 * V1.0.0, 20251222-13:07
 * Initial creation and release of appRouter.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '../../../app/app';
import * as prompts from '@clack/prompts';

// --- Mocks ---
vi.mock('@clack/prompts');

// FIXED: Complete Logger Mock
vi.mock('../../../app/services/loggerService', () => ({
	logger: {
		init: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		success: vi.fn(),
		warn: vi.fn(),
	}
}));

vi.mock('../../../app/services/configService');
vi.mock('../../../app/services/llmService', () => ({
	llm: { checkAvailability: vi.fn().mockResolvedValue([]) }
}));

// Spy on Commands
vi.mock('../../../app/commands/app/runApp', () => ({ runApp: vi.fn() }));
vi.mock('../../../app/commands/git/initLayers', () => ({ initLayers: vi.fn() }));
vi.mock('../../../app/commands/utils/validateHeaders', () => ({ validateHeaders: vi.fn() }));

import { runApp } from '../../../app/commands/app/runApp';
import { initLayers } from '../../../app/commands/git/initLayers';
import { validateHeaders } from '../../../app/commands/utils/validateHeaders';
import { logger } from '../../../app/services/loggerService';

describe('Unit: App Router (Headless)', () => {
	let mockIntro: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		mockIntro = vi.mocked(prompts.intro);
	});
	
	it('should route "app dev" directly to runApp', async () => {
		process.argv = ['node', 'index.ts', 'app', 'dev'];
		await main('/root', '/tool');
		
		expect(runApp).toHaveBeenCalledWith('/root', 'dev');
		expect(mockIntro).not.toHaveBeenCalled();
		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Headless Mode'));
	});
	
	it('should route "git init FORCE" directly to initLayers', async () => {
		process.argv = ['node', 'index.ts', 'git', 'init', 'FORCE'];
		await main('/root', '/tool');
		
		expect(initLayers).toHaveBeenCalledWith('/root', { force: true });
		expect(mockIntro).not.toHaveBeenCalled();
	});
	
	it('should route "utils headers" directly to validateHeaders', async () => {
		process.argv = ['node', 'index.ts', 'utils', 'headers'];
		await main('/root', '/tool');
		
		expect(validateHeaders).toHaveBeenCalledWith('/root');
	});
	
	it('should Fallback to Interactive Mode for unknown commands', async () => {
		// Setup: Unknown command
		process.argv = ['node', 'index.ts', 'unknown', 'command'];
		
		// Mock prompt to exit immediately to avoid loop
		(prompts.select as any).mockResolvedValue('exit');
		
		// Mock process.exit to avoid crash in test
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('EXIT'); });
		
		try {
			await main('/root', '/tool');
		} catch {}
		
		expect(logger.error).toHaveBeenCalled();
		exitSpy.mockRestore();
	});
});