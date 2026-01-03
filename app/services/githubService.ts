/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/githubService.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 01:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The GitHub Service.
 *
 * Provides a high-level abstraction for Git Version Control operations.
 * It utilizes the ProcessService to execute underlying git CLI commands
 * while managing complex arguments and error handling logic.
 *
 * Key Features:
 * - Repository Initialization (with safe branch naming)
 * - Submodule Management (for Monorepo Layers)
 * - Atomic Stage & Commit operations
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260102-01:08
 * Initial creation and release of githubService.ts
 * Initial migration from legacy codebase.
 * Refactored to use the Singleton ProcessService and strict Option interfaces.
 *
 * ================================================================================
 */

import { processService } from './processService';
import { logger } from './loggerService';
import type { GitInitOptions, GitSubmoduleOptions } from '../types/index';

class GithubService {
	
	/**
	 * Initializes a new Git repository in the specified directory.
	 * Optionally configures the local user identity for this specific repo.
	 * * @param options Configuration options (cwd, branch, user details)
	 */
	public async initRepo(options: GitInitOptions): Promise<void> {
		const { cwd, defaultBranch = 'main', userName, userEmail } = options;
		
		logger.info(`Initializing Git repository in: ${cwd}`);
		
		// 1. Initialize
		await processService.execute('git init', { cwd });
		
		// 2. Rename default branch (modern standard is 'main')
		if (defaultBranch) {
			await processService.execute(`git branch -M ${defaultBranch}`, { cwd });
		}
		
		// 3. Configure local user identity if provided
		// This is crucial for CI/CD or scaffolding tools where global config might be missing
		if (userName) {
			await processService.execute(`git config user.name "${userName}"`, { cwd });
		}
		if (userEmail) {
			await processService.execute(`git config user.email "${userEmail}"`, { cwd });
		}
	}
	
	/**
	 * Adds a git submodule to the repository.
	 * Used for adding Layers to the Monorepo.
	 * * @param options Submodule details (url, path)
	 */
	public async addSubmodule(options: GitSubmoduleOptions): Promise<void> {
		const { cwd, url, path, branch } = options;
		
		logger.info(`Adding submodule: ${path}`);
		
		let command = `git submodule add`;
		if (branch) {
			command += ` -b ${branch}`;
		}
		command += ` ${url} ${path}`;
		
		const result = await processService.execute(command, { cwd });
		
		if (result.exitCode !== 0) {
			logger.error(`Failed to add submodule ${path}`);
			throw new Error(result.stderr || 'Git submodule add failed');
		}
	}
	
	/**
	 * Stages all changes and commits them with a message.
	 * Useful for initial scaffolding commits.
	 * * @param cwd The repository root
	 * @param message The commit message
	 */
	public async stageAndCommit(cwd: string, message: string): Promise<void> {
		// 1. Stage all files
		await processService.execute('git add .', { cwd });
		
		// 2. Commit
		// We use safe quotes around the message to prevent shell injection issues
		const safeMessage = message.replace(/"/g, '\\"');
		await processService.execute(`git commit -m "${safeMessage}"`, { cwd });
		
		logger.success('Git commit created successfully');
	}
}

// Export as Singleton
export const githubService = new GithubService();