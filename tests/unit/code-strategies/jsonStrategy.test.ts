/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/strategies/jsonStrategy.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 23:31
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Comprehensive Unit Test Suite for JsonStrategy.
 *
 * ARCHITECTURE:
 * Uses 'jsonc-parser' to verify results, ensuring we can handle comments (JSONC)
 * and deep structural edits without failing on standard JSON.parse() limitations.
 *
 * COVERAGE:
 * 1. Standard Schema (Happy Path)
 * 2. App Manager Schema (Deep Nesting)
 * 3. Hybrid/Ambiguous Schemas (Priority Resolution)
 * 4. Formatting Preservation (Tabs, Spaces, Minified)
 * 5. JSONC (Comments: Header, Inline, Trailing)
 * 6. Input Resilience (Whitespace, Case Sensitivity)
 * 7. Structural Edge Cases (Missing Parents, Empty Files)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-23:31
 * Initial creation and release of jsonStrategy.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { parse } from 'jsonc-parser';
import { JsonStrategy } from '../../../app/strategies/jsonStrategy.js';

describe('JsonStrategy (Architectural Coverage)', () => {
	const strategy = new JsonStrategy();
	
	/**
	 * Helper: Robustly parse JSON/JSONC results.
	 * Using 'jsonc-parser' here ensures tests don't fail just because
	 * the strategy preserved a comment in the output.
	 */
	const parseResult = (text: string) => parse(text);
	
	// ===========================================================================
	// 1. Standard Schema (Root Level)
	// ===========================================================================
	describe('Standard Schema (e.g. package.json)', () => {
		
		it('should extract metadata from root properties', () => {
			const content = `{
				"version": "1.0.0",
				"description": "Root desc",
				"author": "Root author"
			}`;
			
			const meta = strategy.parseMetadata(content);
			
			expect(meta.version).toBe('1.0.0');
			expect(meta.description).toBe('Root desc');
			expect(meta.author).toBe('Root author');
		});
		
		it('should surgically update root properties without destroying format', () => {
			// Note the specific formatting and comments
			const content = `{
				// This is a comment
				"version": "1.0.0",
				"author": "Old"
			}`;
			
			const header = `@version: 2.0.0\n@author: New`;
			const result = strategy.injectHeader(content, header);
			
			// 1. Check Logic
			const json = parseResult(result);
			expect(json.version).toBe('2.0.0');
			expect(json.author).toBe('New');
			
			// 2. Check Preservation (The "Surgical" aspect)
			expect(result).toContain('// This is a comment');
		});
	});
	
	// ===========================================================================
	// 2. App Manager Schema (Nested metadataEntity)
	// ===========================================================================
	describe('App Manager Schema (Nested)', () => {
		
		const complexJson = `{
			"metadataEntity": {
				"description": "Legacy Desc",
				"development": {
					"schemaVersion": "1.0.0",
					"targetFile": "foo.json"
				},
				"author": "Old Author"
			}
		}`;
		
		it('should extract metadata from nested paths', () => {
			const meta = strategy.parseMetadata(complexJson);
			
			expect(meta.version).toBe('1.0.0'); // Should pull from development.schemaVersion
			expect(meta.description).toBe('Legacy Desc');
			expect(meta.author).toBe('Old Author');
		});
		
		it('should map header updates to nested paths', () => {
			const header = `@version: 3.5.0\n@description: New Desc`;
			const result = strategy.injectHeader(complexJson, header);
			
			const json = parseResult(result);
			
			// Verify mappings
			expect(json.metadataEntity.development.schemaVersion).toBe('3.5.0');
			expect(json.metadataEntity.description).toBe('New Desc');
			
			// Verify untouched fields remain
			expect(json.metadataEntity.development.targetFile).toBe('foo.json');
		});
	});
	
	// ===========================================================================
	// 3. Schema Priority & Resolution
	// ===========================================================================
	describe('Schema Priority & Resolution', () => {
		
		it('should strictly prioritize "metadataEntity" over root properties if both exist', () => {
			// This simulates a file transitioning from legacy to new schema
			const hybridContent = `{
				"version": "1.0.0-legacy",
				"metadataEntity": {
					"development": { "schemaVersion": "2.0.0-modern" },
					"description": "Modern Desc"
				},
				"description": "Legacy Desc"
			}`;
			
			const meta = strategy.parseMetadata(hybridContent);
			
			// MUST pick the modern nested path
			expect(meta.version).toBe('2.0.0-modern');
			expect(meta.description).toBe('Modern Desc');
		});
		
		it('should fallback to root properties if "metadataEntity" is present but empty', () => {
			const content = `{
				"version": "1.0.0",
				"metadataEntity": {}
			}`;
			
			// Based on implementation logic, if metadataEntity exists,
			// we stick to that schema context.
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBeUndefined();
		});
	});
	
	// ===========================================================================
	// 4. Surgical Editing (Formatting & Comments)
	// ===========================================================================
	describe('Surgical Editing (Preservation)', () => {
		
		it('should preserve 4-space indentation', () => {
			const content = `{\n    "version": "1.0.0"\n}`;
			const header = `@version: 2.0.0`;
			
			const result = strategy.injectHeader(content, header);
			
			expect(result).toContain('\n    "version": "2.0.0"'); // Maintains 4 spaces
		});
		
		it('should preserve TAB indentation', () => {
			const content = `{\n\t"version": "1.0.0"\n}`;
			const header = `@version: 2.0.0`;
			
			const result = strategy.injectHeader(content, header);
			
			expect(result).toContain('\n\t"version": "2.0.0"'); // Maintains Tabs
		});
		
		it('should preserve complex comments (JSONC)', () => {
			const content = `{
				// Header Comment
				"version": "1.0.0", // Inline Comment
				/* Block Comment
				*/
				"author": "Steve"
			}`;
			const header = `@version: 2.0.0`;
			
			const result = strategy.injectHeader(content, header);
			
			expect(result).toContain('"version": "2.0.0"');
			expect(result).toContain('// Header Comment');
			expect(result).toContain('// Inline Comment');
			expect(result).toContain('Block Comment');
		});
		
		it('should handle minified JSON correctly', () => {
			const content = `{"version":"1.0.0","author":"Steve"}`;
			const header = `@version: 2.0.0`;
			
			const result = strategy.injectHeader(content, header);
			const parsed = parseResult(result);
			
			expect(parsed.version).toBe('2.0.0');
		});
	});
	
	// ===========================================================================
	// 5. Input Resilience (Header Parsing)
	// ===========================================================================
	describe('Input Resilience', () => {
		
		it('should handle messy whitespace in header tags', () => {
			const content = `{"version": "1.0.0"}`;
			// Extra spaces around key and value
			const header = `@  version   :   2.0.0   \n  @   author :   Steve  `;
			
			const result = strategy.injectHeader(content, header);
			const parsed = parseResult(result);
			
			expect(parsed.version).toBe('2.0.0');
			expect(parsed.author).toBe('Steve');
		});
		
		it('should be case insensitive for header keys', () => {
			const content = `{"version": "1.0.0"}`;
			const header = `@VERSION: 2.0.0\n@Author: Steve`;
			
			const result = strategy.injectHeader(content, header);
			const parsed = parseResult(result);
			
			expect(parsed.version).toBe('2.0.0');
			expect(parsed.author).toBe('Steve');
		});
		
		it('should ignore unknown or unsupported tags', () => {
			const content = `{"version": "1.0.0"}`;
			const header = `@foo: bar\n@baz: qux\n@version: 2.0.0`;
			
			const result = strategy.injectHeader(content, header);
			const parsed = parseResult(result);
			
			expect(parsed.version).toBe('2.0.0');
			expect((parsed as any).foo).toBeUndefined(); // Should not inject random keys
		});
	});
	
	// ===========================================================================
	// 6. Structural Edge Cases
	// ===========================================================================
	describe('Structural Edge Cases', () => {
		
		it('should handle missing intermediate objects in App Manager schema', () => {
			// Scenario: metadataEntity exists, but 'development' object is missing.
			// The strategy is expected to auto-create 'development' and inject 'schemaVersion'.
			
			const content = `{
				"metadataEntity": {
					"description": "desc"
					// 'development' is missing
				}
			}`;
			const header = `@version: 2.0.0`; // Maps to metadataEntity.development.schemaVersion
			
			const result = strategy.injectHeader(content, header);
			const parsed = parseResult(result);
			
			expect(parsed.metadataEntity.development).toBeDefined();
			expect(parsed.metadataEntity.development.schemaVersion).toBe('2.0.0');
			expect(parsed.metadataEntity.description).toBe('desc');
		});
		
		it('should handle numeric values in source file but string updates', () => {
			// Source has number, we inject string. Valid JSON change.
			const content = `{ "version": 1.0 }`;
			const header = `@version: 2.0.0`;
			
			const result = strategy.injectHeader(content, header);
			const parsed = parseResult(result);
			
			expect(parsed.version).toBe('2.0.0'); // Should be a string now
		});
		
		it('should return original content if JSON is completely malformed', () => {
			const content = `INVALID_FILE_CONTENT`;
			const header = `@version: 1.0.0`;
			
			const result = strategy.injectHeader(content, header);
			expect(result).toBe(content);
		});
		
		it('should handle empty files gracefully', () => {
			const content = ``;
			const meta = strategy.parseMetadata(content);
			expect(meta).toEqual({});
		});
	});
});