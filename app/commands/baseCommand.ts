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
 * TODO: Create description here
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

import { CommandMetadata, CommandOptions } from '../types/index';

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