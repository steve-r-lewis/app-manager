/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/pushToRemote.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:19
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
 * V1.0.0, 20251218-23:19
 * Initial creation and release of pushToRemote.ts
 *
 * ================================================================================
 */

import { intro, outro, multiselect, isCancel } from '@clack/prompts';
import { logger } from '../../services/loggerService';
import { execSync } from 'child_process';
import pc from 'picocolors';

export interface PushOptions {
	remote?: string;
	branch?: string;
}

export async function pushToRemote(targetRoot: string, options: PushOptions = {}) {
	// --- HEADLESS MODE ---
	if (options.remote && options.branch) {
		const { remote, branch } = options;
		logger.info(`Headless Push: ${remote} -> ${branch}`);
		
		try {
			execSync(`git push ${remote} ${branch}`, {
				cwd: targetRoot,
				stdio: 'inherit'
			});
			logger.success('Push completed successfully.');
		} catch (error) {
			logger.error(`Failed to push to ${remote}/${branch}`);
		}
		return;
	}
	
	// --- INTERACTIVE MODE ---
	intro('🚀  Push to Remote');
	
	// 1. Get Remotes
	let remotes: string[] = [];
	try {
		const output = execSync('git remote', { cwd: targetRoot }).toString();
		remotes = output.split('\n').filter(r => r.trim());
	} catch (error) {
		logger.error('Not a git repository or no remotes found.');
		return;
	}
	
	if (remotes.length === 0) {
		logger.warn('No remotes defined.');
		return;
	}
	
	// 2. Select Remotes
	const selectedRemotes = await multiselect({
		message: 'Select remote(s) to push to:',
		options: remotes.map(r => ({ value: r, label: r })),
		required: true
	});
	
	if (isCancel(selectedRemotes)) {
		outro('Push Cancelled');
		return;
	}
	
	// 3. Get Current Branch
	const currentBranch = execSync('git branch --show-current', { cwd: targetRoot }).toString().trim();
	
	// 4. Push
	(selectedRemotes as string[]).forEach(remote => {
		const loader = logger.loader(`Pushing to ${remote}...`);
		try {
			execSync(`git push ${remote} ${currentBranch}`, { cwd: targetRoot, stdio: 'ignore' });
			loader.stop();
			logger.success(`Pushed to ${pc.bold(remote)}`);
		} catch (error) {
			loader.stop();
			logger.error(`Failed to push to ${remote}`);
		}
	});
	
	outro('Done');
}