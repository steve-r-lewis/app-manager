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
	
	/**
	 * Tries to find specific config for a repo, or falls back to global defaults.
	 */
	private getConfig(repoName: string): { token: string; org: string } {
		let token = process.env.GITHUB_TOKEN;
		let org = process.env.GITHUB_ORG || 'steve-r-lewis';
		
		// Try to find a specific override in the registry
		if (configService.repoConfig) {
			const record = configService.repoConfig.records.find(r => r.repositoryName === repoName);
			if (record) {
				// If the record has a specific token (or env var name), use it
				// Note: In a real app, you might distinguish between "Raw Token" and "Env Var Name"
				// For now, we assume global token unless specific logic is added.
				if (record.githubOrg) org = record.githubOrg;
			}
		}
		
		if (!token) {
			throw new Error("Missing GITHUB_TOKEN. Check your .env file.");
		}
		
		return { token, org };
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
}

export const github = new GitHubService();