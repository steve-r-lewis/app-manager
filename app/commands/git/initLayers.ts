/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/initLayers.ts
 * @version:    1.0.1
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
 *
 * V1.0.1, 20251221-19:35
 * Added 'force' option for Headless/CI operations.
 *
 * V1.0.0, 20251218-23:43
 * Initial creation and release of initLayers.ts
 *
 * ================================================================================
 */

import { intro, outro, confirm } from '@clack/prompts';
import { logger } from '../../services/loggerService';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface InitOptions {
	force?: boolean;
}

export async function initLayers(targetRoot: string, options: InitOptions = {}) {
	// --- HEADLESS LOGIC START ---
	// If headless, we skip the intro/outro to keep logs clean
	if (!options.force) {
		intro('📂  Initialize Layers');
	}
	
	const layersDir = path.join(targetRoot, 'layers');
	if (!fs.existsSync(layersDir)) {
		logger.warn('No "layers" directory found.');
		return;
	}
	
	// 1. Find candidates
	const layers = fs.readdirSync(layersDir).filter(dir => {
		const fullPath = path.join(layersDir, dir);
		return fs.statSync(fullPath).isDirectory() && !fs.existsSync(path.join(fullPath, '.git'));
	});
	
	if (layers.length === 0) {
		if (!options.force) logger.success('All layers are already initialized.');
		return;
	}
	
	// --- INTERACTIVE CONFIRMATION ---
	if (!options.force) {
		logger.info(`Found ${layers.length} uninitialized layers: ${layers.join(', ')}`);
		const shouldInit = await confirm({
			message: 'Initialize git in these layers?'
		});
		
		if (!shouldInit) {
			outro('Operation Cancelled');
			return;
		}
	} else {
		logger.info(`Headless: Initializing ${layers.length} layers...`);
	}
	
	// 2. Initialize
	layers.forEach(layer => {
		const layerPath = path.join(layersDir, layer);
		try {
			execSync('git init', { cwd: layerPath, stdio: 'ignore' });
			logger.success(`Initialized: ${layer}`);
		} catch (error) {
			logger.error(`Failed to init ${layer}`);
		}
	});
	
	if (!options.force) outro('Done');
}