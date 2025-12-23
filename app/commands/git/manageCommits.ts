/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/manageCommits.ts
 * @version:    2.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:22
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Git Commit Management Command.
 * Features:
 * 1. Stages files.
 * 2. Generates conventional commit messages via LLM.
 * 3. Supports selecting specific LLM providers (passed from App Health Check).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20251222-22:26
 * Changed the way the commit message is generated.
 *
 * V1.0.0, 20251217-01:22
 * Initial creation and release of manageCommits.ts
 *
 * ================================================================================
 */

import { intro, outro, text, confirm, select, isCancel, spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import { logger } from '../../services/loggerService';
import { llm, type LLMProviderStatus } from '../../services/llmService';
import pc from 'picocolors';

export interface CommitOptions {
	message?: string; // For headless/manual mode
	availableLLMs?: LLMProviderStatus[]; // Passed from app.ts health check
}

export async function manageCommits(targetRoot: string, options: CommitOptions = {}) {
	intro('🐙 Manage Commits');
	
	// 1. Check for Staged Changes
	try {
		const status = execSync('git status --porcelain', { cwd: targetRoot, encoding: 'utf-8' });
		
		if (!status) {
			logger.warn('No changes detected in repository.');
			// Offer to stage all?
			const shouldStage = await confirm({ message: 'Stage all changes?' });
			if (isCancel(shouldStage) || !shouldStage) return;
			
			execSync('git add .', { cwd: targetRoot });
			logger.success('Staged all changes.');
		} else {
			// Check if anything is actually staged
			const staged = execSync('git diff --name-only --cached', { cwd: targetRoot, encoding: 'utf-8' });
			if (!staged) {
				const shouldStage = await confirm({ message: 'Changes exist but nothing is staged. Stage all?' });
				if (isCancel(shouldStage) || !shouldStage) return;
				execSync('git add .', { cwd: targetRoot });
			}
		}
	} catch (error: any) {
		logger.error(`Git status check failed: ${error.message}`);
		return;
	}
	
	// 2. Select Generation Mode (If AI is available)
	let finalMessage = options.message;
	
	if (!finalMessage) {
		// --- AI PROVIDER SELECTION ---
		// If the app passed us verified providers, let the user choose.
		if (options.availableLLMs && options.availableLLMs.length > 0) {
			
			// Build the selection list
			const providerOptions = options.availableLLMs.map(p => ({
				value: p.id,
				label: `🤖 ${p.name}`,
				hint: p.id === process.env.LLM_PROVIDER ? '(Default)' : undefined
			}));
			
			// Add Manual Option
			providerOptions.push({ value: 'manual', label: '✏️  Manual Entry', hint: '' });
			
			const selectedProvider = await select({
				message: 'Select Commit Message Generator:',
				options: providerOptions
			});
			
			if (isCancel(selectedProvider)) return;
			
			if (selectedProvider === 'manual') {
				// Manual Fallback
				const manualMsg = await text({
					message: 'Enter commit message:',
					placeholder: 'feat: add new feature'
				});
				if (isCancel(manualMsg)) return;
				finalMessage = manualMsg as string;
				
			} else {
				// Activate the selected AI
				llm.setActiveProvider(selectedProvider as string);
				
				// Get the diff for context
				const s = spinner();
				s.start('Reading git diff...');
				const diff = execSync('git diff --cached', { cwd: targetRoot, encoding: 'utf-8' });
				s.stop('Diff captured.');
				
				if (diff.length > 6000) {
					logger.warn('Diff is very large. Sending summary only.');
					// (Optional: Logic to truncate diff would go here)
				}
				
				// Generate
				s.start(`Generating message via ${selectedProvider}...`);
				try {
					const prompt = `
                        Generate a concise Conventional Commit message for the following git diff.
                        Format: <type>(<scope>): <description>
                        Only return the message string, no markdown, no quotes.
                        Diff:
                        ${diff.slice(0, 4000)}
                    `;
					
					const generated = await llm.generate(prompt);
					s.stop('Generation Complete.');
					
					// Review
					const accepted = await confirm({
						message: `Use this message?\n\n   ${pc.cyan(generated)}\n`
					});
					
					if (isCancel(accepted)) return;
					
					if (accepted) {
						finalMessage = generated.trim();
					} else {
						// Retry manually
						const manual = await text({
							message: 'Edit message:',
							initialValue: generated.trim()
						});
						if (isCancel(manual)) return;
						finalMessage = manual as string;
					}
					
				} catch (err: any) {
					s.stop('Generation Failed.');
					logger.error(err.message);
					return; // Exit or fall back
				}
			}
		} else {
			// No AI available -> Force Manual
			const manualMsg = await text({ message: 'Enter commit message (No AI available):' });
			if (isCancel(manualMsg)) return;
			finalMessage = manualMsg as string;
		}
	}
	
	// 3. Execute Commit
	if (finalMessage) {
		try {
			// Escape quotes for shell safety (basic)
			const safeMessage = finalMessage.replace(/"/g, '\\"');
			execSync(`git commit -m "${safeMessage}"`, { cwd: targetRoot, stdio: 'inherit' });
			outro(pc.green('Commit successful!'));
		} catch (error: any) {
			logger.error(`Commit failed: ${error.message}`);
		}
	} else {
		logger.warn('No commit message provided. Aborting.');
	}
}