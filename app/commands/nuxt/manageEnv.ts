/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/nuxt/manageEnv.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:39
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
 * V1.0.0, 20251217-01:39
 * Initial creation and release of manageEnv.ts
 *
 * ================================================================================
 */

// scripts/tui/commands/nuxt/manageEnv.ts
import { select, isCancel, spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

// --- Configuration ---
const ARTIFACT_DIRS = ['.nuxt', '.output', 'dist', 'coverage', 'node_modules'];
const ARTIFACT_FILES = ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'];

// --- Helper: Delete Paths ---
async function deletePaths(pathsToDelete: string[], label: string) {
  const s = spinner();
  s.start(label);

  let count = 0;
  for (const p of pathsToDelete) {
    const fullPath = path.resolve(process.cwd(), p);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
      count++;
    } catch (e) {
      consola.warn(`Failed to delete ${p}:`, e);
    }
  }

  s.stop(`Cleaned ${count} items.`);
}

// --- Helper: Run Install ---
async function runInstall() {
  consola.info('Running pnpm install...');

  return new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['install'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        consola.success('Dependencies installed.');
        resolve();
      } else {
        reject(new Error(`pnpm install exited with code ${code}`));
      }
    });
  });
}

// --- Actions ---

async function cleanArtifacts() {
  const allTargets = [...ARTIFACT_DIRS, ...ARTIFACT_FILES];
  await deletePaths(allTargets, 'Removing all artifacts & lockfiles...');
}

async function cleanCache() {
  const cacheTargets = ['.nuxt', 'node_modules/.cache'];
  await deletePaths(cacheTargets, 'Clearing Nuxt/Vite caches...');
}

export async function manageEnv() {
  const action = await select({
    message: 'Select Environment Action:',
    options: [
      { value: 'clean', label: 'Clean Artifacts', hint: 'Delete node_modules, .output, lockfiles' },
      { value: 'cache', label: 'Clean Cache Only', hint: 'Safe clean (keeps node_modules)' },
      { value: 'reset', label: 'Hard Reset', hint: 'Clean Artifacts + Reinstall pnpm' },
      { value: 'install', label: 'Install Only', hint: 'Run pnpm install' },
      { value: 'back', label: 'Go Back' }
    ]
  });

  if (isCancel(action) || action === 'back') return;

  try {
    if (action === 'clean') await cleanArtifacts();
    if (action === 'cache') await cleanCache();
    if (action === 'install') await runInstall();

    if (action === 'reset') {
      await cleanArtifacts();
      await runInstall();
    }
  } catch (err: any) {
    consola.error(pc.red(`Operation Failed: ${err.message}`));
  }
}
