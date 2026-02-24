/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/strategies/cssStrategy.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 23:32
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for CSS parsing.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-23:32
 * Initial creation and release of cssStrategy.test.ts
 *
 * ================================================================================
 */

// tests/unit/strategies/cssStrategy.test.ts
import { describe, it, expect } from 'vitest';
import { CssStrategy } from '../../../app/strategies/cssStrategy.js';

describe('CssStrategy', () => {
	const strategy = new CssStrategy();
	
	describe('findDocumentableBlocks (Edge Cases)', () => {
		
		// NICHE CASE 1: Multi-line selectors
		it('should identify selectors spanning multiple lines', () => {
			const content = `h1,\nh2,\nh3 {\n  color: red;\n}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks).toHaveLength(1);
			// The buffer logic should combine them
			expect(blocks[0].name).toBe('h1, h2, h3');
			expect(blocks[0].startLine).toBe(0); // Starts on line 0
		});
		
		// NICHE CASE 2: Attribute Selectors
		it('should handle attribute selectors with quotes', () => {
			const content = `input[type="text"] {\n  border: 1px solid #ccc;\n}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks).toHaveLength(1);
			expect(blocks[0].name).toBe('input[type="text"]');
		});
		
		// NICHE CASE 3: Pseudo-elements and classes
		it('should handle pseudo-classes and elements', () => {
			const content = `a:hover::after {\n  content: '';\n}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks).toHaveLength(1);
			expect(blocks[0].name).toBe('a:hover::after');
		});
		
		it('should ignore @media blocks but capture their children', () => {
			const content = `@media (min-width: 700px) {\n  .container {\n    width: 100%;\n  }\n}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			// Should NOT capture '@media (min-width: 700px)' as a block
			// Should capture '.container'
			const mediaBlock = blocks.find(b => b.name.includes('@media'));
			const containerBlock = blocks.find(b => b.name === '.container');
			
			expect(mediaBlock).toBeUndefined();
			expect(containerBlock).toBeDefined();
		});
	});
	
	describe('injectFunctionDoc (Edge Cases)', () => {
		
		it('should handle extra whitespace in selector definition', () => {
			// User has weird spacing
			const content = `.weird-spacing    {\n  color: red;\n}`;
			const result = strategy.injectFunctionDoc(content, '.weird-spacing', 'Docs');
			
			expect(result).toContain(`/* Docs */\n.weird-spacing    {`);
		});
		
		it('should NOT inject into partial matches', () => {
			// If we look for ".btn", we should NOT match ".btn-group"
			const content = `.btn-group {\n  display: flex;\n}\n.btn {\n  color: blue;\n}`;
			const result = strategy.injectFunctionDoc(content, '.btn', 'Button Docs');
			
			// The docs should be above .btn, NOT .btn-group
			const lines = result.split('\n');
			const btnGroupIdx = lines.findIndex(l => l.includes('.btn-group'));
			const btnIdx = lines.findIndex(l => l.includes('.btn {'));
			const docIdx = lines.findIndex(l => l.includes('/* Button Docs */'));
			
			expect(docIdx).toBeGreaterThan(btnGroupIdx); // Docs appear after btn-group
			expect(docIdx).toBe(btnIdx - 1); // Docs appear exactly before .btn
		});
	});
	
	describe('parseMetadata', () => {
		it('should extract version and author from standard header', () => {
			const content = `/**
       * @version: 1.5.0
       * @author:  Steve R Lewis
       */`;
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('1.5.0');
			expect(meta.author).toBe('Steve R Lewis');
		});
		
		it('should handle loose syntax (no colons)', () => {
			const content = `/* @version 2.0 @author Jane Doe */`;
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('2.0');
			expect(meta.author).toBe('Jane Doe');
		});
	});
	
	describe('injectHeader', () => {
		it('should replace existing header and preserve code', () => {
			const content = `/* Old Header */\n.body { color: red; }`;
			const newHeader = `New Header`;
			
			const result = strategy.injectHeader(content, newHeader);
			
			expect(result).toContain('/*\n * New Header\n */');
			expect(result).not.toContain('Old Header');
			expect(result).toContain('.body { color: red; }');
		});
		
		it('should CRITICALLY preserve @charset at the very top', () => {
			const content = `@charset "UTF-8";\n/* Old */\nbody { background: #000; }`;
			const newHeader = `License Header`;
			
			const result = strategy.injectHeader(content, newHeader);
			
			// 1. Check strict start
			expect(result.startsWith('@charset "UTF-8";')).toBe(true);
			// 2. Check header follows
			expect(result).toContain(`@charset "UTF-8";\n\n/*`);
			expect(result).toContain(` * License Header`);
		});
	});
	
	describe('findDocumentableBlocks', () => {
		it('should identify basic class and ID selectors', () => {
			const content = `.my-class { }\n#my-id { }`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks).toHaveLength(2);
			expect(blocks[0].name).toBe('.my-class');
			expect(blocks[1].name).toBe('#my-id');
		});
		
		it('should identify HTML element selectors', () => {
			const content = `body {\n  margin: 0;\n}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks).toHaveLength(1);
			expect(blocks[0].name).toBe('body');
		});
		
		it('should identify complex combinators', () => {
			const content = `div > p.active {\n  color: red;\n}`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks[0].name).toBe('div > p.active');
		});
		
		it('should identify @keyframes', () => {
			const content = `@keyframes slideIn { from { x: 0 } }`;
			const blocks = strategy.findDocumentableBlocks(content);
			
			expect(blocks[0].name).toBe('@keyframes slideIn');
		});
	});
	
	describe('injectFunctionDoc', () => {
		it('should inject doc above selector', () => {
			const content = `.btn {\n  color: blue;\n}`;
			const result = strategy.injectFunctionDoc(content, '.btn', 'Button styles');
			
			expect(result).toBe(`/* Button styles */\n.btn {\n  color: blue;\n}`);
		});
		
		it('should handle nested indentation (e.g. inside @media)', () => {
			const content = `@media (min-width: 768px) {\n  .container {\n    width: 100%;\n  }\n}`;
			// We want to document .container inside the media query
			const result = strategy.injectFunctionDoc(content, '.container', 'Responsive Container');
			
			// The injected doc should have 2 spaces of indentation to match .container
			expect(result).toContain(`  /* Responsive Container */\n  .container {`);
		});
	});
});