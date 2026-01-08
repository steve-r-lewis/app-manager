/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/pushCommand.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 21:40
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
 * V1.0.0, 20260107-21:40
 * Initial creation and release of pushCommand.ts
 *
 * ================================================================================
 */

import { spinner } from '@clack/prompts';
import { BaseCommand } from '../baseCommand';
import type { CommandOptions } from '../../types/index';
import { githubService } from '../../services/githubService';
import { logger } from '../../services/loggerService';

export class PushCommand extends BaseCommand {
	constructor() {
		super({
			id: 'git.push',
			domain: 'git',
			name: 'push',
			label: '⬆️  Push Changes',
			description: 'Pushes committed changes to the remote repository.'
		});
	}
	
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		const s = spinner();
		s.start('Pushing to remote...');
		
		try {
			await githubService.pushToRemote(targetRoot);
			s.stop('Push complete.');
			logger.success('Changes pushed to remote.');
		} catch (error: any) {
			s.stop('Push failed.');
			logger.error(`Failed to push: ${error.message}`);
		}
	}
}