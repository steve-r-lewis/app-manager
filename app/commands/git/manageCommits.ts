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

import { simpleGit, SimpleGit } from 'simple-git';
import { select, text, multiselect, isCancel, spinner } from '@clack/prompts';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';

function getSmartDiff(diff: string, maxLength = 3500): string {
	if (diff.length <= maxLength) return diff;
	return diff.substring(0, maxLength) + '\n...[Diff Truncated]...';
}

export async function manageCommits(targetRoot: string) {
	const git: SimpleGit = simpleGit(targetRoot);
	const s = spinner();
	
	// 1. Validation
	const isRepo = await git.checkIsRepo();
	if (!isRepo) {
		consola.error(pc.red(`Not a git repository: ${targetRoot}`));
		return;
	}
	
	// 2. Status Check
	const status = await git.status();
	
	if (status.files.length === 0) {
		consola.info("Working tree clean. No changes to commit.");
		return;
	}
	
	// 3. Smart Staging
	// If nothing is staged, force user to select files (Safety check)
	if (status.staged.length === 0) {
		const selectedFiles = await multiselect({
			message: 'No files staged. Select files to commit:',
			options: status.files.map(f => ({
				value: f.path,
				label: `${f.working_dir} ${f.path}`,
			})),
			required: false
		});
		
		if (isCancel(selectedFiles)) return;
		
		if (selectedFiles.length > 0) {
			s.start('Staging files...');
			await git.add(selectedFiles as string[]);
			s.stop('Files staged.');
		} else {
			consola.warn('No files selected. Aborting.');
			return;
		}
	}
	
	// 4. Generate Diff for AI
	const diff = await git.diff(['--staged']);
	let commitMessage = '';
	
	if (diff.trim()) {
		s.start("AI is analyzing changes...");
		try {
			const smartDiff = getSmartDiff(diff);
			const prompt = `
You are a senior developer. Generate a concise, conventional commit message for this diff.
Format: <type>(<scope>): <subject>
Example: feat(auth): add login validation logic
Diff:
${smartDiff}
            `.trim();
			
			commitMessage = await llm.generate(prompt);
			s.stop("Analysis Complete");
		} catch (error) {
			s.stop("AI Analysis Failed");
			consola.error("Could not generate message. Falling back to manual input.");
		}
	} else {
		consola.warn("Staged changes are empty or binary.");
	}
	
	// 5. Review Loop
	let confirmed = false;
	while (!confirmed) {
		const action = await select({
			message: `Commit Message: "${pc.cyan(commitMessage || 'Top secret changes')}"`,
			options: [
				{ value: 'commit', label: '✅ Commit' },
				{ value: 'edit', label: '✏️ Edit Message' },
				{ value: 'regenerate', label: '🔄 Regenerate (AI)' },
				{ value: 'cancel', label: '❌ Cancel' }
			]
		});
		
		if (isCancel(action) || action === 'cancel') return;
		
		if (action === 'commit') {
			confirmed = true;
		} else if (action === 'edit') {
			const userMsg = await text({
				message: 'Enter commit message:',
				initialValue: commitMessage
			});
			if (!isCancel(userMsg)) commitMessage = userMsg as string;
		} else if (action === 'regenerate') {
			s.start("Regenerating...");
			try {
				commitMessage = await llm.generate(`Retry: Generate a DIFFERENT, shorter commit message for:\n${getSmartDiff(diff)}`);
				s.stop("Regenerated.");
			} catch (err) {
				s.stop("Failed.");
			}
		}
	}
	
	// 6. Execution
	try {
		await git.commit(commitMessage);
		consola.success(pc.green(`Changes committed locally. Run "Push" to sync.`));
	} catch (error: any) {
		consola.error(`Commit Failed: ${error.message}`);
	}
}