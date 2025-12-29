/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/addSubmodules.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 18
 * @createTime: 23:44
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
 * V1.0.1, 20251226-1912
 * Refactored logic.
 *
 * V1.0.0, 20251218-23:44
 * Initial creation and release of addSubmodules.ts
 *
 * ================================================================================
 */

import { simpleGit } from 'simple-git';
import { multiselect, isCancel, spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';

export async function addSubmodules(targetRoot: string) {
	const s = spinner();
	const rootGit = simpleGit(targetRoot);
	const layersDir = path.join(targetRoot, 'layers');
	
	if (!await rootGit.checkIsRepo()) {
		consola.error("Root is not a git repository.");
		return;
	}
	if (!fs.existsSync(layersDir)) {
		consola.warn("No 'layers' directory found.");
		return;
	}
	
	// 1. Discovery
	s.start('Scanning candidates...');
	
	// Get list of existing submodules to avoid duplicates
	// Output format: "mode blob stage path"
	const submoduleRaw = await rootGit.raw(['ls-files', '--stage']);
	const trackedPaths = new Set(
		submoduleRaw.split('\n')
			.map(line => line.split('\t')[1]) // Get path part
			.filter(Boolean)
	);
	
	const entries = fs.readdirSync(layersDir, { withFileTypes: true });
	const candidates = [];
	
	for (const entry of entries) {
		if (entry.isDirectory()) {
			const relPath = `layers/${entry.name}`;
			const absPath = path.join(layersDir, entry.name);
			const layerGit = simpleGit(absPath);
			
			// Must be a repo, but NOT already tracked in root
			if (await layerGit.checkIsRepo() && !trackedPaths.has(relPath)) {
				
				// Critical: We need a Remote URL to add as submodule
				const remotes = await layerGit.getRemotes(true);
				const origin = remotes.find(r => r.name === 'origin');
				
				if (origin) {
					candidates.push({
						value: { name: entry.name, url: origin.refs.fetch, path: relPath },
						label: `${entry.name} (${origin.refs.fetch})`,
					});
				} else {
					consola.warn(pc.yellow(`Skipping ${entry.name}: No 'origin' remote found.`));
				}
			}
		}
	}
	s.stop('Scan complete.');
	
	if (candidates.length === 0) {
		consola.info("No eligible layers found to link as submodules.");
		return;
	}
	
	// 2. Selection
	const selected = await multiselect({
		message: 'Select layers to link as submodules:',
		options: candidates,
		required: false
	});
	
	if (isCancel(selected) || selected.length === 0) return;
	
	// 3. Execution
	const targets = selected as { name: string, url: string, path: string }[];
	s.start(`Linking ${targets.length} submodules...`);
	
	for (const target of targets) {
		try {
			// git submodule add <url> <path>
			await rootGit.submoduleAdd(target.url, target.path);
			consola.success(pc.green(`Linked ${target.name}`));
		} catch (error: any) {
			consola.error(pc.red(`Failed to link ${target.name}: ${error.message}`));
		}
	}
	s.stop('Submodule linking complete.');
	consola.info("Don't forget to commit these changes in Root!");
}