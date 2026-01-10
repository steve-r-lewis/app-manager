/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/gitTypes.ts
 * @version:    1.2.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:04
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Central type definitions for the Git Operations Domain.
 * These interfaces define the command arguments and return structures for
 * core version control tasks, including syncing, pushing, and AI-assisted commits.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0, 20260110-21:15
 * Added GitCloneOptions to support repository bootstrapping.
 *
 * V1.0.3, 20260110-19:17
 * Added GitRemote interface to replace inline type definitions.
 *
 * V1.0.2, 20250108-22:55
 * Updated project details.
 *
 * V1.0.1, 20251231-01:33
 * Refactored to namespaced types (GitPrefix) for clarity.
 *
 * V1.0.0, 20251231-01:04
 * Initial creation and release of gitTypes.ts
 *
 * ================================================================================
 */

import type { LLMProviderStatus } from './llmTypes';

/**
 * Options for the "git delete" command.
 */
export interface GitDeleteRepoOptions {
	repo?: string;    // "owner/repo" or "repo"
	confirm?: string; // The specific confirmation string required to execute. The "DELETE" string
}

/**
 * Options for the "git init" command.
 */
export interface GitInitOptions {
	cwd: string;
	defaultBranch?: string;
	userName?: string;
	userEmail?: string;
	force?: boolean; // Re-initialize existing repositories if true
}

/**
 * Options for the "git submodules" command.
 */
export interface GitSubmoduleOptions {
	cwd: string;
	url: string;
	path: string;
	branch?: string;
}

/**
 * Options for the "git commit" command.
 */
export interface GitCommitOptions {
	message?: string; // Manual message string (bypasses AI generation)
	availableLLMs?: LLMProviderStatus[]; // Passed from app health check for the AI selection menu
}

/**
 * Options for the "git push" command.
 */
export interface GitPushOptions {
	remote?: string;
	branch?: string;
}

/**
 * Options for the "git sync" command.
 */
export interface GitSyncOptions {
	force?: boolean; // Headless mode: Skips UI prompts/intro
}

/**
 * Represents a configured remote upstream.
 */
export interface GitRemoteConfig {
	name: string;
	url: string;
}

export interface GitStatusResult {
	branch: string;
	isDirty: boolean;
	modified: string[];
	staged: string[];
	ahead?: number;
	behind?: number;
}

/**
 * Represents a remote repository configuration.
 * Returned by simple-git's getRemotes(true).
 */
export interface GitRemote {
	name: string;
	refs: {
		fetch: string;
		push: string;
	};
}

/**
 * Configuration options for cloning a repository.
 */
export interface GitCloneOptions {
	url: string;          // The remote repository URL
	destination: string;  // Local path to clone into
	branch?: string;      // Optional: Specific branch/tag to checkout
	depth?: number;       // Optional: Shallow clone depth (e.g. 1 for CI/CD)
}