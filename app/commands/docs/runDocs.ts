/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/docs/runDocs.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:47
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
 * V1.0.0, 20251217-10:47
 * Initial creation and release of runDocs.ts
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
 */
function detectPackageManager(targetRoot: string): string {
	if (fs.existsSync(path.join(targetRoot, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(targetRoot, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(targetRoot, 'bun.lockb'))) return 'bun';
	return 'npm';
}

/**
 * Executes a shell command and streams output.
 */
async function runShell(command: string, args: string[], cwd: string) {
	const fullCmd = `${command} ${args.join(' ')}`;
	consola.info(pc.dim(`> Executing: ${fullCmd}`));
	
	return new Promise<void>((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: 'inherit',
			shell: true,
			cwd
		});
		
		child.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Exit Code: ${code}`));
		});
		
		child.on('error', (err) => reject(err));
	});
}

export async function runDocs(targetRoot: string) {
	const pkgPath = path.join(targetRoot, 'package.json');
	
	if (!fs.existsSync(pkgPath)) {
		consola.error(pc.red(`No package.json found in ${targetRoot}`));
		return;
	}
	
	let pkg: any = {};
	try {
		pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
	} catch (error) {
		consola.error(pc.red('Failed to parse package.json'));
		return;
	}
	
	// 1. Validation: Is Vitepress installed?
	const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
	if (!allDeps['vitepress']) {
		consola.warn(pc.yellow('⚠️  Vitepress is not listed in dependencies.'));
		const confirm = await select({
			message: 'Continue anyway?',
			options: [
				{ value: 'no', label: 'No, abort' },
				{ value: 'yes', label: 'Yes, try running commands' }
			]
		});
		if (isCancel(confirm) || confirm === 'no') return;
	}
	
	// 2. Discovery: Find existing scripts that use 'vitepress'
	const scripts = pkg.scripts || {};
	const docScripts = Object.entries(scripts).filter(([_, cmd]) =>
		(cmd as string).includes('vitepress')
	);
	
	const pm = detectPackageManager(targetRoot);
	let options = [];
	
	// Scenario A: Custom Scripts Found
	if (docScripts.length > 0) {
		options = docScripts.map(([key, script]) => ({
			value: `script:${key}`,
			label: `Run "${key}"`,
			hint: pc.dim(script as string)
		}));
		consola.success(pc.green(`Found ${docScripts.length} Vitepress scripts.`));
	} else {
		// Scenario B: No Scripts, use Raw Commands
		options = [
			{ value: 'raw:dev', label: 'Start Dev Server', hint: 'vitepress dev' },
			{ value: 'raw:build', label: 'Build Site', hint: 'vitepress build' },
			{ value: 'raw:preview', label: 'Preview Build', hint: 'vitepress preview' }
		];
	}
	
	options.push({ value: 'back', label: 'Go Back', hint: '' });
	
	// 3. Selection
	const action = await select({
		message: 'Select Documentation Task:',
		options
	});
	
	if (isCancel(action) || action === 'back') return;
	
	// 4. Execution
	try {
		const act = action as string;
		
		// If running a package.json script (e.g. "pnpm run docs:dev")
		if (act.startsWith('script:')) {
			const scriptName = act.replace('script:', '');
			await runShell(pm, ['run', scriptName], targetRoot);
		}
		// If running raw binary (e.g. "pnpm exec vitepress dev")
		else if (act.startsWith('raw:')) {
			const command = act.replace('raw:', '');
			// use 'exec' (pnpm) or 'npx' (npm) or 'yarn' logic
			// For simplicity/compatibility, 'npx' or package manager 'exec' pattern
			// npm/pnpm/yarn all support 'exec' or 'x' usually, but safe bet is:
			const runner = pm === 'npm' ? 'npx' : `${pm} exec`;
			// Note: spawn requires command and args split.
			// 'pnpm exec' is two words. We handle this by splitting or using shell=true.
			// Let's use the package manager's 'exec' capability if possible, or npx fallback.
			
			if (pm === 'npm') {
				await runShell('npx', ['vitepress', command], targetRoot);
			} else {
				// pnpm exec vitepress dev
				await runShell(pm, ['exec', 'vitepress', command], targetRoot);
			}
		}
		
		consola.success(pc.green('Docs command completed successfully.'));
	} catch (err: any) {
		consola.error(pc.red(`Docs execution failed: ${err.message}`));
	}
}