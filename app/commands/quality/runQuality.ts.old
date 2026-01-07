/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/quality/runQuality.ts
 * @version:    1.0.1
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
 * V1.0.1, 20251226-1912
 * Refactored logic.
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

function detectPM(root: string) {
	if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(root, 'bun.lockb'))) return 'bun';
	return 'npm';
}

async function runScript(cmd: string, args: string[], cwd: string) {
	consola.info(pc.blue(`> Executing in ${cwd}: ${cmd} ${args.join(' ')}`));
	
	return new Promise<void>((resolve, reject) => {
		const child = spawn(cmd, args, {
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

export async function runQuality(targetRoot: string, toolRoot: string) {
	// 1. Select Scope
	const scope = await select({
		message: 'Select Quality Scope:',
		options: [
			{ value: 'target', label: '🎯 Target Project', hint: path.basename(targetRoot) },
			{ value: 'tool', label: '🛠️  App Manager', hint: 'Run tests for this CLI tool' },
			{ value: 'back', label: 'Go Back' }
		]
	});
	
	if (isCancel(scope) || scope === 'back') return;
	
	const activeRoot = scope === 'target' ? targetRoot : toolRoot;
	const pm = detectPM(activeRoot);
	const pkgPath = path.join(activeRoot, 'package.json');
	
	// 2. Analyze Capabilities
	let scripts: Record<string, string> = {};
	let hasVitest = false;
	
	if (fs.existsSync(pkgPath)) {
		try {
			const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
			scripts = pkg.scripts || {};
			const deps = { ...pkg.dependencies, ...pkg.devDependencies };
			if (deps.vitest) hasVitest = true;
		} catch (e) { /* ignore */ }
	}
	
	// 3. Build Menu based on available tools
	const options = [];
	
	// LINT
	if (scripts.lint) options.push({ value: 'lint', label: 'Lint', hint: 'npm run lint' });
	
	// TEST (Standard)
	if (scripts.test) {
		options.push({ value: 'test', label: 'Run Tests', hint: 'npm run test' });
	} else if (hasVitest) {
		options.push({ value: 'vitest', label: 'Run Tests (Direct)', hint: 'npx vitest run' });
	}
	
	// TEST (UI) - The new feature!
	if (hasVitest) {
		options.push({ value: 'vitest:ui', label: '🧪 Test UI', hint: 'Open Vitest in Browser' });
	}
	
	// TYPECHECK
	if (scripts.typecheck) options.push({ value: 'typecheck', label: 'Typecheck', hint: 'npm run typecheck' });
	
	options.push({ value: 'back', label: 'Go Back' });
	
	if (options.length === 1) {
		consola.warn("No quality scripts (lint, test, typecheck) found in package.json.");
		return;
	}
	
	// 4. Execute
	const action = await select({
		message: `Quality Actions (${scope === 'target' ? 'Target' : 'Tool'}):`,
		options
	});
	
	if (isCancel(action) || action === 'back') return;
	
	try {
		if (action === 'lint') await runScript(pm, ['run', 'lint'], activeRoot);
		if (action === 'typecheck') await runScript(pm, ['run', 'typecheck'], activeRoot);
		
		if (action === 'test') {
			await runScript(pm, ['run', 'test'], activeRoot);
		}
		
		if (action === 'vitest') {
			const runner = pm === 'npm' ? 'npx' : pm;
			await runScript(runner, ['vitest', 'run'], activeRoot);
		}
		
		if (action === 'vitest:ui') {
			const runner = pm === 'npm' ? 'npx' : pm;
			// --ui opens the dashboard
			await runScript(runner, ['vitest', '--ui'], activeRoot);
		}
		
	} catch (e: any) {
		consola.error(`Execution failed: ${e.message}`);
	}
}