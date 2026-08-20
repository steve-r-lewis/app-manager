/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/languages/jsonTemplate.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 11
 * @createTime: 22:34
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Generic Metadata JSON Template Generator.
 *
 * This template produces a structured JSON file used for tracking data entity
 * metadata. It normalizes the structure found in 'jsonTemplate.json' into a
 * dynamic generator that auto-populates creation dates and initializes versioning.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260820
 * - Rewrote the function to return a real JS object literal instead of a
 *   template-literal string with unquoted keys and bare '${}' expressions
 *   (the string version was not valid JSON and didn't match the function's
 *   declared return type, Record<string, any>).
 * - Requires 'version' and 'description' to be added to JsonTemplateContext
 *   in templateTypes.ts — see the small patch note I gave separately.
 *
 * V1.0.0, 20260111-22:34
 * Initial creation and release of jsonTemplate.ts
 *
 * ================================================================================
 */

import type { JsonTemplateContext, TemplateFunction } from '../../types/index.js';

/**
 * Generates the metadata JSON object.
 */
export const jsonTemplate: TemplateFunction<JsonTemplateContext, Record<string, any>> = (ctx) => {
	const now = new Date().toISOString();
	const initialVersion = ctx.version || "1.0.0";

	// Default to development if not specified
	const environment = ctx.environment || "development";

	return {
		metadataEntity: {
			description: ctx.description || "Initial metadata definition",
			environment,

			// Development Lifecycle State
			development: {
				targetFile: ctx.targetFile || "",
				dataPlatform: ctx.dataPlatform || "",
				dataSchema: ctx.dataSchema || "",
				dataQueryLanguage: ctx.dataQueryLanguage || "",
				schemaVersion: initialVersion,
				createdAt: now,
				revisionHistory: [
					{
						schemaVersion: initialVersion,
						archivedAt: now,
						revisionNote: "Initial creation"
					}
				]
			},

			// Production Lifecycle State (Initialized empty or mirrored based on needs)
			production: {
				dataPlatform: "",
				dataSchema: "",
				dataQueryLanguage: "",
				schemaVersion: "0.0.0",
				createdAt: now,
				revisionHistory: []
			}
		},

		metadataContent: {
			dataDomain: ctx.dataDomain || "",
			recordCount: 0,
			notes: ctx.notes || ""
		},

		// Placeholder for actual data records
		records: []
	};
};
