/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/nuxt/createLayer.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:41
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
 * V1.0.0, 20251219-23:41
 * Initial creation and release of createLayer.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
// Correct import path (4 levels up)
import { createLayer } from '../../../../app/commands/nuxt/createLayer';

describe('E2E: Create Layer', () => {
	let tempDir: string;
	
	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'am-e2e-nuxt-'));
		fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
	});
	
	afterEach(() => {
		try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
	});
	
	it('should scaffold a complete layer structure on disk', async () => {
		const layerName = 'marketing-feature';
		globalThis.mockText.mockResolvedValue(layerName);
		
		// FIX: Pass tempDir explicitly
		await createLayer(tempDir);
		
		const layerPath = path.join(tempDir, 'layers', layerName);
		expect(fs.existsSync(path.join(layerPath, 'nuxt.config.ts'))).toBe(true);
		expect(fs.existsSync(path.join(layerPath, 'package.json'))).toBe(true);
	});
});