/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/git/manageCommits.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:22
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
 * V1.0.0, 20251217-01:22
 * Initial creation and release of manageCommits.ts
 *
 * ================================================================================
 */

import { simpleGit } from 'simple-git';
import { select, text, confirm, spinner } from '@clack/prompts';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';

export async function manageCommits() {
  const git = simpleGit();
  const s = spinner();

  // 1. Check Status
  const status = await git.status();

  if (status.files.length === 0) {
    consola.info("No changes detected.");
    return;
  }

  // 2. Stage Changes
  await git.add('.');
  const diff = await git.diff(['--staged']);

  if (!diff) {
    consola.warn("Staged changes are empty (binary files?).");
    return;
  }

  // 3. AI Generation
  s.start("Analyzing changes with AI...");

  const aiMessage = await llm.invoke({
    systemPrompt: "You are a semantic git commit message generator. Output ONLY the message.",
    userPrompt: `Generate a commit message for this diff (max 50 chars):\n${diff.substring(0, 4000)}`
  });

  s.stop("AI Analysis Complete");

  // 4. Interactive Menu
  const action = await select({
    message: `Proposed: "${pc.cyan(aiMessage.trim())}"`,
    options: [
      { value: 'accept', label: 'Accept & Push' },
      { value: 'edit', label: 'Edit Message' },
      { value: 'skip', label: 'Cancel' }
    ]
  });

  if (action === 'skip') return;

  let finalMessage = aiMessage.trim();
  if (action === 'edit') {
    const custom = await text({
      message: 'Enter commit message',
      initialValue: finalMessage
    });
    if (typeof custom === 'string') finalMessage = custom;
  }

  // 5. Commit & Push
  s.start("Pushing to remote...");
  await git.commit(finalMessage);
  await git.push();
  s.stop("Synced successfully! 🚀");
}
