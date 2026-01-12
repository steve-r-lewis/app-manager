/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/code-strategies/htmlStrategy.test.ts
 * @version:    1.2.0
 * @createDate: 2026 Jan 11
 * @createTime: 23:33
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for HTML parsing (Robust Coverage).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0, 20260112-00:30
 * Fixed test expectations to match corrected regex implementation.
 * Added clearer comments about what each test validates.
 *
 * V1.1.0, 20260112-00:02
 * Added stubs for findDocumentableBlocks and injectFunctionDoc. Also added
 * coverage for whitespace handling.
 *
 * V1.0.0, 20260111-23:33
 * Initial creation and release of htmlStrategy.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { HtmlStrategy } from '../../../app/code-strategies/htmlStrategy';

describe('HtmlStrategy', () => {
	const strategy = new HtmlStrategy();
	
	describe('parseMetadata', () => {
		
		it('should extract version and author from HTML comments', () => {
			const content = `
		  <!--
		    @version: 1.0.5
		    @author: Jane Doe
		  -->
		  <div></div>
		  `;
			
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('1.0.5');
			expect(meta.author).toBe('Jane Doe');
		});
		
		it('should handle partial metadata (Version only)', () => {
			const content = `
		  <!-- @version: 2.0.0 -->
		  `;
			
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('2.0.0');
			expect(meta.author).toBeUndefined();
		});
		
		it('should handle messy whitespace in metadata tags', () => {
			const content = `
		  <!--
		      @version :    3.0.0
		      @author :  Steve
		  -->
		  `;
			
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('3.0.0');
			expect(meta.author).toBe('Steve');
		});
		
		it('should return empty object if no metadata exists', () => {
			// No HTML comments with metadata tags
			const content = '<!DOCTYPE html>\n<div></div>';
			const meta = strategy.parseMetadata(content);
			expect(meta).toEqual({});
		});
	});
	
	describe('injectHeader', () => {
		it('should wrap header in HTML comment blocks (New File)', () => {
			// File with no existing header comment
			const content = '<div>App</div>';
			const result = strategy.injectHeader(content, 'My Header');
			
			expect(result).toContain('<!--');
			expect(result).toContain('My Header');
			expect(result).toContain('-->');
			expect(result).toContain('<div>App</div>');
		});
		
		it('should replace existing header comments at the start', () => {
			// File starts with a comment - should replace it
			const content = '<!-- Old Header -->\n<div>Content</div>';
			const result = strategy.injectHeader(content, 'New Header');
			
			expect(result).toContain('<!--');
			expect(result).toContain('New Header');
			expect(result).toContain('-->');
			expect(result).toContain('<div>Content</div>');
			expect(result).not.toContain('Old Header');
		});
		
		it('should PREPEND (not replace) if comment is not at the very top', () => {
			// Edge Case: File starts with code, then has a comment.
			// We should NOT delete the user's code or the inner comment.
			const content = '<div>Top</div>\n<!-- Some other comment -->';
			const result = strategy.injectHeader(content, 'New Header');
			
			// Expect Header + Original Content (both comment and div)
			expect(result).toContain('New Header');
			expect(result).toContain('<div>Top</div>');
			expect(result).toContain('<!-- Some other comment -->');
		});
		
		it('should handle files starting with whitespace correctly', () => {
			// Edge Case: File has empty lines/spaces at top, then a comment.
			// The regex ^\s*<!-- should catch this and treat it as a header to replace.
			const content = '   \n   <!-- Old Header -->';
			const result = strategy.injectHeader(content, 'New Header');
			
			expect(result).toContain('New Header');
			expect(result).not.toContain('Old Header');
		});
	});
	
	describe('Stubs (Safety Checks)', () => {
		it('findDocumentableBlocks should return empty array (No Crash)', () => {
			// HTML doesn't have documentable blocks like functions
			expect(strategy.findDocumentableBlocks('<div></div>')).toEqual([]);
		});
		
		it('injectFunctionDoc should return content unchanged (No Crash)', () => {
			// Not applicable for HTML - should return content as-is
			const content = '<div></div>';
			expect(strategy.injectFunctionDoc(content, 'foo', 'doc')).toBe(content);
		});
	});
});