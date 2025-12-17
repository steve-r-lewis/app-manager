/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/initEnv.ts
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

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { consola } from 'consola';

// Resolve paths relative to the project root
const projectRoot = process.cwd();
const scriptsEnvPath = path.resolve(projectRoot, 'scripts/.env');

if (fs.existsSync(scriptsEnvPath)) {
  dotenv.config({ path: scriptsEnvPath });
  // Optional: Verbose check during debug
  if (process.env.DEBUG) consola.info(`Loaded env from: ${scriptsEnvPath}`);
} else {
  consola.warn(`Environment file not found at: ${scriptsEnvPath}`);
}
