/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/app.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:25
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
 * V1.0.0, 20251217-01:25
 * Initial creation and release of app.ts
 *
 * ================================================================================
 */

// scripts/tui/app.ts
import { intro, outro, select, isCancel } from '@clack/prompts';
import pc from 'picocolors';

// Nuxt Commands
import { createLayer } from './commands/nuxt/createLayer';
import { extractDocs } from './commands/nuxt/extractDocs';
import { manageEnv } from './commands/nuxt/manageEnv';

// Git Commands
import { syncRepos } from './commands/git/syncRepos';
import { manageCommits } from './commands/git/manageCommits';

// Utils Commands
import { validateHeaders } from './commands/utils/validateHeaders';
import { autoVersion } from './commands/utils/autoVersion';
import { autoDoc } from './commands/utils/autoDoc';

// Quality Commands - (lint:*, typecheck:*, and vitest:*)
import { runQuality } from './commands/quality/runQuality';

// Docs Commands - (vitepress:dev, vitepress:build, vitepress:preview)
import { runDocs } from './commands/docs/runDocs';

// App Commands - (nuxt prepare, nuxt preview, nuxt dev --force, nuxt build, nuxt generate)
import { runApp } from './commands/app/runApp';

async function main() {
  console.clear();
  intro(pc.inverse(pc.cyan(' Nuxt 4 Monorepo Manager ')));

  while (true) {
    const domain = await select({
      message: 'Select Domain:',
      options: [
        { value: 'app', label: 'App', hint: 'Dev, Build, Generate' },
        { value: 'nuxt', label: 'Nuxt Operations', hint: 'Layers, Docs, Env' },
        { value: 'git', label: 'Git Operations', hint: 'Sync, Commits' },
        { value: 'quality', label: 'Quality', hint: 'Lint, Test, Typecheck' },
        { value: 'docs', label: 'Documentation', hint: 'Vitepress' },
        { value: 'utils', label: 'Utilities', hint: 'Validation, Auto-Doc, Auto-Version' },
        { value: 'exit', label: 'Exit' }
      ]
    });

    if (isCancel(domain) || domain === 'exit') {
      outro('Goodbye!');
      process.exit(0);
    }

    if (domain === 'app') await runApp();

    if (domain === 'nuxt') {
      const action = await select({
        message: 'Nuxt Action:',
        options: [
          { value: 'env', label: 'Manage Env', hint: 'Clean, Reset' },
          { value: 'create', label: 'Create Layer', hint: 'Scaffold new' },
          { value: 'docs', label: 'Extract Report', hint: 'Generate Markdown' },
          { value: 'back', label: 'Go Back' }
        ]
      });
      if (isCancel(action) || action === 'back') continue;
      if (action === 'env') await manageEnv();
      if (action === 'create') await createLayer();
      if (action === 'docs') await extractDocs();
    }

    if (domain === 'git') {
      const action = await select({
        message: 'Git Action:',
        options: [
          { value: 'commit', label: 'Smart Commit (AI)' },
          { value: 'sync', label: 'Sync Repos', hint: 'Submodules & Remotes' },
          { value: 'back', label: 'Go Back' }
        ]
      });
      if (isCancel(action) || action === 'back') continue;
      if (action === 'commit') await manageCommits();
      if (action === 'sync') await syncRepos();
    }

    if (domain === 'quality') await runQuality();

    if (domain === 'docs') await runDocs();

    if (domain === 'utils') {
      const action = await select({
        message: 'Utility Action:',
        options: [
          { value: 'headers', label: 'Validate Headers' },
          { value: 'version', label: 'Auto Version' },
          { value: 'doc', label: 'Auto Document Code' },
          { value: 'back', label: 'Go Back' }
        ]
      });
      if (isCancel(action) || action === 'back') continue;
      if (action === 'headers') await validateHeaders();
      if (action === 'version') await autoVersion();
      if (action === 'doc') await autoDoc();
    }
  }
}

main().catch(console.error);
