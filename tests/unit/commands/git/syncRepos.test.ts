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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncRepos } from '../../../../app/commands/git/syncRepos';
import child_process from 'child_process';
import { spinner } from '@clack/prompts';

// 1. Mock External Dependencies
vi.mock('child_process');
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/loggerService', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn()
	}
}));

describe('Command: syncRepos', () => {
	const mockRoot = '/mock/root';
	let spinnerMock: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup Spinner Mock
		spinnerMock = {
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		};
		vi.mocked(spinner).mockReturnValue(spinnerMock);
	});
	
	// --- NEW HEADLESS TEST ---
	it('should run synchronously without spinner if force=true (Headless)', async () => {
		await syncRepos(mockRoot, { force: true });
		
		// Verify NO Spinner was used
		expect(spinner).not.toHaveBeenCalled();
		
		// Verify Git commands
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git pull'),
			expect.objectContaining({ stdio: 'inherit' })
		);
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git submodule update'),
			expect.objectContaining({ stdio: 'inherit' })
		);
	});
	
	// --- INTERACTIVE TEST ---
	it('should use spinner in interactive mode', async () => {
		await syncRepos(mockRoot);
		
		// Verify Spinner WAS used
		expect(spinner).toHaveBeenCalled();
		expect(spinnerMock.start).toHaveBeenCalled();
		expect(spinnerMock.stop).toHaveBeenCalled();
		
		// Verify Git commands (quiet mode)
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git pull'),
			expect.objectContaining({ stdio: 'ignore' })
		);
	});
	
	it('should handle errors gracefully', async () => {
		// Force error
		vi.mocked(child_process.execSync).mockImplementation(() => {
			throw new Error('Git failed');
		});
		
		await syncRepos(mockRoot);
		
		expect(spinnerMock.stop).toHaveBeenCalledWith('Sync Failed');
	});
});