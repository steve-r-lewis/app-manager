/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/githubTypes.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Central type definitions for the GitHub Domain.
 *
 * Includes:
 * 1. Configuration types (for repositoryRegistry.json).
 * 2. API Response types (for GitHub REST API interactions).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251231-01:30
 * Refactored to namespaced types (GithubPrefix) for clarity.
 *
 * V1.0.0, 20251231-01:08
 * Initial creation and release of githubTypes.ts
 *
 * ================================================================================
 */

/**
 * Configuration object representing a single repository entry in the registry.
 * Maps to an entry in `repositoryRegistry.json`.
 */
export interface GithubRepositoryConfig {
	repositoryName: string;
	githubToken: string;
	githubOrg?: string; // Required to match repositoryRegistry.json and githubService usage
}

/**
 * Structure of the JSON file used to store repository configurations.
 */
export interface GithubRegistry {
	records: GithubRepositoryConfig[];
}

// --- API Response Types (Used by GithubService) ---

/**
 * Represents a GitHub User object returned from the API.
 */
export interface GithubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
}

/**
 * Represents a GitHub Repository object returned from the API.
 */
export interface GithubRepo {
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
	owner?: GithubUser;
}

/**
 * Represents a GitHub Organization object returned from the API.
 */
export interface GithubOrg {
	login: string;
	id: number;
	url: string;
	repos_url: string;
}