/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/scannerTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 12
 * @createTime: 22:59
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
 * V1.0.0, 20260112-22:59
 * Initial creation and release of scannerTypes.ts
 *
 * ================================================================================
 */

export type TsTokenType =
	| 'Keyword'
	| 'Identifier'
	| 'String'
	| 'Comment'
	| 'Punctuation'
	| 'BlockStart'  // {
	| 'BlockEnd'    // }
	| 'Operator'
	| 'Whitespace'
	| 'Unknown';

export interface SourceLocation {
	line: number;
	column: number;
	index: number;
}

export interface Token<TType = string> {
	type: TType;
	value: string;
	start: SourceLocation;
	end: SourceLocation;
}