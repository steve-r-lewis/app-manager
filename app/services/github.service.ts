/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/github.service.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:21
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
 * V1.0.0, 20251217-01:21
 * Initial creation and release of github.service.ts
 *
 * ================================================================================
 */

import { consola } from 'consola';
import { configService } from './config.service.js';

export class GitHubService {
	
	// Lazy Getter: Reads config only when accessed, ensuring .env is loaded
	private get token(): string {
		// 1. Check Registry first (if we implemented per-repo tokens)
		// For now, we fall back to the global env
		const envToken = process.env.GITHUB_TOKEN;
		if (!envToken) {
			throw new Error("Missing GITHUB_TOKEN. Check your .env file.");
		}
		return envToken;
	}
	
	private get org(): string {
		return process.env.GITHUB_ORG || 'steve-r-lewis';
	}
	
	private async api(endpoint: string, method: string = 'GET', body?: any) {
		// Token access here is safe because api() is called AFTER app start
		const token = this.token;
		
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
			if (res.status === 404) return null; // Handle 404 gracefully
			
			// Log detailed error for debugging
			const errText = await res.text();
			throw new Error(`GitHub API Error [${res.status}]: ${res.statusText} - ${errText}`);
		}
		return res.json();
	}
	
	async ensureRepoExists(name: string, isOrg: boolean = false): Promise<string> {
		const owner = this.org;
		
		try {
			// 1. Check if it exists
			const existing = await this.api(`/repos/${owner}/${name}`);
			if (existing) {
				consola.success(`Repo exists: ${owner}/${name}`);
				return existing.clone_url;
			}
			
			// 2. Create if missing
			consola.info(`Creating repo: ${owner}/${name}`);
			const endpoint = isOrg ? `/orgs/${owner}/repos` : `/user/repos`;
			
			const created = await this.api(endpoint, 'POST', {
				name,
				private: true, // Default to private security
				auto_init: true // Create with README so we can clone immediately
			});
			
			consola.success(`Created repo: ${created.full_name}`);
			return created.clone_url;
			
		} catch (error) {
			consola.error(`Failed to ensure repo ${owner}/${name}`);
			throw error;
		}
	}
}

export const github = new GitHubService();