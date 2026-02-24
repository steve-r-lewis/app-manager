/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/strategies/index.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 12
 * @createTime: 00:02
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for the Strategy Registry.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260112-00:02
 * Initial creation and release of index.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { getStrategyForFile } from '../../../app/strategies/index.js';
import { TypescriptStrategy } from '../../../app/strategies/typescriptStrategy.js';
import { VueStrategy } from '../../../app/strategies/vueStrategy.js';
import { JsonStrategy } from '../../../app/strategies/jsonStrategy.js';
import { CssStrategy } from '../../../app/strategies/cssStrategy.js';
import { HtmlStrategy } from '../../../app/strategies/htmlStrategy.js';

describe('Strategy Registry', () => {
	
	it('should return TypescriptStrategy for .ts files', () => {
		const strategy = getStrategyForFile('test.ts');
		expect(strategy).toBeInstanceOf(TypescriptStrategy);
	});
	
	it('should return TypescriptStrategy for .js files', () => {
		const strategy = getStrategyForFile('script.js');
		expect(strategy).toBeInstanceOf(TypescriptStrategy);
	});
	
	it('should return VueStrategy for .vue files', () => {
		const strategy = getStrategyForFile('Component.vue');
		expect(strategy).toBeInstanceOf(VueStrategy);
	});
	
	it('should return JsonStrategy for .json files', () => {
		const strategy = getStrategyForFile('data.json');
		expect(strategy).toBeInstanceOf(JsonStrategy);
	});
	
	it('should return CssStrategy for .css files', () => {
		const strategy = getStrategyForFile('style.css');
		expect(strategy).toBeInstanceOf(CssStrategy);
	});
	
	it('should return HtmlStrategy for .html files', () => {
		const strategy = getStrategyForFile('index.html');
		expect(strategy).toBeInstanceOf(HtmlStrategy);
	});
	
	it('should throw error for unsupported extensions', () => {
		expect(() => getStrategyForFile('image.png')).toThrow('Unsupported file type: .png');
	});
});