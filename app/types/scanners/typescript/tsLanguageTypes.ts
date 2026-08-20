/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/tsLanguageTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 23:43
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
 * V1.0.0, 20260611-23:43
 * Initial creation and release of tsLanguageTypes.ts
 *
 * ================================================================================
 */

export type TsTokenType =
	| 'Keyword'
	| 'Identifier'
	| 'String'
	| 'Regex'       // <--- Added for Regex Literals
	| 'Comment'
	| 'Punctuation'
	| 'BlockStart'  // {
	| 'BlockEnd'    // }
	| 'Operator'
	| 'Whitespace'
	| 'Unknown';