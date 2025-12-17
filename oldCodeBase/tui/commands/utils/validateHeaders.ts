/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/utils/validateHeaders.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:46
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
 * V1.0.0, 20251217-01:46
 * Initial creation and release of validateHeaders.ts
 *
 * ================================================================================
 */

import fs from 'fs/promises';
import path from 'path';
import { spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';

// Regex Patterns
const RX_PROJECT = /(@project:\s*)(.+)/;
const RX_FILE = /(@file:\s*)(.+)/;
const RX_AUTHOR = /(@author:\s*)(.+)/;
const RX_VERSION_TAG = /(@version:\s*)(\S+)/;
const RX_HISTORY_VER = /V\d+\.\d+\.\d+/g;

// Helper: Get Project Context (Root vs Layer)
function getProjectName(filePath: string) {
  const match = filePath.match(/[\\/]layers[\\/]([^\\/]+)[\\/]/);
  return match ? `@monorepo/${match[1]}` : path.basename(process.cwd()); // Default to root folder name
}

async function processFile(filePath: string, rootPath: string) {
  const content = await fs.readFile(filePath, 'utf-8');
  let newContent = content;
  const changes: string[] = [];

  const relPath = '~/' + path.relative(rootPath, filePath).replace(/\\/g, '/');
  const projectName = getProjectName(filePath);
  const author = "Steve R Lewis"; // Centralized Author

  // 1. Update Header Fields
  if (RX_PROJECT.test(newContent)) {
    newContent = newContent.replace(RX_PROJECT, `$1${projectName}`);
  }
  if (RX_FILE.test(newContent)) {
    const currentFileVal = newContent.match(RX_FILE)?.[2];
    if (currentFileVal !== relPath) {
      newContent = newContent.replace(RX_FILE, `$1${relPath}`);
      changes.push('Path');
    }
  }
  if (RX_AUTHOR.test(newContent)) {
    newContent = newContent.replace(RX_AUTHOR, `$1${author}`);
  }

  // 2. Sync Version with History
  // Find all "V.x.x.x" in the file. The last one usually corresponds to the history block.
  // A more robust check might look specifically inside the @notes block, but strict regex usually works.
  const historyMatches = newContent.match(RX_HISTORY_VER);
  if (historyMatches && historyMatches.length > 0) {
    const latestRev = historyMatches[0]; // Regex usually finds the first one. Your history is top-down?
    // Actually, usually history is descended. Let's assume the @version tag should match the *top-most* history entry found.

    // Check current @version
    const verMatch = newContent.match(RX_VERSION_TAG);
    if (verMatch && verMatch[2] !== latestRev) {
      newContent = newContent.replace(RX_VERSION_TAG, `$1${latestRev}`);
      changes.push(`Ver->${latestRev}`);
    }
  }

  if (newContent !== content) {
    await fs.writeFile(filePath, newContent, 'utf-8');
    return changes;
  }
  return null;
}

// Recursive Walker
async function walk(dir: string, fileList: string[] = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      if (['node_modules', '.git', '.nuxt', '.output', 'dist'].includes(file.name)) continue;
      await walk(res, fileList);
    } else {
      if (['.ts', '.vue'].includes(path.extname(file.name))) {
        fileList.push(res);
      }
    }
  }
  return fileList;
}

export async function validateHeaders() {
  const s = spinner();
  s.start('Scanning source files...');

  const root = process.cwd();
  const files = await walk(root);

  let updated = 0;

  for (const file of files) {
    const changes = await processFile(file, root);
    if (changes) {
      const name = path.basename(file);
      s.message(`Updated ${name}: ${changes.join(', ')}`);
      updated++;
    }
  }

  s.stop(`Validation Complete. ${updated} files updated.`);
}
