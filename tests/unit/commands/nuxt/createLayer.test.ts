/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/nuxt/createLayer.test.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 19
 * @createTime: 00:21
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit tests for initLayers logic, covering file system discovery,
 * user interaction, and headless execution.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251221-22:35
 * Updated mocks to support spinner instead of logger.loader.
 *
 * V1.0.0, 20251219-00:21
 * Initial creation and release of createLayer.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLayer } from '../../../../app/commands/nuxt/createLayer';
import fs from 'fs';
import { spinner } from '@clack/prompts';

// Mock deps
vi.mock('fs');
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/logger.service', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn()
		// No loader needed here anymore
	}
}));
vi.mock('../../../../app/services/llm.service', () => ({
	llm: { generate: vi.fn().mockResolvedValue('{"pkgJson": "desc", "readme": "read", "jsdoc": "jsdoc"}') }
}));

describe('Unit: createLayer', () => {
	const mockRoot = '/mock/root';
	
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(fs.existsSync).mockReturnValue(false);
		
		// Mock Spinner
		vi.mocked(spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
	});
	
	it('should scaffold a new layer structure', async () => {
		await createLayer(mockRoot, { name: 'test-layer', purpose: 'testing' });
		
		const writeCalls = vi.mocked(fs.writeFileSync).mock.calls;
		
		// Check for specific files
		expect(writeCalls.some(call => call[0].toString().endsWith('package.json'))).toBe(true);
		expect(writeCalls.some(call => call[0].toString().endsWith('nuxt.config.ts'))).toBe(true);
		expect(writeCalls.some(call => call[0].toString().endsWith('LICENSE'))).toBe(true);
		expect(writeCalls.some(call => call[0].toString().endsWith('.gitignore'))).toBe(true);
		
		// Verify spinner was used
		expect(spinner).toHaveBeenCalled();
	});
});