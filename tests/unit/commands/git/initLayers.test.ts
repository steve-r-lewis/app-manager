/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/initLayers.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:49
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
 * V1.0.0, 20251218-23:49
 * Initial creation and release of initLayers.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initLayers } from '../../../../app/commands/git/initLayers';
import { setupTestContext } from '../../../utils/test-context';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

const mockGit = {
	checkIsRepo: vi.fn(),
	init: vi.fn(),
	add: vi.fn(),
	commit: vi.fn(),
};

vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	multiselect: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: initLayers', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockMulti = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockGit.checkIsRepo.mockResolvedValue(false); // Default: Not a repo
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should find non-repo layers and initialize them', async () => {
		// Setup: Create a layer folder
		const layersDir = path.join(ctx.targetRoot, 'layers');
		const layer1 = path.join(layersDir, 'new-layer');
		fs.mkdirSync(layer1, { recursive: true });
		
		// User selects it
		mockMulti.mockResolvedValue(['new-layer']);
		
		await initLayers(ctx.targetRoot);
		
		expect(mockGit.init).toHaveBeenCalled();
		expect(mockGit.commit).toHaveBeenCalledWith('Initial commit');
	});
	
	it('should skip existing repos', async () => {
		const layersDir = path.join(ctx.targetRoot, 'layers');
		fs.mkdirSync(path.join(layersDir, 'existing-repo'), { recursive: true });
		
		mockGit.checkIsRepo.mockResolvedValue(true); // Is a repo
		
		await initLayers(ctx.targetRoot);
		
		// Should exit early without prompting
		expect(mockMulti).not.toHaveBeenCalled();
	});
});