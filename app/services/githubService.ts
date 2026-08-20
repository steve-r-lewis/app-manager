/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/githubService.ts
 * @version:    1.4.1
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
 * V1.4.1, 20260820
 * Fixed addSubmodule calling the non-existent 'submodule' method on SimpleGit;
 * corrected to 'subModule' to match the installed simple-git 3.x API.
 * NOTE: tests/unit/services/githubService.test.ts mocks 'submodule' on the
 * fake git instance — that mock name needs updating to 'subModule' too, or
 * the addSubmodule test will fail even though the real code is now correct.
 *
 * V1.4.0, 20260110-21:15
 * Added cloneRepo method to support future workspace bootstrapping features.
 *
 * V1.3.0, 20260110-20:55
 * Added debug logging to getStatus for better observability in verbose mode.
 * Verified async/await strictness (removing all Promise chaining).
 *
 * V1.2.1, 20260110-19:28
 * Added logger.debug statements to track remote retrieval and remote count.
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
 * V1.0.0, 20260102-01:08
 * Initial creation and release of githubService.ts
 * Initial migration from legacy codebase.
 * Refactored to use the Singleton ProcessService and strict Option interfaces.
 *
 * ================================================================================
 */

import { simpleGit, SimpleGit } from 'simple-git';
import { logger } from './loggerService.js';
import type {
	GitInitOptions,
	GitSubmoduleOptions,
	GitStatusResult,
	GithubRepo,
	GitRemote,
	GitCloneOptions
} from '../types/index.js';
import type { IGithubService } from '../types/index.js';

class GithubService implements IGithubService {

	private git(cwd: string): SimpleGit {
		return simpleGit(cwd);
	}

	// ============================================================================
	// Local Git Operations (via simple-git)
	// ============================================================================

	public async initRepo(options: GitInitOptions): Promise<void> {
		const { cwd, defaultBranch = 'main', userName, userEmail } = options;
		logger.info(`Initializing Git repository in: ${cwd}`);

		const git = this.git(cwd);
		await git.init();

		const branches = await git.branchLocal();
		if (branches.current !== defaultBranch) {
			logger.debug(`Renaming branch '${branches.current}' to '${defaultBranch}'`);
			await git.branch(['-M', defaultBranch]);
		}

		if (userName) {
			logger.debug(`Setting local git user.name: ${userName}`);
			await git.addConfig('user.name', userName);
		}
		if (userEmail) {
			logger.debug(`Setting local git user.email: ${userEmail}`);
			await git.addConfig('user.email', userEmail);
		}
	}

	public async cloneRepo(options: GitCloneOptions): Promise<void> {
		const { url, destination, branch, depth } = options;
		logger.info(`Cloning repository...`);
		logger.debug(`Source: ${url} | Dest: ${destination}`);

		const args: string[] = [];
		if (branch) args.push('--branch', branch);
		if (depth) args.push('--depth', String(depth));

		try {
			await simpleGit().clone(url, destination, args);
			logger.info('Clone operation successful.');
		} catch (error: unknown) {
			const errMsg = error instanceof Error ? error.message : String(error);
			const msg = `Clone failed: ${errMsg}`;
			logger.error(msg);
			throw new Error(msg);
		}
	}

	public async getStatus(cwd: string): Promise<GitStatusResult> {
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

	public async createCommit(cwd: string, message: string, files: string[] = ['.']): Promise<void> {
		logger.info(`Creating commit in ${cwd}`);
		logger.debug(`Message: "${message}" | Files: ${files.join(', ')}`);

		const git = this.git(cwd);
		await git.add(files);
		await git.commit(message);
	}

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

	public async syncRepo(cwd: string, silent: boolean = true): Promise<void> {
		logger.info(`Syncing repository at: ${cwd}`);
		const git = this.git(cwd);

		if (!silent) {
			git.outputHandler((command, stdout, stderr) => {
				stdout.pipe(process.stdout);
				stderr.pipe(process.stderr);
			});
		}

		logger.debug('Executing git pull...');
		await git.pull();

		logger.debug('Updating submodules...');
		await git.submoduleUpdate(['--init', '--recursive']);

		logger.info('Sync complete.');
	}

	public async addSubmodule(options: GitSubmoduleOptions): Promise<void> {
		const { cwd, url, path, branch } = options;
		logger.info(`Adding submodule: ${url} -> ${path}`);

		const args = ['add'];
		if (branch) args.push('-b', branch);
		args.push(url, path);

		// FIX: simple-git 3.x exposes this as 'subModule' (capital M), not 'submodule'.
		await this.git(cwd).subModule(args);
	}

	public async getRemotes(cwd: string): Promise<GitRemote[]> {
		logger.debug(`Retrieving remotes for: ${cwd}`);
		const remotes = await this.git(cwd).getRemotes(true);
		logger.debug(`Found ${remotes.length} remote(s).`);
		return remotes;
	}

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
	 * Centralized network wrapper to enforce HTTP timeouts and prevent infinite CLI hangs.
	 */
	private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 15000): Promise<Response> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

		try {
			const response = await fetch(url, { ...options, signal: controller.signal });
			clearTimeout(timeoutId);
			return response;
		} catch (error: unknown) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === 'AbortError') {
				const timeoutMsg = `Network timeout: GitHub API did not respond within ${timeoutMs / 1000} seconds.`;
				logger.error(timeoutMsg);
				throw new Error(timeoutMsg);
			}
			throw error;
		}
	}

	public async deleteRemoteRepo(owner: string, repo: string): Promise<void> {
		logger.warn(`DELETING REMOTE REPO: ${owner}/${repo}`);
		const url = `https://api.github.com/repos/${owner}/${repo}`;

		const response = await this.fetchWithTimeout(url, {
			method: 'DELETE',
			headers: this.getAuthHeader()
		});

		if (!response.ok) {
			await this.handleApiError(response, `Failed to delete repo ${owner}/${repo}`);
		}
		logger.info(`Successfully deleted remote repo: ${owner}/${repo}`);
	}

	public async listRemoteRepos(org?: string): Promise<GithubRepo[]> {
		const target = org || 'Authenticated User';
		logger.debug(`Fetching remote repositories for: ${target}`);

		const url = org
			? `https://api.github.com/orgs/${org}/repos`
			: `https://api.github.com/user/repos`;

		const response = await this.fetchWithTimeout(url, {
			method: 'GET',
			headers: this.getAuthHeader()
		});

		if (!response.ok) {
			await this.handleApiError(response, 'Failed to fetch repositories');
		}

		const repos = await response.json();
		logger.debug(`Fetched ${repos.length} repositories.`);
		return repos;
	}

	/**
	 * Extracts detailed JSON error messages from GitHub responses.
	 */
	private async handleApiError(response: Response, context: string): Promise<never> {
		let errorMsg = response.statusText;
		try {
			const errorBody = await response.json();
			if (errorBody && errorBody.message) {
				errorMsg = errorBody.message;
			}
		} catch {
			// Fallback to statusText if body is unparseable
		}

		const msg = `GitHub API Error (${response.status}): ${context} - ${errorMsg}`;
		logger.error(msg);
		throw new Error(msg);
	}
}

export const githubService = new GithubService();
