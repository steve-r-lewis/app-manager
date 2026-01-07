/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/docs/runDocs.ts
 * @version:    1.1.1
 * @createDate: 2025 Dec 17
 * @createTime: 10:47
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * This module orchestrates documentation workflows, specifically designed for
 * Vitepress integration. It serves a dual purpose: managing the internal
 * documentation for the App Manager tool itself and providing an interface to
 * build, serve, or preview documentation for the target Nuxt monorepo.
 *
 * Key Functionality:
 * Context Awareness:
 * It distinguishes between the "Tool Root" (this CLI) and the "Target Root"
 * (the user's project). It scans the target's package.json to verify if
 * 'vitepress' is installed before offering project-specific options.
 *
 * Package Manager Abstraction:
 * It independently detects the package manager (pnpm, Bun, Yarn, or npm)
 * for both the tool and the target project. This ensures that commands like
 * 'vitepress dev' are executed using the correct binary context (e.g.,
 * using 'npx' fallback where appropriate).
 *
 * Lifecycle Management:
 * Provides interactive menu options for the standard Vitepress workflow:
 * - Dev: Starts the hot-reloading development server.
 * - Build: Generates the static production site.
 * - Preview: Serves the built production site locally.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.1.1, 20251226-1912
 * Refactored logic.
 *
 * V1.1.0, 20251219-21:08
 * - Added support for vitepress docs in target project in addition to tool docs.
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
 * Helper: Detect package manager (npm/pnpm/yarn/bun)
 */
function detectPM(root: string) {
	if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(root, 'bun.lockb'))) return 'bun';
	return 'npm';
}

/**
 * Helper: Run a command interactively
 */
async function runScript(cmd: string, args: string[], cwd: string) {
	consola.info(pc.blue(`> Executing in ${cwd}: ${cmd} ${args.join(' ')}`));
	
	return new Promise<void>((resolve, reject) => {
		const child = spawn(cmd, args, {
			cwd,
			stdio: 'inherit', // Important: lets user interact/see output
			shell: true
		});
		
		child.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Process exited with code ${code}`));
		});
		
		child.on('error', (err) => reject(err));
	});
}

export async function runDocs(targetRoot: string, toolRoot: string) {
	// 1. Analyze Project Capabilities
	const targetPkgPath = path.join(targetRoot, 'package.json');
	let hasProjectDocs = false;
	let projectPM = 'npm';
	
	if (fs.existsSync(targetPkgPath)) {
		try {
			const pkg = JSON.parse(fs.readFileSync(targetPkgPath, 'utf-8'));
			const deps = { ...pkg.dependencies, ...pkg.devDependencies };
			if (deps.vitepress) {
				hasProjectDocs = true;
				projectPM = detectPM(targetRoot);
			}
		} catch (e) { /* ignore invalid json */ }
	}
	
	const toolPM = detectPM(toolRoot);
	
	// 2. Build Menu
	const options = [
		{
			value: 'tool:dev',
			label: '📘 Start App Manager Docs',
			hint: `View this tool's documentation`
		},
	];
	
	if (hasProjectDocs) {
		options.push({
			value: 'project:dev',
			label: '🚀 Start Project Docs',
			hint: 'Run vitepress dev in target'
		});
		options.push({
			value: 'project:build',
			label: '🔨 Build Project Docs',
			hint: 'Run vitepress build'
		});
		options.push({
			value: 'project:preview',
			label: '👀 Preview Project Docs',
			hint: 'View production build'
		});
	}
	
	options.push({ value: 'back', label: 'Go Back' });
	
	// 3. User Selection
	const action = await select({
		message: 'Documentation Actions:',
		options
	});
	
	if (isCancel(action) || action === 'back') return;
	
	try {
		// A. App Manager Docs (Tool Root)
		if (action === 'tool:dev') {
			// Assumes 'docs:dev' exists in your app-manager package.json, or fallback to npx
			await runScript(toolPM === 'npm' ? 'npx' : toolPM, ['vitepress', 'dev'], toolRoot);
		}
		
		// B. Project Docs (Target Root)
		else if (action === 'project:dev') {
			await runScript(projectPM === 'npm' ? 'npx' : projectPM, ['vitepress', 'dev'], targetRoot);
		}
		else if (action === 'project:build') {
			await runScript(projectPM === 'npm' ? 'npx' : projectPM, ['vitepress', 'build'], targetRoot);
		}
		else if (action === 'project:preview') {
			await runScript(projectPM === 'npm' ? 'npx' : projectPM, ['vitepress', 'preview'], targetRoot);
		}
		
	} catch (err: any) {
		consola.error(`Docs Command Failed: ${err.message}`);
	}
}