/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/commitCommand.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 21
 * @createTime: 12:03
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
 * V1.0.0, 20260121-12:03
 * Initial creation and release of commitCommand.ts
 *
 * ================================================================================
 */

import { BaseCommand } from '../baseCommand.js';
import { CommandOptions } from '../../types/index.js';
import { githubService } from '../../services/githubService.js';
import { llmService } from '../../services/llmService.js';
import { logger } from '../../services/loggerService.js';
import * as p from '@clack/prompts';
import pc from 'picocolors';

export class CommitCommand extends BaseCommand {
	constructor() {
		super({
			id: 'git.commit',
			domain: 'git',
			name: 'commit',
			label: '📝 Smart Commit (AI)',
			description: 'Stages and commits changes, optionally using AI to write the message.'
		});
	}
	
	/**
	 * Checks if the current target root is a valid Git repository.
	 */
	override async isEnabled(targetRoot: string): Promise<boolean> {
		try {
			const status = await githubService.getStatus(targetRoot);
			// If it has a branch, it's a valid repo context
			return status && status.branch !== undefined;
		} catch {
			return false;
		}
	}
	
	/**
	 * Executes the Smart Commit workflow.
	 */
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		try {
			// Phase 1: Status & Staging
			const status = await githubService.getStatus(targetRoot);
			
			if (!status.isDirty) {
				logger.success('Working directory is clean. Nothing to commit.');
				return;
			}
			
			// If dirty but nothing is staged, prompt to stage all
			if (status.staged.length === 0) {
				const shouldStage = await p.confirm({
					message: 'You have unstaged changes. Stage ALL changes?',
					initialValue: true
				});
				
				if (p.isCancel(shouldStage) || !shouldStage) {
					logger.warn('Commit aborted. No files staged.');
					return;
				}
				
				// The specification maps this to a githubService call to stage files
				await githubService.createCommit(targetRoot, 'temp', ['.']);
			}
			
			// Phase 2: Message Generation
			let message = options.message as string | undefined;
			
			if (!message) {
				const useAi = await p.confirm({
					message: 'Generate commit message with AI?',
					initialValue: true
				});
				
				if (p.isCancel(useAi)) return;
				
				if (useAi) {
					const s = p.spinner();
					s.start('Analyzing staged changes');
					try {
						const diff = await githubService.getStagedDiff(targetRoot);
						if (!diff) {
							s.stop('No diff found.');
							logger.warn('Cannot generate AI message without a diff. Falling back to manual.');
						} else {
							s.message('Generating message via LLM');
							const generatedMessage = await llmService.generate(diff);
							s.stop('Message generated.');
							
							const acceptAiMessage = await p.confirm({
								message: `Generated message:\n\n${pc.cyan(generatedMessage)}\n\nUse this message?`,
								initialValue: true
							});
							
							if (p.isCancel(acceptAiMessage)) return;
							
							if (acceptAiMessage) {
								message = generatedMessage;
							}
						}
					} catch (aiError) {
						s.stop('AI Generation failed.');
						logger.error('AI Service encountered an error. Falling back to manual.', aiError as Error);
					}
				}
			}
			
			// Manual Fallback (if no AI, AI failed, or AI message was rejected)
			if (!message) {
				const manualMessage = await p.text({
					message: 'Enter your commit message:',
					placeholder: 'feat: add new user login system',
					validate: (value) => {
						if (value.trim().length === 0) return 'Commit message is required.';
					}
				});
				
				if (p.isCancel(manualMessage)) {
					logger.warn('Commit aborted.');
					return;
				}
				message = manualMessage;
			}
			
			// Phase 3: Execution
			const commitSpinner = p.spinner();
			commitSpinner.start('Committing changes...');
			
			// Replace with actual GitHub service commit method if signatures differ
			await githubService.createCommit(targetRoot, message);
			
			commitSpinner.stop(pc.green(`✔ Successfully committed: "${message}"`));
			
		} catch (error) {
			logger.error('Failed to execute commit workflow', error as Error);
		}
	}
}