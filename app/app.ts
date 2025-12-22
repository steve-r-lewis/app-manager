/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/app.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:25
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * This is the main entry point and router for the app-manager CLI application. It
 * orchestrates the flow of the application, handling both automated headless
 * commands and an interactive menu-driven interface.
 *
 * Key Functionality:
 *
 *   Routing Logic:
 *     Headless Mode: It parses process.argv to detect specific command arguments
 *     (e.g., git init FORCE, utils headers). If matches are found, it executes the
 *     corresponding function immediately and exits, bypassing the UI.
 *
 *     Interactive Mode: If no specific headless arguments are matched, it launches
 *     a while(true) loop that presents a categorized menu system (App, Nuxt, Git,
 *     Docs, etc.) using @clack/prompts.
 *
 *   Session Configuration: Allows the user to toggle "Debug Mode" (verbose logs)
 *   and "File Logging" (writing transcripts to disk) at the start of an
 *   interactive session.
 *
 *   Error Handling: Implements a global try/catch block that traps critical crashes,
 *   logs the stack trace to a file in app-monitor/error-logs, and prevents the
 *   application from failing silently.
 *
 *   Pre-flight Checks: Runs validation on startup to warn the user about missing
 *   environment variables, such as GITHUB_TOKEN.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251222-01:30
 * Added headless routing for the 'app' domain (e.g., 'am app dev') to support
 * CI/CD automation. Implemented exit code propagation to ensure the CLI process
 * terminates with the correct status code upon child process failure.
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
import fs from 'fs';
import path from 'path';
import { logger } from './services/logger.service.js';

// Commands
import { runApp } from './commands/app/runApp.js';
import { runDocs } from './commands/docs/runDocs.js';
import { syncRepos } from './commands/git/syncRepos.js';
import { manageCommits } from './commands/git/manageCommits.js';
import { pushToRemote } from './commands/git/pushToRemote.js';
import { initLayers } from './commands/git/initLayers.js';
import { addSubmodules } from './commands/git/addSubmodules.js';
import { deleteRemoteRepos } from './commands/git/deleteRemoteRepos.js';
import { createLayer } from './commands/nuxt/createLayer.js';
import { extractDocs } from './commands/nuxt/extractDocs.js';
import { manageEnv } from './commands/nuxt/manageEnv.js';
import { runQuality } from './commands/quality/runQuality.js';
import { autoVersion } from './commands/utils/autoVersion.js';
import { validateHeaders } from './commands/utils/validateHeaders.js';
import { autoDoc } from './commands/utils/autoDoc.js';
import { addContributor } from './commands/utils/addContributor.js';
import { cleanLogs } from './commands/utils/cleanLogs.js';

export async function main(targetRoot: string, toolRoot: string) {
	// 1. Initialize Logger & Debugging
	if (!process.env.DEBUG) console.clear();
	
	// Debug Args Dumper (Test Utility)
	if (process.env.AM_DEBUG_ARGS === 'true') {
		try {
			const debugPath = path.join(targetRoot, 'debug_args.json');
			const args = process.argv.slice(2);
			fs.writeFileSync(debugPath, JSON.stringify({
				fullArgv: process.argv,
				receivedArgs: args,
				domain: args[0],
				command: args[1]
			}, null, 2));
		} catch (e) { /* ignore */ }
	}
	
	logger.init();
	
	// 2. Global Error Trap
	try {
		// --- PRE-FLIGHT CHECKS ---
		validateEnvironment();
		// -------------------------
		
		// 3. Parse CLI Arguments (Headless Mode)
		const args = process.argv.slice(2);
		const domainArg = args[0];
		const commandArg = args[1];
		
		if (domainArg) {
			if (process.env.DEBUG) consola.info(pc.dim(`CLI Mode: ${domainArg} ${commandArg || ''}`));
			
			// --- NEW: App Domain Headless Routing ---
			// Usage: am app [dev|build|generate]
			if (domainArg === 'app') {
				const script = commandArg || 'dev'; // Default to 'dev' if arg missing
				const exitCode = await runApp(targetRoot, script);
				
				// Critical: Exit with the actual code from the app
				if (exitCode !== 0) process.exit(exitCode);
				return;
			}
			
			// --- Headless Routing ---
			if (domainArg === 'utils' && commandArg === 'headers') {
				await validateHeaders(targetRoot);
				return;
			}
			
			if (domainArg === 'utils' && commandArg === 'contributor') {
				const name = args[2];
				const email = args[3];
				const url = args[4];
				if (!name || !email) {
					logger.error('Usage: utils contributor "Name" "Email" [URL]');
					process.exit(1);
				}
				await addContributor(targetRoot, { name, email, url });
				return;
			}
			
			if (domainArg === 'git' && commandArg === 'delete') {
				const repo = args[2];
				const confirm = args[3];
				if (!repo) {
					logger.error('Usage: git delete "owner/repo" ["DELETE"]');
					process.exit(1);
				}
				await deleteRemoteRepos({ repo, confirm });
				return;
			}
			
			if (domainArg === 'git' && commandArg === 'commit') {
				const message = args[2];
				if (message) {
					await manageCommits(targetRoot, { message });
					return;
				}
			}
			
			if (domainArg !== 'git' || commandArg !== 'commit') {
				consola.warn(`Command '${domainArg} ${commandArg}' not recognized. Starting interactive mode.`);
			}
			
			// 5. Git Push (Headless)
			// usage: am git push origin main
			if (domainArg === 'git' && commandArg === 'push') {
				const remote = args[2];
				const branch = args[3];
				
				if (remote && branch) {
					await pushToRemote(targetRoot, { remote, branch });
					return;
				}
			}
			
			// 6. Git Sync (Headless)
			// usage: am git sync
			// Note: We treat "git sync" with NO extra args as an interactive command usually,
			// but for Headless CI we might want a flag like "force" or just check if non-interactive?
			// For simplicity, let's look for a flag argument or just enable it if the user passes "FORCE"
			// actually, 'sync' usually doesn't need args.
			// Let's assume: `am git sync FORCE` runs headless.
			if (domainArg === 'git' && commandArg === 'sync') {
				if (args[2] === 'FORCE') {
					await syncRepos(targetRoot, { force: true });
					return;
				}
			}
			
			// 7. Git Init Layers (Headless)
			// usage: am git init FORCE
			if (domainArg === 'git' && commandArg === 'init') {
				if (args[2] === 'FORCE') {
					await initLayers(targetRoot, { force: true });
					return;
				}
			}
		}
		
		// 4. Interactive Mode (Legacy)
		intro(pc.inverse(pc.cyan(' Nuxt 4 Monorepo Manager ')));
		
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
		
		const config = sessionConfig as string[];
		if (config.includes('debug')) {
			process.env.DEBUG = 'true';
			consola.info(pc.blue('ℹ Debug Mode Enabled'));
		}
		if (config.includes('logging')) {
			process.env.LOG_TO_FILE = 'true';
			consola.info(pc.blue('ℹ File Logging Enabled'));
			logger.enableSessionLogging();
		}
		
		if (process.env.DEBUG) {
			consola.info(pc.dim(`Context: Running in ${targetRoot}`));
		}
		
		// Main Loop
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
				if (action === 'submodules') await addSubmodules(targetRoot);
				if (action === 'delete') await deleteRemoteRepos();
			}
			
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
				if (action === 'headers') await validateHeaders(targetRoot);
				if (action === 'version') await autoVersion(targetRoot);
				if (action === 'doc') await autoDoc(targetRoot);
				if (action === 'contributor+') await addContributor(targetRoot);
			}
			
			if (domain === 'clean') await cleanLogs(targetRoot);
		}
		
	} catch (error: any) {
		// --- GLOBAL ERROR HANDLER ---
		consola.fatal(pc.red('CRITICAL ERROR: Application Crashed'));
		consola.error(error.message);
		
		// Write to error log
		try {
			const logDir = path.join(targetRoot, 'app-monitor', 'error-logs');
			if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
			
			const logFile = path.join(logDir, 'error.log');
			const timestamp = new Date().toISOString();
			const logEntry = `[${timestamp}] CRITICAL: ${error.stack || error.message}\n`;
			
			fs.appendFileSync(logFile, logEntry);
			consola.info(pc.dim(`Error details written to ${logFile}`));
		} catch (writeErr) {
			consola.error('Failed to write to error log');
		}
		
		process.exit(1);
	}
}

/**
 * Pre-Flight Checks
 * Warns if critical environment variables are missing.
 */
function validateEnvironment() {
	const warnings: string[] = [];
	
	// Check for Git/GitHub Config
	if (!process.env.GITHUB_TOKEN) {
		warnings.push('GITHUB_TOKEN is missing. Git operations (list/delete repos) may fail.');
	}
	
	// Check for AI Config (Optional but good to warn)
	if (!process.env.NUXT_HUB_AI_API_KEY && !process.env.OPENAI_API_KEY) {
		// Just a gentle warning since manual commits work fine without AI
		// warnings.push('AI Keys missing. Smart Commit features will be disabled.');
	}
	
	if (warnings.length > 0) {
		consola.warn(pc.yellow('⚠️  Environment Warnings:'));
		warnings.forEach(w => consola.warn(pc.dim(`  - ${w}`)));
		// We don't exit; just warn.
	}
}