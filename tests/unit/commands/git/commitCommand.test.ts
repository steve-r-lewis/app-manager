/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/commitCommand.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 20:09
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
 * V1.0.0, 20260107-20:09
 * Initial creation and release of commitCommand.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as clack from '@clack/prompts';
import { CommitCommand } from '../../../../app/commands/git/commitCommand.js';
import { githubService } from '../../../../app/services/githubService.js';
import { llmService } from '../../../../app/services/llmService.js';

// Mock Services
vi.mock('../../../../app/services/githubService');
vi.mock('../../../../app/services/llmService');
vi.mock('@clack/prompts');

describe('CommitCommand', () => {
	let command: CommitCommand;
	
	beforeEach(() => {
		vi.clearAllMocks();
		command = new CommitCommand();
		// Default: Mock spinner to avoid crashes
		(clack.spinner as any).mockReturnValue({ start: vi.fn(), stop: vi.fn() });
	});
	
	it('should be valid metadata', () => {
		expect(command.metadata.id).toBe('git.commit');
		expect(command.metadata.domain).toBe('git');
	});
	
	it('should abort if directory is clean', async () => {
		vi.mocked(githubService.getStatus).mockResolvedValue({
			branch: 'main', isDirty: false, modified: [], staged: []
		});
		
		await command.execute('/root', {});
		
		expect(githubService.createCommit).not.toHaveBeenCalled();
	});
	
	it('should commit immediately if message passed via options', async () => {
		vi.mocked(githubService.getStatus).mockResolvedValue({
			branch: 'main', isDirty: true, modified: ['file.ts'], staged: ['file.ts']
		});
		
		await command.execute('/root', { message: 'cli commit' });
		
		expect(githubService.createCommit).toHaveBeenCalledWith('/root', 'cli commit');
		expect(clack.text).not.toHaveBeenCalled(); // No prompts
	});
	
	it('should use AI generation flow if requested', async () => {
		vi.mocked(githubService.getStatus).mockResolvedValue({
			branch: 'main', isDirty: true, modified: [], staged: ['file.ts']
		});
		vi.mocked(githubService.getStagedDiff).mockResolvedValue('diff content');
		vi.mocked(llmService.generate).mockResolvedValue('feat: ai commit');
		
		// Mocks for Clack flow:
		// 1. Generate with AI? -> True
		// 2. Use this message? -> True
		vi.mocked(clack.confirm)
			.mockResolvedValueOnce(true)  // Generate?
			.mockResolvedValueOnce(true); // Approve?
		
		await command.execute('/root', {});
		
		expect(githubService.getStagedDiff).toHaveBeenCalled();
		expect(llmService.generate).toHaveBeenCalled();
		expect(githubService.createCommit).toHaveBeenCalledWith('/root', 'feat: ai commit');
	});
	
	it('should fall back to manual entry if AI is rejected', async () => {
		vi.mocked(githubService.getStatus).mockResolvedValue({
			branch: 'main', isDirty: true, modified: [], staged: ['file.ts']
		});
		
		vi.mocked(clack.confirm)
			.mockResolvedValueOnce(true)  // Generate?
			.mockResolvedValueOnce(false); // Approve? -> NO
		
		vi.mocked(clack.text).mockResolvedValue('manual fix');
		
		await command.execute('/root', {});
		
		expect(githubService.createCommit).toHaveBeenCalledWith('/root', 'manual fix');
	});
});