/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/headerBlockTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:22
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
 * V1.0.0, 20260226-00:22
 * Initial creation and release of headerBlockTemplate.ts
 *
 * ================================================================================
 */

export interface HeaderParams {
	projectName: string;
	filePath: string;
	author?: string;
	description?: string;
	version?: string;
}

export function getHeaderBlock(params: HeaderParams): string {
	const {
		projectName,
		filePath,
		author = 'Steve R Lewis', // Default from your spec
		description = 'TODO: Create description here',
		version = '1.0.0'
	} = params;
	
	// Date formatting: e.g., "2026 Feb 26"
	const now = new Date();
	const year = now.getFullYear();
	const month = now.toLocaleString('en-US', { month: 'short' });
	const day = String(now.getDate()).padStart(2, '0');
	const createDate = `${year} ${month} ${day}`;
	
	// Time formatting: e.g., "23:54"
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const createTime = `${hours}:${minutes}`;
	
	// Extract just the filename for the initial release note
	const fileName = filePath.split('/').pop() || 'file';
	const releaseDateStr = `${year}${String(now.getMonth() + 1).padStart(2, '0')}${day}`;
	
	return `/**
 * ================================================================================
 *
 * @project:    ${projectName}
 * @file:       ${filePath}
 * @version:    ${version}
 * @createDate: ${createDate}
 * @createTime: ${createTime}
 * @author:     ${author}
 *
 * ================================================================================
 *
 * @description:
 * ${description}
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V${version}, ${releaseDateStr}-${createTime}
 * Initial creation and release of ${fileName}
 *
 * ================================================================================
 */`;
}