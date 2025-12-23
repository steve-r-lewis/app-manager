/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/system/appInteractive.test.ts
 * @version:    2.0.1
 * @createDate: 2025 Dec 20
 * @createTime: 16:40
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Integration test suite for the Application's Main Entry Point (Interactive Mode).
 *
 * This suite mocks the User Interface layer (@clack/prompts) to simulate user
 * interactions with the main menu and sub-menus. It verifies that:
 *
 *   1. User selections correctly trigger the corresponding command modules.
 *   2. Navigation flows (e.g., "Go Back", "Exit") function as expected.
 *   3. Session configurations (Debug Mode, File Logging) are correctly applied
 *      to the environment.
 *
 * Note: This suite mocks the actual execution of commands to isolate the
 * menu routing logic.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.1, 20251222-23:28
 * - Added safety net to prevent infinite loops (Heap Out of Memory).
 *
 * V2.0.0, 20251222-22:48
 * - Added tests for AI provider selection and fallback
 *
 * V1.0.0, 20251220-16:40
 * Initial creation and release of appInteractive.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '../../../app/app';
import * as prompts from '@clack/prompts';

// --- Mocks ---

// 1. Mock Clack Prompts with SAFETY NET
vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		intro: vi.fn(),
		outro: vi.fn(),
		spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
		// DEFAULT TO 'exit'. This prevents infinite loops if a test misses a step.
		select: vi.fn().mockResolvedValue('exit'),
		isCancel: vi.fn(() => false),
		text: vi.fn(),
	};
});

// 2. Mock Services
vi.mock('../../../app/services/loggerService');
vi.mock('../../../app/services/configService');
vi.mock('../../../app/services/llmService', () => ({
	llm: {
		checkAvailability: vi.fn().mockResolvedValue([]),
		setActiveProvider: vi.fn(),
	}
}));

// 3. Mock Commands (Spy on them to verify calls)
vi.mock('../../../app/commands/app/runApp', () => ({ runApp: vi.fn() }));
vi.mock('../../../app/commands/docs/runDocs', () => ({ runDocs: vi.fn() }));
vi.mock('../../../app/commands/quality/runQuality', () => ({ runQuality: vi.fn() }));
vi.mock('../../../app/commands/git/manageCommits', () => ({ manageCommits: vi.fn() }));
vi.mock('../../../app/commands/git/syncRepos', () => ({ syncRepos: vi.fn() }));
vi.mock('../../../app/commands/git/pushToRemote', () => ({ pushToRemote: vi.fn() }));
vi.mock('../../../app/commands/git/initLayers', () => ({ initLayers: vi.fn() }));
vi.mock('../../../app/commands/git/deleteRemoteRepos', () => ({ deleteRemoteRepos: vi.fn() }));
vi.mock('../../../app/commands/git/addSubmodules', () => ({ addSubmodules: vi.fn() }));
vi.mock('../../../app/commands/nuxt/createLayer', () => ({ createLayer: vi.fn() }));
vi.mock('../../../app/commands/nuxt/manageEnv', () => ({ manageEnv: vi.fn() }));
vi.mock('../../../app/commands/nuxt/extractDocs', () => ({ extractDocs: vi.fn() }));
vi.mock('../../../app/commands/utils/cleanLogs', () => ({ cleanLogs: vi.fn() }));
vi.mock('../../../app/commands/utils/validateHeaders', () => ({ validateHeaders: vi.fn() }));
vi.mock('../../../app/commands/utils/autoDoc', () => ({ autoDoc: vi.fn() }));
vi.mock('../../../app/commands/utils/autoVersion', () => ({ autoVersion: vi.fn() }));
vi.mock('../../../app/commands/utils/addContributor', () => ({ addContributor: vi.fn() }));

import { runApp } from '../../../app/commands/app/runApp';
import { runQuality } from '../../../app/commands/quality/runQuality';
import { runDocs } from '../../../app/commands/docs/runDocs';
import { cleanLogs } from '../../../app/commands/utils/cleanLogs';

describe('Integration: Main App Menu', () => {
	let exitSpy: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		process.argv = ['node', 'index.ts'];
		
		// CRITICAL: Mock process.exit to THROW specific error.
		// This physically breaks the "while(true)" loop in app.ts
		exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
			throw new Error(`PROCESS_EXIT:${code}`);
		});
	});
	
	afterEach(() => {
		exitSpy.mockRestore();
	});
	
	// Helper to catch the expected exit error
	const runMain = async () => {
		try {
			await main('/root', '/tool');
		} catch (e: any) {
			if (!e.message.startsWith('PROCESS_EXIT')) throw e;
		}
	};
	
	it('should handle session cancellation at Logger selection', async () => {
		(prompts.select as any).mockResolvedValueOnce(prompts.isCancel(Symbol()));
		
		// We expect it to throw PROCESS_EXIT:0
		await expect(main('/root', '/tool')).rejects.toThrow('PROCESS_EXIT:0');
	});
	
	it('should enable Debug Mode', async () => {
		// 1. Logger -> Yes
		(prompts.select as any).mockResolvedValueOnce('yes');
		// 2. Menu -> Exit (Handled by default mock or explicit)
		(prompts.select as any).mockResolvedValueOnce('exit');
		
		await runMain();
		expect(process.env.DEBUG).toBe('true');
	});
	
	it('should run App Domain -> runApp', async () => {
		// Sequence: Logger(no) -> Domain(app) -> Action(dev) -> Domain(exit)
		(prompts.select as any)
			.mockResolvedValueOnce('no')    // Logger
			.mockResolvedValueOnce('app')   // Domain
			.mockResolvedValueOnce('dev')   // Action
		// Next call defaults to 'exit' via mock definition
		
		await runMain();
		expect(runApp).toHaveBeenCalledWith('/root', 'dev');
	});
	
	it('should run Quality Domain -> runQuality', async () => {
		(prompts.select as any)
			.mockResolvedValueOnce('no')
			.mockResolvedValueOnce('quality')
			.mockResolvedValueOnce('run');
		
		await runMain();
		expect(runQuality).toHaveBeenCalledWith('/root');
	});
	
	it('should run Docs Domain -> runDocs', async () => {
		(prompts.select as any)
			.mockResolvedValueOnce('no')
			.mockResolvedValueOnce('docs')
			.mockResolvedValueOnce('generate');
		
		await runMain();
		expect(runDocs).toHaveBeenCalledWith('/root');
	});
	
	it('should run Utils -> Clean Logs', async () => {
		(prompts.select as any)
			.mockResolvedValueOnce('no')
			.mockResolvedValueOnce('utils')
			.mockResolvedValueOnce('clean');
		
		await runMain();
		expect(cleanLogs).toHaveBeenCalledWith('/root');
	});
});