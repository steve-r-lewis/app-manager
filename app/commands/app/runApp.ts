/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/app/runApp.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:42
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
 * V1.0.0, 20251217-10:42
 * Initial creation and release of runApp.ts
 *
 * ================================================================================
 */

import { select, isCancel } from '@clack/prompts';
import { spawn } from 'child_process';
import { consola } from 'consola';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';

/**
 * Detects the package manager used in the target project.
 * Defaults to 'npm' if no lockfile is found.
 */
function detectPackageManager(targetRoot: string): string {
	if (fs.existsSync(path.join(targetRoot, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(targetRoot, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(targetRoot, 'bun.lockb'))) return 'bun';
	return 'npm';
}

/**
 * Executes a shell command and streams output to stdio.
 * Logs the attempt via consola (which is captured by logger.service).
 */
async function runShell(command: string, args: string[]) {
	const fullCmd = `${command} ${args.join(' ')}`;
	consola.info(pc.dim(`> Executing: ${fullCmd}`));
	
	return new Promise<void>((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: 'inherit',
			shell: true
		});
		
		child.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command failed with Exit Code: ${code}`));
			}
		});
		
		child.on('error', (err) => {
			reject(err);
		});
	});
}

export async function runApp(targetRoot: string) {
	// 1. Locate and Parse package.json
	const pkgPath = path.join(targetRoot, 'package.json');
	
	if (!fs.existsSync(pkgPath)) {
		consola.error(pc.red(`No package.json found in ${targetRoot}`));
		return;
	}
	
	let scripts: Record<string, string> = {};
	try {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		scripts = pkg.scripts || {};
	} catch (error) {
		consola.error(pc.red('Failed to parse package.json'), error);
		return;
	}
	
	if (Object.keys(scripts).length === 0) {
		consola.warn(pc.yellow('No scripts found in package.json'));
		return;
	}
	
	// 2. Detect Package Manager (npm, pnpm, yarn, etc.)
	const pm = detectPackageManager(targetRoot);
	consola.info(pc.dim(`Detected Package Manager: ${pm}`));
	
	// 3. Build Menu Options
	const options = Object.entries(scripts).map(([key, script]) => ({
		value: key,
		label: key,
		hint: pc.dim(script) // Show the actual command as a hint
	}));
	
	// Add explicit Back option
	options.push({ value: 'back', label: 'Go Back', hint: '' });
	
	// 4. Prompt User
	const selectedScript = await select({
		message: `Select a script to run (${pm}):`,
		options: options,
		initialValue: 'dev' // Common default, falls back gracefully if missing
	});
	
	if (isCancel(selectedScript) || selectedScript === 'back') return;
	
	// 5. Execute
	try {
		// Example: pnpm run dev
		await runShell(pm, ['run', selectedScript as string]);
		consola.success(pc.green(`Script '${selectedScript}' completed successfully.`));
	} catch (err: any) {
		consola.error(pc.red(`Script execution failed: ${err.message}`));
	}
}