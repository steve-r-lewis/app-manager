/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/pnpmWorkspaceTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 25
 * @createTime: 23:55
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
 * V1.0.0, 20260225-23:55
 * Initial creation and release of pnpmWorkspaceTemplate.ts
 *
 * ================================================================================
 */

export function getPnpmWorkspaceTemplate(): string {
	return `packages:
  - 'layers/*'

onlyBuiltDependencies:
  - esbuild
  - vue-demi
`;
}