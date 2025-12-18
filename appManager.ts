#!/usr/bin/env -S npx tsx

/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/appManager.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 16:56
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
 * V1.0.0, 20251217-16:56
 * Initial creation and release of initEnv.ts
 *
 * ================================================================================
 */

import { main } from './app/app.js';
import { consola } from 'consola';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. Resolve Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// toolRoot: Where this script and the config/ folder live
const toolRoot = __dirname;
// targetRoot: Where the user ran the command (the Nuxt project)
const targetRoot = process.cwd();

// 2. Load Environment from Tool Root
const envPath = path.resolve(toolRoot, '.env');
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	consola.warn(`[AppManager] No .env found at ${envPath}. Ensure API keys are set.`);
}

// 3. Launch App
(async () => {
	try {
		if (process.env.DEBUG) {
			consola.info(`[AppManager] Tool Root: ${toolRoot}`);
			consola.info(`[AppManager] Target: ${targetRoot}`);
		}
		// Pass context to the main application
		await main(targetRoot, toolRoot);
	} catch (error) {
		consola.error("Fatal Application Error:", error);
		process.exit(1);
	}
})();