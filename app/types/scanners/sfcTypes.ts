/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/sfcTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 23:23
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
 * V1.0.0, 20260611-23:23
 * Initial creation and release of sfcTypes.ts
 *
 * ================================================================================
 */

import type { SourceLocation } from './baseScannerTypes.js';

export interface SfcBlock {
	readonly type: 'script' | 'template' | 'style' | 'custom';
	readonly content: string;
	readonly start: number;
	readonly end: number;
	readonly tagStart: number;
	readonly tagEnd: number;
	readonly attributes: Readonly<Record<string, string | boolean>>;
	readonly loc: {
		readonly start: SourceLocation;
		readonly end: SourceLocation;
	};
}

export interface RegionOfInterest {
	readonly type: string;
	readonly start: number;
	readonly end: number;
	readonly content: string;
	readonly loc: {
		readonly start: { readonly line: number, readonly column: number };
		readonly end: { readonly line: number, readonly column: number };
	};
}