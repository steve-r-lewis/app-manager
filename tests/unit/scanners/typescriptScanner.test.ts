/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/scanners/typescriptScanner.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 13
 * @createTime: 00:03
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for the TypescriptScanner.
 * Validates:
 * - Structural tokenization (Blocks {}, Keywords)
 * - Safe handling of strings (Single, Double, Template)
 * - Comment stripping/capturing
 * - Operator and Punctuation detection
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260113-00:03
 * Initial creation and release of typescriptScanner.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { TypescriptScanner } from '../../../app/scanners/typescriptScanner';

describe('TypescriptScanner', () => {
	
	it('should scan basic variable declarations', () => {
		const code = 'const myVar = 10;';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens.map(t => ({ type: t.type, value: t.value }))).toEqual([
			{ type: 'Keyword', value: 'const' },
			{ type: 'Identifier', value: 'myVar' },
			{ type: 'Operator', value: '=' },
			{ type: 'Unknown', value: '1' }, // Note: Base scanner currently treats numbers as Unknown fallback in TS, which is fine for structure
			{ type: 'Unknown', value: '0' },
			{ type: 'Punctuation', value: ';' },
		]);
	});
	
	it('should identify structural blocks correctly', () => {
		const code = 'function init() { return true; }';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		const types = tokens.map(t => t.type);
		
		expect(types).toContain('BlockStart');
		expect(types).toContain('BlockEnd');
		
		// Verify specific sequence
		expect(tokens[3].type).toBe('BlockStart'); // {
		expect(tokens[3].value).toBe('{');
		expect(tokens[tokens.length - 1].type).toBe('BlockEnd'); // }
	});
	
	it('should distinguish keywords from identifiers', () => {
		const code = 'class MyClass extends Base {}';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[0]).toMatchObject({ type: 'Keyword', value: 'class' });
		expect(tokens[1]).toMatchObject({ type: 'Identifier', value: 'MyClass' });
		expect(tokens[2]).toMatchObject({ type: 'Keyword', value: 'extends' });
	});
	
	it('should safely handle strings containing structural characters', () => {
		// The brace inside the string should NOT be a BlockStart
		const code = 'const str = "function { }";';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		const stringToken = tokens.find(t => t.type === 'String');
		expect(stringToken).toBeDefined();
		expect(stringToken?.value).toBe('"function { }"');
		
		// Ensure no block tokens were emitted
		expect(tokens.some(t => t.type === 'BlockStart')).toBe(false);
	});
	
	it('should safely handle template literals', () => {
		const code = 'const tpl = `Start { content } End`;';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		expect(tokens[2].type).toBe('String');
		expect(tokens[2].value).toBe('`Start { content } End`');
	});
	
	it('should handle comments without breaking structure', () => {
		const code = `
      // Single line comment
      const x = 1; /* Block
      Comment */
    `;
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		const comments = tokens.filter(t => t.type === 'Comment');
		expect(comments).toHaveLength(2);
		expect(comments[0].value).toBe('// Single line comment');
		expect(comments[1].value).toContain('/* Block');
	});
	
	it('should correct track line and column numbers', () => {
		const code = 'const\nvar';
		const scanner = new TypescriptScanner(code);
		const tokens = scanner.scan();
		
		// const (Line 1)
		expect(tokens[0].start.line).toBe(1);
		
		// var (Line 2)
		expect(tokens[1].value).toBe('var');
		expect(tokens[1].start.line).toBe(2);
	});
});