/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/app/runApp.ts
 * @version:    1.1.1
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
 * Command to execute npm scripts.
 * Features:
 * - Strict validation of package.json and script existence.
 * - Auto-detection of Package Manager (Bun, PNPM, Yarn, NPM).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.1, 20251222-23:59
 * Added strict error throwing when script is missing (Fixes E2E Exit Code).
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

import { execSync } from 'child_process';
import { logger } from '../../services/loggerService';
import fs from 'fs';
import path from 'path';

export async function runApp(targetRoot: string, scriptName: string) {
	const pkgPath = path.join(targetRoot, 'package.json');
	
	// 1. Strict Validation: package.json must exist
	if (!fs.existsSync(pkgPath)) {
		throw new Error('package.json not found in target root.');
	}
	
	// 2. Strict Validation: Script must exist
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
	if (!pkg.scripts || !pkg.scripts[scriptName]) {
		throw new Error(`Missing script: "${scriptName}"`);
	}
	
	// 3. Detect Package Manager
	let pm = 'npm';
	if (fs.existsSync(path.join(targetRoot, 'bun.lockb'))) {
		pm = 'bun';
	} else if (fs.existsSync(path.join(targetRoot, 'pnpm-lock.yaml'))) {
		pm = 'pnpm';
	} else if (fs.existsSync(path.join(targetRoot, 'yarn.lock'))) {
		pm = 'yarn';
	}
	
	// 4. Execute
	const command = `${pm} run ${scriptName}`;
	logger.info(`🚀 Running: ${command}`);
	
	try {
		execSync(command, {
			cwd: targetRoot,
			stdio: 'inherit'
		});
	} catch (error: any) {
		// Ensure non-zero exit code propagates
		throw new Error(`Script "${scriptName}" failed execution.`);
	}
}