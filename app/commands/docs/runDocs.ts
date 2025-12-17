/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/docs/runDocs.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 10:47
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
 * V1.0.0, 20251217-10:47
 * Initial creation and release of runDocs.ts
 *
 * ================================================================================
 */

import { select, isCancel } from '@clack/prompts';
import { spawn } from 'child_process';
import { consola } from 'consola';
import pc from 'picocolors';

async function runShell(cmd: string, args: string[]) {
  consola.info(`> ${cmd} ${args.join(' ')}`);
  return new Promise<void>((resolve) => {
    spawn(cmd, args, { stdio: 'inherit', shell: true }).on('close', () => resolve());
  });
}

export async function runDocs() {
  const action = await select({
    message: 'Vitepress Actions:',
    options: [
      { value: 'dev', label: 'Docs Dev', hint: 'vitepress dev' },
      { value: 'build', label: 'Docs Build', hint: 'vitepress build' },
      { value: 'preview', label: 'Docs Preview', hint: 'vitepress preview' },
      { value: 'back', label: 'Go Back' }
    ]
  });

  if (isCancel(action) || action === 'back') return;

  const cmd = 'npx';
  const baseArgs = ['vitepress'];

  if (action === 'dev') await runShell(cmd, [...baseArgs, 'dev']);
  if (action === 'build') await runShell(cmd, [...baseArgs, 'build']);
  if (action === 'preview') await runShell(cmd, [...baseArgs, 'preview']);
}
