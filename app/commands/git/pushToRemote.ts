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

import { simpleGit, SimpleGit } from 'simple-git';
import { multiselect, isCancel, spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';

export async function pushToRemote(targetRoot: string) {
	const git: SimpleGit = simpleGit(targetRoot);
	const s = spinner();
	
	// 1. Validation
	const isRepo = await git.checkIsRepo();
	if (!isRepo) {
		consola.error(pc.red(`Not a git repository: ${targetRoot}`));
		return;
	}
	
	// 2. Discovery
	const remotes = await git.getRemotes(true); // true = verbose
	if (remotes.length === 0) {
		consola.warn("No remotes configured.");
		return;
	}
	
	// Dedup remotes by name
	const uniqueRemotes = Array.from(new Set(remotes.map(r => r.name)));
	
	// 3. Selection
	const selected = await multiselect({
		message: 'Select remotes to push to:',
		options: uniqueRemotes.map(name => ({
			value: name,
			label: name,
			hint: remotes.find(r => r.name === name)?.refs.push
		})),
		initialValues: ['origin'], // Default to origin
		required: true
	});
	
	if (isCancel(selected)) return;
	
	// 4. Execution
	const targets = selected as string[];
	s.start(`Pushing to ${targets.join(', ')}...`);
	
	const results = [];
	for (const remote of targets) {
		try {
			await git.push(remote);
			results.push({ remote, status: 'success' });
		} catch (error: any) {
			results.push({ remote, status: 'error', msg: error.message });
		}
	}
	
	s.stop('Push operation completed.');
	
	// 5. Report
	results.forEach(res => {
		if (res.status === 'success') {
			consola.success(pc.green(`✅ Pushed to ${res.remote}`));
		} else {
			consola.error(pc.red(`❌ Failed to push to ${res.remote}: ${res.msg}`));
		}
	});
}