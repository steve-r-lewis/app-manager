/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/app.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 17
 * @createTime: 01:25
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Main application router and menu system.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20251219-2045
 * Updated utility commands to accept targetRoot argument.
 *
 * V1.0.0, 20251217-01:25
 * Initial creation and release of app.ts
 *
 * ================================================================================
 */

import { intro, outro, select, multiselect, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import { consola } from 'consola';

// Import Logger Service
import { logger } from './services/logger.service.js';

// App Commands
import { runApp } from './commands/app/runApp';

// Docs Commands
import { runDocs } from './commands/docs/runDocs';

// Git Commands
import { syncRepos } from './commands/git/syncRepos';
import { manageCommits } from './commands/git/manageCommits';
import { pushToRemote } from './commands/git/pushToRemote';
import { initLayers } from './commands/git/initLayers';
import { addSubmodules } from './commands/git/addSubmodules';
import { deleteRemoteRepos } from './commands/git/deleteRemoteRepos';

// Nuxt Commands
import { createLayer } from './commands/nuxt/createLayer';
import { extractDocs } from './commands/nuxt/extractDocs';
import { manageEnv } from './commands/nuxt/manageEnv';

// Quality Commands
import { runQuality } from './commands/quality/runQuality';

// Utils Commands
import { autoVersion } from './commands/utils/autoVersion';
import { validateHeaders } from './commands/utils/validateHeaders';
import { autoDoc } from './commands/utils/autoDoc';
import { addContributor } from './commands/utils/addContributor';

// App Utils Commands
import { cleanLogs } from './commands/utils/cleanLogs';

export async function main(targetRoot: string, toolRoot: string) {
	// 1. Initial Clear
	if (!process.env.DEBUG) console.clear();
	
	intro(pc.inverse(pc.cyan(' Nuxt 4 Monorepo Manager ')));
	
	// 2. Session Configuration
	const sessionConfig = await multiselect({
		message: 'Session Configuration:',
		options: [
			{ value: 'debug', label: 'Enable Debug Mode', hint: 'Show verbose logs & API outputs' },
			{ value: 'logging', label: 'Enable File Logging', hint: 'Write transcripts to logs/' }
		],
		required: false
	});
	
	if (isCancel(sessionConfig)) {
		outro('Operation Cancelled');
		return;
	}
	
	// 3. Apply Settings & Initialize Logger
	const config = sessionConfig as string[];
	
	if (config.includes('debug')) {
		process.env.DEBUG = 'true';
		consola.info(pc.blue('ℹ Debug Mode Enabled'));
	}
	
	if (config.includes('logging')) {
		process.env.LOG_TO_FILE = 'true';
		// Only enable the VERBOSE session log if requested.
		// The Error log is already active from appManager.ts (index.ts)
		consola.info(pc.blue('ℹ File Logging Enabled'));
		logger.enableSessionLogging();
	}
	
	if (process.env.DEBUG) {
		consola.info(pc.dim(`Context: Running in ${targetRoot}`));
	}
	
	// 4. Main Domain Loop
	while (true) {
		if (!process.env.DEBUG) console.clear();
		
		const domain = await select({
			message: 'Select Domain:',
			options: [
				{ value: 'app', label: 'App', hint: 'Dev, Build, Generate' },
				{ value: 'nuxt', label: 'Nuxt Operations', hint: 'Layers, Docs, Env' },
				{ value: 'git', label: 'Git Operations', hint: 'Sync, Commits' },
				{ value: 'docs', label: 'Documentation', hint: 'Vitepress' },
				{ value: 'utils', label: 'Utilities', hint: 'Validation, Auto-Doc, Auto-Version' },
				{ value: 'quality', label: 'Quality', hint: 'Lint, Test, Typecheck' },
				{ value: 'clean', label: 'Clean Logs', hint: 'Remove all fixtures and logs from appManager' },
				{ value: 'exit', label: 'Exit' }
			]
		});
		
		if (isCancel(domain) || domain === 'exit') {
			outro('Goodbye!');
			return;
		}
		
		if (domain === 'app') await runApp(targetRoot);
		
		if (domain === 'nuxt') {
			const action = await select({
				message: 'Nuxt Action:',
				options: [
					{ value: 'env', label: 'Manage Env', hint: 'Clean, Reset' },
					{ value: 'create', label: 'Create Layer', hint: 'Scaffold new' },
					{ value: 'docs', label: 'Extract Report', hint: 'Generate Markdown' },
					{ value: 'back', label: 'Go Back' }
				]
			});
			
			if (isCancel(action) || action === 'back') continue;
			if (action === 'env') await manageEnv(targetRoot);
			if (action === 'create') await createLayer(targetRoot);
			if (action === 'docs') await extractDocs(targetRoot);
		}
		
		if (domain === 'git') {
			const action = await select({
				message: 'Git Action:',
				options: [
					{ value: 'commit', label: 'Smart Commit (AI)', hint: 'Stage & Commit' },
					{ value: 'push', label: 'Push to Remote', hint: 'Select Remotes' },
					{ value: 'sync', label: 'Sync Repos', hint: 'Pull & Update Submodules' },
					{ value: 'init', label: 'Init Layers', hint: 'Initialize new git repos' },
					{ value: 'submodules', label: 'Add Submodules', hint: 'Add layers to Root' },
					{ value: 'delete', label: 'Delete Remote Repo', hint: '⚠️ Destructive' },
					{ value: 'back', label: 'Go Back' }
				]
			});
			if (isCancel(action) || action === 'back') continue;
			
			if (action === 'commit') await manageCommits(targetRoot);
			if (action === 'push') await pushToRemote(targetRoot);
			if (action === 'sync') await syncRepos(targetRoot);
			if (action === 'init') await initLayers(targetRoot);
			if (action === 'Submodules') await addSubmodules(targetRoot);
			if (action === 'delete') await deleteRemoteRepos();
		}
		
		//if (domain === 'quality') await runQuality(targetRoot);
		if (domain === 'quality') await runQuality(targetRoot, toolRoot);
		
		if (domain === 'docs') await runDocs(targetRoot, toolRoot);
		
		if (domain === 'utils') {
			const action = await select({
				message: 'Utility Action:',
				options: [
					{ value: 'headers', label: 'Validate Headers' },
					{ value: 'version', label: 'Auto Version' },
					{ value: 'doc', label: 'Auto Document Code' },
					{ value: 'contributor+', label: '👥  Add Contributor', hint: 'Add author to package.json & headers' },
					{ value: 'back', label: 'Go Back' }
				]
			});
			if (isCancel(action) || action === 'back') continue;
			
			// UPDATED: Pass targetRoot to all utility functions
			if (action === 'headers') await validateHeaders(targetRoot);
			if (action === 'version') await autoVersion(targetRoot);
			if (action === 'doc') await autoDoc(targetRoot);
			if (action === 'contributor+') await addContributor(targetRoot);
		}
		
		if (domain === 'clean') await cleanLogs(targetRoot );
	}
}