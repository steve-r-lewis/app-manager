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
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251217-10:42
 * Initial creation and release of runApp.ts
 *
 * ================================================================================
 */

import { spawn } from 'child_process';
import { logger } from '../../services/logger.service.js';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

export async function runApp(targetRoot: string, script: string = 'dev') {
	logger.info(`Starting App in ${targetRoot}...`);
	
	const pm = detectPackageManager(targetRoot);
	const command = pm === 'npm' ? 'npm' : pm; // npm requires 'run' but others often imply it, though 'bun run' is standard.
	
	// Construct arguments: e.g. "run dev"
	const args = ['run', script];
	
	logger.info(pc.dim(`> ${command} ${args.join(' ')}`));
	
	// Spawn the process
	const child = spawn(command, args, {
		cwd: targetRoot,
		stdio: 'inherit', // Pipe output directly to console
		shell: true       // Required for Windows compatibility
	});
	
	// Handle Exit
	child.on('close', (code) => {
		if (code !== 0) {
			logger.error(`App exited with code ${code}`);
		} else {
			logger.success('App stopped.');
		}
	});
	
	// Return a promise that never resolves (keeps process alive until user kills it)
	// or resolves on close if you prefer. For a "dev" server, we usually await completion.
	return new Promise<void>((resolve) => {
		child.on('close', () => resolve());
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