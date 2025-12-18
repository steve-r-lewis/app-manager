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

export class GitHubService {
  private token: string;
  private org: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    this.org = process.env.GITHUB_ORG || 'steve-r-lewis'; // Default from your script
  }

  private async api(endpoint: string, method: string = 'GET', body?: any) {
    if (!this.token) throw new Error("Missing GITHUB_TOKEN");

    const res = await fetch(`https://api.github.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Nuxt-Monorepo-Tool'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
      if (res.status === 404) return null; // Handle 404 gracefully
      throw new Error(`GitHub API Error: ${res.statusText}`);
    }
    return res.json();
  }

  async ensureRepoExists(name: string, isOrg: boolean = false): Promise<string> {
    const owner = this.org; // Simplify for now, assuming org context
    const existing = await this.api(`/repos/${owner}/${name}`);

    if (existing) {
      consola.success(`Repo exists: ${owner}/${name}`);
      return existing.clone_url;
    }

    consola.info(`Creating repo: ${owner}/${name}`);
    const endpoint = isOrg ? `/orgs/${owner}/repos` : `/user/repos`;

    const created = await this.api(endpoint, 'POST', {
      name,
      private: true,
      visibility: 'private'
    });

    return created.clone_url;
  }
}

export const github = new GitHubService();
