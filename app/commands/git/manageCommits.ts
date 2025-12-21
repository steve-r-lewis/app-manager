/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/manageCommits.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:22
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
 * V1.0.0, 20251217-01:22
 * Initial creation and release of manageCommits.ts
 *
 * ================================================================================
 */

import { intro, outro, text, isCancel } from '@clack/prompts';
import { logger } from '../../services/logger.service.js';
// FIX: Using correct export 'llm'
import { llm } from '../../services/llm.service.js';
import { execSync } from 'child_process';

export interface CommitOptions {
	message?: string;
}

export async function manageCommits(targetRoot: string, options: CommitOptions = {}) {
	// --- HEADLESS MODE ---
	if (options.message) {
		logger.info(`Headless Commit: "${options.message}"`);
		try {
			// 1. Stage All
			// stdio: 'ignore' keeps the console clean
			execSync('git add .', { cwd: targetRoot, stdio: 'ignore' });
			
			// 2. Commit
			// Escape quotes to prevent shell errors
			const safeMessage = options.message.replace(/"/g, '\\"');
			execSync(`git commit -m "${safeMessage}"`, {
				cwd: targetRoot,
				stdio: 'inherit'
			});
			
			logger.success('Commit created successfully.');
			return;
		} catch (error) {
			logger.error('Failed to create commit. (Is the working tree clean?)');
			return;
		}
	}
	
	// --- INTERACTIVE MODE (Legacy) ---
	intro('🤖  Smart Commit (AI Powered)');
	
	// 1. Check Status
	try {
		const status = execSync('git status --porcelain', { cwd: targetRoot }).toString();
		if (!status.trim()) {
			logger.warn('Working tree is clean. Nothing to commit.');
			return;
		}
	} catch (e) {
		logger.error('Not a git repository.');
		return;
	}
	
	// 2. Stage All
	execSync('git add .', { cwd: targetRoot });
	logger.info('Staged all changes.');
	
	// 3. Generate Message via AI
	const diff = execSync('git diff --staged', { cwd: targetRoot }).toString();
	if (!diff.trim()) {
		logger.warn('No changes detected in staged files.');
		return;
	}
	
	const loader = logger.loader('Analyzing Diff & Generating Message...');
	let suggestion = '';
	
	try {
		const prompt = `Generate a conventional commit message for this diff:\n\n${diff.slice(0, 2000)}`;
		suggestion = await llm.generate(prompt);
		loader.stop();
	} catch (error) {
		loader.stop();
		logger.error('AI Generation Failed. Fallback to manual.');
	}
	
	// 4. Confirm or Edit
	const message = await text({
		message: 'Commit Message:',
		initialValue: suggestion || '',
		placeholder: 'feat: add new feature',
		validate: (val) => !val ? 'Message is required' : undefined
	});
	
	if (isCancel(message)) {
		outro('Commit Cancelled');
		return;
	}
	
	// 5. Commit
	try {
		const safeMessage = (message as string).replace(/"/g, '\\"');
		execSync(`git commit -m "${safeMessage}"`, {
			cwd: targetRoot,
			stdio: 'inherit'
		});
		logger.success('Commit created successfully.');
	} catch (error) {
		logger.error('Commit failed.');
	}
}