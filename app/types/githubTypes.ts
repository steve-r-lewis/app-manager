/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/githubTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:08
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
 * V1.0.0, 20251231-01:08
 * Initial creation and release of githubTypes.ts
 *
 * ================================================================================
 */

export interface GithubRepositoryConfig {
	repositoryName: string;
	githubToken: string;
	githubOrg?: string;
}

export interface GithubRegistry {
	records: GithubRepositoryConfig[];
}

// --- API Types ---

export interface GithubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
}

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

export interface GithubOrg {
	login: string;
	id: number;
	url: string;
	repos_url: string;
}