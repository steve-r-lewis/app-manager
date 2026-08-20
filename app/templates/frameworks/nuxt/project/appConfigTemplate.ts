/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/appConfigTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:11
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
 * V1.0.0, 20260226-00:11
 * Initial creation and release of appConfigTemplate.ts
 *
 * ================================================================================
 */

export function getAppConfigTemplate(): string {
	return `/**
 * @description:
 * Nuxt App Configuration.
 * Use this file to configure your UI, themes, and public tokens.
 */

export default defineAppConfig({
  // ui: {
  //   primary: 'green',
  //   gray: 'slate'
  // }
})
`;
}