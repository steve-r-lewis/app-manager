/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/pushAll.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 26
 * @createTime: 23:05
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * "Mass Push" Utility.
 * Scans the Root repository and all Layer submodules.
 * Identifies repositories that are ahead of their remote tracking branch.
 * Performs a bulk push operation for all identified changes.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251227-22:15
 * Refactored to use loggerService for consistency.
 * Verified simple-git implementation.
 *
 * V1.0.0, 20251226-23:05
 * Initial creation and release of pushAll.ts
 *
 * ================================================================================
 */

// import fs from 'fs';
// import path from 'path';
// import { intro, outro, spinner, confirm, isCancel } from '@clack/prompts';
// import { consola } from 'consola';
// import pc from 'picocolors';
// import { simpleGit } from 'simple-git';
//
// interface RepoStatus {
// 	name: string;
// 	path: string;
// 	ahead: number;
// 	branch: string;
// }
//
// async function getRepoStatus(repoPath: string, name: string): Promise<RepoStatus | null> {
// 	try {
// 		const git = simpleGit(repoPath);
// 		const status = await git.status();
//
// 		// We only care if we are ahead of remote
// 		if (status.ahead > 0) {
// 			return {
// 				name,
// 				path: repoPath,
// 				ahead: status.ahead,
// 				branch: status.current || 'HEAD'
// 			};
// 		}
// 		return null;
// 	} catch (e) {
// 		// invalid repo or error, skip
// 		return null;
// 	}
// }
//
// export async function pushAll(targetRoot: string) {
// 	intro(pc.cyan('🐙 Git Mass Push'));
// 	const s = spinner();
//
// 	// 1. Discovery Phase
// 	s.start('Scanning repositories for unpushed commits...');
//
// 	const pushQueue: RepoStatus[] = [];
//
// 	// Check Root
// 	const rootStatus = await getRepoStatus(targetRoot, 'ROOT (App)');
// 	if (rootStatus) pushQueue.push(rootStatus);
//
// 	// Check Layers
// 	const layersDir = path.join(targetRoot, 'layers');
// 	if (fs.existsSync(layersDir)) {
// 		const layers = fs.readdirSync(layersDir, { withFileTypes: true });
// 		for (const layer of layers) {
// 			if (layer.isDirectory()) {
// 				const layerPath = path.join(layersDir, layer.name);
// 				// quick check if it's a git repo
// 				if (fs.existsSync(path.join(layerPath, '.git'))) {
// 					const status = await getRepoStatus(layerPath, `Layer: ${layer.name}`);
// 					if (status) pushQueue.push(status);
// 				}
// 			}
// 		}
// 	}
//
// 	s.stop('Scan complete.');
//
// 	// 2. Report Phase
// 	if (pushQueue.length === 0) {
// 		consola.success('All repositories are up to date with remote.');
// 		return;
// 	}
//
// 	consola.info(pc.bold('The following repositories have unpushed commits:'));
// 	for (const item of pushQueue) {
// 		consola.log(` - ${pc.cyan(item.name)}: ${pc.yellow(item.ahead + ' commits')} on branch ${pc.green(item.branch)}`);
// 	}
//
// 	// 3. Confirmation
// 	const shouldPush = await confirm({
// 		message: `Push these ${pushQueue.length} repositories to remote?`,
// 		initialValue: true
// 	});
//
// 	if (isCancel(shouldPush) || !shouldPush) {
// 		outro('Operation cancelled.');
// 		return;
// 	}
//
// 	// 4. Execution Phase
// 	s.start('Pushing to remotes...');
// 	const results: string[] = [];
// 	const errors: string[] = [];
//
// 	for (const item of pushQueue) {
// 		try {
// 			s.message(`Pushing ${item.name}...`);
// 			const git = simpleGit(item.path);
// 			await git.push();
// 			results.push(item.name);
// 		} catch (e: any) {
// 			errors.push(`${item.name}: ${e.message}`);
// 		}
// 	}
//
// 	s.stop('Bulk Push Complete.');
//
// 	// 5. Summary
// 	if (results.length > 0) {
// 		consola.success(`Successfully pushed: ${results.join(', ')}`);
// 	}
// 	if (errors.length > 0) {
// 		consola.error('Failed to push:');
// 		errors.forEach(err => consola.error(` - ${err}`));
// 	}
//
// 	outro(pc.green('✅ Done'));
// }


import fs from 'fs';
import path from 'path';
import { intro, outro, spinner, confirm, isCancel } from '@clack/prompts';
import { logger } from '../../services/loggerService'; // Refactored: Use unified logger
import pc from 'picocolors';
import { simpleGit } from 'simple-git';

// Internal interface for this command's state
interface RepoStatus {
	name: string;
	path: string;
	ahead: number;
	branch: string;
}

async function getRepoStatus(repoPath: string, name: string): Promise<RepoStatus | null> {
	try {
		const git = simpleGit(repoPath);
		const status = await git.status();
		
		// We only care if we are ahead of remote
		if (status.ahead > 0) {
			return {
				name,
				path: repoPath,
				ahead: status.ahead,
				branch: status.current || 'HEAD'
			};
		}
		return null;
	} catch (e) {
		// invalid repo or error, skip
		return null;
	}
}

export async function pushAll(targetRoot: string) {
	intro(pc.cyan('🐙 Git Mass Push'));
	const s = spinner();
	
	// 1. Discovery Phase
	s.start('Scanning repositories for unpushed commits...');
	
	const pushQueue: RepoStatus[] = [];
	
	// Check Root
	const rootStatus = await getRepoStatus(targetRoot, 'ROOT (App)');
	if (rootStatus) pushQueue.push(rootStatus);
	
	// Check Layers
	const layersDir = path.join(targetRoot, 'layers');
	if (fs.existsSync(layersDir)) {
		const layers = fs.readdirSync(layersDir, { withFileTypes: true });
		for (const layer of layers) {
			if (layer.isDirectory()) {
				const layerPath = path.join(layersDir, layer.name);
				// quick check if it's a git repo
				if (fs.existsSync(path.join(layerPath, '.git'))) {
					const status = await getRepoStatus(layerPath, `Layer: ${layer.name}`);
					if (status) pushQueue.push(status);
				}
			}
		}
	}
	
	s.stop('Scan complete.');
	
	// 2. Report Phase
	if (pushQueue.length === 0) {
		logger.success('All repositories are up to date with remote.');
		return;
	}
	
	logger.info(pc.bold('The following repositories have unpushed commits:'));
	for (const item of pushQueue) {
		logger.log(` - ${pc.cyan(item.name)}: ${pc.yellow(item.ahead + ' commits')} on branch ${pc.green(item.branch)}`);
	}
	
	// 3. Confirmation
	const shouldPush = await confirm({
		message: `Push these ${pushQueue.length} repositories to remote?`,
		initialValue: true
	});
	
	if (isCancel(shouldPush) || !shouldPush) {
		outro('Operation cancelled.');
		return;
	}
	
	// 4. Execution Phase
	s.start('Pushing to remotes...');
	const results: string[] = [];
	const errors: string[] = [];
	
	for (const item of pushQueue) {
		try {
			s.message(`Pushing ${item.name}...`);
			const git = simpleGit(item.path);
			await git.push();
			results.push(item.name);
		} catch (e: any) {
			errors.push(`${item.name}: ${e.message}`);
		}
	}
	
	s.stop('Bulk Push Complete.');
	
	// 5. Summary
	if (results.length > 0) {
		logger.success(`Successfully pushed: ${results.join(', ')}`);
	}
	if (errors.length > 0) {
		logger.error('Failed to push:');
		errors.forEach(err => logger.error(` - ${err}`));
	}
	
	outro(pc.green('✅ Done'));
}


