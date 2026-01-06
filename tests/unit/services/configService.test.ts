/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/configService.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 00:15
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Config Service.
 *
 * Verifies that the service can:
 * 1. Initialize and hold application state.
 * 2. Provide access to Git user configuration.
 * 3. manage global feature flags.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260102-00:15
 * Initial creation and release of configService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
// @ts-ignore - Module does not exist yet
import { configService } from '../../../app/services/configService';

describe('ConfigService', () => {
	
	beforeEach(() => {
		// Reset config if necessary between tests (method to be implemented)
		if (configService.reset) configService.reset();
	});
	
	describe('Initialization', () => {
		it('should initialize with default defaults', () => {
			const config = configService.getConfig();
			
			expect(config.cwd).toBeDefined();
			expect(config.flags.verbose).toBe(false);
			expect(config.flags.dryRun).toBe(false);
		});
	});
	
	describe('State Integrity', () => {
		it('should return a copy of the config to prevent direct mutation', () => {
			const config1 = configService.getConfig();
			
			// Attempt to mutate the returned object
			// @ts-ignore
			config1.cwd = '/hacked/path';
			
			// Verify the internal service state remains unchanged
			const config2 = configService.getConfig();
			expect(config2.cwd).not.toBe('/hacked/path');
			expect(config2.cwd).toBe(process.cwd());
		});
		
		it('should reset state to defaults', () => {
			// 1. Change state
			configService.setFlag('verbose', true);
			expect(configService.getConfig().flags.verbose).toBe(true);
			
			// 2. Reset
			configService.reset();
			
			// 3. Verify return to default
			expect(configService.getConfig().flags.verbose).toBe(false);
		});
	});
	
	describe('Git User Configuration', () => {
		it('should allow setting and retrieving git user info', () => {
			const mockUser = { name: 'Test User', email: 'test@example.com' };
			
			configService.setGitUser(mockUser);
			const config = configService.getConfig();
			
			expect(config.gitUser.name).toBe('Test User');
			expect(config.gitUser.email).toBe('test@example.com');
		});
	});
	
	describe('Feature Flags', () => {
		it('should update verbosity flags', () => {
			configService.setFlag('verbose', true);
			expect(configService.getConfig().flags.verbose).toBe(true);
		});
		
		it('should update dry-run flags', () => {
			configService.setFlag('dryRun', true);
			expect(configService.getConfig().flags.dryRun).toBe(true);
		});
	});
});