/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/git/pushToRemote.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:23
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
 * V1.0.0, 20251218-23:23
 * Initial creation and release of pushToRemote.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pushToRemote } from '../../../../app/commands/git/pushToRemote';
import child_process from 'child_process';
import { multiselect } from '@clack/prompts';

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

describe('Command: pushToRemote', () => {
	const mockRoot = '/mock/root';
	
	beforeEach(() => {
		vi.clearAllMocks();
		// Default: git remote returns a list
		vi.mocked(child_process.execSync).mockReturnValue('origin\nupstream' as any);
	});
	
	// --- NEW TEST CASE ---
	it('should push immediately if remote and branch are provided (Headless)', async () => {
		// Run in headless mode
		await pushToRemote(mockRoot, { remote: 'origin', branch: 'main' });
		
		// Verify NO prompts were shown
		expect(multiselect).not.toHaveBeenCalled();
		
		// Verify Git Push was called with exact args
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git push origin main'),
			expect.objectContaining({ stdio: 'inherit' })
		);
	});
	// ---------------------
	
	it('should show multiselect if no arguments provided (Interactive)', async () => {
		// Mock User Selection
		vi.mocked(multiselect).mockResolvedValue(['origin']);
		// Mock current branch check
		vi.mocked(child_process.execSync).mockImplementation((cmd) => {
			if (cmd.toString().includes('branch --show-current')) return 'dev';
			if (cmd.toString().includes('remote')) return 'origin\nupstream';
			return '';
		});
		
		await pushToRemote(mockRoot);
		
		// Verify Prompt WAS shown
		expect(multiselect).toHaveBeenCalled();
		
		// Verify Push uses selected remote + current branch
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git push origin dev'),
			expect.anything()
		);
	});
	
	it('should abort if no remotes exist', async () => {
		vi.mocked(child_process.execSync).mockReturnValue(''); // Empty remote list
		
		await pushToRemote(mockRoot);
		
		expect(multiselect).not.toHaveBeenCalled();
		// Logger should warn
		const { logger } = await import('../../../../app/services/loggerService');
		expect(logger.warn).toHaveBeenCalledWith('No remotes defined.');
	});
});