#!/usr/bin/env -S npx tsx

/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/index.ts
 * @version:    1.0.1
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
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251217-16:56
 * Initial creation and release of initEnv.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       ~/index.ts
 * @version:    1.1.0
 * ================================================================================
 */

import { main } from './app/index';
import { consola } from 'consola';
import path from 'path';
import { fileURLToPath } from 'url';
import { configService } from './app/services/configService';
import { logger } from './app/services/loggerService'; // Import Logger

// 1. Resolve Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolRoot = __dirname;
const targetRoot = process.cwd();

// 2. Initialize Infrastructure
// A. Create Directories & Error Hooks immediately
logger.init(targetRoot);

// B. Load Configuration
configService.init(toolRoot);

// 3. Launch App
(async () => {
	try {
		if (process.env.DEBUG) {
			consola.info(`[AppManager] Tool Root: ${toolRoot}`);
			consola.info(`[AppManager] Target: ${targetRoot}`);
		}
		await main(targetRoot, toolRoot);
	} catch (error) {
		// This will now be caught by our loggerService hook and written to error.log
		consola.error("Fatal Application Error:", error);
		process.exit(1);
	}
})();