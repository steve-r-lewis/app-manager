/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/code-strategies/jsonStrategy.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 15:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for manipulating JSON files.
 *
 * NOTE:
 * Since JSON doesn't support comments, this strategy updates
 * root-level fields (e.g., version, author, description).
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

import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../types/index';

export class JsonStrategy implements ICodeStrategy {
	
	public parseMetadata(content: string): CodeFileMetadata {
		try {
			const json = JSON.parse(content);
			return {
				version: json.version || json._version,
				description: json.description || json._description,
				author: json.author || json._author
			};
		} catch (e) {
			return {};
		}
	}
	
	public injectHeader(content: string, headerText: string): string {
		// We cannot inject a text header. We must parse headers and apply them as keys.
		try {
			const json = JSON.parse(content);
			
			// Extract known keys from the headerText (assuming format "Key: Value")
			const lines = headerText.split('\n');
			lines.forEach(line => {
				const [key, ...val] = line.split(':');
				if (key && val.length > 0) {
					const cleanKey = key.replace(/[@*]/g, '').trim().toLowerCase();
					const cleanVal = val.join(':').trim();
					
					// Map common metadata to JSON fields
					if (cleanKey === 'version') json.version = cleanVal;
					if (cleanKey === 'author') json.author = cleanVal;
					if (cleanKey === 'description') json.description = cleanVal;
				}
			});
			
			return JSON.stringify(json, null, 2);
		} catch (e) {
			return content; // Fail safe
		}
	}
	
	public findDocumentableBlocks(content: string): CodeBlock[] {
		return []; // Not applicable for JSON
	}
	
	public injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		return content; // Not applicable for JSON
	}
}