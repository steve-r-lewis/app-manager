/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/gitTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:04
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
 * V1.0.0, 20251231-01:04
 * Initial creation and release of gitTypes.ts
 *
 * ================================================================================
 */

import type { LLMProviderStatus } from './llmTypes';

export interface GitDeleteRepoOptions {
	repo?: string;    // "owner/repo" or "repo"
	confirm?: string; // The "DELETE" string
}

export interface GitInitOptions {
	force?: boolean;
}

export interface GitCommitOptions {
	message?: string; // For headless/manual mode
	availableLLMs?: LLMProviderStatus[]; // Passed from app.ts health check
}

export interface GitPushOptions {
	remote?: string;
	branch?: string;
}

export interface GitSyncOptions {
	force?: boolean; // Headless flag
}

export interface GitRemoteConfig {
	name: string;
	url: string;
}

export interface GitStatusResult {
	branch: string;
	isDirty: boolean;
	modified: string[];
	staged: string[];
}