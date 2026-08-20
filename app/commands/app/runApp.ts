/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/app/runApp.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 21
 * @createTime: 11:59
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
 * V1.0.0, 20260121-11:59
 * Initial creation and release of runApp.ts
 *
 * ================================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { BaseCommand } from '../baseCommand.js';
import { CommandOptions } from '../../types/index.js';
import { logger } from '../../services/loggerService.js';
import * as p from '@clack/prompts';
import pc from 'picocolors';

export class RunAppCommand extends BaseCommand {
	constructor() {
		super({
			id: 'app.run',
			domain: 'app',
			name: 'run',
			label: '🚀 Run App Script',
			description: 'Executes a package.json script using the intelligently detected package manager.'
		});
	}
	
	/**
	 * Command is only available if a package.json exists in the target directory.
	 */
	override async isEnabled(targetRoot: string): Promise<boolean> {
		const pkgPath = path.join(targetRoot, 'package.json');
		return fs.existsSync(pkgPath);
	}
	
	/**
	 * Executes the run workflow.
	 */
	async execute(targetRoot: string, options: CommandOptions, ...args: string[]): Promise<void> {
		try {
			// 1. Construct Path & Validate Existence
			const pkgPath = path.join(targetRoot, 'package.json');
			if (!fs.existsSync(pkgPath)) {
				throw new Error('package.json not found in target root.');
			}
			
			// Parse package.json
			const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
			const pkg = JSON.parse(pkgContent);
			const scripts = pkg.scripts || {};
			const scriptKeys = Object.keys(scripts);
			
			if (scriptKeys.length === 0) {
				logger.warn('No scripts found in package.json.');
				return;
			}
			
			// Support passing script as an argument (e.g., `am app run dev`) or falling back to interactive
			let scriptName = args[0] || (options.script as string);
			
			// Interactive Mode (if script name isn't provided via CLI args)
			if (!scriptName) {
				const scriptOptions = scriptKeys.map((key) => ({
					value: key,
					label: `${pc.cyan(key)} ${pc.dim(`(${scripts[key]})`)}`
				}));
				
				const selectedScript = await p.select({
					message: 'Select a script to execute:',
					options: scriptOptions,
				});
				
				if (p.isCancel(selectedScript)) {
					logger.warn('Run aborted.');
					return;
				}
				
				scriptName = selectedScript as string;
			}
			
			// 2. Validate Script Existence
			if (!scripts[scriptName]) {
				throw new Error(`Missing script: "${scriptName}"`);
			}
			
			// 3. Detect Package Manager based on lockfiles
			let pm = 'npm'; // Default
			if (fs.existsSync(path.join(targetRoot, 'bun.lockb'))) {
				pm = 'bun';
			} else if (fs.existsSync(path.join(targetRoot, 'pnpm-lock.yaml'))) {
				pm = 'pnpm';
			} else if (fs.existsSync(path.join(targetRoot, 'yarn.lock'))) {
				pm = 'yarn';
			}
			
			// 4. Construct Command
			const command = `${pm} run ${scriptName}`;
			logger.info(`Executing: ${pc.green(command)}`);
			
			// 5. Execute
			try {
				// We use stdio: 'inherit' to preserve terminal colors and interactivity (like Nuxt's dev server)
				execSync(command, { stdio: 'inherit', cwd: targetRoot });
			} catch (execError: unknown) {
				// Catching the execution error to throw the specifically requested formatted error message
				throw new Error(`Script "${scriptName}" failed execution.`);
			}
			
		} catch (error) {
			logger.error('Failed to execute run command', error as Error);
		}
	}
}