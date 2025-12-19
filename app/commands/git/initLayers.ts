/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/initLayers.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:43
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
 * V1.0.0, 20251218-23:43
 * Initial creation and release of initLayers.ts
 *
 * ================================================================================
 */

import { simpleGit } from 'simple-git';
import { multiselect, isCancel, spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';

export async function initLayers(targetRoot: string) {
	const s = spinner();
	const layersDir = path.join(targetRoot, 'layers');
	
	// 1. Validation
	if (!fs.existsSync(layersDir)) {
		consola.warn("No 'layers' directory found.");
		return;
	}
	
	// 2. Discovery
	s.start('Scanning layers...');
	const entries = fs.readdirSync(layersDir, { withFileTypes: true });
	const candidates = [];
	
	for (const entry of entries) {
		if (entry.isDirectory()) {
			const layerPath = path.join(layersDir, entry.name);
			const git = simpleGit(layerPath);
			const isRepo = await git.checkIsRepo();
			
			if (!isRepo) {
				candidates.push({
					value: entry.name,
					label: entry.name,
					path: layerPath
				});
			}
		}
	}
	s.stop('Scan complete.');
	
	if (candidates.length === 0) {
		consola.info(pc.green("All layers are already initialized git repositories."));
		return;
	}
	
	// 3. Selection
	const selected = await multiselect({
		message: 'Select layers to initialize as Git repositories:',
		options: candidates,
		required: false
	});
	
	if (isCancel(selected) || selected.length === 0) return;
	
	// 4. Execution
	const targets = selected as string[];
	s.start(`Initializing ${targets.length} layers...`);
	
	for (const name of targets) {
		const layerPath = path.join(layersDir, name);
		const git = simpleGit(layerPath);
		
		try {
			await git.init();
			// Optional: Initial commit to make it a valid repo immediately
			await git.add('.');
			await git.commit('Initial commit');
			consola.success(pc.green(`Initialized ${name}`));
		} catch (error: any) {
			consola.error(pc.red(`Failed to init ${name}: ${error.message}`));
		}
	}
	s.stop('Initialization complete.');
}