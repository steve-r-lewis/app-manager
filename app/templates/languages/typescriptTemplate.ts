/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/typescriptTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:14
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
 * V1.0.0, 20260226-00:14
 * Initial creation and release of typescriptTemplate.ts
 *
 * ================================================================================
 */

export function getTypescriptTemplate(description: string = 'Generated TypeScript file', content: string = ''): string {
	return `/**
 * @description:
 * ${description}
 */

${content}
`;
}