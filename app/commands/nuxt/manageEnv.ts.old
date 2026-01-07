/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/nuxt/manageEnv.ts
 * @version:    2.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:39
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Manages the development environment state (cleaning and reinstallation).
 * - Interactive: Menu-driven selection of artifacts to clean.
 * - Headless: Direct execution of cleaning/reinstalling for automation.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20251226-23:15
 * Added Headless Mode support (parity with nuxtManager.ps1 -SkipMenu).
 * Refactored to separate interactive prompts from core logic.
 *
 * V1.0.1, 20251226-1912
 * Refactored logic.
 *
 * V1.0.0, 20251217-01:39
 * Initial creation and release of manageEnv.ts
 *
 * ================================================================================
 */

import { select, multiselect, isCancel, confirm, intro, outro, spinner } from '@clack/prompts';
import { consola } from 'consola';
import fs from 'fs';
import path from 'path';
import { logger } from '../../services/loggerService';
import { processService } from '../../services/processService';

export interface EnvOptions {
	clean?: boolean;
	reinstall?: boolean;
	force?: boolean; // Skip confirmation in headless mode
}

export async function manageEnv(targetRoot: string, options: EnvOptions = {}) {
	// --- HEADLESS MODE ---
	if (options.clean || options.reinstall) {
		logger.info(`Headless Env Manager: Clean=${options.clean}, Reinstall=${options.reinstall}`);
		
		if (options.clean) {
			// In headless, we default to cleaning ALL standard artifacts
			const targets = ['node_modules', '.nuxt', '.output', 'dist', '.cache'];
			await executeClean(targetRoot, targets);
		}
		
		if (options.reinstall) {
			await executeInstall(targetRoot);
		}
		return;
	}
	
	// --- INTERACTIVE MODE ---
	const s = spinner();
	
	const action = await select({
		message: 'Manage Environment:',
		options: [
			{ value: 'clean', label: 'Clean Artifacts', hint: 'Delete .nuxt, node_modules, dist' },
			{ value: 'reinstall', label: 'Reinstall Dependencies', hint: 'Clean + Install' },
			{ value: 'reset', label: 'Full Reset', hint: 'Clean Everything + Reinstall' },
			{ value: 'back', label: 'Go Back' }
		]
	});
	
	if (isCancel(action) || action === 'back') return;
	
	const allTargets = ['node_modules', '.nuxt', '.output', 'dist', '.cache'];
	
	// 1. CLEAN ACTION
	if (action === 'clean') {
		const selected = await multiselect({
			message: 'Select directories to delete:',
			options: allTargets.map(t => ({ value: t, label: t })),
			required: false
		});
		
		if (isCancel(selected)) return;
		const dirsToDelete = selected as string[];
		
		if (dirsToDelete.length === 0) return;
		
		const shouldContinue = await confirm({ message: `Delete ${dirsToDelete.join(', ')}?` });
		if (!shouldContinue) return;
		
		s.start('Cleaning directories...');
		await executeClean(targetRoot, dirsToDelete);
		s.stop('Cleanup complete.');
	}
	
	// 2. REINSTALL ACTION
	else if (action === 'reinstall') {
		await executeInstall(targetRoot);
		outro('Dependencies reinstalled.');
	}
	
	// 3. FULL RESET (Matches nuxtManager.ps1 "Clean & Reset")
	else if (action === 'reset') {
		const shouldReset = await confirm({ message: 'This will delete artifacts and node_modules, then reinstall. Proceed?' });
		if (!shouldReset || isCancel(shouldReset)) return;
		
		s.start('Resetting Environment...');
		await executeClean(targetRoot, allTargets);
		s.stop('Clean complete. Installing...');
		await executeInstall(targetRoot);
		outro('Environment Reset Complete.');
	}
}

// --- CORE LOGIC HELPERS ---

async function executeClean(targetRoot: string, dirs: string[]) {
	for (const dir of dirs) {
		const fullPath = path.join(targetRoot, dir);
		if (fs.existsSync(fullPath)) {
			try {
				fs.rmSync(fullPath, { recursive: true, force: true });
				logger.success(`Deleted: ${dir}`);
			} catch (e: any) {
				logger.error(`Failed to delete ${dir}: ${e.message}`);
			}
		}
	}
}

async function executeInstall(targetRoot: string) {
	const pm = processService.detectPackageManager(targetRoot);
	logger.info(`Installing with ${pm}...`);
	try {
		await processService.run(pm, ['install'], targetRoot);
	} catch (error: any) {
		logger.error(`Install failed: ${error.message}`);
	}
}