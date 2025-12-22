/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/helpers/addContributor.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 19:30
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
 * V1.0.0, 20251219-19:30
 * Initial creation and release of addContributor.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addContributor } from '../../../../app/commands/utils/addContributor';
import { text } from '@clack/prompts';
import fs from 'fs';
import path from 'path';

// 1. Mock External Dependencies
// We mock fs to avoid disk writes during unit tests
vi.mock('fs');
vi.mock('@clack/prompts');

// 2. Mock Logger Service
// CRITICAL: This prevents the 'consola.create is not a function' error
// by stopping the real LoggerService from loading.
vi.mock('../../../../app/services/loggerService', () => ({
	logger: {
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn()
	}
}));

describe('Unit: Add Contributor', () => {
	const mockRoot = '/mock/root';
	const mockPkgPath = path.resolve(mockRoot, 'package.json');
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup default fs mocks
		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
			name: 'mock-app',
			contributors: []
		}));
	});
	
	it('should use provided options (Headless Mode) without prompting', async () => {
		// Run with full options
		await addContributor(mockRoot, {
			name: 'Headless User',
			email: 'headless@example.com',
			url: 'http://headless.com'
		});
		
		// 1. Verify Prompts were NOT called
		expect(text).not.toHaveBeenCalled();
		
		// 2. Verify File Write
		expect(fs.writeFileSync).toHaveBeenCalledWith(
			mockPkgPath,
			expect.stringContaining('"name": "Headless User"'),
		);
		expect(fs.writeFileSync).toHaveBeenCalledWith(
			mockPkgPath,
			expect.stringContaining('"email": "headless@example.com"'),
		);
	});
	
	it('should prompt for missing name if not provided in options', async () => {
		// Mock user input
		vi.mocked(text).mockResolvedValueOnce('Prompt User'); // Name
		vi.mocked(text).mockResolvedValueOnce('prompt@example.com'); // Email
		vi.mocked(text).mockResolvedValueOnce(''); // URL (Optional)
		
		// Run with empty options
		await addContributor(mockRoot, {});
		
		// Verify Prompts occurred
		expect(text).toHaveBeenCalled();
		
		// Verify Save
		expect(fs.writeFileSync).toHaveBeenCalledWith(
			mockPkgPath,
			expect.stringContaining('"name": "Prompt User"'),
		);
	});
	
	it('should handle missing package.json gracefully', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(false);
		
		await addContributor(mockRoot, { name: 'Test', email: 'test@test.com' });
		
		// Should check path but NOT read/write
		expect(fs.existsSync).toHaveBeenCalledWith(mockPkgPath);
		expect(fs.readFileSync).not.toHaveBeenCalled();
		expect(fs.writeFileSync).not.toHaveBeenCalled();
	});
});