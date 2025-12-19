/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/quality/runQuality.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:40
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
 * V1.0.0, 20251217-10:40
 * Initial creation and release of runQuality.ts
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
 * Executes a shell command in the target directory.
 */
async function runShell(command: string, args: string[], cwd: string) {
	const fullCmd = `${command} ${args.join(' ')}`;
	consola.info(pc.dim(`> Executing: ${fullCmd}`));
	
	return new Promise<void>((resolve, reject) => {
		const child = spawn(command, args, {
			cwd,
			stdio: 'inherit',
			shell: true
		});
		
		child.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Exit Code: ${code}`));
		});
		
		child.on('error', (err) => reject(err));
	});
}

export async function runQuality(targetRoot: string) {
	const pkgPath = path.join(targetRoot, 'package.json');
	if (!fs.existsSync(pkgPath)) {
		consola.error("No package.json found.");
		return;
	}
	
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
	const scripts = pkg.scripts || {};
	const deps = { ...pkg.dependencies, ...pkg.devDependencies };
	const pm = detectPackageManager(targetRoot);
	const runner = pm === 'npm' ? 'npx' : `${pm} exec`; // fallback runner
	
	// --- Build Menu Options Dynamically ---
	const options = [];
	
	// 1. Linting
	if (scripts.lint) {
		options.push({ value: 'script:lint', label: 'Lint Code', hint: `run lint` });
		options.push({ value: 'script:lint:fix', label: 'Lint & Fix', hint: `run lint --fix` });
	} else if (deps.eslint) {
		options.push({ value: 'raw:lint', label: 'Lint Code', hint: 'eslint .' });
		options.push({ value: 'raw:lint:fix', label: 'Lint & Fix', hint: 'eslint . --fix' });
	}
	
	// 2. Typechecking
	if (scripts.typecheck) {
		options.push({ value: 'script:typecheck', label: 'Typecheck', hint: `run typecheck` });
	} else if (deps['vue-tsc'] || deps.nuxt) {
		options.push({ value: 'raw:typecheck', label: 'Typecheck', hint: 'nuxi typecheck' });
	}
	
	// 3. Testing
	if (scripts.test) {
		options.push({ value: 'script:test', label: 'Run Tests', hint: `run test` });
		options.push({ value: 'script:test:watch', label: 'Watch Tests', hint: `run test (watch)` });
		options.push({ value: 'script:coverage', label: 'Test Coverage', hint: `run test --coverage` });
	} else if (deps.vitest) {
		options.push({ value: 'raw:test', label: 'Run Tests', hint: 'vitest run' });
		options.push({ value: 'raw:test:watch', label: 'Watch Tests', hint: 'vitest' });
		options.push({ value: 'raw:coverage', label: 'Test Coverage', hint: 'vitest run --coverage' });
	}
	
	options.push({ value: 'back', label: 'Go Back' });
	
	if (options.length === 1) {
		consola.warn("No quality tools (ESLint, Vitest, TypeScript) detected in package.json.");
		return;
	}
	
	// --- Interactive Selection ---
	const action = await select({
		message: 'Select Quality Check:',
		options
	});
	
	if (isCancel(action) || action === 'back') return;
	
	// --- Execution ---
	try {
		const act = action as string;
		const [type, task, sub] = act.split(':'); // e.g. script:lint:fix
		
		// A. Script Runner (pnpm run ...)
		if (type === 'script') {
			const scriptName = task;
			const args = ['run', scriptName];
			
			// Append flags for variants
			// Use '--' to ensure flags are passed to the script, not npm/pnpm itself
			if (sub === 'fix') args.push('--', '--fix');
			if (sub === 'coverage') args.push('--', '--coverage');
			
			// Watch is usually implicit in the script or interactive shell
			if (sub === 'watch') {
				// No extra args needed if the script handles it,
				// or user inherits stdio
			}
			
			await runShell(pm, args, targetRoot);
		}
		
		// B. Raw Runner (npx/pnpm exec ...)
		else if (type === 'raw') {
			if (task === 'lint') {
				const args = ['eslint', '.', '--ext', '.vue,.js,.jsx,.ts,.tsx'];
				if (sub === 'fix') args.push('--fix');
				await runShell(runner, args, targetRoot);
			}
			if (task === 'typecheck') {
				await runShell(runner, ['nuxi', 'typecheck'], targetRoot);
			}
			if (task === 'test') {
				if (sub === 'watch') await runShell(runner, ['vitest'], targetRoot);
				else if (sub === 'coverage') await runShell(runner, ['vitest', 'run', '--coverage'], targetRoot);
				else await runShell(runner, ['vitest', 'run'], targetRoot);
			}
		}
		
		consola.success('Check complete.');
	} catch (err: any) {
		consola.error(pc.red(`Quality Check Failed: ${err.message}`));
	}
}