/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/editorconfigTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 25
 * @createTime: 22:23
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
 * V1.0.0, 20260225-22:23
 * Initial creation and release of editorconfigTemplate.ts
 *
 * ================================================================================
 */

export function getEditorconfigTemplate(): string {
	return `root = true

[*]
indent_size = 2
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`;
}