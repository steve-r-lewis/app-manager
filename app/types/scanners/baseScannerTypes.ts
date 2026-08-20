/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/baseScannerTypes.ts
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
 * Initial creation and release of baseScannerTypes.ts
 *
 * ================================================================================
 */

import type { Token } from '../../types/index.js';

export interface SourceLocation {
	readonly line: number;
	readonly column: number;
	readonly index: number;
}

export interface Scanner<TToken extends string> {
	scan(): readonly Token<TToken>[];
}

export interface ScannerDiagnostic {

}
