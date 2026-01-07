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

export interface CommandMetadata {
	id: string;             // Unique ID (e.g., 'git.commit')
	domain: string;         // Category (e.g., 'git', 'app', 'nuxt')
	name: string;           // CLI Action Name (e.g., 'commit')
	label: string;          // TUI Display Name (e.g., '📝 Smart Commit')
	description: string;    // Help text
	hidden?: boolean;       // Hide from menus?
}

export interface CommandOptions {
	[key: string]: any;     // Flexible key-value pairs for flags (--force, --dry-run)
}