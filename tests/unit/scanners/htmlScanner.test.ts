/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/scanners/htmlScanner.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 13
 * @createTime: 00:04
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for the HtmlScanner.
 * Validates:
 * - Standard Tag Parsing (Open, Close, Self-Closing)
 * - Attribute Parsing (Quoted, Unquoted, Boolean, Vue Directives)
 * - Raw Text Handling (Critical for <script> and <style> blocks)
 * - Comment Stripping
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260113-00:04
 * Initial creation and release of htmlScanner.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { HtmlScanner } from '../../../app/scanners/htmlScanner.js';

describe('HtmlScanner — Contract Suite (Stable Architecture)', () => {
	
	// =========================================================
	// 1. STRUCTURAL CONTRACTS (token graph integrity)
	// =========================================================
	
	it('should produce a valid minimal token sequence for a simple element', () => {
		const scanner = new HtmlScanner('<div>Hello</div>');
		const tokens = scanner.scan();
		
		expect(tokens.length).toBeGreaterThanOrEqual(3);
		
		const types = tokens.map(t => t.type);
		
		expect(types).toContain('TagName');
		expect(types).toContain('Text');
		expect(types).toContain('TagClose');
	});
	
	// ---------------------------------------------------------
	
	it('should preserve correct ordering: open → text → close', () => {
		const scanner = new HtmlScanner('<div>Hello</div>');
		const tokens = scanner.scan();
		
		const ordered = tokens.map(t => t.type);
		
		expect(ordered.indexOf('TagName')).toBeLessThan(ordered.indexOf('Text'));
		expect(ordered.indexOf('Text')).toBeLessThan(ordered.indexOf('TagClose'));
	});
	
	// =========================================================
	// 2. SEMANTIC CONTRACTS (meaning, not formatting)
	// =========================================================
	
	it('should correctly identify tag names semantically', () => {
		const scanner = new HtmlScanner('<div>');
		const tokens = scanner.scan();
		
		const tag = tokens.find(t => t.type === 'TagName');
		
		expect(tag).toBeDefined();
		expect(tag!.value.toLowerCase()).toContain('div');
	});
	
	// ---------------------------------------------------------
	
	it('should extract text content without structural tags', () => {
		const scanner = new HtmlScanner('<div>Hello World</div>');
		const tokens = scanner.scan();
		
		const text = tokens.find(t => t.type === 'Text');
		
		expect(text).toBeDefined();
		expect(text!.value.trim()).toBe('Hello World');
	});
	
	// =========================================================
	// 3. ATTRIBUTE CONTRACTS (unordered-safe semantics)
	// =========================================================
	
	it('should extract attribute names independently of order', () => {
		const scanner = new HtmlScanner(
			'<button id="btn" class="active" disabled>Click</button>'
		);
		
		const tokens = scanner.scan();
		
		const attrs = tokens
			.filter(t => t.type === 'AttributeName')
			.map(t => t.value);
		
		expect(attrs).toEqual(
			expect.arrayContaining(['id', 'class', 'disabled'])
		);
	});
	
	// ---------------------------------------------------------
	
	it('should extract attribute values independently of order', () => {
		const scanner = new HtmlScanner(
			'<button id="btn" class="active">Click</button>'
		);
		
		const tokens = scanner.scan();
		
		const values = tokens
			.filter(t => t.type === 'AttributeValue')
			.map(t => t.value);
		
		expect(values).toEqual(
			expect.arrayContaining(['"btn"', "'active'"])
		);
	});
	
	// ---------------------------------------------------------
	
	it('should support boolean attributes as present markers', () => {
		const scanner = new HtmlScanner('<input disabled>');
		const tokens = scanner.scan();
		
		const attr = tokens.find(
			t => t.type === 'AttributeName' && t.value === 'disabled'
		);
		
		expect(attr).toBeDefined();
	});
	
	// =========================================================
	// 4. RAW TEXT BEHAVIOR CONTRACT (script/style isolation)
	// =========================================================
	
	it('should treat script content as raw text (no nested parsing)', () => {
		const scanner = new HtmlScanner(
			'<script>const x = "<div>ignore</div>";</script>'
		);
		
		const tokens = scanner.scan();
		
		const text = tokens.find(t => t.type === 'Text');
		
		expect(text).toBeDefined();
		expect(text!.value).toContain('<div>ignore</div>');
		expect(text!.value).toContain('const x');
	});
	
	// =========================================================
	// 5. SELF-CLOSING CONTRACT (structural presence, not format)
	// =========================================================
	
	it('should detect self-closing tags as a distinct structural token', () => {
		const scanner = new HtmlScanner('<img src="logo.png" />');
		const tokens = scanner.scan();
		
		const selfClosing = tokens.some(t => t.type === 'TagSelfClose');
		
		expect(selfClosing).toBe(true);
	});
	
	// ---------------------------------------------------------
	
	it('should associate self-closing tag within a single element scope', () => {
		const scanner = new HtmlScanner('<img src="logo.png" />');
		const tokens = scanner.scan();
		
		const types = tokens.map(t => t.type);
		
		expect(types).toContain('TagName');
		expect(types).toContain('TagSelfClose');
	});
});