/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/processService.ts
 * @version:    1.0.2
 * @createDate: 2026 Jan 02
 * @createTime: 01:00
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Process Service.
 *
 * Responsible for executing system shell commands. It wraps Node.js child_process
 * to provide a Promise-based API with standardized result objects (exit codes,
 * stdout, stderr).
 *
 * Features:
 * - Environment variable merging
 * - Working directory control
 * - Output trimming
 * - Integration with Logger for debug visibility
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.2, 20260822-01:16
 * execute() now rejects when shell: false is explicitly passed, since
 * child_process.exec is inherently shell-based and cannot honor that
 * guarantee. shell: true or omitted are unaffected. Added test coverage for
 * previously-untested option paths on execute() and spawn() (cwd, timeout,
 * env, silent, string shell values).
 *
 * V1.0.1, 20260822-01:00
 * Fixed spawn()'s close handler defaulting a signal-killed process (code null)
 * to exitCode 0. spawn() now returns ProcessResult (was Promise<number>) so the
 * terminating signal can be reported instead of being reported as a success.
 * execute()'s error fallback now also populates the new signal field.
 *
 * V1.0.0, 20260102-01:00
 * Initial creation and release of processService.ts
 *
 * ================================================================================
 */

import { exec, spawn, type ExecException } from 'node:child_process';
import type { ProcessExecuteOptions, ProcessResult, IProcessService } from '../types/index.js';
import { logger } from './loggerService.js';

class ProcessService implements IProcessService {
	
	public async execute(command: string, options: ProcessExecuteOptions = {}): Promise<ProcessResult> {
		if (options.shell === false) {
			// child_process.exec is inherently shell-based — it cannot honor a
			// "no shell" guarantee, so refuse rather than silently ignoring it.
			// Use spawn() with shell: false for shell-less execution instead.
			throw new Error('execute() cannot honor shell: false — it always runs via a shell (child_process.exec). Use spawn() with shell: false for shell-less execution.');
		}

		const cwd = options.cwd || process.cwd();
		const env = options.env ? { ...process.env, ...options.env } : process.env;
		const timeout = options.timeout || 0;
		
		if (!options.silent) {
			logger.debug(`Executing: "${command}" in ${cwd}`);
		}
		
		// Explicit Promise closure prevents V8 symbol stripping during Vitest module mocking
		return new Promise((resolve) => {
			exec(command, { cwd, env, timeout }, (error: ExecException | null, stdout, stderr) => {
				const outStr = stdout ? String(stdout).trim() : '';
				const errStr = stderr ? String(stderr).trim() : '';
				
				let exitCode = 0;
				let signal: NodeJS.Signals | null = null;
				if (error) {
					// Fallback to exit code 1 if the OS error code is not numeric
					exitCode = typeof error.code === 'number' ? error.code : 1;
					signal = error.signal ?? null;
				}

				resolve({
					stdout: outStr,
					stderr: errStr,
					exitCode,
					signal
				});
			});
		});
	}
	
	public async spawn(command: string, args: string[], options: ProcessExecuteOptions = {}): Promise<ProcessResult> {
		const cwd = options.cwd || process.cwd();
		const env = options.env ? { ...process.env, ...options.env } : process.env;
		
		// Security Hardening: Safely handle Windows .cmd execution, but secure Unix environments.
		const useShell = options.shell ?? (process.platform === 'win32');
		
		if (!options.silent) {
			logger.debug(`Spawning: "${command} ${args.join(' ')}" in ${cwd}`);
		}
		
		return new Promise((resolve, reject) => {
			const child = spawn(command, args, {
				cwd,
				env,
				stdio: 'inherit',
				shell: useShell
			});

			child.on('error', (err) => reject(err));

			child.on('close', (code, signal) => {
				if (code === null && signal) {
					// Killed by a signal (SIGTERM/SIGINT/timeout) rather than a normal exit —
					// don't collapse this into exitCode 0, it isn't a success.
					resolve({ stdout: '', stderr: '', exitCode: 1, signal });
				} else {
					resolve({ stdout: '', stderr: '', exitCode: code ?? 0, signal: null });
				}
			});
		});
	}
}

export const processService = new ProcessService();