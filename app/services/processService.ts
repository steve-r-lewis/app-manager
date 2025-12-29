/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/processService.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 22
 * @createTime: 02:02
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Service responsible for low-level process execution and environment detection.
 * It abstracts shell spawning and package manager differences (npm/pnpm/bun/yarn)
 * into a reusable singleton.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251227-21:35
 * - Refactored to import types from ~/app/types.
 * - Added validateProjectManifest helper to centralize package.json checks.
 *
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251222-02:02
 * Initial creation and release of processService.ts
 *
 * ================================================================================
 */

// import fs from 'fs';
// import path from 'path';
// import { spawn } from 'child_process';
// import { logger } from './loggerService';
// import pc from 'picocolors';
// // Import Type
// import type { PackageManager } from '../types/process.types';
//
// class ProcessService {
// 	/**
// 	 * Detects the package manager used in a specific directory based on lockfiles.
// 	 * Priority: Bun > pnpm > Yarn > npm (Default)
// 	 */
// 	detectPackageManager(root: string): PackageManager {
// 		if (fs.existsSync(path.join(root, 'bun.lockb'))) return 'bun';
// 		if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
// 		if (fs.existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
// 		return 'npm';
// 	}
//
// 	/**
// 	 * Determines the correct binary runner (e.g., 'npx' vs 'pnpm').
// 	 * Useful for one-off commands like 'vitest' or 'vitepress' where the invocation
// 	 * style changes based on the package manager.
// 	 */
// 	getBinaryRunner(pm: PackageManager): string {
// 		return pm === 'npm' ? 'npx' : pm;
// 	}
//
// 	/**
// 	 * Executes a command in a child process, piping output to the console.
// 	 * Returns a Promise that resolves to the exit code.
// 	 * * @param command - The base command (e.g., 'npm', 'git')
// 	 * @param args - Array of arguments (e.g., ['run', 'dev'])
// 	 * @param cwd - The directory to execute in
// 	 * @param options - execution options (silent: boolean)
// 	 */
// 	async run(
// 		command: string,
// 		args: string[],
// 		cwd: string,
// 		options: { silent?: boolean } = {}
// 	): Promise<number> {
// 		if (!options.silent) {
// 			logger.info(pc.dim(`> ${command} ${args.join(' ')}`));
// 		}
//
// 		return new Promise((resolve) => {
// 			const child = spawn(command, args, {
// 				cwd,
// 				stdio: 'inherit',
// 				shell: true
// 			});
//
// 			child.on('close', (code) => {
// 				// Return 0 if code is null (success) or the actual code
// 				resolve(code ?? 0);
// 			});
//
// 			child.on('error', (err) => {
// 				logger.error(`Failed to execute ${command}: ${err.message}`);
// 				resolve(1);
// 			});
// 		});
// 	}
// }
//
// /**
//  * Initializes the Process Service instance.
//  *
//  * @return {ProcessService} The initialized Process Service instance.
//  */
// export const processService = new ProcessService();

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { logger } from './loggerService';
import pc from 'picocolors';
import type { PackageManager } from '../types';

class ProcessService {
	
	/**
	 * Detects the package manager used in a specific directory based on lockfiles.
	 * Priority: Bun > pnpm > Yarn > npm (Default)
	 */
	detectPackageManager(root: string): PackageManager {
		if (fs.existsSync(path.join(root, 'bun.lockb'))) return 'bun';
		if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
		if (fs.existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
		return 'npm';
	}
	
	/**
	 * Determines the correct binary runner (e.g., 'npx' vs 'pnpm').
	 * Useful for one-off commands like 'vitest' or 'vitepress'.
	 */
	getBinaryRunner(pm: PackageManager): string {
		return pm === 'npm' ? 'npx' : pm;
	}
	
	/**
	 * Validates and reads the project manifest (package.json).
	 * Useful for pre-flight checks in commands.
	 */
	validateProjectManifest(targetRoot: string) {
		const pkgPath = path.join(targetRoot, 'package.json');
		
		if (!fs.existsSync(pkgPath)) {
			throw new Error('package.json not found in target root.');
		}
		
		try {
			const content = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
			return { path: pkgPath, content };
		} catch (e: any) {
			throw new Error(`Failed to parse package.json: ${e.message}`);
		}
	}
	
	/**
	 * Executes a command in a child process, piping output to the console.
	 * Returns a Promise that resolves to the exit code.
	 * * @param command - The base command (e.g., 'npm', 'git')
	 * @param args - Array of arguments (e.g., ['run', 'dev'])
	 * @param cwd - The directory to execute in
	 * @param options - execution options (silent: boolean)
	 */
	async run(
		command: string,
		args: string[],
		cwd: string,
		options: { silent?: boolean } = {}
	): Promise<number> {
		if (!options.silent) {
			logger.info(pc.dim(`> ${command} ${args.join(' ')}`));
		}
		
		return new Promise((resolve) => {
			const child = spawn(command, args, {
				cwd,
				stdio: 'inherit',
				shell: true
			});
			
			child.on('close', (code) => {
				// Return 0 if code is null (success) or the actual code
				resolve(code ?? 0);
			});
			
			child.on('error', (err) => {
				logger.error(`Failed to execute ${command}: ${err.message}`);
				resolve(1);
			});
		});
	}
}

export const processService = new ProcessService();