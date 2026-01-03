/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/gitTypes.ts
 * @version:    1.0.1
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
	force?: boolean; // Re-initialize existing repositories if true
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
	force?: boolean; // Bypass safety checks in headless mode
}

/**
 * Represents a configured remote upstream.
 */
export interface GitRemoteConfig {
	name: string;
	url: string;
}

/**
 * Represents the status of a repository (e.g. for prompt display).
 */
export interface GitStatusResult {
	branch: string;
	isDirty: boolean;
	modified: string[];
	staged: string[];
}