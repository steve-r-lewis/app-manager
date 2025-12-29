/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/deleteRemoteRepos.test.ts
 * @version:    1.0.1
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
 * V1.0.1, 20251226-1913
 * Added author field.
 *
 * V1.0.0, 20251218-23:53
 * Initial creation and release of deleteRemoteRepos.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteRemoteRepos } from '../../../../app/commands/git/deleteRemoteRepos';
import { github } from '../../../../app/services/githubService';
import { select, text } from '@clack/prompts';

// Mock dependencies
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/githubService', () => ({
	// FIX: Export 'github'
	github: {
		listRepos: vi.fn(),
		deleteRepo: vi.fn()
	}
}));
vi.mock('../../../../app/services/loggerService', () => ({
	logger: { warn: vi.fn() }
}));

describe('Command: Delete Remote Repos', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Default: Return one repo with full_name structure
		vi.mocked(github.listRepos).mockResolvedValue([
			{ name: 'test-repo', full_name: 'steve-r-lewis/test-repo', private: false }
		] as any);
	});
	
	it('should delete repo when confirmed with uppercase "DELETE"', async () => {
		// Select returns the repo object now
		vi.mocked(select).mockResolvedValueOnce({
			name: 'test-repo',
			full_name: 'steve-r-lewis/test-repo'
		});
		vi.mocked(text).mockResolvedValueOnce('DELETE');
		
		await deleteRemoteRepos();
		
		expect(github.deleteRepo).toHaveBeenCalledWith('steve-r-lewis', 'test-repo');
	});
	
	it('should delete repo when confirmed with lowercase "delete"', async () => {
		vi.mocked(select).mockResolvedValueOnce({
			name: 'test-repo',
			full_name: 'steve-r-lewis/test-repo'
		});
		vi.mocked(text).mockResolvedValueOnce('delete');
		
		await deleteRemoteRepos();
		
		expect(github.deleteRepo).toHaveBeenCalledWith('steve-r-lewis', 'test-repo');
	});
});