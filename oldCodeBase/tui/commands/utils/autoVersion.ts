/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/utils/autoVersion.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:47
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
 * V1.0.0, 20251217-01:47
 * Initial creation and release of autoVersion.ts
 *
 * ================================================================================
 */

import simpleGit from 'simple-git';
import fs from 'fs/promises';
import { spinner, select, confirm } from '@clack/prompts';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';

// Regex
const RX_VERSION = /(@version:\s*)([vV]?\d+\.\d+\.\d+)/;
const RX_HISTORY = /(@notes: Revision History\s*)/;

function incrementVersion(version: string, type: 'Major' | 'Minor' | 'Patch'): string {
  const clean = version.replace(/^[vV]/, '');
  const parts = clean.split('.').map(Number);
  if (parts.length < 3) return version; // Safety

  if (type === 'Major') { parts[0]++; parts[1]=0; parts[2]=0; }
  else if (type === 'Minor') { parts[1]++; parts[2]=0; }
  else { parts[2]++; } // Patch

  return `V${parts.join('.')}`;
}

export async function autoVersion() {
  const git = simpleGit();
  const s = spinner();

  // 1. Find Modified Files
  const status = await git.diff(['--name-only', '--diff-filter=d', 'HEAD']);
  const files = status.split('\n').filter(f => f.match(/\.(ts|vue)$/)).filter(Boolean);

  if (files.length === 0) {
    consola.info("No modified .ts/.vue files found.");
    return;
  }

  consola.info(`Found ${files.length} modified files.`);

  for (const file of files) {
    const diff = await git.diff(['HEAD', '--', file]);
    if (!diff) continue;

    s.start(`Analyzing ${file}...`);

    // 2. AI Analysis
    let analysis;
    try {
      const response = await llm.invoke({
        systemPrompt: "You are a Semantic Versioning expert.",
        userPrompt: `Analyze this git diff.
        Task 1: Determine increment (Patch, Minor, Major).
        Task 2: Write a single-line technical revision note (max 15 words).
        Return JSON: { "increment": "Patch", "note": "Fixed null ref." }
        DIFF: ${diff.substring(0, 3000)}`,
        jsonMode: true
      });
      analysis = JSON.parse(response);
    } catch (e) {
      consola.warn(`AI analysis failed for ${file}, skipping.`);
      continue;
    }

    s.stop(`Analysis: ${analysis.increment} - ${analysis.note}`);

    // 3. Confirm (Optional - removed for speed, or add 'confirm' prompt here)

    // 4. Update File
    const content = await fs.readFile(file, 'utf-8');
    const verMatch = content.match(RX_VERSION);

    if (!verMatch) {
      consola.warn(`No @version header found in ${file}`);
      continue;
    }

    const currentVer = verMatch[2];
    const newVer = incrementVersion(currentVer, analysis.increment);

    const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // Simple YYYYMMDDHHMM
    // PowerShell format was: V1.1.0, 20251205-1430
    // We'll approximate closely:
    const prettyDate = new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + new Date().toTimeString().slice(0,5).replace(':','');

    const historyEntry = `\n V${newVer.replace('V','')}, ${prettyDate}\n ${analysis.note}\n`;

    let newContent = content.replace(RX_VERSION, `$1${newVer}`);

    if (RX_HISTORY.test(newContent)) {
      newContent = newContent.replace(RX_HISTORY, `$1${historyEntry}`);
      await fs.writeFile(file, newContent, 'utf-8');
      consola.success(`Updated ${file}: ${currentVer} -> ${newVer}`);
    } else {
      consola.warn(`No History block found in ${file}.`);
    }
  }
}
