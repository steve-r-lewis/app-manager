/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/syncCommand.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 21:41
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
 * V1.0.0, 20260107-21:41
 * Initial creation and release of syncCommand.ts
 *
 * ================================================================================
 */

import { spinner } from '@clack/prompts';
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
			description: 'Pulls the latest changes from the remote repository.'
		});
	}
	
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		const s = spinner();
		s.start('Syncing with remote...');
		
		try {
			await githubService.syncRepo(targetRoot);
			s.stop('Sync complete.');
			logger.success('Repository is up to date.');
		} catch (error: any) {
			s.stop('Sync failed.');
			logger.error(`Failed to sync: ${error.message}`);
		}
	}
}