/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/processService.test.ts
 * @version:    1.0.2
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
 * V1.0.2, 20260822-01:16
 * Added coverage for signal-terminated spawn() results, execute()'s
 * shell: false rejection, and previously-untested option paths (cwd,
 * timeout, env, silent, string shell values) on both execute() and spawn().
 *
 * V1.0.0, 20260102-01:00
 * Initial creation and release of processService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as child_process from 'node:child_process'; // Enforce strict node: imports
import { processService } from '../../../app/services/processService.js';
import { logger } from '../../../app/services/loggerService.js';

// Add this near the top of your test file to store the real platform
const originalPlatform = process.platform;

// Strictly mock the module
vi.mock('node:child_process', () => ({
	exec: vi.fn(),
	spawn: vi.fn()
}));

vi.mock('../../../app/services/loggerService.js', () => ({
	logger: { debug: vi.fn(), error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));

describe('ProcessService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
	});
	
  // ... inside your describe('ProcessService') block:
	afterEach(() => {
		vi.restoreAllMocks();
		// Strictly restore the host platform after every test
		Object.defineProperty(process, 'platform', { value: originalPlatform });
	});
	
	describe('execute()', () => {
		it('should execute a command and return stdout + exitCode 0', async () => {
			// utilize vi.mocked for strict typing instead of `as any`
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'Success Output\n', '');
				return {} as child_process.ChildProcess;
			}) as any);
			
			const result = await processService.execute('echo "test"');
			
			expect(result.exitCode).toBe(0);
			expect(result.stdout).toBe('Success Output');
			expect(child_process.exec).toHaveBeenCalledWith(
				'echo "test"',
				expect.objectContaining({ cwd: expect.any(String) }),
				expect.any(Function)
			);
		});
		
		it('should handle execution errors (non-zero exit code)', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				const err = new Error('Command Failed') as NodeJS.ErrnoException;
				err.code = '127'; // Standard "command not found" mock
				callback(err, '', 'Error Output\n');
				return {} as child_process.ChildProcess;
			}) as any);
			
			const result = await processService.execute('bad-command');
			
			// String code cast to Number logic verification
			expect(result.exitCode).toBe(1);
			expect(result.stderr).toBe('Error Output');
		});
		
		it('should pass environment variables when provided', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'ok', '');
				return {} as child_process.ChildProcess;
			}) as any);
			
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

		it('should use the explicit cwd when provided', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'ok', '');
				return {} as child_process.ChildProcess;
			}) as any);

			await processService.execute('build', { cwd: '/custom/project/path' });

			expect(child_process.exec).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ cwd: '/custom/project/path' }),
				expect.any(Function)
			);
		});

		it('should pass the timeout option through to exec', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'ok', '');
				return {} as child_process.ChildProcess;
			}) as any);

			await processService.execute('build', { timeout: 5000 });

			expect(child_process.exec).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ timeout: 5000 }),
				expect.any(Function)
			);
		});

		it('should suppress the debug log when silent: true', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'ok', '');
				return {} as child_process.ChildProcess;
			}) as any);

			await processService.execute('build', { silent: true });

			expect(logger.debug).not.toHaveBeenCalled();
		});

		it('should log a debug message by default (silent not set)', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'ok', '');
				return {} as child_process.ChildProcess;
			}) as any);

			await processService.execute('build');

			expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('build'));
		});

		it('should reject when shell: false is explicitly passed, since exec() cannot honor shell-less execution', async () => {
			await expect(processService.execute('ls', { shell: false })).rejects.toThrow(/shell/i);
			expect(child_process.exec).not.toHaveBeenCalled();
		});

		it('should execute normally when shell: true is explicitly passed', async () => {
			vi.mocked(child_process.exec).mockImplementation(((cmd: string, opts: any, callback: Function) => {
				callback(null, 'ok', '');
				return {} as child_process.ChildProcess;
			}) as any);

			const result = await processService.execute('build', { shell: true });

			expect(result.exitCode).toBe(0);
			expect(child_process.exec).toHaveBeenCalled();
		});
	});
	
	describe('spawn() Cross-Platform Execution', () => {
		it('should strictly default to shell: false on Unix-like systems (Linux/macOS)', async () => {
			// Mock the OS to Linux
			Object.defineProperty(process, 'platform', { value: 'linux' });
			
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);
			
			await processService.spawn('git', ['status']);
			
			expect(child_process.spawn).toHaveBeenCalledWith(
				'git',
				['status'],
				expect.objectContaining({ shell: false }) // Enforce Unix Security
			);
		});
		
		it('should dynamically default to shell: true on Windows systems (win32)', async () => {
			// Mock the OS to Windows
			Object.defineProperty(process, 'platform', { value: 'win32' });
			
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);
			
			await processService.spawn('npm', ['install']);
			
			expect(child_process.spawn).toHaveBeenCalledWith(
				'npm',
				['install'],
				expect.objectContaining({ shell: true }) // Enforce Windows Operability
			);
		});
		
		it('should allow explicit shell override regardless of the host OS', async () => {
			// Mock the OS to Linux, but explicitly request a shell
			Object.defineProperty(process, 'platform', { value: 'linux' });
			
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);
			
			await processService.spawn('echo', ['$HOME'], { shell: true });
			
			expect(child_process.spawn).toHaveBeenCalledWith(
				'echo',
				['$HOME'],
				expect.objectContaining({ shell: true }) // Override respected
			);
		});
		
		it('should propagate spawn errors safely via promise rejections', async () => {
			const mockChild = {
				on: vi.fn((event, cb) => {
					if (event === 'error') cb(new Error('Spawn Failed'));
				})
			};
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);

			await expect(processService.spawn('bad-binary', [])).rejects.toThrow('Spawn Failed');
		});

		it('should resolve with exitCode 0 and signal null on a normal clean exit', async () => {
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0, null); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);

			const result = await processService.spawn('git', ['status']);

			expect(result).toEqual({ stdout: '', stderr: '', exitCode: 0, signal: null });
		});

		it('should resolve with a non-success exitCode and the signal when killed by a signal', async () => {
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(null, 'SIGTERM'); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);

			const result = await processService.spawn('long-running-task', []);

			expect(result.exitCode).not.toBe(0);
			expect(result.signal).toBe('SIGTERM');
		});

		it('should use explicit cwd and env when provided', async () => {
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0, null); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);

			await processService.spawn('npm', ['run', 'build'], {
				cwd: '/custom/project/path',
				env: { NODE_ENV: 'production' }
			});

			expect(child_process.spawn).toHaveBeenCalledWith(
				'npm',
				['run', 'build'],
				expect.objectContaining({
					cwd: '/custom/project/path',
					env: expect.objectContaining({ NODE_ENV: 'production' })
				})
			);
		});

		it('should suppress the debug log when silent: true', async () => {
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0, null); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);

			await processService.spawn('git', ['status'], { silent: true });

			expect(logger.debug).not.toHaveBeenCalled();
		});

		it('should pass a string shell value through unchanged', async () => {
			const mockChild = { on: vi.fn((e, cb) => { if (e === 'close') cb(0, null); }) };
			vi.mocked(child_process.spawn).mockReturnValue(mockChild as any);

			await processService.spawn('echo', ['hi'], { shell: '/bin/bash' });

			expect(child_process.spawn).toHaveBeenCalledWith(
				'echo',
				['hi'],
				expect.objectContaining({ shell: '/bin/bash' })
			);
		});
	});
});