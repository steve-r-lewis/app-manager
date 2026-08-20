/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/jsonLanguageTypes.ts
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
 * Initial creation and release of jsonLanguageTypes.ts
 *
 * ================================================================================
 */

export type JsonTokenType =
	| 'BraceOpen'       // {
	| 'BraceClose'      // }
	| 'BracketOpen'     // [
	| 'BracketClose'    // ]
	| 'Colon'           // :
	| 'Comma'           // ,
	| 'String'          // "value"
	| 'Number'          // 123, 12.34, 1e5
	| 'Boolean'         // true, false
	| 'Null'            // null
	| 'Comment'         // // or /* ... */
	| 'Whitespace'
	| 'Unknown';