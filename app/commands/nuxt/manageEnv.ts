/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/nuxt/manageEnv.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:39
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
 * V1.0.0, 20251217-01:39
 * Initial creation and release of manageEnv.ts
 *
 * ================================================================================
 */

import { select, isCancel, spinner, confirm } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// --- Configuration ---
// Build Artifacts (Recursive Clean)
const CLEAN_TARGETS = new Set(['.nuxt', '.output', 'dist', 'coverage', '.cache']);

// Dependency Artifacts (Prune)
const LOCK_FILES = ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lockb'];

/**
 * Recursively finds directories matching specific names.
 * Optimized to skip traversing into a match (e.g., if deleting node_modules, don't scan inside it).
 */
function findRecursively(dir: string, targetNames: Set<string>, results: string[] = []) {
	if (!fs.existsSync(dir)) return results;
	
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		
		for (const entry of entries) {
			if (entry.isDirectory()) {
				const fullPath = path.join(dir, entry.name);
				
				// 1. Found a target? Add it and STOP recursing down this branch (we'll delete it all)
				if (targetNames.has(entry.name)) {
					results.push(fullPath);
				}
					// 2. Special Case: node_modules
					// If we are cleaning .cache, we MUST check inside node_modules/.cache
				// But we don't want to scan the entire 1GB node_modules tree.
				else if (entry.name === 'node_modules') {
					if (targetNames.has('.cache')) {
						const cachePath = path.join(fullPath, '.cache');
						if (fs.existsSync(cachePath)) results.push(cachePath);
					}
					// Do not recurse further into node_modules
				}
				// 3. Normal Directory? Recurse.
				else {
					findRecursively(fullPath, targetNames, results);
				}
			}
		}
	} catch (e) {
		// Ignore permission/access errors
	}
	return results;
}

/**
 * Detects the package manager used in the target project.
 */
function detectPackageManager(targetRoot: string): string {
	if (fs.existsSync(path.join(targetRoot, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(targetRoot, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(targetRoot, 'bun.lockb'))) return 'bun';
	return 'npm';
}

/**
 * Deletes a list of paths.
 */
async function deletePaths(paths: string[], label: string) {
	if (paths.length === 0) return;
	
	const s = spinner();
	s.start(label);
	
	let count = 0;
	for (const fullPath of paths) {
		try {
			if (fs.existsSync(fullPath)) {
				fs.rmSync(fullPath, { recursive: true, force: true });
				count++;
			}
		} catch (e: any) {
			consola.warn(`Failed to delete ${path.basename(fullPath)}: ${e.message}`);
		}
	}
	s.stop(`Removed ${count} items.`);
}

/**
 * Runs the install command.
 */
async function runInstall(targetRoot: string, pm: string) {
	consola.info(pc.dim(`> Running ${pm} install...`));
	
	return new Promise<void>((resolve, reject) => {
		const child = spawn(pm, ['install'], {
			cwd: targetRoot,
			stdio: 'inherit',
			shell: true
		});
		
		child.on('close', (code) => {
			if (code === 0) {
				consola.success('Dependencies installed.');
				resolve();
			} else {
				reject(new Error(`Install failed with code ${code}`));
			}
		});
		
		child.on('error', (err) => reject(err));
	});
}

export async function manageEnv(targetRoot: string) {
	// Detect PM *before* we potentially delete the lockfile
	const pm = detectPackageManager(targetRoot);
	
	const action = await select({
		message: `Environment Management (${pm}):`,
		options: [
			{ value: 'clean', label: '🧹 Clean Artifacts', hint: 'Recursive: .nuxt, .output, .cache' },
			{ value: 'prune', label: '🗑️  Prune Dependencies', hint: 'Recursive: node_modules + lockfiles' },
			{ value: 'reset', label: '🧨 Hard Reset', hint: 'Prune + Clean + Reinstall' },
			{ value: 'install', label: '📥 Install Dependencies', hint: `${pm} install` },
			{ value: 'back', label: '🔙 Go Back' }
		]
	});
	
	if (isCancel(action) || action === 'back') return;
	
	// Safety Check for Destructive Actions
	if (['prune', 'reset'].includes(action as string)) {
		const sure = await confirm({
			message: 'This will delete all node_modules and lockfiles. Are you sure?',
			initialValue: false
		});
		if (isCancel(sure) || !sure) return;
	}
	
	try {
		// 1. Clean Build Artifacts (Recursive)
		if (action === 'clean' || action === 'reset') {
			const targets = findRecursively(targetRoot, CLEAN_TARGETS);
			if (targets.length > 0) {
				await deletePaths(targets, 'Cleaning build artifacts recursively...');
			} else {
				consola.info('No build artifacts found.');
			}
		}
		
		// 2. Prune Dependencies (Recursive node_modules + Root Lockfiles)
		if (action === 'prune' || action === 'reset') {
			// A. Recursive node_modules
			const modules = findRecursively(targetRoot, new Set(['node_modules']));
			
			// B. Root Lockfiles
			const locks = LOCK_FILES.map(f => path.join(targetRoot, f)).filter(f => fs.existsSync(f));
			
			const allTargets = [...modules, ...locks];
			
			if (allTargets.length > 0) {
				await deletePaths(allTargets, 'Pruning dependencies & lockfiles...');
			} else {
				consola.info('No dependencies found.');
			}
		}
		
		// 3. Reinstall
		if (action === 'install' || action === 'reset') {
			await runInstall(targetRoot, pm);
		}
		
		consola.success(pc.green('Environment operation completed.'));
		
	} catch (err: any) {
		consola.error(pc.red(`Operation Failed: ${err.message}`));
	}
}