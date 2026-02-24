/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/jsonTemplate.ts
 * @version:    1.0.0
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
 * Key Features:
 * - ISO 8601 Date stamping for 'createdAt' and 'archivedAt'.
 * - Automated Revision History initialization (Starts at V1.0.0).
 * - Separation of concerns between 'metadataEntity' (Lifecycle) and
 *   'metadataContent' (Domain).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-22:34
 * Initial creation and release of jsonTemplate.ts
 *
 * ================================================================================
 */

import type { JsonTemplateContext, TemplateFunction } from '../types/index.js';

/**
 * Generates the metadata JSON object.
 */
export const jsonTemplate: TemplateFunction<JsonTemplateContext, Record<string, any>> = (ctx) => {
	const now = new Date().toISOString();
	const initialVersion = ctx.version || "1.0.0";
	
	// Default to development if not specified
	const environment = ctx.environment || "development";
	
	return `{
		metadataEntity: {
			description: ctx.description || "Initial metadata definition",
			environment: environment,
			
			// Development Lifecycle State
			development: {
				targetFile: ${ctx.targetFile || ""},
				dataPlatform: ${ctx.dataPlatform || ""},
				dataSchema: ${ctx.dataSchema || ""},
				dataQueryLanguage: ${ctx.dataQueryLanguage || ""},
				schemaVersion: ${initialVersion},
				createdAt: now,
				revisionHistory: [
					{
						schemaVersion: ${initialVersion},
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
			dataDomain: ${ctx.dataDomain || ""},
			recordCount: 0,
			notes: ${ctx.notes || ""}
		},
		
		// Placeholder for actual data records
		records: [${}]
	}`;
};