/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/tokenTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 23:14
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
 * V1.0.0, 20260611-23:14
 * Initial creation and release of tokenTypes.ts
 *
 * ================================================================================
 */

export interface SourceLocation {
	readonly line: number;
	readonly column: number;
	readonly index: number;
}

export interface Token<TTokenType extends string> {
	readonly type: TTokenType;
	readonly value: string;
	readonly start: SourceLocation;
	readonly end: SourceLocation;
}