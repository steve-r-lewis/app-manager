/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/index.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 07
 * @createTime: 20:28
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The clean entry point that initializes the app and delegates to the correct mode.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260224-21:44
 * Added the RunApp command registration and main function.
 *
 * V1.0.0, 20260107-20:28
 * Initial creation and release of index.ts
 *
 * ================================================================================
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Services
import { logger } from './services/loggerService.js';
import { configService } from './services/configService.js';
import { commandRegistry } from './commands/commandRegistry.js';

// Modes
import { runHeadless } from './modes/headlessMode.js';
import { runInteractive } from './modes/interactiveMode.js';

// Commands (Registration)
import { CommitCommand } from './commands/git/commitCommand.js';
import { PushCommand } from './commands/git/pushCommand.js';
import { SyncCommand } from './commands/git/syncCommand.js';
import { RunAppCommand } from './commands/app/runApp.js'; // <-- New import

// --- REGISTER COMMANDS ---
commandRegistry.register(new CommitCommand());
commandRegistry.register(new PushCommand());
commandRegistry.register(new SyncCommand());
commandRegistry.register(new RunAppCommand()); // <-- New registration

// --- MAIN ORCHESTRATOR ---
export async function main(targetRoot: string, toolRoot: string) {
	// 1. Initialize Core Services
	logger.init(targetRoot);
	configService.init(toolRoot);
	
	const args = process.argv.slice(2);
	
	// 2. Dispatch Mode
	if (args.length > 0) {
		await runHeadless(targetRoot, args);
	} else {
		await runInteractive(targetRoot);
	}
}

// --- BOOTSTRAP ---
const currentFile = fileURLToPath(import.meta.url);
const isEntryPoint = process.argv[1] === currentFile;

if (isEntryPoint) {
	const __dirname = dirname(currentFile);
	const targetRoot = process.cwd();
	const toolRoot = resolve(__dirname, '..');
	
	main(targetRoot, toolRoot).catch((err) => {
		console.error('Fatal Error:', err);
		process.exit(1);
	});
}
