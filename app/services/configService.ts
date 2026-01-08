/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/configService.ts
 * @version:    1.0.0
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

import type { AppConfig, GitUserConfig } from '../types/index';

class ConfigService {
	private config: AppConfig;
	private _toolRoot: string = '';
	
	constructor() {
		this.config = this.getDefaults();
	}
	
	/**
	 * Initializes the configuration service with the CLI tool's root path.
	 * @param toolRoot - The directory where the CLI tool code resides.
	 */
	public init(toolRoot: string) {
		this._toolRoot = toolRoot;
	}
	
	public get toolRoot(): string {
		return this._toolRoot;
	}
	
	/**
	 * Resets the configuration to default values.
	 * Useful for testing cleanup.
	 */
	public reset(): void {
		this.config = this.getDefaults();
		this._toolRoot = '';
	}
	
	/**
	 * Returns the default configuration state.
	 */
	private getDefaults(): AppConfig {
		return {
			cwd: process.cwd(),
			gitUser: {
				name: '',
				email: ''
			},
			flags: {
				verbose: false,
				dryRun: false
			}
		};
	}
	
	/**
	 * Retrieves the current application configuration.
	 * Returns a copy to prevent direct mutation of the internal state.
	 */
	public getConfig(): Readonly<AppConfig> {
		return { ...this.config };
	}
	
	/**
	 * Updates the detected Git User configuration.
	 * @param user The Git identity (name, email)
	 */
	public setGitUser(user: GitUserConfig): void {
		this.config.gitUser = { ...user };
	}
	
	/**
	 * Updates a specific global feature flag.
	 * @param key The flag name (e.g., 'verbose')
	 * @param value The boolean state
	 */
	public setFlag(key: keyof AppConfig['flags'], value: boolean): void {
		this.config.flags[key] = value;
	}
	
	/**
	 * Helper to check verbose status (used by Logger)
	 */
	public isVerbose(): boolean {
		return this.config.flags.verbose;
	}
}

// Export as a Singleton
export const configService = new ConfigService();