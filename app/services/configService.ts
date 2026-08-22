/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/configService.ts
 * @version:    2.1.0
 * @createDate: 2026 Jan 02
 * @createTime: 00:20
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Configuration Service.
 *
 * Responsible for managing the global application state, including:
 * - Current Working Directory (CWD)
 * - User Identity (Git Config)
 * - Feature Flags (Verbose, DryRun)
 *
 * This service acts as the "Single Source of Truth" for the application's
 * runtime settings.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.1.0, 20260822-00:22
 * Wired up AppConfigSchema validation on default-config construction
 * (constructor/reset), and added runtime validation to setFlag() (rejects
 * unknown flag keys / non-boolean values), matching the validation posture
 * already established by setGitUser(). Removed a duplicate/orphaned header
 * block left over from a prior edit.
 *
 * V2.0.0, 20260107-22:43
 * Refactored to include init method.
 *
 * V1.0.0, 20260102-00:20
 * Initial creation and release of configService.ts
 * Initial migration and strict typing implementation.
 * Adapts legacy state management to the new AppConfig interface.
 *
 * ================================================================================
 */

import { AppConfigFlagsSchema, AppConfigSchema, GitUserConfigSchema } from '../types/index.js';
import type { AppConfig, GitUserConfig, IConfigService } from '../types/index.js';

class ConfigService implements IConfigService {
	private config: AppConfig;
	private _toolRoot: string = '';
	
	constructor() {
		this.config = this.getDefaults();
	}
	
	/**
	 * Initializes the configuration service with the CLI tool's root path.
	 */
	public init(toolRoot: string): void {
		this._toolRoot = toolRoot;
	}
	
	public get toolRoot(): string {
		return this._toolRoot;
	}
	
	/**
	 * Resets the configuration to default values.
	 */
	public reset(): void {
		this.config = this.getDefaults();
		this._toolRoot = '';
	}
	
	/**
	 * Returns the default configuration state map.
	 * Enforces runtime schema parsing, consistent with setGitUser().
	 */
	private getDefaults(): AppConfig {
		return AppConfigSchema.parse({
			cwd: process.cwd(),
			gitUser: {
				name: '',
				email: ''
			},
			flags: {
				verbose: false,
				dryRun: false
			}
		});
	}
	
	/**
	 * Retrieves the current application configuration safely.
	 * Returns a deep structured clone to eliminate nested reference mutations.
	 */
	public getConfig(): Readonly<AppConfig> {
		return structuredClone(this.config);
	}
	
	/**
	 * Validates and updates the detected Git User configuration.
	 * Enforces runtime schema parsing to secure input parameters.
	 */
	public setGitUser(user: GitUserConfig): void {
		// Zod parse validates structural shape and strips unsafe properties simultaneously
		this.config.gitUser = GitUserConfigSchema.parse(user);
	}
	
	/**
	 * Updates a specific global feature flag.
	 * Enforces runtime schema parsing to reject unknown keys or wrong-typed
	 * values, consistent with setGitUser().
	 */
	public setFlag(key: keyof AppConfig['flags'], value: boolean): void {
		const validKey = AppConfigFlagsSchema.keyof().parse(key);
		const validValue = AppConfigFlagsSchema.shape[validKey].parse(value);
		this.config.flags[validKey] = validValue;
	}
	
	/**
	 * Direct boolean helper to evaluate verbose tracking.
	 */
	public isVerbose(): boolean {
		return this.config.flags.verbose;
	}
}

// Export as a strictly typed Singleton boundary
export const configService = new ConfigService();