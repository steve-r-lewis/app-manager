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
import { configService } from '../../../app/services/configService';

describe('ConfigService', () => {
	
	beforeEach(() => {
		// Reset state ensures isolation between tests
		configService.reset();
	});
	
	// ========================================================================
	// 1. New Functionality (Infrastructure)
	// ========================================================================
	describe('Infrastructure', () => {
		it('should initialize with tool root', () => {
			configService.init('/my/tool/path');
			expect(configService.toolRoot).toBe('/my/tool/path');
		});
		
		it('should correctly report verbose mode via helper', () => {
			expect(configService.isVerbose()).toBe(false);
			
			configService.setFlag('verbose', true);
			expect(configService.isVerbose()).toBe(true);
		});
	});
	
	// ========================================================================
	// 2. Legacy Functionality (Configuration Management)
	// ========================================================================
	describe('Configuration Management', () => {
		it('should provide default configuration', () => {
			const config = configService.getConfig();
			
			expect(config.cwd).toBeDefined();
			expect(config.flags.verbose).toBe(false);
			expect(config.flags.dryRun).toBe(false);
			expect(config.gitUser.name).toBe('');
		});
		
		it('should update git user configuration', () => {
			configService.setGitUser({ name: 'Test User', email: 'test@example.com' });
			
			const config = configService.getConfig();
			expect(config.gitUser.name).toBe('Test User');
			expect(config.gitUser.email).toBe('test@example.com');
		});
		
		it('should update feature flags independently', () => {
			// Test Verbose
			configService.setFlag('verbose', true);
			expect(configService.getConfig().flags.verbose).toBe(true);
			
			// Test Dry Run (ensure no cross-contamination)
			configService.setFlag('dryRun', true);
			expect(configService.getConfig().flags.dryRun).toBe(true);
		});
	});
	
	// ========================================================================
	// 3. State Integrity (Restored from Legacy)
	// ========================================================================
	describe('State Integrity', () => {
		it('should return a copy of the config to prevent direct mutation', () => {
			const config1 = configService.getConfig();
			
			// Attempt to mutate the returned object property directly
			// @ts-ignore
			config1.cwd = '/hacked/path';
			
			// Verify the internal service state remains unchanged
			const config2 = configService.getConfig();
			expect(config2.cwd).not.toBe('/hacked/path');
			expect(config2.cwd).toBe(process.cwd());
		});
		
		it('should reset state completely to defaults', () => {
			// 1. Change State
			configService.init('/dirty/path');
			configService.setFlag('verbose', true);
			
			// 2. Reset
			configService.reset();
			
			// 3. Verify Clean Slate
			expect(configService.toolRoot).toBe('');
			expect(configService.isVerbose()).toBe(false);
			expect(configService.getConfig().flags.verbose).toBe(false);
		});
	});
});