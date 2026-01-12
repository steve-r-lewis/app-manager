/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/code-strategies/jsonStrategy.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 23:31
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for JSON strategy (Metadata Injection).
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
import { JsonStrategy } from '../../../app/code-strategies/jsonStrategy';

describe('JsonStrategy', () => {
	const strategy = new JsonStrategy();
	
	describe('parseMetadata', () => {
		it('should extract metadata fields', () => {
			const content = JSON.stringify({ version: '1.0.0', author: 'Me' });
			const meta = strategy.parseMetadata(content);
			expect(meta.version).toBe('1.0.0');
			expect(meta.author).toBe('Me');
		});
	});
	
	describe('injectHeader', () => {
		it('should inject header fields as JSON keys', () => {
			const content = JSON.stringify({ name: 'test' });
			const header = `@version: 2.0.0\n@author: New Author`;
			
			const result = strategy.injectHeader(content, header);
			const json = JSON.parse(result);
			
			expect(json.version).toBe('2.0.0');
			expect(json.author).toBe('New Author');
			expect(json.name).toBe('test');
		});
		
		it('should handle malformed JSON gracefully', () => {
			const content = '{ invalid json }';
			const result = strategy.injectHeader(content, 'Header');
			expect(result).toBe(content);
		});
	});
});