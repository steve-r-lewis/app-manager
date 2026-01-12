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

export type HtmlTokenType =
	| 'TagOpen'         // <div
	| 'TagClose'        // </div>
	| 'TagSelfClose'    // />
	| 'TagName'         // div, span
	| 'AttributeName'   // class, id
	| 'AttributeValue'  // "container"
	| 'Equals'          // =
	| 'Text'            // Content between tags
	| 'Comment'         // | 'Doctype'         // <!DOCTYPE html>
	| 'Whitespace'
	| 'Unknown';

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

export interface SfcBlock {
	type: 'script' | 'template' | 'style' | 'custom';
	content: string;
	start: number;      // Absolute start index of the CONTENT
	end: number;        // Absolute end index of the CONTENT
	tagStart: number;   // Start index of the opening tag <script>
	tagEnd: number;     // End index of the closing tag </script>
	attributes: Record<string, string | boolean>;
	loc: {
		start: SourceLocation;
		end: SourceLocation;
	};
}

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