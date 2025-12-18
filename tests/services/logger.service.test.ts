/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/services/logger.service.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 19:55
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
 * V1.0.0, 20251218-19:55
 * Initial creation and release of logger.service.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { logger } from '../../app/services/logger.service';
import { setupTestContext } from '../utils/test-context';
import fs from 'fs';
import path from 'path';
import { consola } from 'consola';

// Helper to let filesystem operations settle
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Logger Service', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(async () => {
		ctx = setupTestContext();
		logger.init(ctx.targetRoot);
		// Wait for streams to initialize
		await wait(50);
	});
	
	afterEach(() => {
		logger.close();
		ctx.restore();
		vi.restoreAllMocks();
	});
	
	it('should automatically create the app-monitor directory structure', () => {
		const logsDir = path.join(ctx.targetRoot, 'app-monitor/logs');
		expect(fs.existsSync(logsDir)).toBe(true);
	});
	
	it('should automatically create the error log file', () => {
		const errorFile = path.join(ctx.targetRoot, 'app-monitor/logs/app-manager-error.log');
		expect(fs.existsSync(errorFile)).toBe(true);
	});
	
	it('should write errors to the error log', async () => {
		const errorFile = path.join(ctx.targetRoot, 'app-monitor/logs/app-manager-error.log');
		
		consola.error('Test Error Message');
		
		// Allow IO buffer to flush
		await wait(100);
		
		const content = fs.readFileSync(errorFile, 'utf-8');
		expect(content).toContain('Test Error Message');
		expect(content).toContain('ERROR');
	});
	
	it('should NOT create session log by default', () => {
		const logsDir = path.join(ctx.targetRoot, 'app-monitor/logs');
		const files = fs.readdirSync(logsDir);
		
		const sessionFiles = files.filter(f => f.startsWith('session-'));
		expect(sessionFiles.length).toBe(0);
	});
	
	it('should create session log when enabled', async () => {
		logger.enableSessionLogging();
		
		// Wait for file creation
		await wait(50);
		
		const logsDir = path.join(ctx.targetRoot, 'app-monitor/logs');
		const files = fs.readdirSync(logsDir);
		const sessionFile = files.find(f => f.startsWith('session-'));
		
		expect(sessionFile).toBeDefined();
	});
});