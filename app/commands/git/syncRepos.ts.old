/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/syncRepos.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 17
 * @createTime: 01:29
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
 * V1.0.0, 20251217-01:29
 * Initial creation and release of syncRepos.ts
 *
 * ================================================================================
 */

// import { intro, outro, spinner } from '@clack/prompts';
// import { logger } from '../../services/loggerService';
// import { execSync } from 'child_process';
// // import pc from 'picocolors';
// // Import Type
// import type { SyncOptions } from '../../types/git.types';
//
// export async function syncRepos(targetRoot: string, options: SyncOptions = {}) {
// 	// --- HEADLESS MODE ---
// 	if (options.force) {
// 		logger.info('Headless Sync: Pulling & Updating Submodules...');
// 		try {
// 			// 1. Pull Root
// 			execSync('git pull', { cwd: targetRoot, stdio: 'inherit' });
// 			// 2. Update Submodules
// 			execSync('git submodule update --init --recursive', { cwd: targetRoot, stdio: 'inherit' });
// 			logger.success('Sync completed.');
// 		} catch (error) {
// 			logger.error('Sync failed.');
// 		}
// 		return;
// 	}
//
// 	// --- INTERACTIVE MODE ---
// 	intro('🔄  Sync Repositories');
//
// 	const s = spinner();
// 	s.start('Syncing Root Repository...');
//
// 	try {
// 		// 1. Pull Root
// 		execSync('git pull', { cwd: targetRoot, stdio: 'ignore' });
// 		s.message('Updating Submodules...');
//
// 		// 2. Update Submodules
// 		execSync('git submodule update --init --recursive', { cwd: targetRoot, stdio: 'ignore' });
//
// 		s.stop('Sync Complete');
// 		logger.success('All repositories matches remote.');
// 	} catch (error) {
// 		s.stop('Sync Failed');
// 		logger.error('Failed to pull or update submodules. (Check git status)');
// 	}
//
// 	outro('Done');
// }





import { intro, outro, spinner } from '@clack/prompts';
import { simpleGit } from 'simple-git';
import pc from 'picocolors';
import { logger } from '../../services/loggerService';
import type { SyncOptions } from '../../types';

export async function syncRepos(targetRoot: string, options: SyncOptions = {}) {
	intro(pc.cyan('🔄 Syncing Repositories'));
	const s = spinner();
	const git = simpleGit(targetRoot);
	
	try {
		// 1. Pull Root
		s.start('Pulling root repository...');
		await git.pull();
		s.message('Root pulled. Updating submodules...');
		
		// 2. Update Submodules
		// equivalent to: git submodule update --init --recursive
		await git.submoduleUpdate(['--init', '--recursive']);
		
		s.stop('Sync complete.');
		logger.success('Root and Submodules are up to date.');
		
	} catch (error: any) {
		s.stop('Sync Failed.');
		logger.error(`Git Error: ${error.message}`);
	}
	
	outro(pc.green('✅ Done'));
}