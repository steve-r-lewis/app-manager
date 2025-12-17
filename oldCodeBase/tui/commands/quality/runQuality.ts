/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/quality/runQuality.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:40
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
 * V1.0.0, 20251217-10:40
 * Initial creation and release of runQuality.ts
 *
 * ================================================================================
 */

import { select, isCancel } from '@clack/prompts';
import { spawn } from 'child_process';
import { consola } from 'consola';
import pc from 'picocolors';

// Generic Helper for Shell Commands
async function runShell(command: string, args: string[]) {
  consola.info(`Running: ${command} ${args.join(' ')}`);

  return new Promise<void>((resolve, reject) => {
    // stdio: 'inherit' allows interactive tools (like vitest watch) to work perfectly
    const child = spawn(command, args, { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with exit code ${code}`));
    });
  });
}

export async function runQuality() {
  const action = await select({
    message: 'Select Quality Check:',
    options: [
      { value: 'lint', label: 'Lint', hint: 'ESLint' },
      { value: 'lint:fix', label: 'Lint & Fix', hint: 'ESLint --fix' },
      { value: 'typecheck', label: 'Typecheck', hint: 'Nuxt Typecheck' },
      { value: 'test', label: 'Run Tests', hint: 'Vitest Run' },
      { value: 'test:watch', label: 'Watch Tests', hint: 'Vitest Watch' },
      { value: 'coverage', label: 'Test Coverage', hint: 'Vitest --coverage' },
      { value: 'back', label: 'Go Back' }
    ]
  });

  if (isCancel(action) || action === 'back') return;

  try {
    switch (action) {
      case 'lint':
        await runShell('eslint', ['.', '--ext', '.vue,.js,.jsx,.ts,.tsx']);
        break;
      case 'lint:fix':
        await runShell('eslint', ['.', '--ext', '.vue,.js,.jsx,.ts,.tsx', '--fix']);
        break;
      case 'typecheck':
        await runShell('npx', ['nuxt', 'typecheck']);
        break;
      case 'test':
        await runShell('npx', ['vitest', 'run']);
        break;
      case 'test:watch':
        await runShell('npx', ['vitest']);
        break;
      case 'coverage':
        await runShell('npx', ['vitest', 'run', '--coverage']);
        break;
    }
    consola.success('Check complete.');
  } catch (err: any) {
    consola.error(pc.red(err.message));
  }
}
