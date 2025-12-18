/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/services/config.service.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 18:01
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251218-18:01
 * Initial creation and release of config.service.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { configService } from '../../app/services/config.service';
import path from 'path';

describe('Config Service', () => {
	// We use the REAL tool root because we want to validate the REAL json files
	const TOOL_ROOT = path.resolve(__dirname, '../../');
	
	it('should load the LLM Registry correctly', () => {
		configService.init(TOOL_ROOT);
		
		expect(configService.llmConfig).toBeDefined();
		expect(configService.llmConfig?.records).toBeInstanceOf(Array);
		expect(configService.llmConfig?.records.length).toBeGreaterThan(0);
		
		// Verify structure of the first record
		const first = configService.llmConfig?.records[0];
		expect(first).toHaveProperty('id');
		expect(first).toHaveProperty('model');
	});
	
	it('should load the Repository Registry correctly', () => {
		configService.init(TOOL_ROOT);
		
		expect(configService.repoConfig).toBeDefined();
		expect(configService.repoConfig?.records).toBeInstanceOf(Array);
	});
	
	it('should not throw when initialized multiple times', () => {
		expect(() => configService.init(TOOL_ROOT)).not.toThrow();
	});
});