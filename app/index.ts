/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/index.ts
 * @version:    1.0.0
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
 * V1.0.0, 20260107-20:28
 * Initial creation and release of index.ts
 *
 * ================================================================================
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Services
import { logger } from './services/loggerService';
import { configService } from './services/configService';
import { commandRegistry } from './commands/commandRegistry';

// Modes
import { runHeadless } from './modes/headlessMode';
import { runInteractive } from './modes/interactiveMode';

// Commands (Registration)
import { CommitCommand } from './commands/git/commitCommand';
import { PushCommand } from './commands/git/pushCommand';
import { SyncCommand } from './commands/git/syncCommand';

// --- REGISTER COMMANDS ---
commandRegistry.register(new CommitCommand());
commandRegistry.register(new PushCommand());
commandRegistry.register(new SyncCommand());

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