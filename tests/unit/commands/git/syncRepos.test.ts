/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/syncRepos.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:55
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
 * V1.0.0, 20251218-23:55
 * Initial creation and release of syncRepos.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { syncRepos } from '../../../../app/commands/git/syncRepos';
import { setupTestContext } from '../../../utils/test-context';
import fs from 'fs';
import path from 'path';

// Mock Simple Git
const mockGit = {
	checkIsRepo: vi.fn(),
	pull: vi.fn(),
	submoduleUpdate: vi.fn(),
};

vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

// Mock Spinner
vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() })
}));

describe('Command: syncRepos', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockGit.checkIsRepo.mockResolvedValue(true);
		mockGit.pull.mockResolvedValue(null);
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should sync root repository', async () => {
		await syncRepos(ctx.targetRoot);
		
		expect(mockGit.pull).toHaveBeenCalledWith(['--rebase']);
		expect(mockGit.submoduleUpdate).toHaveBeenCalled();
	});
	
	it('should iterate and sync layers if they exist', async () => {
		// Create a mock layer directory
		const layersDir = path.join(ctx.targetRoot, 'layers');
		const layer1 = path.join(layersDir, 'my-layer');
		fs.mkdirSync(layer1, { recursive: true });
		
		await syncRepos(ctx.targetRoot);
		
		// Expect 2 pulls: 1 for Root, 1 for Layer
		expect(mockGit.pull).toHaveBeenCalledTimes(2);
	});
	
	it('should skip non-git layers', async () => {
		const layersDir = path.join(ctx.targetRoot, 'layers');
		fs.mkdirSync(path.join(layersDir, 'not-a-repo'), { recursive: true });
		
		// First call (Root) returns true, Second call (Layer) returns false
		mockGit.checkIsRepo
			.mockResolvedValueOnce(true)
			.mockResolvedValueOnce(false);
		
		await syncRepos(ctx.targetRoot);
		
		// Should pull Root (1), but skip Layer
		expect(mockGit.pull).toHaveBeenCalledTimes(1);
	});
});