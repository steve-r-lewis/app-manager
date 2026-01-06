/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/processService.ts
 * @version:    1.0.0
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
 * V1.0.0, 20260102-01:00
 * Initial creation and release of processService.ts
 *
 * ================================================================================
 */

import { exec, spawn } from 'child_process';
import type { ProcessExecuteOptions, ProcessResult } from '../types/index';
import { logger } from './loggerService';

class ProcessService {
	/**
	 * Executes a shell command and buffers output.
	 * Best for short-lived commands where you need to parse the result (e.g., git status).
	 */
	public async execute(command: string, options: ProcessExecuteOptions = {}): Promise<ProcessResult> {
		const cwd = options.cwd || process.cwd();
		const env = options.env ? { ...process.env, ...options.env } : process.env;
		const timeout = options.timeout || 0;
		
		if (!options.silent) {
			logger.debug(`Executing: "${command}" in ${cwd}`);
		}
		
		return new Promise((resolve) => {
			exec(command, { cwd, env, timeout }, (error, stdout, stderr) => {
				const outStr = stdout ? stdout.toString().trim() : '';
				const errStr = stderr ? stderr.toString().trim() : '';
				
				let exitCode = 0;
				if (error) {
					exitCode = typeof error.code === 'number' ? error.code : 1;
				}
				
				resolve({
					stdout: outStr,
					stderr: errStr,
					exitCode: exitCode
				});
			});
		});
	}
	
	/**
	 * Spawns a shell command and streams output directly to the terminal.
	 * Best for long-running processes (e.g., nuxt dev, npm install) or interactive tools.
	 * * @returns Promise<number> The exit code.
	 */
	public async spawn(command: string, args: string[], options: ProcessExecuteOptions = {}): Promise<number> {
		const cwd = options.cwd || process.cwd();
		const env = options.env ? { ...process.env, ...options.env } : process.env;
		
		if (!options.silent) {
			logger.debug(`Spawning: "${command} ${args.join(' ')}" in ${cwd}`);
		}
		
		return new Promise((resolve, reject) => {
			const child = spawn(command, args, {
				cwd,
				env,
				stdio: 'inherit', // CRITICAL: Pipes output directly to parent terminal
				shell: true       // CRITICAL: Allows cross-platform commands (cmd/bash)
			});
			
			child.on('error', (err) => reject(err));
			
			child.on('close', (code) => {
				resolve(code ?? 0);
			});
		});
	}
}

export const processService = new ProcessService();
