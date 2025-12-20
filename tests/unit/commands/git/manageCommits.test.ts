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

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { manageCommits } from '../../../../app/commands/git/manageCommits';
import { setupTestContext } from '../../../utils/test-context';
import { llm } from '../../../../app/services/llm.service';
import * as prompts from '@clack/prompts';

// Mock simple-git
const mockGit = {
	checkIsRepo: vi.fn(),
	status: vi.fn(),
	add: vi.fn(),
	diff: vi.fn(),
	commit: vi.fn(),
};

vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

// Mock Prompts
vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	select: vi.fn(),
	multiselect: vi.fn(),
	text: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

// Mock LLM
vi.mock('../../../../app/services/llm.service', () => ({
	llm: { generate: vi.fn() }
}));

describe('Command: manageCommits', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockSelect = prompts.select as unknown as ReturnType<typeof vi.fn>;
	const mockMulti = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockGit.checkIsRepo.mockResolvedValue(true);
		mockGit.status.mockResolvedValue({ files: [], staged: [] });
		mockGit.diff.mockResolvedValue('mock diff');
		(llm.generate as any).mockResolvedValue('feat: ai message');
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should stage files if none are staged', async () => {
		mockGit.status.mockResolvedValue({
			files: [{ path: 'file.txt', working_dir: 'M' }],
			staged: []
		});
		
		mockMulti.mockResolvedValue(['file.txt']);
		mockSelect.mockResolvedValue('commit');
		
		await manageCommits(ctx.targetRoot);
		
		expect(mockGit.add).toHaveBeenCalledWith(['file.txt']);
		expect(mockGit.commit).toHaveBeenCalledWith('feat: ai message');
	});
	
	it('should allow editing the message before committing', async () => {
		mockGit.status.mockResolvedValue({ files: [{}], staged: ['file.txt'] });
		
		mockSelect
			.mockResolvedValueOnce('edit')
			.mockResolvedValueOnce('commit');
		
		(prompts.text as any).mockResolvedValue('chore: manual edit');
		
		await manageCommits(ctx.targetRoot);
		
		expect(mockGit.commit).toHaveBeenCalledWith('chore: manual edit');
	});
});