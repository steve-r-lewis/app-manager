/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/manageCommits.test.ts
 * @version:    2.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:20
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit test for manageCommits command.
 * Verifies:
 * 1. Headless mode (Message provided via args).
 * 2. Interactive AI Selection (Choosing a provider -> Generating).
 * 3. Interactive Manual Fallback.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20251222-22:53
 * - Added tests for AI provider selection and fallback
 *
 * V1.0.0, 20251218-23:20
 * Initial creation and release of manageCommits.test.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/manageCommits.test.ts
 * @version:    2.0.0
 * ================================================================================
 * @description:
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { manageCommits } from '../../../../app/commands/git/manageCommits';
import { llm } from '../../../../app/services/llmService';
import * as prompts from '@clack/prompts';
import { execSync } from 'child_process';

// --- MOCKS ---
vi.mock('child_process');
vi.mock('../../../../app/services/loggerService');

// Mock Clack Prompts
vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		intro: vi.fn(),
		outro: vi.fn(),
		spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
		select: vi.fn(),
		confirm: vi.fn(),
		text: vi.fn(),
		isCancel: vi.fn(() => false),
	};
});

// Mock LLM Service
vi.mock('../../../../app/services/llmService', () => ({
	llm: {
		generate: vi.fn(),
		setActiveProvider: vi.fn(),
	}
}));

describe('Unit: Manage Commits', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Default: Git status says "Modified file"
		(execSync as any).mockReturnValue(' M file.txt');
	});
	
	it('should commit immediately if message is provided (Headless Mode)', async () => {
		await manageCommits('/root', { message: 'feat: headless commit' });
		
		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining('commit -m "feat: headless commit"'),
			expect.anything()
		);
		// Should not trigger interactive prompts
		expect(prompts.select).not.toHaveBeenCalled();
	});
	
	it('should prompt user to select AI Provider if available', async () => {
		// 1. Setup
		const availableLLMs = [{ id: 'ollama', name: 'Ollama', available: true }];
		
		// Mock Prompts:
		// Selection 1: Choose "ollama"
		(prompts.select as any).mockResolvedValueOnce('ollama');
		// Confirmation: "Use this message?" -> Yes
		(prompts.confirm as any).mockResolvedValueOnce(true);
		
		// Mock LLM Generation
		(llm.generate as any).mockResolvedValue('feat: ai generated');
		
		// 2. Execute
		await manageCommits('/root', { availableLLMs });
		
		// 3. Verify
		expect(prompts.select).toHaveBeenCalledWith(expect.objectContaining({
			message: 'Select Commit Message Generator:'
		}));
		expect(llm.setActiveProvider).toHaveBeenCalledWith('ollama');
		expect(llm.generate).toHaveBeenCalled();
		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining('commit -m "feat: ai generated"'),
			expect.anything()
		);
	});
	
	it('should fall back to Manual Entry if user selects "manual"', async () => {
		const availableLLMs = [{ id: 'gemini', name: 'Gemini', available: true }];
		
		// Selection: Choose "manual"
		(prompts.select as any).mockResolvedValueOnce('manual');
		// Text Input: "feat: manual"
		(prompts.text as any).mockResolvedValueOnce('feat: manual');
		
		await manageCommits('/root', { availableLLMs });
		
		expect(llm.generate).not.toHaveBeenCalled();
		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining('commit -m "feat: manual"'),
			expect.anything()
		);
	});
	
	it('should force Manual Entry if no AI providers are available', async () => {
		// No LLMs passed in options
		(prompts.text as any).mockResolvedValueOnce('feat: forced manual');
		
		await manageCommits('/root', { availableLLMs: [] });
		
		// Should NOT ask to select provider, should go straight to text
		expect(prompts.select).not.toHaveBeenCalled();
		expect(prompts.text).toHaveBeenCalledWith(expect.objectContaining({
			message: expect.stringContaining('No AI available')
		}));
	});
});