/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/app/runApp.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:42
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * This module serves as the execution engine for running target application scripts
 * (such as 'dev', 'build', or 'generate') within the monorepo context.
 *
 * Key Functionality:
 * Package Manager Abstraction:
 * Automatically detects the underlying package manager (Bun, pnpm, Yarn, or npm)
 * active in the target project by analyzing lockfiles (e.g., bun.lockb,
 * pnpm-lock.yaml). This ensures commands are executed using the correct binary
 * without requiring user configuration.
 *
 * Interactive Process Spawning:
 * It utilizes Node.js 'spawn' with inherited stdio. This allows the target
 * application (e.g., a Nuxt development server) to output logs directly to the
 * console and accept interactive input (Ctrl+C), while keeping the App Manager
 * process alive in the background until the child process terminates.
 *
 * Cross-Platform Compatibility:
 * Enables shell execution mode to ensure consistent behavior across Windows
 * and POSIX systems.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251222-01:30
 * Refactored return type to Promise<number> to expose process exit codes.
 * Enhanced error handling to resolve with non-zero codes on failure, enabling
 * reliable status reporting for upstream callers.
 *
 * V1.0.0, 20251217-10:42
 * Initial creation and release of runApp.ts
 *
 * ================================================================================
 */

import { spawn } from 'child_process';
import { logger } from '../../services/loggerService';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

// Return Promise<number> so the caller knows the exit code
export async function runApp(targetRoot: string, script: string = 'dev'): Promise<number> {
	logger.info(`Starting App in ${targetRoot}...`);
	
	const pm = detectPackageManager(targetRoot);
	const command = pm === 'npm' ? 'npm' : pm;
	const args = ['run', script];
	
	logger.info(pc.dim(`> ${command} ${args.join(' ')}`));
	
	const child = spawn(command, args, {
		cwd: targetRoot,
		stdio: 'inherit',
		shell: true
	});
	
	return new Promise<number>((resolve) => {
		child.on('close', (code) => {
			if (code !== 0) {
				logger.error(`App exited with code ${code}`);
				// Resolve with the error code
				resolve(code || 1);
			} else {
				logger.success('App stopped.');
				resolve(0);
			}
		});
		
		// Handle spawn errors (e.g. command not found)
		child.on('error', (err) => {
			logger.error(`Failed to start subprocess: ${err.message}`);
			resolve(1);
		});
	});
}

/**
 * Helper: Detects package manager based on lockfiles.
 * Priority: Bun > pnpm > Yarn > npm
 */
function detectPackageManager(root: string): string {
	if (fs.existsSync(path.join(root, 'bun.lockb'))) return 'bun';
	if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
	return 'npm';
}