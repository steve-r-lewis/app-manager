/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/processService.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 01:00
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Process Service.
 *
 * V1.0.1 Update:
 * - Aligned with strict ProcessResult and ProcessExecuteOptions interfaces.
 * - Verifies exitCode, stdout, and env passing.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260102-01:00
 * Initial creation and release of processService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// @ts-ignore
import * as child_process from 'child_process';
import { processService } from '../../../app/services/processService.js';

// Mock child_process
vi.mock('child_process', () => ({
	exec: vi.fn(),
	spawn: vi.fn()
}));

describe('ProcessService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
	});
	
	// ... [Group: execute] ...
	describe('execute()', () => {
		
		it('should execute a command and return stdout + exitCode 0', async () => {
			// Mock exec to simulate success
			(child_process.exec as any).mockImplementation((cmd: string, opts: any, callback: any) => {
				// callback signature: (error, stdout, stderr)
				callback(null, 'Success Output\n', '');
			});
			
			const result = await processService.execute('echo "test"');
			
			expect(result.exitCode).toBe(0);
			expect(result.stdout).toBe('Success Output'); // Service should trim
			expect(child_process.exec).toHaveBeenCalledWith(
				'echo "test"',
				expect.objectContaining({ cwd: expect.any(String) }),
				expect.any(Function)
			);
		});
		
		it('should handle execution errors (non-zero exit code)', async () => {
			// Mock exec to simulate failure (e.g., command not found)
			(child_process.exec as any).mockImplementation((cmd: string, opts: any, callback: any) => {
				const err: any = new Error('Command Failed');
				err.code = 127; // Standard "command not found" code
				callback(err, '', 'Error Output\n');
			});
			
			const result = await processService.execute('bad-command');
			
			expect(result.exitCode).toBe(127);
			expect(result.stderr).toBe('Error Output');
		});
		
		it('should pass environment variables when provided', async () => {
			(child_process.exec as any).mockImplementation((cmd: string, opts: any, callback: any) => {
				callback(null, 'ok', '');
			});
			
			const customEnv = { NODE_ENV: 'production' };
			await processService.execute('build', { env: customEnv });
			
			expect(child_process.exec).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					env: expect.objectContaining({ NODE_ENV: 'production' })
				}),
				expect.any(Function)
			);
		});
	});
	
	// ... [Group: spawn] ...
	describe('spawn()', () => {
		it('should spawn a child process with inherited stdio', async () => {
			// Mock the ChildProcess event emitter
			const mockChild = {
				on: vi.fn((event, cb) => {
					if (event === 'close') cb(0); // Simulate immediate success
				})
			};
			(child_process.spawn as any).mockReturnValue(mockChild);
			
			const exitCode = await processService.spawn('npm', ['install']);
			
			expect(exitCode).toBe(0);
			expect(child_process.spawn).toHaveBeenCalledWith(
				'npm',
				['install'],
				expect.objectContaining({
					stdio: 'inherit',
					shell: true
				})
			);
		});
		
		it('should propagate spawn errors', async () => {
			const mockChild = {
				on: vi.fn((event, cb) => {
					if (event === 'error') cb(new Error('Spawn Failed'));
				})
			};
			(child_process.spawn as any).mockReturnValue(mockChild);
			
			await expect(processService.spawn('bad', [])).rejects.toThrow('Spawn Failed');
		});
	});
});
