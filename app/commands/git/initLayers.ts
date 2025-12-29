/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/initLayers.ts
 * @version:    1.0.2
 * @createDate: 2025 Dec 18
 * @createTime: 23:43
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * This file defines a specific Git operation command designed to scan a project's
 * layers directory and initialize Git repositories for any sub-projects that do
 * not currently have them. It serves as a utility to automate the setup of modular
 * architectures (specifically Nuxt layers) within a monorepo structure.
 *
 * Key Functionality:
 *   Directory Scanning: It checks for the existence of a layers directory and
 *   iterates through its sub-directories.
 *
 *   Repo Validation: It filters the directories to identify candidates that are
 *   not yet Git repositories by checking for the absence of a .git folder.
 *
 *     Dual Operation Modes:
 *       Interactive: By default, it presents a user confirmation prompt via
 *       @clack/prompts listing the uninitialized layers before proceeding.
 *
 *       Headless/CI: It accepts a force option (via InitOptions) to bypass user
 *       prompts, allowing for automated execution in Continuous Integration
 *       environments.
 *
 *   Execution: It uses execSync to run the standard git init command within the
 *   target directory context.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.2, 20251226-1912
 * Refactored logic.
 *
 * V1.0.1, 20251221-19:35
 * Added 'force' option for Headless/CI operations.
 *
 * V1.0.0, 20251218-23:43
 * Initial creation and release of initLayers.ts
 *
 * ================================================================================
 */

// import { intro, outro, confirm } from '@clack/prompts';
// import { logger } from '../../services/loggerService';
// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
//
// // Import Type
// import type { InitOptions } from '../../types/git.types';
//
// export async function initLayers(targetRoot: string, options: InitOptions = {}) {
// 	// --- HEADLESS LOGIC START ---
// 	// If headless, we skip the intro/outro to keep logs clean
// 	if (!options.force) {
// 		intro('📂  Initialize Layers');
// 	}
//
// 	const layersDir = path.join(targetRoot, 'layers');
// 	if (!fs.existsSync(layersDir)) {
// 		logger.warn('No "layers" directory found.');
// 		return;
// 	}
//
// 	// 1. Find candidates
// 	const layers = fs.readdirSync(layersDir).filter(dir => {
// 		const fullPath = path.join(layersDir, dir);
// 		return fs.statSync(fullPath).isDirectory() && !fs.existsSync(path.join(fullPath, '.git'));
// 	});
//
// 	if (layers.length === 0) {
// 		if (!options.force) logger.success('All layers are already initialized.');
// 		return;
// 	}
//
// 	// --- INTERACTIVE CONFIRMATION ---
// 	if (!options.force) {
// 		logger.info(`Found ${layers.length} uninitialized layers: ${layers.join(', ')}`);
// 		const shouldInit = await confirm({
// 			message: 'Initialize git in these layers?'
// 		});
//
// 		if (!shouldInit) {
// 			outro('Operation Cancelled');
// 			return;
// 		}
// 	} else {
// 		logger.info(`Headless: Initializing ${layers.length} layers...`);
// 	}
//
// 	// 2. Initialize
// 	layers.forEach(layer => {
// 		const layerPath = path.join(layersDir, layer);
// 		try {
// 			execSync('git init', { cwd: layerPath, stdio: 'ignore' });
// 			logger.success(`Initialized: ${layer}`);
// 		} catch (error) {
// 			logger.error(`Failed to init ${layer}`);
// 		}
// 	});
//
// 	if (!options.force) outro('Done');
// }

import { intro, outro, confirm, isCancel, spinner } from '@clack/prompts';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import { logger } from '../../services/loggerService';
import type { InitOptions } from '../../types';

export async function initLayers(targetRoot: string, options: InitOptions = {}) {
	intro(pc.cyan('📦 Initialize Layers'));
	const s = spinner();
	
	const layersDir = path.join(targetRoot, 'layers');
	if (!fs.existsSync(layersDir)) {
		logger.warn('No layers directory found.');
		outro('Skipped.');
		return;
	}
	
	const layers = fs.readdirSync(layersDir, { withFileTypes: true });
	const uninitialized = layers.filter(dirent => {
		if (!dirent.isDirectory()) return false;
		return !fs.existsSync(path.join(layersDir, dirent.name, '.git'));
	});
	
	if (uninitialized.length === 0) {
		logger.success('All layers are already initialized git repositories.');
		outro('Done.');
		return;
	}
	
	logger.info(`Found ${uninitialized.length} uninitialized layers.`);
	
	if (!options.force) {
		const shouldInit = await confirm({
			message: `Initialize git in: ${uninitialized.map(u => u.name).join(', ')}?`,
			initialValue: true
		});
		
		if (isCancel(shouldInit) || !shouldInit) {
			outro('Operation cancelled.');
			return;
		}
	}
	
	s.start('Initializing repositories...');
	
	for (const layer of uninitialized) {
		const layerPath = path.join(layersDir, layer.name);
		try {
			await simpleGit(layerPath).init();
			s.message(`Initialized ${layer.name}`);
		} catch (error: any) {
			logger.error(`Failed to init ${layer.name}: ${error.message}`);
		}
	}
	
	s.stop('Initialization complete.');
	outro(pc.green('✅ Done'));
}
