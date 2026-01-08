/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/syncCommand.ts
 * @version:    1.0.1
 * @createDate: 2026 Jan 07
 * @createTime: 21:41
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Pulls the latest changes for the root repository and recursively updates all
 * submodules. Supports both interactive (spinner) and headless (raw output) modes.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260108-22:50
 * Refactored to match specifications:
 * - Added Headless/Interactive branching
 * - Integrated githubService.syncRepo
 *
 * V1.0.0, 20260107-21:41
 * Initial creation and release of syncCommand.ts
 *
 * ================================================================================
 */

import { intro, outro, spinner } from '@clack/prompts';
import { BaseCommand } from '../baseCommand';
import type { CommandOptions } from '../../types/index';
import { githubService } from '../../services/githubService';
import { logger } from '../../services/loggerService';

export class SyncCommand extends BaseCommand {
	constructor() {
		super({
			id: 'git.sync',
			domain: 'git',
			name: 'sync',
			label: '🔄 Sync Repo',
			description: 'Pulls root repo and updates submodules.'
		});
	}
	
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		const isHeadless = !!options.force;
		
		// --- HEADLESS MODE ---
		if (isHeadless) {
			// Spec: Must not show Intro/Outro. Logs visible (stdio inherit).
			try {
				await githubService.syncRepo(targetRoot, false); // silent = false
				logger.success('Sync completed.');
			} catch (error: any) {
				logger.error(`Sync failed: ${error.message}`);
			}
			return;
		}
		
		// --- INTERACTIVE MODE ---
		intro('🔄  Sync Repositories');
		const s = spinner();
		
		try {
			s.start('Pulling root repository...');
			
			// silent = true (default) for Interactive mode to keep UI clean
			await githubService.syncRepo(targetRoot, true);
			
			s.stop('Sync complete.');
			logger.success('All repositories match remote.');
		} catch (error: any) {
			s.stop('Sync Failed.');
			logger.error(`Failed to sync: ${error.message}`);
		}
		
		outro('Done');
	}
}