/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/code-strategies/typescriptStrategy.test.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 11
 * @createTime: 23:29
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Robust Unit tests for the TypeScript parsing strategy.
 * Covers: Metadata parsing, Header Injection (safety), Block Detection (Modern TS),
 * and DocBlock Injection.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260112-00:58
 * Added additional tests for edge cases.
 *
 * V1.0.0, 20260111-23:29
 * Initial creation and release of typescriptStrategy.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { TypescriptStrategy } from '../../../app/code-strategies/typescriptStrategy';

describe('TypescriptStrategy', () => {
	const strategy = new TypescriptStrategy();
	
	describe('parseMetadata', () => {
		it('should extract version and author from header comments', () => {
			const content = `
/**
 * @version: 1.2.3
 * @author: John Doe
 */
export const x = 1;`;
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('1.2.3');
			expect(meta.author).toBe('John Doe');
		});
		
		it('should handle messy whitespace and partial data', () => {
			const content = `
/**
 * @version  :    2.0.0
 */`;
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('2.0.0');
			expect(meta.author).toBeUndefined();
		});
		
		it('should return empty object if no metadata exists', () => {
			const meta = strategy.parseMetadata('const x = 1;');
			expect(meta).toEqual({});
		});
	});
	
	describe('injectHeader', () => {
		it('should replace an existing JSDoc header', () => {
			const content = `/** Old Header */\nconst x = 1;`;
			const newHeader = `/** New Header */`;
			const result = strategy.injectHeader(content, newHeader);
			
			expect(result).toContain('/** New Header */');
			expect(result).not.toContain('/** Old Header */');
			expect(result).toContain('const x = 1;');
		});
		
		it('should prepend header if none exists', () => {
			const content = `const x = 1;`;
			const newHeader = `/** New Header */`;
			const result = strategy.injectHeader(content, newHeader);
			
			expect(result).toBe(`/** New Header */\n\nconst x = 1;`);
		});
		
		it('should PRESERVE shebang lines (#!/usr/bin/env node)', () => {
			// Critical Edge Case: CLI tools break if the header goes above the shebang
			const content = `#!/usr/bin/env node\nconst x = 1;`;
			const newHeader = `/** Header */`;
			const result = strategy.injectHeader(content, newHeader);
			
			// Shebang must remain first line
			expect(result.startsWith('#!/usr/bin/env node')).toBe(true);
			// Header comes after
			expect(result).toContain(`#!/usr/bin/env node\n/** Header */`);
		});
	});
	
	describe('findDocumentableBlocks', () => {
		it('should identify standard exports (Function, Const, Class, Interface)', () => {
			const content = `
export function myFunc() {}
export const myVar = 10;
export class MyClass {}
export interface MyInterface {}
`;
			const blocks = strategy.findDocumentableBlocks(content);
			expect(blocks).toHaveLength(4);
			expect(blocks.find(b => b.name === 'myFunc')?.type).toBe('function');
			expect(blocks.find(b => b.name === 'myVar')?.type).toBe('variable');
			expect(blocks.find(b => b.name === 'MyClass')?.type).toBe('class');
			expect(blocks.find(b => b.name === 'MyInterface')?.type).toBe('interface');
		});
		
		it('should identify ASYNC functions', () => {
			const content = `export async function fetchData() {}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			const func = blocks.find(b => b.name === 'fetchData');
			expect(func).toBeDefined();
			expect(func?.type).toBe('function');
		});
		
		it('should identify ARROW functions assigned to const', () => {
			const content = `export const myArrow = () => {};`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			const arrow = blocks.find(b => b.name === 'myArrow');
			expect(arrow).toBeDefined();
			expect(arrow?.type).toBe('variable'); // TS treats these as const vars usually
		});
		
		it('should detect existing documentation', () => {
			const content = `
/** Docs */
export function documented() {}
export function undocumented() {}
`;
			const blocks = strategy.findDocumentableBlocks(content);
			expect(blocks.find(b => b.name === 'documented')?.hasDoc).toBe(true);
			expect(blocks.find(b => b.name === 'undocumented')?.hasDoc).toBe(false);
		});
	});
	
	describe('injectFunctionDoc', () => {
		it('should inject a JSDoc block above a specific function', () => {
			const content = `
export function target() {
  return true;
}
`;
			const doc = `/** My Doc */`;
			const result = strategy.injectFunctionDoc(content, 'target', doc);
			
			expect(result).toContain(`/** My Doc */\nexport function target()`);
		});
		
		it('should handle indentation correctly', () => {
			// Niche: If function is indented (e.g. inside a namespace or bad formatting),
			// comment should ideally respect it, or at least be placed correctly.
			const content = `    export function indented() {}`;
			const doc = `/** Doc */`;
			const result = strategy.injectFunctionDoc(content, 'indented', doc);
			
			expect(result).toContain(`/** Doc */\n    export function indented`);
		});
	});
});