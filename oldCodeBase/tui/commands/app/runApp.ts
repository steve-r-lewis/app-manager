/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/app/runApp.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:42
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
 * V1.0.0, 20251217-10:42
 * Initial creation and release of runApp.ts
 *
 * ================================================================================
 */

import { select, isCancel } from '@clack/prompts';
import { spawn } from 'child_process';
import { consola } from 'consola';
import pc from 'picocolors';

async function runShell(command: string, args: string[]) {
  consola.info(`> ${command} ${args.join(' ')}`);
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit Code: ${code}`));
    });
  });
}

export async function runApp() {
  const action = await select({
    message: 'Select App Action:',
    options: [
      { value: 'dev', label: 'Start Dev Server', hint: 'nuxt dev --force' },
      { value: 'build', label: 'Build for Production', hint: 'nuxt build' },
      { value: 'generate', label: 'Static Generation', hint: 'nuxt generate' },
      { value: 'preview', label: 'Preview Build', hint: 'nuxt preview' },
      { value: 'back', label: 'Go Back' }
    ]
  });

  if (isCancel(action) || action === 'back') return;

  try {
    switch (action) {
      case 'dev':
        await runShell('npx', ['nuxt', 'dev', '--force']);
        break;
      case 'build':
        await runShell('npx', ['nuxt', 'build']);
        break;
      case 'generate':
        await runShell('npx', ['nuxt', 'generate']);
        break;
      case 'preview':
        await runShell('npx', ['nuxt', 'preview']);
        break;
    }
  } catch (err: any) {
    consola.error(pc.red(err.message));
  }
}
