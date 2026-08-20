/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/baseCommandTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 01:14
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
 * V1.0.0, 20260107-01:14
 * Initial creation and release of baseCommandTypes.ts
 *
 * ================================================================================
 */

// app/types/baseCommandTypes.ts refactor
export interface CommandMetadata {
	readonly id: string;             // Unique ID (e.g., 'git.commit')
	readonly domain: string;         // Category (e.g., 'git', 'app', 'nuxt')
	readonly name: string;           // CLI Action Name (e.g., 'commit')
	readonly label: string;          // TUI Display Name (e.g., '📝 Smart Commit')
	readonly description: string;    // Help text
	readonly hidden?: boolean;       // Hide from menus?
}

// Enforce strict records instead of any
export type CommandOptions = Record<string, string | number | boolean | undefined>;

