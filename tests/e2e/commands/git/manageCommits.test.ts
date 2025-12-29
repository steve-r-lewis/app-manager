/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/manageCommits.test.ts
 * @version:    2.0.1
 * @createDate: 2025 Dec 19
 * @createTime: 23:47
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * E2E test for manageCommits.
 * * Creates a real temporary git repo.
 * * Simulates interactive user flow via mocked Prompts.
 * * Verifies a real git commit is created.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V2.0.1, 20251226-1913
 * Authorship update.
 *
 * V2.0.0, 20251222-22:53
 * - Added tests for AI provider selection and fallback
 *
 * V1.0.0, 20251219-23:47
 * Initial creation and release of manageCommits.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { manageCommits } from '../../../../app/commands/git/manageCommits';
import { setupTestContext } from '../../../helpers/testContext';
import { llm } from '../../../../app/services/llmService';
import * as prompts from '@clack/prompts';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Mock Prompts to control the flow
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

// Mock LLM Service (We test the *integration* of the result, not the API itself)
vi.mock('../../../../app/services/llmService', () => ({
	llm: {
		generate: vi.fn(),
		setActiveProvider: vi.fn(),
	}
}));

describe('E2E: Manage Commits', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// 1. Initialize a Real Git Repo
		execSync('git init', { cwd: ctx.targetRoot, stdio: 'ignore' });
		execSync('git config user.name "Test User"', { cwd: ctx.targetRoot });
		execSync('git config user.email "test@example.com"', { cwd: ctx.targetRoot });
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should stage files and create a commit using AI selection flow', async () => {
		// 1. Create a dirty file
		fs.writeFileSync(path.join(ctx.targetRoot, 'new-feature.txt'), 'content');
		
		// 2. Setup Interactions
		// Prompt 1: Stage changes? -> true
		(prompts.confirm as any).mockResolvedValueOnce(true);
		// Prompt 2: Select Provider -> "ollama"
		(prompts.select as any).mockResolvedValueOnce('ollama');
		// Prompt 3: Use this message? -> true
		(prompts.confirm as any).mockResolvedValueOnce(true);
		
		// 3. Setup LLM Response
		(llm.generate as any).mockResolvedValue('feat: e2e test commit');
		
		// 4. Run Command
		await manageCommits(ctx.targetRoot, {
			availableLLMs: [{ id: 'ollama', name: 'Ollama', available: true }]
		});
		
		// 5. Verify Git History
		const log = execSync('git log --oneline', { cwd: ctx.targetRoot, encoding: 'utf-8' });
		expect(log).toContain('feat: e2e test commit');
		
		// Verify LLM was configured correctly
		expect(llm.setActiveProvider).toHaveBeenCalledWith('ollama');
	});
	
	it('should correctly handle the Headless flow on a real repo', async () => {
		// 1. Create a dirty file
		fs.writeFileSync(path.join(ctx.targetRoot, 'headless.txt'), 'headless content');
		
		// 2. Stage manually (Headless manageCommits assumes you might have staged,
		// or it might auto-stage if configured, but let's test the args path)
		execSync('git add .', { cwd: ctx.targetRoot });
		
		// 3. Run Command
		await manageCommits(ctx.targetRoot, { message: 'chore: headless run' });
		
		// 4. Verify
		const log = execSync('git log --oneline', { cwd: ctx.targetRoot, encoding: 'utf-8' });
		expect(log).toContain('chore: headless run');
		
		// Ensure NO interactive prompts appeared
		expect(prompts.select).not.toHaveBeenCalled();
	});
});