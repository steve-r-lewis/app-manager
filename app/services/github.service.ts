/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/services/github.service.ts
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
import fs from 'fs';
import path from 'path';
import '../initEnv';

// IMPORTS
import type { RepoRegistryFile } from '../../types/github.types';

export class GitHubService {
  private token: string;
  private org: string;
  private baseUrl: string;

  constructor() {
    this.token = process.env.API_KEY_GITHUB_TOKEN || '';
    this.org = 'steve-r-lewis';
    this.baseUrl = 'https://api.github.com';
    this.loadConfig();

    if (!this.token) {
      consola.warn("GitHub Token missing. Check 'API_KEY_GITHUB_TOKEN' in scripts/.env");
    }
  }

  private loadConfig() {
    const configPath = path.resolve(process.cwd(), 'scripts/config/repositoryRegistry.json');

    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        // TYPE-SAFE PARSING
        const parsed: RepoRegistryFile = JSON.parse(raw);

        const ghRecord = parsed.records.find(r => r.tokenType === 'github');

        if (ghRecord) {
          this.org = ghRecord.githubOrg;
          this.baseUrl = ghRecord.baseURL;
        }
      } catch (e) {
        consola.warn("Failed to parse repositoryRegistry.json, using defaults.");
      }
    }
  }

  private async api(endpoint: string, method: string = 'GET', body?: any) {
    if (!this.token) throw new Error("Missing GitHub API Token");

    // Ensure no double slashes when joining base + endpoint
    const cleanBase = this.baseUrl.replace(/\/$/, '');

    const res = await fetch(`${cleanBase}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Nuxt-Monorepo-Tool'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
      if (res.status === 404) return null; // Graceful 404
      throw new Error(`GitHub API Error: ${res.statusText}`);
    }
    return res.json();
  }

  async ensureRepoExists(name: string, isOrg: boolean = false): Promise<string> {
    const owner = this.org;
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
