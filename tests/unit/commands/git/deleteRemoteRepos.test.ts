/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/deleteRemoteRepos.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:53
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
 * V1.0.0, 20251218-23:53
 * Initial creation and release of deleteRemoteRepos.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { deleteRemoteRepos } from '../../../../app/commands/git/deleteRemoteRepos';
import { github } from '../../../../app/services/github.service';
import * as prompts from '@clack/prompts';

// Mock GitHub Service
vi.mock('../../../../app/services/github.service', () => ({
	github: {
		listRepos: vi.fn(),
		deleteRepo: vi.fn(),
	}
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	multiselect: vi.fn(),
	text: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: deleteRemoteRepos', () => {
	const mockMulti = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	const mockText = prompts.text as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		vi.clearAllMocks();
		(github.listRepos as any).mockResolvedValue([
			{ name: 'repo-1', full_name: 'user/repo-1' }
		]);
	});
	
	it('should not delete if confirmation fails', async () => {
		mockMulti.mockResolvedValue([{ name: 'repo-1', full_name: 'user/repo-1' }]);
		// Wrong confirmation text
		mockText.mockResolvedValue('wrong-text');
		
		await deleteRemoteRepos();
		
		expect(github.deleteRepo).not.toHaveBeenCalled();
	});
	
	it('should delete if confirmation matches DELETE', async () => {
		mockMulti.mockResolvedValue([{ name: 'repo-1', full_name: 'user/repo-1' }]);
		mockText.mockResolvedValue('DELETE');
		
		await deleteRemoteRepos();
		
		expect(github.deleteRepo).toHaveBeenCalledWith('user', 'repo-1');
	});
});