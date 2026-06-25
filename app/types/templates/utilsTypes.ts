/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/utilsTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the General Utilities Domain.
 *
 * These interfaces define the arguments and data structures for miscellaneous
 * maintenance tasks, such as managing contributors in package.json or
 * handling file header validation.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20251231-01:52
 * Refactored to namespaced types (UtilsPrefix) for clarity.
 *
 * V1.0.0, 20251231-01:06
 * Initial creation and release of utilsTypes.ts
 *
 * ================================================================================
 */

/**
 * Options for the "utils contributor" command.
 * Used to add or update contributor details in the project's package.json.
 */
export interface UtilsContributorOptions {
	/** The full name of the contributor */
	name?: string;
	
	/** The email address of the contributor (format: Name <email>) */
	email?: string;
	
	/** The website or profile URL of the contributor */
	url?: string;
}
