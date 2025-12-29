/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/system/startup.test.ts
 * @version:    2.0.2
 * @createDate: 2025 Dec 20
 * @createTime: 17:37
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * System-level End-to-End (E2E) test suite responsible for verifying the
 * application's startup integrity and resilience mechanisms.
 *
 * Key Validation Areas:
 * 1. Pre-Flight Checks:
 * Ensures the CLI correctly identifies and warns about missing critical
 * environment variables (e.g. GITHUB_TOKEN) before execution proceeds.
 *
 * 2. Process Resilience:
 * Verifies the Global Error Trap implementation by ensuring that fatal
 * crashes are caught, handled gracefully (exit code 1), and that diagnostic
 * information is successfully written to the persistent 'error.log' file.
 *
 * 3. Binary Integrity:
 * Acts as a "Smoke Test" by executing the compiled CLI entry point (via tsx)
 * in a child process, confirming that the tool boots successfully without
 * syntax errors or resolution failures.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V2.0.2, 20251226-1913
 * Authorship update.
 *
 * V2.0.1, 20251222-22:30
 * Added 4. HEADLESS Mode routing.
 *
 * V2.0.0, 20251222-22:26
 * E2E/Integration test for the Application Startup Flow.
 * Verifies:
 * 1. Pre-flight checks (Logger, Config).
 * 2. NEW: AI Service Health Check execution.
 * 3. Graceful handling of "Offline" vs "Online" AI states.
 *
 * V1.0.0, 20251220-17:37
 * Initial creation and release of startup.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '../../../app/app';
import { llm } from '../../../app/services/llmService';
import { logger } from '../../../app/services/loggerService';
import { setupTestContext } from '../../helpers/testContext';
import * as prompts from '@clack/prompts';

// 1. Mock Interactive Prompts
vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		intro: vi.fn(),
		outro: vi.fn(),
		spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
		select: vi.fn(),
		isCancel: vi.fn(() => false),
		text: vi.fn(),
	};
});

// 2. Mock LLM Service
vi.mock('../../../app/services/llmService', () => ({
	llm: {
		checkAvailability: vi.fn(),
		setActiveProvider: vi.fn(),
	}
}));

describe('E2E: System Startup', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	let exitSpy: any;
	let loggerSpy: any;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Spy on Logger to verify headless errors
		loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
		
		// CRITICAL FIX: Mock process.exit to THROW an error.
		// This breaks the while(true) loop in app.ts immediately.
		exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
			throw new Error(`PROCESS_EXIT:${code}`);
		});
		
		process.argv = ['node', 'index.ts'];
	});
	
	afterEach(() => {
		ctx.restore();
		exitSpy.mockRestore();
	});
	
	it('should run AI Health Check and report "Online" when providers exist', async () => {
		// --- Setup Mocks ---
		// 1. Logger Question -> "no"
		(prompts.select as any).mockResolvedValueOnce('no');
		// 2. Main Menu -> "exit"
		(prompts.select as any).mockResolvedValueOnce('exit');
		
		// 3. LLM Check -> Returns 1 active provider
		(llm.checkAvailability as any).mockResolvedValue([
			{ id: 'ollama', available: true, name: 'Ollama Local' }
		]);
		
		// --- Execute ---
		// Expect the promise to reject with our special exit error
		await expect(main(ctx.targetRoot, ctx.toolRoot))
			.rejects.toThrow('PROCESS_EXIT:0');
		
		// --- Verify ---
		expect(prompts.intro).toHaveBeenCalled();
		expect(llm.checkAvailability).toHaveBeenCalled();
		expect(prompts.outro).toHaveBeenCalledWith(expect.stringContaining('See you next time'));
	});
	
	it('should run AI Health Check and report "Offline" gracefully when no providers exist', async () => {
		// --- Setup Mocks ---
		(prompts.select as any).mockResolvedValueOnce('no');
		(prompts.select as any).mockResolvedValueOnce('exit');
		
		// 3. LLM Check -> Returns empty
		(llm.checkAvailability as any).mockResolvedValue([]);
		
		// --- Execute ---
		await expect(main(ctx.targetRoot, ctx.toolRoot))
			.rejects.toThrow('PROCESS_EXIT:0');
		
		// --- Verify ---
		expect(llm.checkAvailability).toHaveBeenCalled();
		// Should have called select twice (Logger -> Menu)
		expect(prompts.select).toHaveBeenCalledTimes(2);
	});
	
	it('should bypass interactive checks if running in Headless Mode', async () => {
		// --- Setup Mocks ---
		// Simulate CLI args: "am git unknown-command"
		process.argv = ['node', 'index.ts', 'git', 'unknown-command'];
		
		// --- Execute ---
		await main(ctx.targetRoot, ctx.toolRoot);
		
		// --- Verify ---
		// 1. Should NOT show intro/spinner/healthcheck
		expect(prompts.intro).not.toHaveBeenCalled();
		expect(llm.checkAvailability).not.toHaveBeenCalled();
		
		// 2. Should have logged an error about the unknown command
		expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown git action'));
		
		// 3. Should NOT have exited (unless app.ts is updated to strict-exit on error)
		// If app.ts logic changes to exit(1) on error, change this to: .rejects.toThrow('PROCESS_EXIT:1')
		expect(exitSpy).not.toHaveBeenCalled();
	});
});