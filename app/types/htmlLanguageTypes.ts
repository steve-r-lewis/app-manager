/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/htmlLanguageTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 23:41
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
 * V1.0.0, 20260611-23:41
 * Initial creation and release of htmlLanguageTypes.ts
 *
 * ================================================================================
 */

export type HtmlTokenType =
	| 'Attribute'
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