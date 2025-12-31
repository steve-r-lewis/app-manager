/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/processTypes.ts
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
 * Initial creation and release of processTypes.ts
 *
 * ================================================================================
 */

export type ProcessPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface ProcessExecuteOptions {
	cwd?: string;
	env?: Record<string, string>;
	silent?: boolean;
	timeout?: number;
}

export interface ProcessResult {
	stdout: string;
	stderr: string;
	exitCode: number;
}