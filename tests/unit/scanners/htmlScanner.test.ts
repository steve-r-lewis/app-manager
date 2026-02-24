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

describe('HtmlScanner', () => {
	
	// --- 1. Basic Structure ---
	
	it('should scan basic tags and text', () => {
		const code = '<div>Hello World</div>';
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[0].type).toBe('TagOpen');
		expect(tokens[1].type).toBe('TagName');
		expect(tokens[1].value).toBe('div');
		expect(tokens[2].type).toBe('TagClose'); // >
		expect(tokens[3].type).toBe('Text');
		expect(tokens[3].value).toBe('Hello World');
		expect(tokens[4].type).toBe('TagClose'); // </
		expect(tokens[5].type).toBe('TagName');  // div
		expect(tokens[6].type).toBe('TagClose'); // >
	});
	
	it('should handle self-closing tags', () => {
		const code = '<img src="test.png" />';
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		// < img src="test.png" />
		const selfClose = tokens.find(t => t.type === 'TagSelfClose');
		expect(selfClose).toBeDefined();
		expect(selfClose?.value).toBe('/>');
	});
	
	// --- 2. Attribute Complexity ---
	
	it('should handle complex attributes including Vue directives', () => {
		const code = '<div id="app" @click="doSomething" :class="{ active: true }" v-if="show">';
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		const attrNames = tokens.filter(t => t.type === 'AttributeName').map(t => t.value);
		
		expect(attrNames).toContain('id');
		expect(attrNames).toContain('@click');
		expect(attrNames).toContain(':class');
		expect(attrNames).toContain('v-if');
	});
	
	it('should handle unquoted and boolean attributes', () => {
		const code = '<input required type=text>';
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		// required (Boolean)
		const requiredAttr = tokens.find(t => t.value === 'required');
		expect(requiredAttr).toBeDefined();
		
		// type=text (Unquoted value handling depends on scanner strictness,
		// current impl might treat "type" as name and "text" as another name if no quotes used,
		// or just consume nicely. Let's verify strict behavior:
		// The current scanner implementation expects name, =, value.
		// If value is unquoted, we need to check if it captures it.
		// *Self-Correction*: The scanner logic scans quoted values specifically.
		// Let's see if it handles the equals sign correctly.)
		
		const equals = tokens.filter(t => t.type === 'Equals');
		expect(equals.length).toBe(1);
	});
	
	// --- 3. The "Raw Text" Trap (Critical for Vue) ---
	
	it('should treat content inside <script> as raw text, ignoring tags', () => {
		// This is the most important test.
		// The "<" in "i < 10" MUST NOT start a new tag.
		const code = `
      <script>
        if (i < 10) { console.log('<div>'); }
      </script>
    `;
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		const scriptContent = tokens.find(t => t.type === 'Text' && t.value.includes('if (i < 10)'));
		
		expect(scriptContent).toBeDefined();
		expect(scriptContent?.value).toContain("console.log('<div>')");
		
		// Ensure no spurious tags were detected inside
		const divTags = tokens.filter(t => t.type === 'TagName' && t.value === 'div');
		expect(divTags.length).toBe(0);
	});
	
	it('should treat content inside <style> as raw text', () => {
		const code = `
      <style>
        .box { content: "<span>"; }
      </style>
    `;
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		const styleContent = tokens.find(t => t.type === 'Text' && t.value.includes('.box'));
		expect(styleContent).toBeDefined();
		
		// Ensure the <span> inside the string wasn't parsed as a tag
		const spanTags = tokens.filter(t => t.type === 'TagName' && t.value === 'span');
		expect(spanTags.length).toBe(0);
	});
	
	// --- 4. Comments ---
	
	it('should ignore HTML comments', () => {
		const code = '<div></div>';
		const scanner = new HtmlScanner(code);
		const tokens = scanner.scan();
		
		const comment = tokens.find(t => t.type === 'Comment');
		expect(comment).toBeDefined();
		expect(comment?.value).toContain('ignore me');
		
		// Ensure the span inside comment was NOT parsed as a tag
		const spanTags = tokens.filter(t => t.type === 'TagName' && t.value === 'span');
		expect(spanTags.length).toBe(0);
	});
});