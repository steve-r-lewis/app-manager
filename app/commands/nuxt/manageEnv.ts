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

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       ~/app/commands/nuxt/manageEnv.ts
 * ================================================================================
 */

import { select, multiselect, isCancel, confirm, intro, outro, spinner } from '@clack/prompts';
import { consola } from 'consola';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

// FIX: Add targetRoot parameter
function detectPackageManager(targetRoot: string): string {
	if (fs.existsSync(path.join(targetRoot, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(targetRoot, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(targetRoot, 'bun.lockb'))) return 'bun';
	return 'npm';
}

// FIX: Add targetRoot parameter
export async function manageEnv(targetRoot: string) {
	const s = spinner();
	
	// 1. Select Action
	const action = await select({
		message: 'Manage Environment:',
		options: [
			{ value: 'clean', label: 'Clean Artifacts', hint: 'Delete .nuxt, node_modules, dist' },
			{ value: 'reinstall', label: 'Reinstall Dependencies', hint: 'Clean + Install' },
			{ value: 'back', label: 'Go Back' }
		]
	});
	
	if (isCancel(action) || action === 'back') return;
	
	// 2. Define targets based on targetRoot
	const targets = [
		'node_modules',
		'.nuxt',
		'.output',
		'dist',
		'.cache'
	];
	
	if (action === 'clean' || action === 'reinstall') {
		const selected = await multiselect({
			message: 'Select directories to delete:',
			options: targets.map(t => ({ value: t, label: t })),
			required: false
		});
		
		if (isCancel(selected)) return;
		
		const dirsToDelete = selected as string[];
		
		if (dirsToDelete.length === 0) {
			consola.warn('No directories selected.');
			return;
		}
		
		const shouldContinue = await confirm({ message: `Delete ${dirsToDelete.join(', ')}?` });
		if (!shouldContinue) return;
		
		s.start('Cleaning directories...');
		
		for (const dir of dirsToDelete) {
			// FIX: Use targetRoot instead of process.cwd()
			const fullPath = path.join(targetRoot, dir);
			if (fs.existsSync(fullPath)) {
				fs.rmSync(fullPath, { recursive: true, force: true });
			}
		}
		
		s.stop('Cleanup complete.');
	}
	
	if (action === 'reinstall') {
		// FIX: Pass targetRoot
		const pm = detectPackageManager(targetRoot);
		const { spawn } = await import('child_process');
		
		consola.info(`Running ${pm} install...`);
		
		const child = spawn(pm, ['install'], {
			cwd: targetRoot, // FIX: Run in targetRoot
			stdio: 'inherit',
			shell: true
		});
		
		await new Promise<void>((resolve) => {
			child.on('close', () => resolve());
		});
		
		outro('Dependencies reinstalled.');
	}
}