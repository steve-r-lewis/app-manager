/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/app.ts
 * @version:    2.0.3
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
 * V2.0.3, 20251226-1912
 * Refactored logic.
 *
 * V2.0.2, 20251223-15:55
 * Restored Session Configuration menu as a multi-select option (Verbose/File Logging)
 * per original design requirements.
 *
 * V2.0.1, 20251223-15:45
 * Refactor: Cleanup of unused imports.
 *
 * V2.0.0, 20251222-21:29
 * Main entry point for the App Manager CLI/TUI.
 * Handles:
 * 1. CLI Argument Parsing (Headless Mode)
 * 2. Interactive TUI (Clack Prompts)
 * 3. Startup Health Checks (LLM Availability)
 * 4. Domain Routing (App, Git, Nuxt, etc.)
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

import { intro, outro, select, multiselect, isCancel, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from './services/loggerService';
import { configService } from './services/configService';
import { llm } from './services/llmService';

// --- Command Imports ---
import { runApp } from './commands/app/runApp';
import { setupApp } from './commands/app/setupApp';

// Docs
import { runDocs } from './commands/docs/runDocs';

// Git
import { manageCommits } from './commands/git/manageCommits';
import { syncRepos } from './commands/git/syncRepos';
import { pushToRemote } from './commands/git/pushToRemote';
import { initLayers } from './commands/git/initLayers';
import { deleteRemoteRepos } from './commands/git/deleteRemoteRepos';
import { addSubmodules } from './commands/git/addSubmodules';
import { pushAll } from './commands/git/pushAll';

// Quality
import { runQuality } from './commands/quality/runQuality';

// Nuxt
import { createLayer } from './commands/nuxt/createLayer';
import { manageEnv } from './commands/nuxt/manageEnv';
import { extractDocs } from './commands/nuxt/extractDocs';

// Utils
import { cleanLogs } from './commands/utils/cleanLogs';
import { validateHeaders } from './commands/utils/validateHeaders';
import { autoVersion } from './commands/utils/autoVersion';
import { autoDoc } from './commands/utils/autoDoc';
import { addContributor } from './commands/utils/addContributor';

import type { LLMProviderStatus } from './types/llm.types';

export async function main(targetRoot: string, toolRoot: string) {
	// 1. Initialize System Services
	logger.init(targetRoot);
	configService.init(toolRoot);
	
	const args = process.argv.slice(2);
	
	// 2. Headless Mode (CLI Arguments)
	if (args.length > 0) {
		const [domain, action, ...rest] = args;
		logger.info(`Running in Headless Mode: ${domain} ${action}`);
		
		try {
			switch (domain) {
				case 'app':
					if (action === 'dev' || action === 'build') await runApp(targetRoot, action);
					else if (action === 'setup') await setupApp(targetRoot); // <--- ADD THIS
					else logger.error(`Unknown app action: ${action}`);
					break;
				case 'git':
					if (action === 'commit') await manageCommits(targetRoot, { message: rest[0] });
					else if (action === 'sync') await syncRepos(targetRoot);
					else if (action === 'push') await pushToRemote(targetRoot);
					else if (action === 'init') await initLayers(targetRoot, { force: rest.includes('FORCE') });
					else if (action === 'delete') await deleteRemoteRepos(targetRoot, rest[0]);
					else logger.error(`Unknown git action: ${action}`);
					break;
				case 'nuxt':
					// Matches nuxtManager.ps1 capabilities
					if (action === 'clean') {
						// am nuxt clean
						await manageEnv(targetRoot, { clean: true, force: true });
					}
					else if (action === 'reinstall') {
						// am nuxt reinstall
						await manageEnv(targetRoot, { reinstall: true, force: true });
					}
					else if (action === 'reset') {
						// am nuxt reset (Clean + Reinstall)
						await manageEnv(targetRoot, { clean: true, reinstall: true, force: true });
					}
					else {
						logger.error(`Unknown nuxt action: ${action}`);
					}
					break;
				case 'utils':
					if (action === 'headers') await validateHeaders(targetRoot);
					else if (action === 'clean') await cleanLogs(targetRoot);
					else if (action === 'contributor') {
						const name = rest[0];
						const email = rest[1];
						await addContributor(targetRoot, { name, email });
					}
					else logger.error(`Unknown utils action: ${action}`);
					break;
				default:
					logger.error(`Unknown domain: ${domain}`);
			}
		} catch (error: any) {
			logger.error(`Headless execution failed: ${error.message}`);
			process.exit(1);
		}
		return;
	}
	
	// 3. Interactive Mode (TUI)
	// ---------------------------------------------------------
	console.clear();
	intro(pc.inverse(pc.cyan(' Nuxt 4 Monorepo Manager ')));
	
	// A. Session Configuration (Multi-Select)
	// Allows user to toggle verbose logging and file logging at start
	const sessionConfig = await multiselect({
		message: 'Session Configuration (Space to select, Enter to confirm):',
		options: [
			{ value: 'debug', label: 'Enable Verbose Logging', hint: 'Show detailed debug logs on screen' },
			{ value: 'file', label: 'Enable File Logging', hint: 'Write logs to app-monitor/ directory' }
		],
		required: false
	});
	
	if (isCancel(sessionConfig)) { outro('👋 Exiting'); process.exit(0); }
	
	// Apply Configuration
	const selectedOptions = sessionConfig as string[];
	if (selectedOptions.includes('debug')) {
		process.env.DEBUG = 'true';
	}
	if (selectedOptions.includes('file')) {
		process.env.LOG_TO_FILE = 'true';
		// If logger was already initialized, we might need to notify it,
		// but typically it checks env vars during write operations or we rely on logic below.
		logger.info('File logging enabled for this session.');
	}
	
	// B. AI Health Check (Pre-Flight)
	const s = spinner();
	s.start('Connecting to AI Providers...');
	let availableLLMs: LLMProviderStatus[] = [];
	try {
		const status = await llm.checkAvailability();
		availableLLMs = status.filter(p => p.available);
		
		const count = availableLLMs.length;
		if (count > 0) {
			s.stop(pc.green(`AI Online: ${count} provider(s) active.`));
		} else {
			s.stop(pc.yellow('AI Offline: No reachable providers found.'));
		}
	} catch (err: any) {
		s.stop(pc.red('AI Check Failed'));
		logger.error(`Startup Health Check Error: ${err.message}`);
	}
	
	// 4. Main Menu Loop
	while (true) {
		const domain = await select({
			message: 'Select Domain:',
			options: [
				{ value: 'app', label: '🚀 App (Run/Build)' },
				{ value: 'git', label: '🐙 Git / Version Control' },
				{ value: 'nuxt', label: '💚 Nuxt / Layers' },
				{ value: 'quality', label: '💎 Code Quality' },
				{ value: 'docs', label: '📚 Documentation' },
				{ value: 'utils', label: '🛠️  Utilities' },
				{ value: 'exit', label: '🚪 Exit' }
			]
		});
		
		if (isCancel(domain) || domain === 'exit') {
			outro('👋 See you next time!');
			process.exit(0);
		}
		
		try {
			// --- APP DOMAIN ---
			if (domain === 'app') {
				const action = await select({
					message: 'App Action:',
					// Inside options array:
					options: [
						{ value: 'setup', label: '🚀 Provision Project (Zero-to-Hero)' }, // <--- ADD THIS
						{ value: 'dev', label: 'Start Dev Server' },
						{ value: 'build', label: 'Build Production' },
						{ value: 'back', label: '⬅️ Back' }
					]
				});
				
				if (action === 'back' || isCancel(action)) continue;
				if (action === 'setup') await setupApp(targetRoot); // <--- ADD THIS
				await runApp(targetRoot, action as 'dev' | 'build');
			}
			
			// --- GIT DOMAIN ---
			else if (domain === 'git') {
				const action = await select({
					message: 'Git Action:',
					options: [
						{ value: 'status', label: '📊 View Status' },
						{ value: 'commit', label: '📝 Smart Commit (AI)' },
						{ value: 'push', label: '⬆️  Push Current Repo' },
						{ value: 'push-all', label: '🚀 Mass Push (Root + Layers)' }, // <--- NEW
						{ value: 'sync', label: '🔄 Sync All Repos (Pull)' },
						{ value: 'init', label: '📦 Init Layers' },
						{ value: 'submodules', label: '🔗 Add Submodules' },
						{ value: 'delete', label: '🔥 Delete Remote Repo' },
						{ value: 'back', label: '⬅️ Back' }
					]
				});
				
				if (action === 'back' || isCancel(action)) continue;
				
				if (action === 'commit') await manageCommits(targetRoot, { availableLLMs });
				else if (action === 'push') await pushToRemote(targetRoot);
				else if (action === 'push-all') await pushAll(targetRoot); // <--- NEW
				else if (action === 'sync') await syncRepos(targetRoot);
				else if (action === 'init') await initLayers(targetRoot);
				else if (action === 'submodules') await addSubmodules(targetRoot);
				else if (action === 'delete') await deleteRemoteRepos(targetRoot);
			}
			
			// --- NUXT DOMAIN ---
			else if (domain === 'nuxt') {
				const action = await select({
					message: 'Nuxt Action:',
					options: [
						{ value: 'create', label: '✨ Create New Layer' },
						{ value: 'env', label: '🔐 Manage .env' },
						{ value: 'docs', label: '📄 Extract Docs' },
						{ value: 'back', label: '⬅️ Back' }
					]
				});
				
				if (action === 'back' || isCancel(action)) continue;
				
				if (action === 'create') await createLayer(targetRoot);
				else if (action === 'env') await manageEnv(targetRoot);
				else if (action === 'docs') await extractDocs(targetRoot);
			}
			
			// --- QUALITY DOMAIN ---
			else if (domain === 'quality') {
				const action = await select({
					message: 'Quality Action:',
					options: [
						{ value: 'run', label: '🔍 Run Linters/Tests' },
						{ value: 'back', label: '⬅️ Back' }
					]
				});
				if (action === 'back' || isCancel(action)) continue;
				await runQuality(targetRoot);
			}
			
			// --- DOCS DOMAIN ---
			else if (domain === 'docs') {
				const action = await select({
					message: 'Docs Action:',
					options: [
						{ value: 'generate', label: '📖 Generate Documentation' },
						{ value: 'back', label: '⬅️ Back' }
					]
				});
				if (action === 'back' || isCancel(action)) continue;
				await runDocs(targetRoot);
			}
			
			// --- UTILS DOMAIN ---
			else if (domain === 'utils') {
				const action = await select({
					message: 'Utility Action:',
					options: [
						{ value: 'clean', label: '🧹 Clean Logs' },
						{ value: 'headers', label: '🏷️  Validate File Headers' },
						{ value: 'autodoc', label: '🤖 Auto-Doc (AI)' },
						{ value: 'autoversion', label: '🔖 Auto-Version' },
						{ value: 'contributor', label: '👤 Add Contributor' },
						{ value: 'back', label: '⬅️ Back' }
					]
				});
				
				if (action === 'back' || isCancel(action)) continue;
				
				if (action === 'clean') await cleanLogs(targetRoot);
				else if (action === 'headers') await validateHeaders(targetRoot);
				else if (action === 'autodoc') await autoDoc(targetRoot);
				else if (action === 'autoversion') await autoVersion(targetRoot);
				else if (action === 'contributor') await addContributor(targetRoot);
			}
			
		} catch (error: any) {
			logger.error(`Command failed: ${error.message}`);
		}
	}
}