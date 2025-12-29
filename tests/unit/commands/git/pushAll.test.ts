/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/pushAll.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 22:10
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
 * V1.0.0, 20251228-22:10
 * Initial creation and release of pushAll.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import { pushAll } from '../../../../app/commands/git/pushAll';
import { simpleGit } from 'simple-git';
import * as prompts from '@clack/prompts';
import { logger } from '../../../../app/services/loggerService';

// --- Mocks ---
vi.mock('fs');
vi.mock('simple-git');
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/loggerService');

describe('pushAll (Command)', () => {
	const mockRoot = '/mock/root';
	const mockLayersDir = '/mock/root/layers';
	
	let gitMock: any;
	let confirmSpy: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Mock Git Instance
		gitMock = {
			status: vi.fn(),
			push: vi.fn(),
		};
		// When simpleGit() is called, return our mock object
		vi.mocked(simpleGit).mockReturnValue(gitMock as any);
		
		// Mock Prompts
		confirmSpy = vi.mocked(prompts.confirm);
		vi.mocked(prompts.spinner).mockReturnValue({ start: vi.fn(), stop: vi.fn(), message: vi.fn() } as any);
		
		// Mock FS: Layers directory exists
		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readdirSync).mockReturnValue([]);
	});
	
	it('should do nothing if no repos are ahead', async () => {
		// Setup: Root is clean (ahead: 0)
		gitMock.status.mockResolvedValue({ ahead: 0, current: 'main' });
		
		await pushAll(mockRoot);
		
		expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('up to date'));
		expect(prompts.confirm).not.toHaveBeenCalled();
	});
	
	it('should detect ahead repos and push them when confirmed', async () => {
		// Setup: Root is ahead by 2 commits
		gitMock.status.mockResolvedValue({ ahead: 2, current: 'dev' });
		
		// Setup: User confirms push
		confirmSpy.mockResolvedValue(true);
		
		await pushAll(mockRoot);
		
		// Verify Report
		expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('ROOT (App)'));
		expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('2 commits'));
		
		// Verify Push Execution
		expect(gitMock.push).toHaveBeenCalled();
		expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Successfully pushed'));
	});
	
	it('should abort if user cancels confirmation', async () => {
		// Setup: Root is ahead
		gitMock.status.mockResolvedValue({ ahead: 1 });
		
		// Setup: User declines
		confirmSpy.mockResolvedValue(false);
		
		await pushAll(mockRoot);
		
		expect(gitMock.push).not.toHaveBeenCalled();
		expect(prompts.outro).toHaveBeenCalledWith(expect.stringContaining('cancelled'));
	});
	
	it('should handle layer repositories correctly', async () => {
		// Setup: Root clean
		gitMock.status.mockResolvedValueOnce({ ahead: 0 });
		
		// Setup: 1 Layer Found
		vi.mocked(fs.readdirSync).mockReturnValue([
			{ name: 'billing', isDirectory: () => true } as any
		]);
		// Layer is git repo
		vi.mocked(fs.existsSync).mockImplementation((p) => p.toString().endsWith('.git'));
		
		// Layer Status: Ahead
		gitMock.status.mockResolvedValueOnce({ ahead: 3, current: 'feature' });
		
		confirmSpy.mockResolvedValue(true);
		
		await pushAll(mockRoot);
		
		// Expect SimpleGit to be initialized with Layer Path
		expect(simpleGit).toHaveBeenCalledWith(expect.stringContaining('billing'));
		expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Layer: billing'));
		expect(gitMock.push).toHaveBeenCalled();
	});
});