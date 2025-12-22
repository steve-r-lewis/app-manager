/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/addSubmodules.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:51
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
 * V1.0.0, 20251218-23:51
 * Initial creation and release of addSubmodules.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addSubmodules } from '../../../../app/commands/git/addSubmodules';
import { setupTestContext } from '../../../helpers/testContext';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock Simple Git
const mockGit = {
	checkIsRepo: vi.fn(),
	raw: vi.fn(),
	getRemotes: vi.fn(),
	submoduleAdd: vi.fn(),
};

vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	multiselect: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: addSubmodules', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockMulti = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockGit.checkIsRepo.mockResolvedValue(true);
		// Default: No existing submodules
		mockGit.raw.mockResolvedValue('');
		// Default: Has remote
		mockGit.getRemotes.mockResolvedValue([{ name: 'origin', refs: { fetch: 'https://github.com/me/repo.git' } }]);
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should call git submodule add which updates .gitmodules', async () => {
		// Setup: Layer exists
		const layersDir = path.join(ctx.targetRoot, 'layers');
		fs.mkdirSync(path.join(layersDir, 'new-layer'), { recursive: true });
		
		// User selects it
		mockMulti.mockResolvedValue([{ name: 'new-layer', url: 'https://github.com/me/repo.git', path: 'layers/new-layer' }]);
		
		await addSubmodules(ctx.targetRoot);
		
		// ASSERTION: This confirms we are running the standard command
		// which git guarantees will update .gitmodules
		expect(mockGit.submoduleAdd).toHaveBeenCalledWith(
			'https://github.com/me/repo.git',
			'layers/new-layer'
		);
	});
	
	it('should ignore layers that are already tracked', async () => {
		const layersDir = path.join(ctx.targetRoot, 'layers');
		fs.mkdirSync(path.join(layersDir, 'tracked-layer'), { recursive: true });
		
		// Mock that git ls-files returns this path
		mockGit.raw.mockResolvedValue('100644 blob ...\tlayers/tracked-layer');
		
		await addSubmodules(ctx.targetRoot);
		
		expect(mockMulti).not.toHaveBeenCalled();
	});
});