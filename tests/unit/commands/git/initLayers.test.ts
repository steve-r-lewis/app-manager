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
 * Unit tests for initLayers logic, covering file system discovery,
 * user interaction, and headless execution.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20251221-19:40
 * Updated to use new test context utility.
 *
 * V1.0.0, 20251218-23:49
 * Initial creation and release of initLayers.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initLayers } from '../../../../app/commands/git/initLayers';
import child_process from 'child_process';
import fs from 'fs';
import { confirm } from '@clack/prompts';
import path from 'path';

// 1. Mock Dependencies
vi.mock('child_process');
vi.mock('@clack/prompts');
vi.mock('fs');
// Mock logger
vi.mock('../../../../app/services/logger.service', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
}));

describe('Unit: initLayers', () => {
	const mockRoot = '/mock/root';
	
	beforeEach(() => {
		vi.clearAllMocks();
		// Default: Layers directory exists
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p.toString().includes('layers')) return true;
			return false;
		});
		// Default: isDirectory returns true
		vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
	});
	
	it('should warn and exit if "layers" directory does not exist', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(false); // No layers dir
		
		await initLayers(mockRoot);
		
		expect(child_process.execSync).not.toHaveBeenCalled();
		const { logger } = await import('../../../../app/services/logger.service');
		expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('No "layers" directory'));
	});
	
	it('should prompt user and init if uninitialized layers found (Interactive)', async () => {
		// Setup: One layer found
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		// Setup: .git does NOT exist inside 'layer1'
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p.toString().endsWith('layers')) return true;
			if (p.toString().endsWith('.git')) return false;
			return true;
		});
		// User confirms
		vi.mocked(confirm).mockResolvedValue(true);
		
		await initLayers(mockRoot);
		
		expect(confirm).toHaveBeenCalled();
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git init'),
			expect.anything()
		);
	});
	
	it('should skip prompt and init immediately if force=true (Headless)', async () => {
		vi.mocked(fs.readdirSync).mockReturnValue(['layer1'] as any);
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p.toString().endsWith('layers')) return true;
			if (p.toString().endsWith('.git')) return false;
			return true;
		});
		
		await initLayers(mockRoot, { force: true });
		
		// Verify NO prompt
		expect(confirm).not.toHaveBeenCalled();
		
		// Verify Init happened
		expect(child_process.execSync).toHaveBeenCalledWith(
			expect.stringContaining('git init'),
			expect.anything()
		);
	});
});