# Technical Specification Document

**Component:** License Template Registry System
**Files:** `~/app/templates/license/*.ts` (new registry + per-license files, replacing the current single `licenseTemplate.ts`), extensions to `configServiceTypes.ts`, `settingsResolver.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*New feature, requested directly rather than surfaced by an audit — but designed to match a pattern already established in this codebase for exactly this shape of problem (`llm.defaultProvider`: registry + settings + `resolveOrPrompt` + availability-aware select menu), rather than inventing a new one. Supersedes `spec-templates-full.md` §4 and §9's treatment of `licenseTemplate.ts` as a single two-branch file.*

---

## 1. Design Decision: Registry Pattern, Not a Bigger If/Else

The current `licenseTemplate.ts` is a single function with an `if (ctx.licenseType === 'MIT') ... else ...` branch. Extending that shape to "many" licenses would mean one increasingly large function with an increasingly long chain of branches — exactly the shape this codebase already avoided elsewhere (`nuxt.addFile`'s registry of addable files, `llmRegistry.json`'s registry of providers). Instead:

- **One file per license**, each a plain `TemplateFunction<LicenseAuthorContext, string>` taking only `{ year?, author?, email? }` — no `licenseType` field needed on the context anymore, since the file itself *is* the type.
- **One registry file** (`app/templates/license/licenseRegistry.ts`) mapping a license ID to its label, its SPDX identifier (useful later for `package.json`'s `license` field), and its template function — a plain object map, matching `nuxt.addFile`'s established "extensible by adding entries, not a class hierarchy" pattern exactly.

```ts
export interface LicenseRegistryEntry {
	id: string;
	label: string;
	spdxId: string;
	template: TemplateFunction<LicenseAuthorContext, string>;
}

export const licenseRegistry: Record<string, LicenseRegistryEntry> = {
	mit: { id: 'mit', label: 'MIT', spdxId: 'MIT', template: mitLicenseTemplate },
	'apache-2.0': { id: 'apache-2.0', label: 'Apache License 2.0', spdxId: 'Apache-2.0', template: apache2LicenseTemplate },
	'gpl-3.0': { id: 'gpl-3.0', label: 'GNU GPLv3', spdxId: 'GPL-3.0-only', template: gplv3LicenseTemplate },
	'bsd-3-clause': { id: 'bsd-3-clause', label: 'BSD 3-Clause', spdxId: 'BSD-3-Clause', template: bsd3LicenseTemplate },
	isc: { id: 'isc', label: 'ISC', spdxId: 'ISC', template: iscLicenseTemplate },
	unlicense: { id: 'unlicense', label: 'The Unlicense (Public Domain)', spdxId: 'Unlicense', template: unlicenseTemplate },
	'mpl-2.0': { id: 'mpl-2.0', label: 'Mozilla Public License 2.0', spdxId: 'MPL-2.0', template: mpl2LicenseTemplate },
	proprietary: { id: 'proprietary', label: 'Proprietary (All Rights Reserved)', spdxId: 'UNLICENSED', template: proprietaryLicenseTemplate }
};

export function getLicenseTemplate(licenseId: string, ctx: LicenseAuthorContext): string {
	const entry = licenseRegistry[licenseId];
	if (!entry) throw new Error(`Unknown license id: ${licenseId}. Valid options: ${Object.keys(licenseRegistry).join(', ')}`);
	return entry.template(ctx);
}
```

**Proposed initial set of eight** — the license types covering the overwhelming majority of real-world OSS and private-work choices: MIT (already correct, migrated as-is), Apache-2.0, GPLv3 (fixed per §2), BSD-3-Clause, ISC, Unlicense, MPL-2.0, and a Proprietary/All-Rights-Reserved option for private work — this last one directly answers a scope question left open all the way back in the original app-config discussion ("default license type for new layers... genuinely useful if you ever do proprietary work"). This list is easy to extend later — adding a ninth license is one new file plus one new registry entry, never a change to any existing file.

## 2. Fixing GPLv3 — Sourcing, Not Retyping

Per the decision stated above: `gplv3LicenseTemplate.ts`'s implementation should copy the complete, current GPLv3 text from its canonical source (`https://www.gnu.org/licenses/gpl-3.0.txt`, the FSF's own plain-text distribution) rather than from any AI-recalled version — including the version already sitting, truncated, in the current file. The GPLv3 text is explicitly, by its own terms, licensed for verbatim redistribution ("Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.") — this is not a copyright concern, it's an accuracy one, and the canonical source is strictly safer than any recollection, mine or otherwise.

**The interpolation points remain exactly where the current (broken) file already puts them** — a `Copyright (C) {year} {author} <{email}>` line near the top, inserted into the license text at the point the GPLv3's own template instructions specify (its final "How to Apply These Terms to Your New Programs" section documents exactly where and how the copyright line should appear). **The duplicated-prefix bug (`Copyright (C)` appearing twice) must not be reproduced** — build the copyright line as a single, complete string rather than constructing part of it separately and re-prefixing it.

## 3. Extending Settings and `resolveOrPrompt`

Mirroring `llm.defaultProvider` exactly, since this is the same shape of problem (pick one of several registry-backed options, with a sensible resolution chain):

### 3.1 New Setting

```ts
// Addition to LlmSettingsSchema-adjacent section of configServiceTypes.ts — new sibling section
export const LicenseSettingsSchema = z.object({
	defaultType: z.string().nullable().default(null) // a licenseRegistry key, e.g. 'mit'
}).partial();
```
Added to `SettingsSectionSchema` alongside `author`/`llm`/`github`. Resolved via `configService.resolve('license.defaultType')`, same tiered precedence as every other setting.

### 3.2 New `SettingsValueMap` Entry

```ts
export interface SettingsValueMap {
	// ...existing entries...
	'license.defaultType': string | null;
}
```

### 3.3 New `resolveOrPrompt` Prompt Kind

```ts
export type PromptConfig =
	| { kind: 'text'; message: string; placeholder?: string }
	| { kind: 'provider-select'; message: string }
	| { kind: 'license-select'; message: string }; // new
```

```ts
// New exported helper, alongside buildProviderSelectOptions() in settingsResolver.ts
export function buildLicenseSelectOptions(): Array<{ value: string; label: string }> {
	return Object.values(licenseRegistry).map(entry => ({ value: entry.id, label: entry.label }));
}
```

Unlike `llm.defaultProvider`, there's no "availability" concept for a license — every registered license is always usable, so this helper is simpler than its LLM counterpart (no `checkAvailability()`-style filtering needed). `license.defaultType` has **no safe built-in default** (an organization's licensing choice is exactly the kind of thing that shouldn't be silently guessed), so it follows the standard prompt-and-persist path like `author.name`/`github.defaultOrg`, persisting to `project-shared` (a project's license choice is a team fact, not a personal one — same reasoning already applied to `github.defaultOrg`).

## 4. Consumer Updates

**`nuxt.createLayer`** (`spec-nuxt-domain-app-setup.md` §4.1, step 6): change from a hardcoded `mitLicenseTemplate` call to `resolveOrPrompt('license.defaultType', { kind: 'license-select', ... })` followed by `getLicenseTemplate(resolvedId, { year, author, email })`.

**`app.setup`** (`spec-nuxt-domain-app-setup.md` §3.1): same change — a newly scaffolded root project should get the same license-selection treatment as a newly scaffolded layer, for consistency, since both are "create a new thing that needs a LICENSE file" operations.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

Registry-based tests need no mocking (pure functions, static registry object). `resolveOrPrompt`'s `license-select` path reuses the exact mocking approach already established for `provider-select` (`@clack/prompts`' `select`/`isCancel`).

### 2. Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| LR-01 | `getLicenseTemplate('mit', ctx)` | Delegates to `mitLicenseTemplate`, output unchanged from today's correct MIT branch |
| LR-02 | `getLicenseTemplate('gpl-3.0', ctx)` | Output contains all 17 GPLv3 section numbers in unbroken sequence, and exactly one `"Copyright (C)"` occurrence |
| LR-03 | `getLicenseTemplate('nonexistent', ctx)` | Throws, message lists valid registry keys |
| LR-04 | `buildLicenseSelectOptions()` | Returns exactly 8 options (or however many are registered), labels matching each entry's `label` field |
| LR-05 | `resolveOrPrompt('license.defaultType', ...)`, unset everywhere | Interactive: `license-select` menu shown; headless: throws naming `app-config set license.defaultType <value>` |

---

## Final Architectural Notes

- This design deliberately mirrors `llm.defaultProvider`'s existing pattern rather than inventing a new one — the same registry-plus-settings-plus-resolveOrPrompt shape now handles two genuinely different domains (AI providers, license choices) with one consistent mental model across the codebase.
- The eight-license starter list is a proposal, not a fixed decision — extending it later costs one new file and one registry line, never a change to existing code, which is the entire point of choosing this architecture over the original if/else.
