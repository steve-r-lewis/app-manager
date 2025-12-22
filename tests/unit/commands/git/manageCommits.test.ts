/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/manageCommits.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:20
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
 * V1.0.0, 20251218-23:20
 * Initial creation and release of manageCommits.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { manageCommits } from '../../../../app/commands/git/manageCommits';
import child_process from 'child_process';
import { text } from '@clack/prompts';

// 1. Mock External Dependencies
vi.mock('child_process');
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/loggerService', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		loader: vi.fn(() => ({ stop: vi.fn() }))
	}
}));
// FIX: Mock 'llm' export to match service
vi.mock('../../../../app/services/llmService', () => ({
	llm: { generate: vi.fn().mockResolvedValue('feat: ai suggestion') }
}));

describe('Unit: manageCommits', () => {
	const mockRoot = '/mock/root';
	
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(child_process.execSync).mockImplementation((cmd) => {
			const command = cmd.toString();
			if (command.includes('status')) return 'M  file.txt';
			if (command.includes('diff')) return 'diff content';
			return '';
		});
	});
	
	it('should stage files and commit immediately if message is provided (Headless)', async () => {
		await manageCommits(mockRoot, { message: 'feat: manual' });
		expect(text).not.toHaveBeenCalled();
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git add'),
			expect.anything()
		);
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git commit -m "feat: manual"'),
			expect.anything()
		);
	});
	
	it('should fallback to interactive mode if no message is provided', async () => {
		vi.mocked(text).mockResolvedValueOnce('feat: user input');
		await manageCommits(mockRoot, {});
		expect(text).toHaveBeenCalled();
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git commit -m "feat: user input"'),
			expect.anything()
		);
	});
});