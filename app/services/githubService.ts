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
 * V1.1.0, 2026005-23:47
 *
 * V1.0.0, 20260102-01:08
 * Initial creation and release of githubService.ts
 * Initial migration from legacy codebase.
 * Refactored to use the Singleton ProcessService and strict Option interfaces.
 *
 * ================================================================================
 */

import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import { logger } from './loggerService';
import type {
	GitInitOptions,
	GitSubmoduleOptions,
	GitStatusResult,
	GitCommitOptions
} from '../types/index';

class GithubService {
	
	// --- Helper: Get Git Instance for a specific path ---
	private git(cwd: string): SimpleGit {
		return simpleGit(cwd);
	}
	
	// ============================================================================
	// Local Git Operations (via simple-git)
	// ============================================================================
	
	/**
	 * Initializes a new Git repository.
	 */
	public async initRepo(options: GitInitOptions): Promise<void> {
		const { cwd, defaultBranch = 'main', userName, userEmail } = options;
		const git = this.git(cwd);
		
		await git.init();
		
		// Rename branch if needed
		const branches = await git.branchLocal();
		if (branches.current !== defaultBranch) {
			await git.branch(['-M', defaultBranch]);
		}
		
		// Configure User (Local Scope)
		if (userName) await git.addConfig('user.name', userName);
		if (userEmail) await git.addConfig('user.email', userEmail);
	}
	
	/**
	 * Checks status of the repository.
	 * Returns a structured object useful for AI prompts and UI.
	 */
	public async getStatus(cwd: string): Promise<GitStatusResult> {
		const status = await this.git(cwd).status();
		
		return {
			branch: status.current || 'HEAD',
			isDirty: !status.isClean(),
			modified: status.modified,
			staged: status.staged,
			ahead: status.ahead,
			behind: status.behind
		};
	}
	
	/**
	 * Stages files and commits them.
	 */
	public async createCommit(cwd: string, message: string, files: string[] = ['.']): Promise<void> {
		const git = this.git(cwd);
		await git.add(files);
		await git.commit(message);
	}
	
	/**
	 * Pushes to remote.
	 */
	public async push(cwd: string, remote: string = 'origin', branch?: string): Promise<void> {
		const git = this.git(cwd);
		if (branch) {
			await git.push(remote, branch);
		} else {
			await git.push(remote);
		}
	}
	
	/**
	 * Syncs repository (Pull + Submodule Update).
	 */
	public async sync(cwd: string): Promise<void> {
		const git = this.git(cwd);
		await git.pull();
		await git.submoduleUpdate(['--init', '--recursive']);
	}
	
	/**
	 * Adds a submodule.
	 */
	public async addSubmodule(options: GitSubmoduleOptions): Promise<void> {
		const { cwd, url, path, branch } = options;
		const args = ['add'];
		
		if (branch) args.push('-b', branch);
		args.push(url, path);
		
		await this.git(cwd).submodule(args);
	}
	
	/**
	 * Gets list of remotes.
	 */
	public async getRemotes(cwd: string): Promise<any[]> {
		return await this.git(cwd).getRemotes(true);
	}
	
	/**
	 * Gets the raw diff of staged changes (for LLM context).
	 */
	public async getStagedDiff(cwd: string): Promise<string> {
		return await this.git(cwd).diff(['--cached']);
	}
	
	// ============================================================================
	// Remote GitHub API Operations (via fetch)
	// ============================================================================
	
	private getAuthHeader() {
		const token = process.env.GITHUB_TOKEN;
		if (!token) throw new Error('Missing GITHUB_TOKEN');
		return {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/vnd.github.v3+json',
			'Content-Type': 'application/json'
		};
	}
	
	/**
	 * Deletes a repository from GitHub.
	 * WARNING: Destructive.
	 */
	public async deleteRemoteRepo(owner: string, repo: string): Promise<void> {
		const url = `https://api.github.com/repos/${owner}/${repo}`;
		
		const response = await fetch(url, {
			method: 'DELETE',
			headers: this.getAuthHeader()
		});
		
		if (!response.ok) {
			throw new Error(`Failed to delete repo ${owner}/${repo}: ${response.statusText}`);
		}
	}
	
	/**
	 * Lists repositories for the authenticated user/org.
	 */
	public async listRemoteRepos(org?: string): Promise<any[]> {
		const url = org
			? `https://api.github.com/orgs/${org}/repos`
			: `https://api.github.com/user/repos`;
		
		const response = await fetch(url, {
			method: 'GET',
			headers: this.getAuthHeader()
		});
		
		if (!response.ok) return [];
		return await response.json();
	}
}

export const githubService = new GithubService();