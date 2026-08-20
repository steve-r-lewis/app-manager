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
import { configService } from '../../../app/services/configService.js';

describe('ConfigService', () => {
	
	beforeEach(() => {
		configService.reset();
	});
	
	describe('Infrastructure Mapping', () => {
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
			configService.setFlag('verbose', true);
			expect(configService.getConfig().flags.verbose).toBe(true);
			
			configService.setFlag('dryRun', true);
			expect(configService.getConfig().flags.dryRun).toBe(true);
		});
	});
	
	describe('State Integrity & Validation Boundaries', () => {
		it('should return a deep clone of the config to prevent egress nested mutation', () => {
			const config1 = configService.getConfig();
			
			// Attempt malicious nested property mutation from a consumer context
			// @ts-ignore
			config1.flags.verbose = true;
			// @ts-ignore
			config1.cwd = '/hacked/path';
			
			const config2 = configService.getConfig();
			expect(config2.flags.verbose).toBe(false); // Deep check holds secure
			expect(config2.cwd).not.toBe('/hacked/path'); // Base primitive holds secure
		});
		
		it('should prevent ingress mutation by completely severing input references', () => {
			const sourceUser = { name: 'Alice', email: 'alice@test.com' };
			configService.setGitUser(sourceUser);
			
			// Mutate original source container post-insertion
			sourceUser.name = 'Hacked External Reference';
			
			const state = configService.getConfig();
			expect(state.gitUser.name).toBe('Alice');
			expect(state.gitUser.name).not.toBe('Hacked External Reference');
		});
		
		it('should strictly reject malformed data types at runtime via Zod schemas', () => {
			// Simulating unvalidated, toxic filesystem input bypass
			const badData = { name: 123, email: 'corrupted-string-format' } as any;
			
			expect(() => configService.setGitUser(badData)).toThrow();
		});
		
		it('should reset state completely to defaults', () => {
			configService.init('/dirty/path');
			configService.setFlag('verbose', true);
			
			configService.reset();
			
			expect(configService.toolRoot).toBe('');
			expect(configService.isVerbose()).toBe(false);
			expect(configService.getConfig().flags.verbose).toBe(false);
		});
	});
});