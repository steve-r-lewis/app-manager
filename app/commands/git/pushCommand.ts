/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/pushCommand.ts
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
 * Initial creation and release of pushCommand.ts
 *
 * ================================================================================
 */

import { BaseCommand } from '../baseCommand.js';
import { CommandOptions } from '../../types/index.js';
import { githubService } from '../../services/githubService.js';
import { logger } from '../../services/loggerService.js';
import * as p from '@clack/prompts';
import pc from 'picocolors';

export class PushCommand extends BaseCommand {
	constructor() {
		super({
			id: 'git.push',
			domain: 'git',
			name: 'push',
			label: '⬆️ Push to Remote',
			description: 'Pushes local commits to one or more remote repositories.'
		});
	}
	
	/**
	 * Checks if the current target root is a valid Git repository with remotes.
	 */
	override async isEnabled(targetRoot: string): Promise<boolean> {
		try {
			const remotes = await githubService.getRemotes(targetRoot);
			return remotes && remotes.length > 0;
		} catch {
			return false;
		}
	}
	
	/**
	 * Executes the Push workflow.
	 */
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		try {
			// Phase 1: Fetch Remotes
			const remotes = await githubService.getRemotes(targetRoot);
			
			if (!remotes || remotes.length === 0) {
				logger.warn('No remotes configured for this repository. Cannot push.');
				return;
			}
			
			let targetRemotes: string[] = [];
			let targetBranch = options.branch as string | undefined;
			
			// Phase 2: Determine Remotes (Headless vs Interactive)
			if (options.remote) {
				targetRemotes = [options.remote as string];
			} else {
				// Interactive Mode
				const remoteOptions = remotes.map((r) => ({
					value: r.name,
					label: r.name
				}));
				
				const selectedRemotes = await p.multiselect({
					message: 'Select remote(s) to push to:',
					options: remoteOptions,
					initialValues: [remotes[0].name],
					required: true
				});
				
				if (p.isCancel(selectedRemotes)) {
					logger.warn('Push cancelled.');
					return;
				}
				
				targetRemotes = selectedRemotes as string[];
			}
			
			// Phase 3: Determine Branch
			if (!targetBranch) {
				const status = await githubService.getStatus(targetRoot);
				targetBranch = status.branch;
			}
			
			// Phase 4: Execute Push
			for (const remote of targetRemotes) {
				const s = p.spinner();
				s.start(`Pushing to ${remote}/${targetBranch}...`);
				
				try {
					await githubService.push(targetRoot, remote, targetBranch);
					
					s.stop(pc.green(`✔ Successfully pushed to ${remote}/${targetBranch}`));
					logger.success(`Changes pushed to ${remote}.`);
				} catch (pushError) {
					s.stop(pc.red(`✖ Failed to push to ${remote}`));
					logger.error(`Failed to push to ${remote}: ${(pushError as Error).message}`);
					logger.info('Tip: You may need to set the upstream branch manually or pull changes first.');
				}
			}
			
		} catch (error) {
			logger.error('Failed to execute push command workflow', error as Error);
		}
	}
}