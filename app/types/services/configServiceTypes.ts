/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/configServiceTypes.ts
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
 * Initial creation and release of configServiceTypes.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/configServiceTypes.ts
 * @version:    2.0.0
 *
 * ================================================================================
 */

import { z } from 'zod';

/**
 * Runtime schema definition for Git User configurations.
 * Natively enforces string types and structural format validation.
 */
export const GitUserConfigSchema = z.object({
	name: z.string(),
	email: z.string().email().or(z.literal('')), // Natively supports default empty string states
});
export type GitUserConfig = z.infer<typeof GitUserConfigSchema>;

/**
 * Runtime schema for global operational feature flags.
 */
export const AppConfigFlagsSchema = z.object({
	verbose: z.boolean(),
	dryRun: z.boolean(),
});

/**
 * The Master Core Configuration Schema.
 */
export const AppConfigSchema = z.object({
	gitUser: GitUserConfigSchema,
	cwd: z.string(),
	flags: AppConfigFlagsSchema,
});
export type AppConfig = z.infer<typeof AppConfigSchema>;

/**
 * The core architectural contract for the Configuration Service.
 */
export interface IConfigService {
	readonly toolRoot: string;
	init(toolRoot: string): void;
	reset(): void;
	getConfig(): Readonly<AppConfig>;
	setGitUser(user: GitUserConfig): void;
	setFlag(key: keyof AppConfig['flags'], value: boolean): void;
	isVerbose(): boolean;
}