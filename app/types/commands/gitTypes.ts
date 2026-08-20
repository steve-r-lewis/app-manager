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
 * Central type definitions for Local Git Operations.
 *
 * This file contains interfaces for interacting with the Git CLI via 'simple-git'.
 * It covers:
 * - Repository Status & State
 * - Command Options (Init, Clone, Commit, Push, Sync)
 * - Remote Configuration (Local references)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.3.0, 20260110-22:16
 * Cleaned up the file to ensure stricter TypeScript rules.
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

import { LLMProviderStatus } from '../../types/index.js';

// ============================================================================
// Core State Types
// ============================================================================

/**
 * Represents the current status of a local repository.
 * Vital for context generation and UI feedback.
 */
export interface GitStatusResult {
	branch: string;
	isDirty: boolean;
	modified: string[];
	staged: string[];
	ahead?: number;
	behind?: number;
}

/**
 * Represents a remote repository reference configured locally.
 * Returned by simple-git's getRemotes(true).
 */
export interface GitRemote {
	name: string;
	refs: {
		fetch: string;
		push: string;
	};
}

// ============================================================================
// Command Option Types
// ============================================================================

/**
 * Options for initializing a new repository.
 */
export interface GitInitOptions {
	cwd: string;
	defaultBranch?: string; // default: 'main'
	userName?: string;
	userEmail?: string;
}

/**
 * Options for cloning a repository (Bootstrapping).
 */
export interface GitCloneOptions {
	url: string;          // Remote URL
	destination: string;  // Local path
	branch?: string;      // Specific branch/tag
	depth?: number;       // Shallow clone depth
}

/**
 * Options for adding a submodule.
 */
export interface GitSubmoduleOptions {
	cwd: string;
	url: string;
	path: string;
	branch?: string;
}

/**
 * Options for the commit workflow.
 */
export interface GitCommitOptions {
	message?: string; // Manual message (bypasses AI)
	availableLLMs?: LLMProviderStatus[]; // For the selection menu
}

/**
 * Options for pushing changes.
 */
export interface GitPushOptions {
	remote?: string;
	branch?: string;
}

/**
 * Options for the sync workflow.
 */
export interface GitSyncOptions {
	force?: boolean; // Headless: Skip UI prompts
}
