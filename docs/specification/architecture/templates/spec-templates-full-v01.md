# Technical Specification Document

**Component:** Templates Layer — Full Audit
**Files:** `~/app/templates/**` (all 25 files)
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Companion to `spec-scanners.md`/`spec-strategies.md`, closing the last gap in specification coverage. Every template file in the codebase was read in full for this document — including the ~16 not touched by Phase 5, which only covered the 8 files flagged (some wrongly) as stubs. That closer read found the two most significant defects surfaced anywhere in this entire project: a severely truncated, legally incomplete GPLv3 license template, and an entire parallel, meaningfully-diverged set of six templates that duplicate files already reviewed in Phase 5.*

---

## 0. Confirmed, Extended: Every Template File Is Functional

Phase 5 found that 7 of 8 files it checked, despite `TODO` docstrings, were fully working. Reading the remaining ~16 files for this document confirms the same is true across the **entire** templates tree — `appConfigTemplate.ts`, `contentConfigTemplate.ts`, and `typescriptTemplate.ts` all carry the identical `TODO: Create description here` docstring and are all fully implemented. **There are no genuinely empty template stubs anywhere in this codebase.** This is worth stating as a settled fact now, not a per-file surprise: the docstring TODO marker was never a reliable signal in this templates directory, for any file, at any point.

## 1. Major Finding: `rootConfigTemplate.ts` Duplicates Six Files Already Reviewed in Phase 5 — With Real, Consequential Divergence

`rootConfigTemplate.ts` exports six functions — `editorConfigTemplate`, `npmrcTemplate`, `nuxtrcTemplate`, `pnpmWorkspaceTemplate`, `gitModulesTemplate`, `vitestConfigTemplate` — using the project's proper `TemplateFunction<Context, Output>` typed-context pattern. **Six standalone files, in the same directory, export functions covering the exact same six file types** (`getEditorconfigTemplate`, `getNpmrcTemplate`, `getNuxtrcTemplate`, `getPnpmWorkspaceTemplate`, `getGitmodulesTemplate`, `getVitestConfigTemplate`), using an older, parameterless `get*Template()` naming and calling convention. Nothing in the codebase indicates which set is authoritative, or that this duplication exists at all — it was found only by listing every exported function name across the directory and noticing the overlap.

**This reads as an incomplete migration**, not two intentionally parallel systems: `rootConfigTemplate.ts`'s versions consistently use the same typed-context pattern already established by `gitignoreTemplate`, `nuxtConfigTemplate`, `packageJsonTemplate`, `tsconfigTemplate`, and `vueComponentTemplate` — suggesting `rootConfigTemplate.ts` was written later, as a modernization pass over some of the older parameterless files, which were then never deleted.

### 1.1 Per-Pair Comparison

| Pair | Divergence | Severity |
|---|---|---|
| `editorConfigTemplate` / `getEditorconfigTemplate` | Byte-identical output. | Low — pure duplication risk, no current drift. |
| `npmrcTemplate` / `getNpmrcTemplate` | Byte-identical output. | Low. |
| `nuxtrcTemplate` / `getNuxtrcTemplate` | Byte-identical output. | Low. |
| `pnpmWorkspaceTemplate` / `getPnpmWorkspaceTemplate` | **Real divergence.** `rootConfigTemplate.ts`'s version correctly accepts and uses a `PnpmWorkspaceContext` (`packages: string[]`, `builtDependencies?: string[]`), matching the type already defined for exactly this purpose. The standalone `getPnpmWorkspaceTemplate()` takes **no parameters at all** and hardcodes `packages: - 'layers/*'` plus a fixed `builtDependencies` list — a type/implementation mismatch Phase 5 noted and deliberately left as low-priority, on the reasoning that the hardcoded default was reasonable for this project's shape. **That reasoning still holds for the hardcoded default's *content*, but Phase 5 did not know a fully parameterized, type-correct implementation of the same function already existed one file away.** | Medium — not a bug in either file individually, but a real "which one is the answer" ambiguity. |
| `gitModulesTemplate` / `getGitmodulesTemplate` | **`rootConfigTemplate.ts`'s version already had the exact fix Phase 5 specified for the standalone file** — a `GitModulesContext`-typed `modules[]` array, returning `''` for zero modules, with no dangerous default parameters. Phase 5's fix to the standalone `getGitmodulesTemplate()` (removing its hardcoded example-repo defaults) was independently correct and necessary for *that* file, but it was solving a problem `rootConfigTemplate.ts`'s version never had. | Medium — the bug Phase 5 fixed was real, but the fix duplicates pre-existing correct code rather than being the only correct implementation. |
| `vitestConfigTemplate` / `getVitestConfigTemplate` | **The most serious divergence in this table.** These are not variations on one idea — they use **different underlying Vitest configuration APIs entirely**. `rootConfigTemplate.ts`'s version imports `defineVitestConfig` from `@nuxt/test-utils/config` — Nuxt's own test-config wrapper, required when testing actual Nuxt application code (components, composables, auto-imports) rather than plain Node.js/TypeScript. The standalone `getVitestConfigTemplate()` imports `defineConfig` from plain `vitest/config`, and its content (`app-monitor`/`app-manager` path references, an `include` pattern of `app/**/*.ts` matching App Manager's *own* source layout, not a generic scaffolded project's) reads as written specifically for **App Manager's own internal test suite**, not for a project `app.setup` scaffolds for someone else. | **High** — see §1.2. |

### 1.2 Why the `vitestConfigTemplate` Divergence Requires a Correction to the Phase 6 Spec

`spec-nuxt-domain-app-setup.md` §3.1 (`app.setup`) lists `vitestConfigTemplate`/`vitestSetupTemplate` among the templates it writes for a newly scaffolded **target** project, citing the Phase 5 review (which only ever examined the standalone `getVitestConfigTemplate()`). Given that function's content is oriented around App Manager's own directory layout and its own log-path conventions, **it is very likely the wrong template for `app.setup` to call.** `rootConfigTemplate.ts`'s Nuxt-test-utils-based `vitestConfigTemplate` is the one actually shaped for testing a scaffolded Nuxt application.

**A related, second issue found by the same reasoning:** `vitestSetupTemplate.ts` (the `@clack/prompts` mocking harness — `mockConfirm`, `mockSelect`, `mockMultiselect`, `mockText`, `mockPassword`) has no `rootConfigTemplate.ts` counterpart to compare against, so it isn't part of §1.1's duplication table — but its content is unambiguously oriented toward testing **CLI commands that use `@clack/prompts`**, not toward testing a scaffolded Nuxt application's Vue components or composables, which have no reason to import that library at all. This template, like the standalone `vitestConfigTemplate`, reads as App Manager's own internal tooling rather than something meant to be written into someone else's project.

**Correction applied to `spec-nuxt-domain-app-setup.md` (§3.1, §4.1):** `app.setup` and `nuxt.createLayer` should import `vitestConfigTemplate` (and, by the same reasoning, `pnpmWorkspaceTemplate`/`gitModulesTemplate`) from `rootConfigTemplate.ts`, not the standalone files — see the reciprocal edit made to that document. **`vitestSetupTemplate` should not be written by either command at all** — neither scaffolds a project that has any use for `@clack/prompts` mocks. If a scaffolded Nuxt project genuinely needs its own `vitest.setup.ts` (e.g. for `@nuxt/test-utils` global setup), that would require a new, Nuxt-appropriate template that does not currently exist — out of scope for this document to design, but worth flagging as a real, currently-unmet need rather than silently leaving both commands without any test-setup file at all.

**This is a recommendation, not a verified fact** — nothing in either file's docstring states its intended consumer explicitly; this conclusion is inferred from each file's content (path conventions, config API choice, and — for `vitestSetupTemplate` — the specific library being mocked) rather than confirmed from an authoritative source. Worth a direct check against the actual App Manager repository's own `vitest.config.ts`/`vitest.setup.ts` (if they exist) to see which of the candidate templates' output they actually match, before treating this as settled.

---

## 2. Moderate Finding: Four Byte-Identical Layer/Project File Pairs

`packageJsonTemplate.ts`, `tsconfigTemplate.ts`, `nuxtConfigTemplate.ts`, and `gitignoreTemplate.ts` each exist as two **byte-for-byte identical** files, one under `frameworks/nuxt/layer/` and one under `frameworks/nuxt/project/` — confirmed via direct `diff`, not inferred. This is architecturally different from §1's finding: these four are not diverged, just physically duplicated. Each file already handles both `target: 'root'` and `target: 'layer'` internally via its own `ctx.target` discriminator (confirmed by reading `packageJsonTemplate.ts`'s branching logic directly) — meaning the `layer/` copy of each file is entirely redundant with its `project/` counterpart; there is no behavior the `layer/` location adds.

**Recommendation:** consolidate to one canonical copy of each (kept in `project/`, matching where the majority of the surrounding, non-duplicated templates already live) and have any code currently importing from the `layer/` path import from `project/` instead. This is a pure risk-reduction cleanup — nothing is broken today, since the copies are identical, but any future fix applied to only one copy would silently fail to apply to the other.

## 3. Minor Finding: `vueComponentTemplate.ts` Near-Duplicate

`components/vueComponentTemplate.ts` and `project/vueComponentTemplate.ts` are functionally identical (same logic, same output for the same input) but differ in indentation style (spaces vs. tabs) in several lines — confirmed via `diff`, which shows only whitespace-only hunks. Lower severity than §2's finding, since even a future logic fix applied to only one copy would be immediately visible as a formatting-only diff when compared against the other, making drift easier to notice than the byte-identical case.

## 4. Serious Finding: `licenseTemplate.ts`'s GPLv3 Output Is Severely Truncated and Contains a Construction Bug

**This is the most consequential defect found anywhere across this entire project — more so than `spec-scanners.md`'s `HtmlScanner` bug, because a truncated legal document has real-world consequences for whoever trusts its output, independent of whether any code path currently exercises it.**

### 4.1 The Truncation

A complete GPLv3 license text has 17 numbered sections (0–16) plus a "How to Apply" appendix. This template's GPLv3 branch jumps from **"0. Definitions"** directly to **"5. Conveying Modified Source Versions"** — skipping sections 1–4 entirely (Source Code, Basic Permissions, Protecting Users' Legal Rights From Anti-Circumvention Law, and Conveying Verbatim Copies) — and then proceeds directly to **"END OF TERMS AND CONDITIONS"** immediately after section 5, omitting sections 6–16 entirely (Conveying Non-Source Forms, Patents, No Surrender of Others' Freedom, Termination, Acceptance Not Required for Having Copies, Automatic Licensing of Downstream Recipients, sublicensing restrictions, Revised Versions, Disclaimer of Warranty, Limitation of Liability, and the interpretation-of-15-and-16 clause). **Roughly 80% of the actual GPLv3 text is missing.** A project shipping this output as its `LICENSE` file would not actually be validly licensed under GPLv3 — the document doesn't contain the terms it claims to grant.

### 4.2 The Construction Bug (Independent of the Truncation)

```ts
const authorLine = `Copyright (C) ${year} ${author} ` + '<' + email + '>';
return `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) ${authorLine}
...
```
`authorLine` is built **already containing** the literal text `"Copyright (C) "`. The template then interpolates it into a string that **also** prepends `"Copyright (C) "`. The rendered output reads:
```
Copyright (C) Copyright (C) 2026 Steve R Lewis <email@example.com>
```
— a duplicated prefix, independent of and in addition to the truncation issue.

### 4.3 Why This Was Never Caught

Checked every command specification produced across this entire project (Phases 1–8): **no command ever selects `licenseType: 'GPLv3'`.** `nuxt.createLayer` (Phase 6) always calls `mitLicenseTemplate`/`licenseTemplate` with the MIT branch, matching the README's own convention (`[MIT](./LICENSE)`, per `readmeTemplate.ts` §5.7 below). The GPLv3 branch is exactly as latent as `spec-scanners.md`'s `HtmlScanner` defect — real, broken, and currently unreachable by any specified code path — which is precisely why it survived undetected until a full read of the file for this document.

**Recommended fix:** either complete the GPLv3 text properly (the full, correct text is a well-known, publicly available, unmodifiable-by-license-terms document — copying it in full is not just permitted but is literally what "verbatim copies of this license document" in its own preamble requires) or, if GPLv3 support isn't actually needed by any planned command, remove the branch entirely rather than leave a broken implementation of an unused option sitting in the codebase. Separately and regardless of that decision, fix the duplicated `"Copyright (C)"` construction bug — it exists independent of the truncation and would need fixing either way.

## 5. Finding: `readmeTemplate.ts`'s Layer Branch Conflicts with Phase 6's Standalone-Layer Mode

`readmeTemplate.ts`'s non-root branch always writes:
```
## Installation

To use this layer in your Nuxt application, add it to your `nuxt.config.ts`:
...
extends: ["@monorepo/name"]
```
This assumes the layer is meant to be **consumed by a host application** — exactly `packageJsonTemplate`'s original, pre-Phase-5 layer behavior (empty `scripts`/`dependencies`, "relies on the host application"). Phase 5 added a `standalone: true` mode to `packageJsonTemplate` specifically because `nuxt.createLayer` (Phase 6) needs layers that run independently — but `readmeTemplate.ts` was never given the equivalent extension, and nothing caught this until this file was read in full for this document. **A standalone layer scaffolded by `nuxt.createLayer` today would receive a README telling its reader to add it to a host's `nuxt.config.ts`, when the whole point of that command is that the layer doesn't need one.**

**Recommended fix, mirroring `packageJsonTemplate`'s Phase 5 pattern exactly:**
```ts
export interface ReadmeContext extends TargetedTemplateContext {
	// ...existing fields...
	standalone?: boolean; // new — only meaningful when target === 'layer'
}
```
When `target === 'layer'` and `ctx.standalone` is true, the installation section should instead read as a root project's setup/development/build instructions (reusing the same three subsections the `isRoot` branch already produces), since a standalone layer is run exactly like a root project until the day it's actually linked into one via `git.addSubmodules`.

**Correction applied to `spec-nuxt-domain-app-setup.md` §4.1:** `nuxt.createLayer`'s template list should include this `readmeTemplate` extension as a dependency, alongside the already-specified `packageJsonTemplate` standalone mode — see the reciprocal edit made to that document.

---

## Part 1: Operational & Design Specification (Per-Template Functional Logic)

*Full treatment for templates with genuine branching logic; a lighter pass for templates that are simple, static, or already fully covered by the findings above.*

### 6. `headerTemplate.ts` — Confirmed Correct (Phase 5 Fix Applied)

`getHeaderBlock()`'s date/time formatting and shebang-relative placement logic confirmed correct on re-read. The Phase 5 fix (default `author` changed from `'Steve R Lewis'` to `'Unknown'`) is the only change needed and remains correct.

### 7. `jsonTemplate.ts` — Confirmed Correct, Confirmed Distinct Purpose

Re-confirmed (from the Phase 2 finding): this generates the `metadataEntity.development.schemaVersion`-shaped envelope — the **same shape `JsonStrategy` specifically detects** (`spec-strategies.md` §5.5) — for data-catalog-style tracking files, genuinely distinct from the flat envelope used by `llmRegistry.json`/`repositoryRegistry.json`/`app-manager/settings.json`. No defects found; this template's purpose and `JsonStrategy`'s "complex schema" branch are two ends of the same, correctly-matched shape.

### 8. `readmeTemplate.ts` — One Fix Required (§5, above)

Otherwise confirmed correct: root-mode instructions, features/requirements sections, and the generic `ctx.author || 'Maintainer'` fallback (a template that already does the right thing on identity, unlike `envTemplate.ts`/`headerTemplate.ts` before their Phase 5 fixes) are all sound.

### 9. `licenseTemplate.ts` — Two Fixes Required (§4, above)

MIT branch confirmed complete and correct. GPLv3 branch requires both fixes in §4 before it should be considered usable by any command.

### 10. `packageJsonTemplate.ts` — Confirmed Correct (Phase 5 Extension Applied), Duplication Noted (§2)

The discriminated `target`/`standalone` logic (Phase 5) is correct. The `layer/`/`project/` copies are byte-identical (§2) — the Phase 5 fix, applied to write both copies identically, was correctly specified.

### 11. `gitignoreTemplate.ts` — Confirmed Correct (Phase 5 Fix Applied), Duplication Noted (§2)

The `app-manager/logs/`/`app-manager/test-logs/` targeted-ignore fix (Phase 5) is correct in both copies (confirmed byte-identical, §2).

### 12. `nuxtConfigTemplate.ts` / `tsconfigTemplate.ts` — Confirmed Correct, Duplication Noted (§2)

Both correctly implement their `target`-discriminated logic (micro-template assembly for Nuxt config; dual compiler-options sets for TS config). Both are byte-identical between `layer/`/`project/` (§2).

### 13. `rootConfigTemplate.ts` — Six Functions, See §1 for the Governing Finding

Each of the six individual functions is internally correct (the `pnpmWorkspaceTemplate`/`gitModulesTemplate`/`vitestConfigTemplate` implementations here are, in isolation, the *better*-designed versions per §1.1's table) — the defect is entirely at the "two files answer the same question differently" level, not within this file itself.

### 14. `vueComponentTemplate.ts` (Both Copies) — Confirmed Correct, Near-Duplicate Noted (§3)

Correct header placement inside `<script setup>`, correct generic author fallback.

### 15. Simple/Static Templates — Confirmed Correct, No Further Detail Needed

`editorconfigTemplate.ts`, `npmrcTemplate.ts`, `nuxtrcTemplate.ts`, `appConfigTemplate.ts`, `contentConfigTemplate.ts`, `typescriptTemplate.ts`, `vitestSetupTemplate.ts` — each confirmed fully implemented, static or near-static output, no branching logic worth a dedicated functional-logic section. `vitestSetupTemplate.ts` in particular (the `@clack/prompts` mocking harness) is more substantial in line count than the others in this group but has no conditional logic — it is a single, fixed block of mock setup code, correctly written.

### 16. `envTemplate.ts` — Confirmed Correct (Phase 5 Fix Applied)

The `EnvExampleContext`-parameterized fix (Phase 5) is correct and complete.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

No mocking required for any template — every one is a pure function of its input context object (or no input at all), consistent with the Scanners and Strategies layers.

### 2. Test Scenarios (New/Corrected Behavior Only)

| ID | Scenario | Expected Outcome |
|---|---|---|
| LIC-01 | `licenseTemplate({ licenseType: 'GPLv3', ... })`, once fixed | Output contains all 17 numbered sections in order, with no gap between any two consecutive section numbers |
| LIC-02 | Same, checking the copyright line | `"Copyright (C)"` appears exactly once, not twice |
| RM-01 | `readmeTemplate({ target: 'layer', standalone: true, ... })`, once fixed | Output contains setup/development/build instructions, **not** "add it to your `nuxt.config.ts`" |
| RM-02 | `readmeTemplate({ target: 'layer', standalone: false, ... })` | Unchanged from current behavior — the host-consumption instructions remain correct for a *non*-standalone layer |
| DUP-01 | `rootConfigTemplate.ts`'s `vitestConfigTemplate` vs. the standalone `getVitestConfigTemplate()` | Both produce syntactically valid but **behaviorally different** Vitest configs — a regression test asserting *which one* `app.setup` actually calls, to catch this silently reverting to the wrong one during implementation |
| DUP-02 | `packageJsonTemplate.ts`/`tsconfigTemplate.ts`/`nuxtConfigTemplate.ts`/`gitignoreTemplate.ts`, `layer/` vs. `project/` | Byte-identical output for identical input — a regression test to catch future drift between the two copies, pending the §2 consolidation recommendation being acted on |

### 3. Test Data Requirements

**Full, correct GPLv3 text**, for LIC-01's fixture — the complete, unmodified license text (publicly available, and per its own terms, permitted and expected to be copied verbatim) rather than a partial excerpt, so the test can assert on the presence of every section number rather than approximating completeness.

---

## Final Architectural Notes

- §4 (the GPLv3 defect) is the single most consequential finding across every specification document produced in this project. Every other defect found — the `HtmlScanner` bug, the `JsonStrategy` mischaracterization, the `processService.spawn()`/legacy-spec semantic mismatch — affects code behavior. This affects a **legal document** a real project could ship under false pretenses of being validly licensed. Recommend prioritizing its fix (or removal) independent of and ahead of any implementation-ordering plan otherwise in place.
- §1's `rootConfigTemplate.ts` finding is the second-most consequential, and the reasoning pattern is worth generalizing: **this project's history includes at least one apparent migration that was started but not finished** (old parameterless templates partially superseded by a newer typed-context file, without the old ones being removed). Worth checking, during implementation, whether any *other* file in the codebase shows the same "two naming conventions for the same concept, one clearly older" signature — this document only went looking because a directory listing happened to surface it for these six specific functions.
- With this document, `spec-scanners.md`, and `spec-strategies.md` complete, **every layer of the code-intelligence stack now has full Part 1/Part 2 specification coverage**, closing the gap identified when this three-document body of work was requested.
