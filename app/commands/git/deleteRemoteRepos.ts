/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/deleteRemoteRepos.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 23:48
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
 * V1.0.0, 20251218-23:48
 * Initial creation and release of deleteRemoteRepos.ts
 *
 * ================================================================================
 */

import { multiselect, select, isCancel, text, spinner } from '@clack/prompts';
import { github } from '../../services/github.service';
import { consola } from 'consola';
import pc from 'picocolors';

export async function deleteRemoteRepos() {
	const s = spinner();
	
	// 1. Fetch Candidates
	s.start('Fetching remote repositories...');
	let repos = [];
	try {
		repos = await github.listRepos();
	} catch (e: any) {
		s.stop('Fetch failed');
		consola.error(e.message);
		return;
	}
	s.stop(`Found ${repos.length} repositories.`);
	
	if (repos.length === 0) return;
	
	// 2. Selection
	const selected = await multiselect({
		message: '🚨 SELECT REPOS TO DELETE (Irreversible):',
		options: repos.map(r => ({
			value: r,
			label: r.full_name,
		})),
		required: false
	});
	
	if (isCancel(selected) || selected.length === 0) return;
	
	// 3. Safety Confirmation
	const targets = selected as { name: string, full_name: string }[];
	const confirmName = await text({
		message: `Type "DELETE" to confirm destroying ${targets.length} repositories:`,
		placeholder: 'DELETE'
	});
	
	if (isCancel(confirmName) || confirmName !== 'DELETE') {
		consola.info('Deletion cancelled.');
		return;
	}
	
	// 4. Execution
	s.start('Deleting...');
	for (const repo of targets) {
		// Parse owner/name from full_name (e.g., "steve/repo")
		const [owner, name] = repo.full_name.split('/');
		try {
			await github.deleteRepo(owner, name);
		} catch (e: any) {
			consola.error(pc.red(`Failed to delete ${repo.full_name}: ${e.message}`));
		}
	}
	s.stop('Cleanup complete.');
}