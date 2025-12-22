/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/processService.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 22
 * @createTime: 02:09
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for ProcessService. Verifies package manager detection logic
 * and correct parameter passing to child_process.spawn.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251222-02:09
 * Initial creation and release of processService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processService } from '../../../app/services/processService';
import fs from 'fs';
import child_process from 'child_process';
import path from 'path';

// Mock dependencies
vi.mock('fs');
vi.mock('child_process');
vi.mock('../../../app/services/loggerService', () => ({
	logger: {
		info: vi.fn(),
		error: vi.fn()
	}
}));

describe('Service: ProcessService', () => {
	const mockRoot = '/mock/root';
	let spawnMock: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup spawn mock
		spawnMock = {
			on: vi.fn((event, cb) => {
				if (event === 'close') cb(0); // Default success
			}),
			stdout: { on: vi.fn() },
			stderr: { on: vi.fn() }
		};
		vi.mocked(child_process.spawn).mockReturnValue(spawnMock as any);
	});
	
	// --- Detection Logic ---
	
	it('should detect Bun via lockfile', () => {
		vi.mocked(fs.existsSync).mockImplementation((p) => (p as string).endsWith('bun.lockb'));
		expect(processService.detectPackageManager(mockRoot)).toBe('bun');
	});
	
	it('should detect pnpm via lockfile', () => {
		vi.mocked(fs.existsSync).mockImplementation((p) => (p as string).endsWith('pnpm-lock.yaml'));
		expect(processService.detectPackageManager(mockRoot)).toBe('pnpm');
	});
	
	it('should detect Yarn via lockfile', () => {
		vi.mocked(fs.existsSync).mockImplementation((p) => (p as string).endsWith('yarn.lock'));
		expect(processService.detectPackageManager(mockRoot)).toBe('yarn');
	});
	
	it('should default to npm if no lockfile found', () => {
		vi.mocked(fs.existsSync).mockReturnValue(false);
		expect(processService.detectPackageManager(mockRoot)).toBe('npm');
	});
	
	// --- Binary Runner Logic ---
	
	it('should return "npx" for npm', () => {
		expect(processService.getBinaryRunner('npm')).toBe('npx');
	});
	
	it('should return package manager name for others (pnpm, bun, yarn)', () => {
		expect(processService.getBinaryRunner('pnpm')).toBe('pnpm');
		expect(processService.getBinaryRunner('bun')).toBe('bun');
		expect(processService.getBinaryRunner('yarn')).toBe('yarn');
	});
	
	// --- Execution Logic ---
	
	it('should spawn process with correct options', async () => {
		await processService.run('npm', ['install'], mockRoot);
		
		expect(child_process.spawn).toHaveBeenCalledWith(
			'npm',
			['install'],
			expect.objectContaining({
				cwd: mockRoot,
				stdio: 'inherit',
				shell: true
			})
		);
	});
	
	it('should resolve with exit code on failure', async () => {
		// Override mock to return failure code
		spawnMock.on = vi.fn((event, cb) => {
			if (event === 'close') cb(127);
		});
		
		const code = await processService.run('bad-cmd', [], mockRoot);
		expect(code).toBe(127);
	});
	
	it('should handle spawn errors gracefully', async () => {
		spawnMock.on = vi.fn((event, cb) => {
			if (event === 'error') cb(new Error('Spawn failed'));
		});
		
		const code = await processService.run('fail', [], mockRoot);
		
		// Should return 1 on error and log it
		expect(code).toBe(1);
		const { logger } = await import('../../../app/services/loggerService');
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Spawn failed'));
	});
	
	it('should suppress logging if silent option is true', async () => {
		await processService.run('echo', ['quiet'], mockRoot, { silent: true });
		
		const { logger } = await import('../../../app/services/loggerService');
		expect(logger.info).not.toHaveBeenCalled();
	});
});