/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/jsonStrategy.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 15:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for manipulating JSON/JSONC files using 'jsonc-parser'.
 *
 * ARCHITECTURE:
 * Uses a CST (Concrete Syntax Tree) approach (via jsonc-parser) rather than
 * basic AST (JSON.parse). This allows "Surgical Edits":
 * - Preserves Comments (// ...)
 * - Preserves Formatting (Tabs vs Spaces)
 * - Preserves Key Ordering
 *
 * SCHEMA SUPPORT:
 * - Detects 'metadataEntity' (App Manager Schema)
 * - Fallbacks to Standard JSON (package.json)
 *
 * FEATURES:
 * - Surgical Edits (Preserves formatting/comments)
 * - Deep Path Creation (Auto-creates missing nested objects like 'development')
 * - Resilience (Gracefully handles malformed files)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-15:06
 * Initial creation and release of jsonStrategy.ts
 *
 * ================================================================================
 */

import { parse, modify, applyEdits, type JSONPath, type ParseError } from 'jsonc-parser';
import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../types/index.js';

export class JsonStrategy implements ICodeStrategy {
	
	public parseMetadata(content: string): CodeFileMetadata {
		const errors: ParseError[] = [];
		const json = parse(content, errors);
		
		if (!json) return {};
		
		if (json.metadataEntity) {
			const entity = json.metadataEntity;
			const dev = entity.development || {};
			return {
				version: dev.schemaVersion,
				description: entity.description,
				author: entity.author
			};
		}
		
		return {
			version: json.version,
			description: json.description,
			author: json.author
		};
	}
	
	public injectHeader(content: string, headerText: string): string {
		let currentContent = content;
		
		// 1. Validate Content
		const errors: ParseError[] = [];
		const initialJson = parse(content, errors);
		
		// If completely malformed (and not just empty), return original to avoid corruption
		if (content.trim().length > 0 && !initialJson && errors.length > 0) {
			return content;
		}
		
		const changes = this.parseHeaderText(headerText);
		const useComplexSchema = !!(initialJson && initialJson.metadataEntity);
		
		// Formatting options (default to 2 spaces, can be inferred in future)
		const options = {
			formattingOptions: { insertSpaces: true, tabSize: 2 }
		};
		
		// 2. Apply Edits
		for (const [key, value] of Object.entries(changes)) {
			let path: JSONPath = [];
			
			// Re-parse current state to check for existence of intermediate paths
			// (Needed for "Deep Creation" logic)
			const currentJson = parse(currentContent) || {};
			
			if (useComplexSchema) {
				// --- App Manager Schema ---
				if (key === 'version') {
					// Target: metadataEntity.development.schemaVersion
					
					// Auto-create 'development' if missing
					if (!currentJson.metadataEntity.development) {
						// Insert 'development' with the version inside
						path = ['metadataEntity', 'development'];
						const edits = modify(currentContent, path, { schemaVersion: value }, options);
						currentContent = applyEdits(currentContent, edits);
						continue; // Done for this key
					}
					
					path = ['metadataEntity', 'development', 'schemaVersion'];
				}
				else if (key === 'description') path = ['metadataEntity', 'description'];
				else if (key === 'author') path = ['metadataEntity', 'author'];
			} else {
				// --- Standard Schema ---
				if (key === 'version') path = ['version'];
				else if (key === 'description') path = ['description'];
				else if (key === 'author') path = ['author'];
			}
			
			// Perform Surgical Edit if path determined
			if (path.length > 0) {
				const edits = modify(currentContent, path, value, options);
				currentContent = applyEdits(currentContent, edits);
			}
		}
		
		return currentContent;
	}
	
	private parseHeaderText(headerText: string): Record<string, string> {
		const updates: Record<string, string> = {};
		headerText.split('\n').forEach(line => {
			const [k, ...v] = line.split(':');
			if (k && v.length > 0) {
				const key = k.replace(/[@*]/g, '').trim().toLowerCase();
				const value = v.join(':').trim();
				updates[key] = value;
			}
		});
		return updates;
	}
	
	public findDocumentableBlocks(content: string): CodeBlock[] {
		return [];
	}
	
	public injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		return content;
	}
}