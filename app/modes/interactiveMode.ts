/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/modes/interactiveMode.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 08
 * @createTime: 15:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Contains purely the TUI loop and menu logic.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260108-15:06
 * Initial creation and release of interactiveMode.ts
 *
 * ================================================================================
 */

import { intro, outro, select, multiselect, isCancel, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../services/loggerService.js';
import { configService } from '../services/configService.js';
import { llmService } from '../services/llmService.js';
import { commandRegistry } from '../commands/commandRegistry.js';

export async function runInteractive(targetRoot: string) {
	console.clear();
	intro(pc.inverse(pc.cyan(' Nuxt 4 Monorepo Manager ')));
	
	// A. Session Configuration
	const sessionConfig = await multiselect({
		message: 'Session Configuration:',
		options: [
			{ value: 'verbose', label: 'Enable Verbose Logging', hint: 'Show detailed debug logs' },
			{ value: 'file', label: 'Enable File Logging', hint: 'Write logs to app_manager/' }
		],
		required: false
	});
	
	if (isCancel(sessionConfig)) { outro('👋 Exiting'); process.exit(0); }
	
	const selectedOpts = sessionConfig as string[];
	if (selectedOpts.includes('verbose')) configService.setFlag('verbose', true);
	if (selectedOpts.includes('file')) {
		process.env.LOG_TO_FILE = 'true';
		logger.init(targetRoot); // Re-init to pick up file logging
		logger.info('File logging enabled for this session.');
	}
	
	// B. AI Health Check
	const s = spinner();
	s.start('Connecting to AI Providers...');
	try {
		await llmService.checkAvailability();
		s.stop(pc.green('AI Online'));
	} catch (err) {
		s.stop(pc.yellow('AI Offline (Limited Functionality)'));
	}
	
	// C. Main Menu Loop
	while (true) {
		const domains = commandRegistry.getDomains();
		
		if (domains.length === 0) {
			logger.warn('No commands registered! (System is empty)');
			await select({ message: 'System Empty', options: [{ value: 'exit', label: 'Exit' }] });
			process.exit(0);
		}
		
		const domain = await select({
			message: 'Select Domain:',
			options: [
				...domains.map(d => ({ value: d, label: d.toUpperCase() })),
				{ value: 'exit', label: '🚪 Exit' }
			]
		});
		
		if (isCancel(domain) || domain === 'exit') {
			outro('👋 See you next time!');
			process.exit(0);
		}
		
		const commands = commandRegistry.getByDomain(domain as string);
		
		const action = await select({
			message: `${(domain as string).toUpperCase()} Actions:`,
			options: [
				...commands.map(cmd => ({
					value: cmd.metadata.id,
					label: cmd.metadata.label,
					hint: cmd.metadata.description
				})),
				{ value: 'back', label: '⬅️ Back' }
			]
		});
		
		if (isCancel(action) || action === 'back') continue;
		
		const selectedCmd = commands.find(c => c.metadata.id === action);
		if (selectedCmd) {
			try {
				if (await selectedCmd.isEnabled(targetRoot)) {
					await selectedCmd.execute(targetRoot, {});
				} else {
					logger.warn('This command is currently disabled.');
				}
			} catch (error: any) {
				logger.error(`Command failed: ${error.message}`);
			}
		}
	}
}