/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/app/setupApp.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 26
 * @createTime: 22:41
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * "Zero-to-Hero" Provisioning Command.
 * Orchestrates the setup of a fresh development environment:
 * 1. .env file creation (from example).
 * 2. Dependency installation.
 * 3. Git Submodule initialization.
 * 4. VS Code Workspace settings.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251226-22:41
 * Initial creation and release of setupApp.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import path from 'path';
import { intro, outro, confirm, spinner, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import { processService } from '../../services/processService';
import { syncRepos } from '../git/syncRepos';

export async function setupApp(targetRoot: string) {
	intro(pc.cyan('🚀 App Setup (Zero-to-Hero)'));
	
	const s = spinner();
	
	// 1. Environment Variables
	const envPath = path.join(targetRoot, '.env');
	const examplePath = path.join(targetRoot, '.env.example');
	
	if (!fs.existsSync(envPath)) {
		if (fs.existsSync(examplePath)) {
			const createEnv = await confirm({
				message: '.env file is missing. Create from .env.example?',
				initialValue: true
			});
			
			if (isCancel(createEnv)) return;
			
			if (createEnv) {
				fs.copyFileSync(examplePath, envPath);
				consola.success('Created .env file.');
				consola.warn(pc.yellow('⚠️  ACTION REQUIRED: Please update .env with your real API keys!'));
			}
		} else {
			consola.warn('No .env.example found. Skipping env setup.');
		}
	} else {
		consola.info('.env file already exists.');
	}
	
	// 2. Install Dependencies
	const installDeps = await confirm({
		message: 'Install dependencies now?',
		initialValue: true
	});
	
	if (isCancel(installDeps)) return;
	
	if (installDeps) {
		const pm = processService.detectPackageManager(targetRoot);
		s.start(`Installing dependencies using ${pm}...`);
		
		try {
			await processService.run(pm, ['install'], targetRoot, { silent: true });
			s.stop('Dependencies installed.');
		} catch (error) {
			s.stop('Installation failed.');
			consola.error(error);
			return; // Stop flow on install failure
		}
	}
	
	// 3. Git Synchronization
	const doSync = await confirm({
		message: 'Initialize & Sync Git Submodules?',
		initialValue: true
	});
	
	if (isCancel(doSync)) return;
	
	if (doSync) {
		await syncRepos(targetRoot);
	}
	
	// 4. VS Code Configuration (Parity with provisionProject.ps1)
	const vscodeDir = path.join(targetRoot, '.vscode');
	const settingsPath = path.join(vscodeDir, 'settings.json');
	
	// Only prompt if it doesn't exist to avoid overwriting user prefs
	if (!fs.existsSync(settingsPath)) {
		const doVscode = await confirm({
			message: 'Generate recommended VS Code settings?',
			initialValue: true
		});
		
		if (!isCancel(doVscode) && doVscode) {
			if (!fs.existsSync(vscodeDir)) fs.mkdirSync(vscodeDir);
			
			const settings = {
				"editor.formatOnSave": true,
				"editor.codeActionsOnSave": {
					"source.fixAll.eslint": "explicit"
				},
				"files.associations": {
					"*.css": "postcss"
				},
				"typescript.tsdk": "node_modules/typescript/lib"
			};
			
			fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
			consola.success('VS Code settings generated.');
		}
	}
	
	outro(pc.green('✅ Project Provisioning Complete!'));
}