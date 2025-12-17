/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/utils/autoDoc.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:48
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
 * V1.0.0, 20251217-01:48
 * Initial creation and release of autoDoc.ts
 *
 * ================================================================================
 */

import fs from 'fs/promises';
import path from 'path';
import { text, spinner, isCancel } from '@clack/prompts';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';

async function backupFile(filePath: string, root: string) {
  const relPath = path.relative(root, filePath);
  const backupPath = path.join(root, 'app-monitor/backup', relPath);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.copyFile(filePath, backupPath);
}

async function documentFile(filePath: string, root: string) {
  const code = await fs.readFile(filePath, 'utf-8');
  const filename = path.basename(filePath);

  // AI Request
  const documentedCode = await llm.invoke({
    systemPrompt: "You are a Senior Technical Writer. Document this code with JSDoc and inline comments. Return ONLY valid runnable code.",
    userPrompt: `Filename: ${filename}\n\n${code}`,
    temperature: 0.2
  });

  // Safety: Strip markdown blocks if AI added them
  const cleanCode = documentedCode.replace(/^```[a-z]*\s*/, '').replace(/\s*```$/, '');

  // Write
  await backupFile(filePath, root);
  await fs.writeFile(filePath, cleanCode, 'utf-8');
  consola.success(`Documented: ${filename}`);
}

export async function autoDoc() {
  const root = process.cwd();

  const target = await text({
    message: 'Enter file or directory path to document:',
    placeholder: 'layers/auth/utils.ts'
  });

  if (isCancel(target) || !target) return;

  const absPath = path.resolve(root, target as string);
  const s = spinner();

  try {
    const stats = await fs.stat(absPath);
    s.start('Processing...');

    if (stats.isFile()) {
      await documentFile(absPath, root);
    } else if (stats.isDirectory()) {
      const files = await fs.readdir(absPath);
      // Filter for code files
      const codeFiles = files.filter(f => /\.(ts|vue|js)$/.test(f));

      for (const f of codeFiles) {
        s.message(`Documenting ${f}...`);
        await documentFile(path.join(absPath, f), root);
      }
    }
    s.stop('Documentation complete. Backups in scripts/backup/');
  } catch (e: any) {
    s.stop('Error');
    consola.error(`Path not found or error: ${e.message}`);
  }
}
