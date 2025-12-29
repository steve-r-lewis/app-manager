/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/githubService.ts
 * @version:    1.0.2
 * @createDate: 2025 Dec 17
 * @createTime: 01:21
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Service to interact with the GitHub API.
 * Handles repository creation, deletion, listing, and user management.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.2, 20251226-1913
 * Refactored logic.
 *
 * V1.0.1, 20251223-01:00
 * Fixed JSON parsing crash on 204 No Content responses (DELETE operations).
 *
 * V1.0.0, 20251217-01:21
 * Initial creation and release of githubService.ts
 *
 * ================================================================================
 */

import { consola } from 'consola';
import { configService } from './configService';

export class GithubService {
	
	/**
	 * Tries to find specific config for a repo in the registry,
	 * or falls back to global environment defaults.
	 */
	private getConfig(repoName: string): { token: string; org: string } {
		let token = process.env.GITHUB_TOKEN;
		let org = process.env.GITHUB_ORG || 'steve-r-lewis';
		
		// Try to find a specific override in the registry
		if (configService.repoConfig) {
			const record = configService.repoConfig.records.find(r => r.repositoryName === repoName);
			if (record) {
				if (record.githubOrg) org = record.githubOrg;
			}
		}
		
		if (!token) {
			throw new Error("Missing GITHUB_TOKEN. Check your .env file.");
		}
		
		return { token, org };
	}
	
	/**
	 * Helper to get the global token for general operations (like listing repos)
	 */
	private get globalToken(): string {
		const token = process.env.GITHUB_TOKEN;
		if (!token) throw new Error("Missing GITHUB_TOKEN. Check your .env file.");
		return token;
	}
	
	private async api(endpoint: string, method: string = 'GET', body?: any, token?: string) {
		if (!token) throw new Error("No token provided for API call");
		
		const res = await fetch(`https://api.github.com${endpoint}`, {
			method,
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github+json',
				'User-Agent': 'Nuxt-Monorepo-Tool'
			},
			body: body ? JSON.stringify(body) : undefined
		});
		
		if (!res.ok) {
			if (res.status === 404) return null;
			const errText = await res.text();
			throw new Error(`GitHub API Error [${res.status}]: ${res.statusText} - ${errText}`);
		}
		
		// --- FIX: Handle 204 No Content (DELETE operations) ---
		if (res.status === 204) {
			return null;
		}
		
		return res.json();
	}
	
	async ensureRepoExists(name: string, isOrg: boolean = false): Promise<string> {
		const { token, org } = this.getConfig(name);
		
		try {
			const existing = await this.api(`/repos/${org}/${name}`, 'GET', undefined, token);
			if (existing) {
				consola.success(`Repo exists: ${org}/${name}`);
				return existing.clone_url;
			}
			
			consola.info(`Creating repo: ${org}/${name}`);
			const endpoint = isOrg ? `/orgs/${org}/repos` : `/user/repos`;
			
			const created = await this.api(endpoint, 'POST', {
				name,
				private: true,
				auto_init: true
			}, token);
			
			consola.success(`Created repo: ${created.full_name}`);
			return created.clone_url;
			
		} catch (error) {
			consola.error(`Failed to ensure repo ${org}/${name}`);
			throw error;
		}
	}
	
	/**
	 * Lists repositories for the authenticated user/org.
	 * Uses the Global Token since we are discovering repos.
	 */
	async listRepos(org?: string): Promise<{ name: string, full_name: string }[]> {
		const token = this.globalToken;
		const owner = org || (process.env.GITHUB_ORG || 'steve-r-lewis');
		const endpoint = org ? `/orgs/${org}/repos` : '/user/repos';
		
		try {
			// Fetch up to 100 recent repos
			const data = await this.api(`${endpoint}?sort=updated&per_page=100`, 'GET', undefined, token);
			return data || [];
		} catch (error) {
			consola.error("Failed to list repos", error);
			throw error;
		}
	}
	
	/**
	 * Deletes a repository. DANGEROUS.
	 * Uses repo-specific config if available, otherwise global token.
	 */
	async deleteRepo(owner: string, name: string): Promise<void> {
		const { token } = this.getConfig(name); // Use smart config lookup
		await this.api(`/repos/${owner}/${name}`, 'DELETE', undefined, token);
		consola.success(`Deleted remote repo: ${owner}/${name}`);
	}
}

/**
 * Returns a GitHub service instance.
 */
export const github = new GithubService();