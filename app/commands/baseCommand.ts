/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/baseCommand.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 01:13
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Defines the abstract BaseCommand class, which serves as the foundational contract
 * for all CLI and TUI commands within the application.
 *
 * Responsibilities:
 * - Encapsulates command metadata (id, domain, name, visibility) in a strongly typed,
 *   readonly property.
 * - Declares the abstract `execute()` method that must be implemented by all concrete
 *   command classes to perform domain-specific operations.
 * - Provides an optional `isEnabled()` asynchronous hook for conditional availability
 *   of commands based on project context or environment.
 *
 * This class ensures a consistent interface for command discovery, registration, and
 * execution by the CommandRegistry and higher-level CLI/TUI services.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260107-01:13
 * Initial creation and release of baseCommand.ts
 *
 * ================================================================================
 */

import { CommandMetadata, CommandOptions } from '../types/index.js';

export abstract class BaseCommand {
	constructor(public readonly metadata: CommandMetadata) {}
	
	/**
	 * The logic to run when selected.
	 * @param targetRoot - The project root directory
	 * @param options - Parsed flags (e.g., { force: true, verbose: true })
	 * @param args - Positional arguments
	 */
	abstract execute(targetRoot: string, options: CommandOptions, ...args: string[]): Promise<void>;
	
	/**
	 * Optional: Check if command is valid in current context
	 * (e.g., don't show 'git push' if not a git repo)
	 */
	async isEnabled(targetRoot: string): Promise<boolean> {
		return true;
	}
}