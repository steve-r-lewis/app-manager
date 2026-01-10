/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/githubService.ts
 * @version:    1.4.0
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
 * It utilizes the 'simple-git' library to execute underlying git CLI commands
 * while managing complex arguments and error handling logic.
 *
 * Key Features:
 * - Repository Initialization (with safe branch naming)
 * - Submodule Management (for Monorepo Layers)
 * - Atomic Stage & Commit operations
 * - Integrated Logging for Audit Trails
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.4.0, 20260110-21:15
 * Added cloneRepo method to support future workspace bootstrapping features.
 *
 * V1.3.0, 20260110-20:55
 * Added debug logging to getStatus for better observability in verbose mode.
 * Verified async/await strictness (removing all Promise chaining).
 *
 * V1.2.1, 20260110-19:28
 * Update: getRemotes
 * Change: Added logger.debug statements to track the retrieval attempt and the count of remotes found.
 *
 * V1.2.0, 20260110-17:35
 * Extracted inline GitRemote type to gitTypes.ts.
 * Enforced strict async/await pattern.
 *
 * V1.1.0, 20260110-17:20
 * Refactored to integrate LoggerService for verbose/file feedback.
 * Fixed JSDoc inaccuracies regarding ProcessService.
 * Hardened error handling for Remote API calls.
 * Applied strict return typing for API responses.
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

import { simpleGit, SimpleGit } from 'simple-git';
import { logger } from './loggerService';
import type {
	GitInitOptions,
	GitSubmoduleOptions,
	GitStatusResult,
	GithubRepo,
	GitRemote
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
		logger.info(`Initializing Git repository in: ${cwd}`);
		
		const git = this.git(cwd);
		
		await git.init();
		
		// Rename branch if needed
		const branches = await git.branchLocal();
		if (branches.current !== defaultBranch) {
			logger.debug(`Renaming branch '${branches.current}' to '${defaultBranch}'`);
			await git.branch(['-M', defaultBranch]);
		}
		
		// Configure User (Local Scope)
		if (userName) {
			logger.debug(`Setting local git user.name: ${userName}`);
			await git.addConfig('user.name', userName);
		}
		if (userEmail) {
			logger.debug(`Setting local git user.email: ${userEmail}`);
			await git.addConfig('user.email', userEmail);
		}
	}
	
	/**
	 * Clones a repository to the local file system.
	 * Does not require an existing git instance/cwd.
	 */
	public async cloneRepo(options: GitCloneOptions): Promise<void> {
		const { url, destination, branch, depth } = options;
		logger.info(`Cloning repository...`);
		logger.debug(`Source: ${url} | Dest: ${destination}`);
		
		// Construct args
		const args: string[] = [];
		if (branch) {
			args.push('--branch', branch);
		}
		if (depth) {
			args.push('--depth', String(depth));
		}
		
		// Use global instance for cloning (not bound to a specific CWD yet)
		try {
			await simpleGit().clone(url, destination, args);
			logger.info('Clone operation successful.');
		} catch (error: any) {
			const msg = `Clone failed: ${error.message}`;
			logger.error(msg);
			throw new Error(msg);
		}
	}
	
	/**
	 * Checks status of the repository.
	 * Returns a structured object useful for AI prompts and UI.
	 */
	public async getStatus(cwd: string): Promise<GitStatusResult> {
		// Log at DEBUG level to prevent spamming standard logs during polling
		logger.debug(`Checking git status for: ${cwd}`);
		
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
		logger.info(`Creating commit in ${cwd}`);
		logger.debug(`Message: "${message}" | Files: ${files.join(', ')}`);
		
		const git = this.git(cwd);
		await git.add(files);
		await git.commit(message);
	}
	
	/**
	 * Pushes to remote.
	 */
	public async push(cwd: string, remote: string = 'origin', branch?: string): Promise<void> {
		const target = branch ? `${remote}/${branch}` : remote;
		logger.info(`Pushing changes to ${target}...`);
		
		const git = this.git(cwd);
		if (branch) {
			await git.push(remote, branch);
		} else {
			await git.push(remote);
		}
		logger.debug('Push completed successfully.');
	}
	
	/**
	 * Syncs repository (Pull + Submodule Update).
	 * @param cwd - The repository root
	 * @param silent - If false, pipes output to stdout/stderr (Headless mode requirement)
	 */
	public async syncRepo(cwd: string, silent: boolean = true): Promise<void> {
		logger.info(`Syncing repository at: ${cwd}`);
		const git = this.git(cwd);
		
		// In headless mode, we want to see the raw git output.
		// This is synchronous configuration of the instance, not an async operation itself.
		if (!silent) {
			git.outputHandler((command, stdout, stderr) => {
				stdout.pipe(process.stdout);
				stderr.pipe(process.stderr);
			});
		}
		
		// 1. Pull Root
		logger.debug('Executing git pull...');
		await git.pull();
		
		// 2. Update Submodules (--init --recursive)
		logger.debug('Updating submodules...');
		await git.submoduleUpdate(['--init', '--recursive']);
		
		logger.info('Sync complete.');
	}
	
	/**
	 * Adds a submodule.
	 */
	public async addSubmodule(options: GitSubmoduleOptions): Promise<void> {
		const { cwd, url, path, branch } = options;
		logger.info(`Adding submodule: ${url} -> ${path}`);
		
		const args = ['add'];
		if (branch) args.push('-b', branch);
		args.push(url, path);
		
		await this.git(cwd).submodule(args);
	}
	
	/**
	 * Gets list of remotes.
	 */
	public async getRemotes(cwd: string): Promise<GitRemote[]> {
		logger.debug(`Retrieving remotes for: ${cwd}`);
		
		const remotes = await this.git(cwd).getRemotes(true);
		
		logger.debug(`Found ${remotes.length} remote(s).`);
		return remotes;
	}
	
	/**
	 * Gets the raw diff of staged changes (for LLM context).
	 */
	public async getStagedDiff(cwd: string): Promise<string> {
		const diff = await this.git(cwd).diff(['--cached']);
		logger.debug(`Retrieved staged diff (${diff.length} chars)`);
		return diff;
	}
	
	// ============================================================================
	// Remote GitHub API Operations (via fetch)
	// ============================================================================
	
	private getAuthHeader() {
		const token = process.env.GITHUB_TOKEN;
		if (!token) {
			const error = new Error('Missing GITHUB_TOKEN in environment variables');
			logger.error(error.message);
			throw error;
		}
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
		logger.warn(`DELETING REMOTE REPO: ${owner}/${repo}`);
		
		const url = `https://api.github.com/repos/${owner}/${repo}`;
		
		const response = await fetch(url, {
			method: 'DELETE',
			headers: this.getAuthHeader()
		});
		
		if (!response.ok) {
			const msg = `Failed to delete repo ${owner}/${repo}: ${response.statusText}`;
			logger.error(msg);
			throw new Error(msg);
		}
		logger.info(`Successfully deleted remote repo: ${owner}/${repo}`);
	}
	
	/**
	 * Lists repositories for the authenticated user/org.
	 */
	public async listRemoteRepos(org?: string): Promise<GithubRepo[]> {
		const target = org || 'Authenticated User';
		logger.debug(`Fetching remote repositories for: ${target}`);
		
		const url = org
			? `https://api.github.com/orgs/${org}/repos`
			: `https://api.github.com/user/repos`;
		
		const response = await fetch(url, {
			method: 'GET',
			headers: this.getAuthHeader()
		});
		
		if (!response.ok) {
			const msg = `GitHub API Error (${response.status}): ${response.statusText}`;
			logger.error(msg);
			throw new Error(msg);
		}
		
		const repos = await response.json();
		logger.debug(`Fetched ${repos.length} repositories.`);
		return repos;
	}
}

export const githubService = new GithubService();