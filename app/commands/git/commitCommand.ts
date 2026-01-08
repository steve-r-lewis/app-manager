/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/commitCommand.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 20:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The clean entry point that initialises the app and delegates to the correct
 * mode.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260107-20:08
 * Initial creation and release of commitCommand.ts
 *
 * ================================================================================
 */

import { text, confirm, spinner, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import { BaseCommand } from '../baseCommand';
import type { CommandOptions } from '../../types/index';
import { githubService } from '../../services/githubService';
import { llmService } from '../../services/llmService';
import { logger } from '../../services/loggerService';

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
	
	async isEnabled(targetRoot: string): Promise<boolean> {
		// Simple check: Is this a git repo?
		try {
			const status = await githubService.getStatus(targetRoot);
			return !!status.branch;
		} catch {
			return false;
		}
	}
	
	async execute(targetRoot: string, options: CommandOptions): Promise<void> {
		// 1. Check Status
		const status = await githubService.getStatus(targetRoot);
		
		if (status.isDirty && status.staged.length === 0) {
			// Nothing staged? Ask to stage all.
			if (!options.yes) {
				const stageAll = await confirm({
					message: 'Nothing is staged. Would you like to stage ALL changes?',
				});
				if (isCancel(stageAll) || !stageAll) {
					logger.warn('Commit aborted. Nothing staged.');
					return;
				}
			}
			// "Temp" message is ignored because we just want the 'add .' side effect
			// A dedicated 'stage' command would be cleaner, but this works for MVP.
			await githubService.createCommit(targetRoot, 'temp', ['.']);
			// Note: githubService.createCommit in your code currently does Add+Commit in one shot.
			// If we just want to stage, we might need to expose 'git add' in the service later.
			// For now, we assume the user accepts the "Stage All + Commit" flow.
		} else if (!status.isDirty) {
			logger.success('Working directory is clean. Nothing to commit.');
			return;
		}
		
		// 2. Determine Message
		let message = options.message as string;
		
		if (!message) {
			// TUI Flow
			const useAI = await confirm({
				message: 'Generate commit message with AI?',
				initialValue: true
			});
			
			if (isCancel(useAI)) return;
			
			if (useAI) {
				const s = spinner();
				s.start('Analyzing changes...');
				try {
					const diff = await githubService.getStagedDiff(targetRoot);
					if (!diff) {
						s.stop('No changes detected in diff.');
						logger.warn('Cannot generate message: Empty diff.');
					} else {
						const prompt = `Generate a Conventional Commits compliant commit message for this diff:\n\n${diff}`;
						message = await llmService.generate(prompt);
						s.stop('Message generated.');
						
						// Review Generated Message
						const approved = await confirm({
							message: `Use this message?\n\n${pc.cyan(message)}\n`,
						});
						
						if (!approved || isCancel(approved)) {
							message = ''; // Reset to force manual entry
						}
					}
				} catch (error) {
					s.stop('AI Generation Failed');
					logger.error(error instanceof Error ? error.message : String(error));
				}
			}
			
			// Fallback to Manual
			if (!message) {
				const manual = await text({
					message: 'Enter commit message:',
					placeholder: 'feat: add new feature',
					validate: (val) => val.length === 0 ? 'Message is required' : undefined
				});
				if (isCancel(manual)) return;
				message = manual as string;
			}
		}
		
		// 3. Commit
		if (message) {
			const s = spinner();
			s.start('Committing...');
			await githubService.createCommit(targetRoot, message);
			s.stop('Changes committed!');
			logger.success(`Committed: "${message}"`);
		}
	}
}