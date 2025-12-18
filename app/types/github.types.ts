/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/github.types.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 22:02
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
 * V1.0.0, 20251218-22:02
 * Initial creation and release of github.types.ts
 *
 * ================================================================================
 */

export interface RepositoryConfig {
	repositoryName: string;
	githubToken: string;
}

export interface RepoRegistry {
	records: RepositoryConfig[];
}