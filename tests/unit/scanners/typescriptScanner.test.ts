/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/scanners/typescriptScanner.test.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 13
 * @createTime: 00:03
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * "Brutal" Unit tests for the TypescriptScanner.
 * Validates:
 * - Structural tokenization (Blocks {}, Keywords)
 * - Safe handling of strings (Single, Double, Template)
 * - Comment stripping/capturing
 * - Operator and Punctuation detection.
 * - Structural tokenization (Blocks {}, Keywords)
 * - Complex String Escaping ("\"" and "\\")
 * - Regex Literals containing structural characters (/{/)
 * - Nesting edge cases (Comments in strings, etc.)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260113-00:26
 * Revised tests target parser-breaking ambiguities like regex traps and escaped
 * quotes. The rewritten suite intentionally exposes scanner flaws to guide the
 * next architectural fix.
 *
 * v1.0.1, 2026013-00:12
 * Corrected typo in test description
 *
 * V1.0.0, 20260113-00:03
 * Initial creation and release of typescriptScanner.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { TypescriptScanner } from '../../../app/scanners/typescriptScanner';

describe('TypescriptScanner (Stress Tests)', () => {
	
	// --- 1. Basic Structural Integrity ---
	
	it('should identify structural blocks correctly', () => {
		const code = 'function init() { return true; }';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		// Tokens: function(0) init(1) ((2) )(3) {(4) ...
		expect(tokens[4].type).toBe('BlockStart'); // {
		expect(tokens[tokens.length - 1].type).toBe('BlockEnd'); // }
	});
	
	it('should distinguish keywords from identifiers', () => {
		const code = 'class MyClass extends Base {}';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[0]).toMatchObject({ type: 'Keyword', value: 'class' });
		expect(tokens[1]).toMatchObject({ type: 'Identifier', value: 'MyClass' });
	});
	
	// --- 2. String Stress Tests ---
	
	it('should handle escaped quotes inside strings', () => {
		const code = 'const s = "Escaped \\" Quote";';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		const strToken = tokens.find(t => t.type === 'String');
		expect(strToken).toBeDefined();
		expect(strToken?.value).toBe('"Escaped \\" Quote"');
	});
	
	it('should handle escaped backslashes at end of string', () => {
		// This ensures we don't escape the closing quote if the backslash itself is escaped
		const code = 'const s = "Backslash \\\\";';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[3].type).toBe('String');
		expect(tokens[3].value).toBe('"Backslash \\\\"');
	});
	
	it('should safely handle structural chars inside template literals', () => {
		const code = 'const tpl = `Start { content } End`;';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[3].type).toBe('String');
		expect(tokens[3].value).toBe('`Start { content } End`');
		// Critical: Ensure { inside string is NOT a BlockStart
		expect(tokens.some(t => t.type === 'BlockStart')).toBe(false);
	});
	
	// --- 3. Comment Stress Tests ---
	
	it('should ignore structural characters inside comments', () => {
		const code = `
      // const x = { };
      /* function f() { } */
      const y = 1;
    `;
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		// Should detect NO blocks, only keywords/identifiers/comments
		expect(tokens.some(t => t.type === 'BlockStart')).toBe(false);
		expect(tokens.some(t => t.type === 'BlockEnd')).toBe(false);
	});
	
	it('should not start a comment inside a string', () => {
		const code = 'const s = "/* Not a comment */";';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[3].type).toBe('String'); // "/* Not a comment */"
		expect(tokens.some(t => t.type === 'Comment')).toBe(false);
	});
	
	// --- 4. The "Regex Trap" (Likely Failure Point) ---
	
	it('should handle regex literals containing braces', () => {
		// If the scanner treats / as operator, it will see { as a BlockStart
		// and think the function has 2 open braces, failing to find the end.
		const code = `
      function test() {
        const regex = / { /;
      }
    `;
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		const blockStarts = tokens.filter(t => t.type === 'BlockStart');
		const blockEnds = tokens.filter(t => t.type === 'BlockEnd');
		
		// We expect exactly ONE block (the function body).
		// The brace inside the regex should be part of a Regex token (or ignored string),
		// NOT a BlockStart.
		expect(blockStarts.length).toBe(1);
		expect(blockEnds.length).toBe(1);
	});
	
	// --- 5. Semantic Edge Cases ---
	
	it('should handle keywords used as property names', () => {
		const code = 'obj.class.function';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		// In property access, these are technically Identifiers, but our scanner might
		// tag them as Keywords. Ideally, for structural scanning, 'Keyword' is acceptable,
		// AS LONG AS it doesn't trigger logic.
		// This test mostly documents current behavior.
		expect(tokens.map(t => t.value)).toEqual(['obj', '.', 'class', '.', 'function']);
	});
});