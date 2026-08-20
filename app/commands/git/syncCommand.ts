/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/syncCommand.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 21
 * @createTime: 12:02
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
 * V1.0.0, 20260121-12:02
 * Initial creation and release of syncCommand.ts
 *
 * ================================================================================
 */

import { BaseCommand } from '../baseCommand.js';
import { CommandOptions } from '../../types/index.js';
import { githubService } from '../../services/githubService.js';
import { logger } from '../../services/loggerService.js';
import * as p from '@clack/prompts';
import pc from 'picocolors';

export class SyncCommand extends BaseCommand {
	constructor() {
		super({
			id: 'git.sync',
			domain: 'git',
			name: 'sync',
			label: '🔄 Sync Repo',
			description: 'Pulls the latest changes from the remote repository.'
		});
	}
	
	/**
	 * Checks if the current target root is a valid Git repository.
	 */
	override async isEnabled(targetRoot: string): Promise<boolean> {
		try {
			const status = await githubService.getStatus(targetRoot);
			return status && status.branch !== undefined;
		} catch {
			return false;
		}
	}
	
	/**
	 * Executes the Sync workflow.
	 */
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		const isHeadless = !!options.force;
		
		try {
			if (isHeadless) {
				// Headless Mode: Raw output piped directly to terminal, no UI decorators
				await githubService.syncRepo(targetRoot, false);
				logger.success('Sync completed.');
				return;
			}
			
			// Interactive Mode: TUI Spinner, Git stdio is silenced
			const s = p.spinner();
			s.start('Syncing with remote...');
			
			try {
				await githubService.syncRepo(targetRoot, true);
				
				s.stop(pc.green('✔ Sync complete.'));
				logger.success('Repository and submodules are up to date.');
			} catch (syncError) {
				s.stop(pc.red('✖ Sync failed.'));
				logger.error(`Failed to sync: ${(syncError as Error).message}`);
			}
			
		} catch (error) {
			logger.error('Fatal error in sync command workflow', error as Error);
		}
	}
}