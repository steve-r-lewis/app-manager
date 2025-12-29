/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/pushToRemote.ts
 * @version:    1.0.1
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
 * V1.0.1, 20251226-1912
 * Refactored logic.
 *
 * V1.0.0, 20251218-23:19
 * Initial creation and release of pushToRemote.ts
 *
 * ================================================================================
 */

// import { intro, outro, multiselect, isCancel } from '@clack/prompts';
// import { logger } from '../../services/loggerService';
// import { execSync } from 'child_process';
// import pc from 'picocolors';
//
// // Import Type
// import type { PushOptions } from '../../types/git.types';
//
// export async function pushToRemote(targetRoot: string, options: PushOptions = {}) {
// 	// --- HEADLESS MODE ---
// 	if (options.remote && options.branch) {
// 		const { remote, branch } = options;
// 		logger.info(`Headless Push: ${remote} -> ${branch}`);
//
// 		try {
// 			execSync(`git push ${remote} ${branch}`, {
// 				cwd: targetRoot,
// 				stdio: 'inherit'
// 			});
// 			logger.success('Push completed successfully.');
// 		} catch (error) {
// 			logger.error(`Failed to push to ${remote}/${branch}`);
// 		}
// 		return;
// 	}
//
// 	// --- INTERACTIVE MODE ---
// 	intro('🚀  Push to Remote');
//
// 	// 1. Get Remotes
// 	let remotes: string[] = [];
// 	try {
// 		const output = execSync('git remote', { cwd: targetRoot }).toString();
// 		remotes = output.split('\n').filter(r => r.trim());
// 	} catch (error) {
// 		logger.error('Not a git repository or no remotes found.');
// 		return;
// 	}
//
// 	if (remotes.length === 0) {
// 		logger.warn('No remotes defined.');
// 		return;
// 	}
//
// 	// 2. Select Remotes
// 	const selectedRemotes = await multiselect({
// 		message: 'Select remote(s) to push to:',
// 		options: remotes.map(r => ({ value: r, label: r })),
// 		required: true
// 	});
//
// 	if (isCancel(selectedRemotes)) {
// 		outro('Push Cancelled');
// 		return;
// 	}
//
// 	// 3. Get Current Branch
// 	const currentBranch = execSync('git branch --show-current', { cwd: targetRoot }).toString().trim();
//
// 	// 4. Push
// 	(selectedRemotes as string[]).forEach(remote => {
// 		const loader = logger.loader(`Pushing to ${remote}...`);
// 		try {
// 			execSync(`git push ${remote} ${currentBranch}`, { cwd: targetRoot, stdio: 'ignore' });
// 			loader.stop();
// 			logger.success(`Pushed to ${pc.bold(remote)}`);
// 		} catch (error) {
// 			loader.stop();
// 			logger.error(`Failed to push to ${remote}`);
// 		}
// 	});
//
// 	outro('Done');
// }




import { intro, outro, spinner } from '@clack/prompts';
import { simpleGit } from 'simple-git';
import pc from 'picocolors';
import { logger } from '../../services/loggerService';
import type { PushOptions } from '../../types';

export async function pushToRemote(targetRoot: string, options: PushOptions = {}) {
	intro(pc.cyan('⬆️  Pushing to Remote'));
	const s = spinner();
	const git = simpleGit(targetRoot);
	
	try {
		// Check if we actually have a remote
		const remotes = await git.getRemotes();
		if (remotes.length === 0) {
			logger.error('No remotes configured.');
			outro('Push Aborted.');
			return;
		}
		
		s.start('Pushing changes...');
		
		// Defaults to pushing current branch to its upstream
		await git.push();
		
		s.stop('Push successful.');
		logger.success('Changes pushed to remote.');
		
	} catch (error: any) {
		s.stop('Push Failed.');
		logger.error(`Git Error: ${error.message}`);
		logger.info('Tip: You may need to set the upstream branch manually once.');
	}
	
	outro(pc.green('✅ Done'));
}