/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/modes/headlessMode.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 08
 * @createTime: 15:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Contains purely the logic for CLI arguments and single-command execution.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260108-15:06
 * Initial creation and release of headlessMode.ts
 *
 * ================================================================================
 */

import { logger } from '../services/loggerService.js';
import { configService } from '../services/configService.js';
import { commandRegistry } from '../commands/commandRegistry.js';

export async function runHeadless(targetRoot: string, args: string[]) {
	const [domain, action, ...rest] = args;
	
	// 1. Parse Options & Flags
	const options: Record<string, any> = {};
	const cleanArgs: string[] = [];
	
	for (let i = 0; i < rest.length; i++) {
		if (rest[i].startsWith('--')) {
			const key = rest[i].substring(2);
			if (rest[i+1] && !rest[i+1].startsWith('--')) {
				options[key] = rest[i+1];
				i++;
			} else {
				options[key] = true;
			}
		} else {
			cleanArgs.push(rest[i]);
		}
	}
	
	// 2. Configure Environment
	if (options.verbose || options.debug) configService.setFlag('verbose', true);
	
	logger.info(`Running Headless: ${domain}.${action}`);
	
	// 3. Command Lookup
	const command = commandRegistry.get(domain, action);
	if (!command) {
		logger.error(`Unknown command: ${domain} ${action}`);
		process.exit(1);
	}
	
	// 4. Execution
	try {
		if (await command.isEnabled(targetRoot)) {
			await command.execute(targetRoot, options, ...cleanArgs);
		} else {
			logger.error(`Command ${domain}.${action} is not available in this context.`);
			process.exit(1);
		}
	} catch (error: any) {
		logger.error(`Execution failed: ${error.message}`);
		process.exit(1);
	}
}