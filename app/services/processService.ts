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

import { exec } from 'child_process';
import type { ProcessExecuteOptions, ProcessResult } from '../types/index';
import { logger } from './loggerService';

class ProcessService {
	/**
	 * Executes a shell command asynchronously.
	 * * @param command The shell command to run (e.g., 'git status')
	 * @param options Configuration for execution (cwd, env, silent)
	 * @returns Promise<ProcessResult> containing stdout, stderr, and exitCode
	 */
	public async execute(command: string, options: ProcessExecuteOptions = {}): Promise<ProcessResult> {
		const cwd = options.cwd || process.cwd();
		// Merge process.env with provided env to ensure system paths are preserved
		const env = options.env ? { ...process.env, ...options.env } : process.env;
		const timeout = options.timeout || 0;
		
		if (!options.silent) {
			logger.debug(`Executing: "${command}" in ${cwd}`);
		}
		
		return new Promise((resolve) => {
			exec(command, { cwd, env, timeout }, (error, stdout, stderr) => {
				// Normalize output
				const outStr = stdout ? stdout.toString().trim() : '';
				const errStr = stderr ? stderr.toString().trim() : '';
				
				// Calculate strict exit code
				let exitCode = 0;
				if (error) {
					// Node's error.code can be a string (e.g., 'ENOENT') or number.
					// Our interface requires a number.
					if (typeof error.code === 'number') {
						exitCode = error.code;
					} else {
						exitCode = 1; // Default fallback for generic failures
					}
				}
				
				const result: ProcessResult = {
					stdout: outStr,
					stderr: errStr,
					exitCode: exitCode
				};
				
				resolve(result);
			});
		});
	}
}

// Export as Singleton
export const processService = new ProcessService();