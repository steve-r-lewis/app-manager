/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/gitignoreTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 21:44
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The .gitignore Template Generator.
 *
 * This template produces the specific ignore rules for Git version control.
 * It handles two distinct security profiles:
 *
 * 1. Root Mode ('root'):
 * - The "Fortress". This file is designed to be defensive and comprehensive.
 * - Blocks OS noise (Thumbs.db, .DS_Store).
 * - Blocks IDE metadata (.idea, .vscode).
 * - Blocks Build Artifacts (Nuxt, Nitro, Vite, Dist).
 * - STRICTLY blocks secrets (.env, service-account.json) while allowing
 * safety templates (.env.example).
 *
 * 2. Layer Mode ('layer'):
 * - The "Standard". Minimal rules required for a sub-package.
 * - Primarily ignores its own local node_modules and nested .git folders.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-21:44
 * Initial creation and release of gitignoreTemplate.ts
 *
 * ================================================================================
 */

import type { GitIgnoreContext, TemplateFunction } from '../types/index';

/**
 * Generates a formatted .gitignore string.
 */
export const gitignoreTemplate: TemplateFunction<GitIgnoreContext, string> = (ctx) => {
	const isRoot = ctx.target === 'root';
	
	// --------------------------------------------------------------------------
	// 1. Root Configuration ("Fortress")
	// --------------------------------------------------------------------------
	if (isRoot) {
		return `# ============================================================================
# .gitignore: Nuxt 4 Monorepo (PNPM Workspace) Starter Template
# ----------------------------------------------------------------------------
# This comprehensive .gitignore is designed for multi-package adapters
# utilizing:
#   - Nuxt 4 (with Nuxt Layers / Nitro / Vite)
#   - pnpm (primary package manager)
#   - TypeScript, TailwindCSS, Pinia, Vitest, Storybook, Cypress
#
# It employs double-star (**) recursive patterns to ensure this root
# file safely ignores generated, secret, or volatile content everywhere, even
# within nested packages.
# ============================================================================

**/.git

# =============================================
# 1. Package Managers & Dependency Stores
# =============================================

# Node dependency trees (high churn, generated)
**/node_modules/

# pnpm stores / virtual links
**/.pnpm-store/
**/.pnp
**/.pnp.*
**/.pnp.js

# Lockfiles from other package managers (pnpm is canonical)
**/package-lock.json
**/yarn.lock
**/pnpm-lock.yaml

# Package manager debug logs
**/app-monitor
**/npm-debug.log*
**/yarn-debug.log*
**/yarn-error.log*
**/pnpm-debug.log*

# ---

# =============================================
# 2. Environment & Secrets
# =============================================

# Local environment files (per env/machine)
**/.env
**/.env.*

# SERVICE SECRETS (Do not commit credentials)
**/service-account.json

# EXAMPLES / TEMPLATES (Keep tracked for onboarding)
!**/.env.example

# ---

# =============================================
# 3. System / OS Noise
# =============================================

# Microsoft Windows Specific
**/Thumbs.db            # Windows thumbnail cache

# Apple Mac Specific
**/.AppleDouble         # Apple resource forks
**/.DS_Store            # macOS Finder metadata
**/.Spotlight-V100      # macOS indexing data
**/.Trashes             # macOS trash

# 'Unix-like' OS specific
**/lost+found/          # Linux FS recovery artifacts

# ---

# =============================================
# 4. Temporary & Backup Files
# =============================================

# Generic scratch directories
**/tmp/
**/temp/

# Logs
*.log                   # Catch stray root-level logs
**/*.log                # Catch logs anywhere

# Generic temp files
*.tmp                   # Generic temp scratch files
*.bak                   # Editor/backup cruft
*.swp                   # Vim swap
*.swo                   # Vim old swap
*.orig                  # Merge conflict backups

# ---

# =============================================
# 5. Nuxt / Nitro / Vite Build & Cache Artefacts
# =============================================

# Core Nuxt + build caches
**/.cache/
**/.nuxi/
**/.nuxt/
**/.output/
**/.nitro/
**/.vite/

# Conventional build output
**/dist/

# Nuxt auto-generated route/page caches
**/.nuxt/routes.json
**/.nuxt/pages.json

# Nuxt DevTools runtime cache/config
.nuxt/devtools/

# Nitro runtime + config
**/nitro.json
**/nitro.config.*
**/*.nitro.*
**/storage/

# Standalone server builds
**/nitro/build/
**/nitro/standalone/
**/standalone/

# Specific file exclusions
nuxt.config.ts

# ---

# =============================================
# 6. Testing, Tooling, QA
# =============================================

# Vitest
**/.vitest/
**/vitest.*.json
coverage/

# =============================================
# 7. Vitepress documentation server
# =============================================
docs/.vitepress/dist
docs/.vitepress/cache

# Local development playgrounds / scratch apps
**/playground/dist/
**/playground/.nuxt/
**/playground/.output/
**/sandbox*/

# Storybook
.storybook/
storybook-static/

# Cypress test runner artefacts
cypress/screenshots/
cypress/videos/

# Powershell Generated Layer Documentation
powershell/output/

# ---

# =============================================
# 8. Backend / Hosting Providers
# =============================================

# Firebase
!.firebase
!.firebaserc
!firebase.json
!firebase/generated_scripts/importData.cjs
!firebase/generated_scripts/importAuthUsers.cjs
**/firebase-debug.log*
**/firebase/functions/package-lock.json

# Appwrite emulator
**/apphosting.emulator.yaml

# Netlify build state
**/.netlify/

# Vercel project-manager state
**/.vercel/

# ---

# =============================================
# 9. IDE / Editor Project Metadata
# =============================================

# JetBrains IDEs
.idea/
qodana.yaml

# JetBrains Fleet
.fleet/

# VS Code workspace files
.vscode/
!**/.vscode/settings.json.example
!**/.vscode/extensions.json.example

# ---

# =============================================
# 10. TypeScript, Build Info & Transpiled Outputs
# =============================================

**/out-tsc/
**/*.tsbuildinfo

# ---

# =============================================
# 11. Project-Specific Runtime & Dev Data
# =============================================

# Generated data/datasets
**/.data/
**/.development/
**/data/
**/development/
**/sandbox*/
`;
	}
	
	// --------------------------------------------------------------------------
	// 2. Layer Configuration (Minimal)
	// --------------------------------------------------------------------------
	return `# =============================================
# 1. Package Managers & Dependency Stores
# =============================================

# Git management
**/.git

# Node dependency trees (high churn, generated)
**/node_modules/
`;
};