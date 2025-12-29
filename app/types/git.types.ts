/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/git.types.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 27
 * @createTime: 15:51
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
 * V1.0.0, 20251227-15:51
 * Initial creation and release of git.types.ts
 *
 * ================================================================================
 */

import type { LLMProviderStatus } from './llm.types';

export interface DeleteRepoOptions {
	repo?: string;    // "owner/repo" or "repo"
	confirm?: string; // The "DELETE" string
}

export interface InitOptions {
	force?: boolean;
}

export interface CommitOptions {
	message?: string; // For headless/manual mode
	availableLLMs?: LLMProviderStatus[]; // Passed from app.ts health check
}

export interface PushOptions {
	remote?: string;
	branch?: string;
}

export interface SyncOptions {
	force?: boolean; // Headless flag
}