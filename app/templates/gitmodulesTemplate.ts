/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/gitmodulesTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:02
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
 * V1.0.0, 20260226-00:02
 * Initial creation and release of gitmodulesTemplate.ts
 *
 * ================================================================================
 */

export function getGitmodulesTemplate(
	path: string = 'layers/themes',
	url: string = 'https://github.com/steve-r-lewis/nuxt4-holistic-therapy-clinic.git'
): string {
	return `[submodule "${path}"]
\tpath = ${path}
\turl = "${url}"
`;
}