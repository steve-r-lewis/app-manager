/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/configTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 00:09
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Config Service.
 *
 * Defines the schema for the application's configuration, including
 * user-specific settings, paths, and flags.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260102-00:09
 * Initial creation and release of configTypes.ts
 *
 * ================================================================================
 */

/**
 * The specific Git user configuration required for scaffolding.
 */
export interface GitUserConfig {
	name: string;
	email: string;
}

/**
 * The Master Configuration Interface.
 */
export interface AppConfig {
	/**
	 * The detected or configured git user.
	 * Used for populating LICENSE and package.json author fields.
	 */
	gitUser: GitUserConfig;
	
	/**
	 * The current working directory (usually process.cwd()).
	 */
	cwd: string;
	
	/**
	 * Global flags (verbose mode, dry-run, etc).
	 */
	flags: {
		verbose: boolean;
		dryRun: boolean;
	};
}