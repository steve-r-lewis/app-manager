/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/services/logger.service.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 12:30
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
 * V1.0.0, 20251217-12:30
 * Initial creation and release of logger.service.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import path from 'path';
import { consola } from 'consola';

// State is module-scoped (private to this file)
const STATE = {
  logDir: path.resolve(process.cwd(), 'app-monitor/logs'),
  initialized: false
};

// Public API defined as a plain object
export const logger = {
  /** Checks if the logging directory exists */
  exists() {
    return fs.existsSync(STATE.logDir);
  },

  /** Ensure directory exists */
  ensureDir() {
    if (!this.exists()) {
      fs.mkdirSync(STATE.logDir, { recursive: true });
    }
  },

  /** Clears the log directory */
  clear() {
    if (this.exists()) {
      fs.rmSync(STATE.logDir, { recursive: true, force: true });
      consola.success('Log directory cleared.');
    } else {
      consola.info('Log directory does not exist.');
    }
  },

  /** Initialize the file reporter */
  init() {
    if (STATE.initialized) return; // Prevent double-init

    this.ensureDir();
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const logFile = path.join(STATE.logDir, `tui_${timestamp}.log`);

    const fileStream = fs.createWriteStream(logFile, { flags: 'a' });

    consola.addReporter({
      log: (logObj) => {
        const time = new Date().toLocaleTimeString();
        const type = logObj.type.toUpperCase();
        const args = logObj.args.map(a =>
          typeof a === 'object' ? JSON.stringify(a) : a
        ).join(' ');

        fileStream.write(`[${time}] [${type}] ${args}\n`);
      }
    });

    STATE.initialized = true;
    return logFile;
  }
};
