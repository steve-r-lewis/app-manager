/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/githubServiceTypes.ts
 * @version:    1.2.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Central type definitions for the Remote GitHub Domain.
 *
 * This file contains interfaces for:
 * 1. GitHub REST API Responses (Snake_Case to match API).
 * 2. Repository Registry Configuration (JSON file structure).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0, 20260101-22:26
 * Added GitStatusResult interface for pushAll command logic.
 *
 * V1.1.0, 20251231-01:30
 * Refactored to namespaced types (GithubPrefix) for clarity.
 *
 * V1.0.0, 20251231-01:08
 * Initial creation and release of githubServiceTypes.ts
 *
 * ================================================================================
 */

/**
 * GithubRepositoryConfig {
 * GithubRegistry {
 * GithubUser {
 * GithubRepo {
 * GithubOrg {
 * GithubApiError {
 */

/**
 * Configuration object for a single repository in the commandRegistry.
 */
export interface GithubRepositoryConfig {
	repositoryName: string;
	githubToken: string;
	githubOrg?: string; // Optional: Overrides default user scope
}

/**
 * The Root structure of the commandRegistry file.
 */
export interface GithubRegistry {
	records: GithubRepositoryConfig[];
}

// --- GitHub REST API Contracts (Snake Case matches API) ---

/**
 * Represents a GitHub User or Organization owner.
 */
export interface GithubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
	type: 'User' | 'Organization';
}

/**
 * Represents a GitHub Repository object returned from the API.
 * Properties are kept in snake_case to match the raw API response strictly.
 */
export interface GithubRepo {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: GithubUser;
	html_url: string;
	description: string | null;
	fork: boolean;
	url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	default_branch: string;
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

/**
 * Standardized Error Object for API failures.
 */
export interface GithubApiError {
	message: string;
	documentation_url?: string;
	status?: string;
}