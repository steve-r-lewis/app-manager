/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/github.types.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 18
 * @createTime: 22:02
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Central type definitions for the GitHub Domain.
 * Includes:
 * 1. Configuration types (for repositoryRegistry.json).
 * 2. API Response types (for GitHub REST API interactions).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251228-22:45
 * Added API Response interfaces and fixed missing githubOrg property.
 *
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251218-22:02
 * Initial creation and release of github.types.ts
 *
 * ================================================================================
 */

export interface RepositoryConfig {
	repositoryName: string;
	githubToken: string;
	githubOrg?: string; // Required to match repositoryRegistry.json and githubService usage
}

export interface RepoRegistry {
	records: RepositoryConfig[];
}

// --- API Types (Used by GithubService) ---

export interface GitHubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
}

export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	private: boolean;
	html_url: string;
	description: string | null;
	fork: boolean;
	created_at: string;
	updated_at: string;
	default_branch: string;
	clone_url?: string;
	owner?: GitHubUser;
}

export interface GitHubOrg {
	login: string;
	id: number;
	url: string;
	repos_url: string;
}
