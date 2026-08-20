/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/cssLanguageTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 23:42
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
 * V1.0.0, 20260611-23:42
 * Initial creation and release of cssLanguageTypes.ts
 *
 * ================================================================================
 */

export type CssTokenType =
	| 'AtKeyword'       // @media, @import
	| 'BlockStart'      // {
	| 'BlockEnd'        // }
	| 'Identifier'      // .class, #id, div, color, red
	| 'String'          // "content", 'font'
	| 'Comment'         // /* ... */
	| 'Colon'           // :
	| 'Semicolon'       // ;
	| 'Comma'           // ,
	| 'Function'        // url(, var(
	| 'Parenthesis'     // )
	| 'Operator'        // +, >, ~
	| 'Whitespace'
	| 'Unknown';