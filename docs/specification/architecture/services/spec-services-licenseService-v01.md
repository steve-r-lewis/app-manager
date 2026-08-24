# Technical Specification Document

**Component:** `licenseService` — OSI-Driven License Catalog, Text Resolution, LICENSE File Management
**Files:** `~/app/services/licenseService.ts`, `~/app/types/services/licenseServiceTypes.ts`, `~/config/licenseRegistry.json` (new cache file), `~/app/templates/license/*.ts` (existing curated templates, unchanged)
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*New service. Confirmed against a real sample response from `https://opensource.org/api/license?`, not assumed field names — see §1.1. Builds on, and does not replace, the already-specced curated 8-license registry (`spec-license-system-v01.md`, `spec-templates-license-v01.md`); this document is about adding full-OSI-catalog coverage and automated text resolution on top of that curated core, per the decision made in conversation to go OSI-API-driven rather than curated-set-only.*

---

## 1. Shared Context

### 1.1 Confirmed API Shape

Real fields, from a live sample response (not guessed):

| Field | Type | Notes |
|---|---|---|
| `id` | string | slug, e.g. `curl`, `cddl-1-1` |
| `name` | string | display name |
| `spdx_id` | string | **can be `""`** — not every entry has a registered SPDX id (§1.4) |
| `version` | string | can be `""` or `"N/A"` |
| `submission_date`, `approval_date` | string | `YYYYMMDD` |
| `submission_url`, `submitter_name` | string | provenance, not needed for generation |
| `approved` | **boolean** | this *is* "state" — see below |
| `license_steward_version` | string | usually `""` |
| `license_steward_url` | string | third-party text/info source — **format is inconsistent across entries** (HTML doc page, plain `.txt`, or `""` empty) |
| `board_minutes` | string | URL, not needed for generation |
| `stewards` | string[] | org slugs |
| `keywords` | string[] | soft curation tags — observed values include `legacy`, `superseded`, `redundant-with-more-popular`, `non-reusable`, `special-purpose`, `international`, `uncategorized`, `other-miscellaneous` |
| `_links.self.href` | string | this API endpoint for the entry |
| `_links.html.href` | string | `https://opensource.org/license/<id>` — OSI's own page, one consistent template/host across every entry |
| `_links.collection.href` | string | `https://opensource.org/api/licenses` (plural) |

**"State" is `approved: boolean`, not a multi-value status.** `keywords` supplies secondary, informal signals (e.g. `superseded`) — advisory only, never used to block an action, only to annotate it in listings.

**Confirmed against the official API announcement (2026-08-24):** the endpoint is `https://opensource.org/api/license` (no trailing `?` required), with `https://opensource.org/api/license/<id>` for a single entry and `?name=`/`?spdx=` query filters for search. The legacy `api.opensource.org` service is being deprecated — nothing in this design uses it, so no action needed there.

**Data-shape caveat found by comparing two real samples:** the official announcement's own worked example (`gpl-3-0`) omits `spdx_id` and `approved` entirely, while the live sample fetched directly for this design (`curl`, `cddl-1-1`, etc.) has both fields present. Treat both as **optionally absent, not just optionally empty** — `resolveText`/`package.json`-sync logic (§1.4) must handle `spdx_id` being `undefined` the same way it handles `''`, and must not assume a missing `approved` means `false` (treat as unknown/unapproved-for-picker-purposes only, never silently coerce).

**Open/unconfirmed at spec time:**
- Whether `GET /api/license` returns the entire catalog in one response or is paginated (the plural `_links.collection.href` suggests a separate collection concept worth checking) — verify against a real full fetch at implementation time.

**Resolved since the previous revision of this document:** the markup of an `_links.html.href` page was previously the biggest open blocker for §1.3/§4 — it's now confirmed against a real captured page (`opensource.org/license/mit`, 2026-08-24). See §3.1/§4.

### 1.2 Two-Tier Registry — Curated Tier Is Transitional, Not Permanent

- **Curated tier (existing, unchanged for now):** the 8 hand-authored templates from `spec-license-system-v01.md` (MIT, Apache-2.0, GPLv3, BSD-3-Clause, ISC, Unlicense, MPL-2.0, Proprietary) — each a `TemplateFunction` with a hand-placed copyright-line insertion point. This is currently the *only working* LICENSE-generation path in the real codebase (`licenseService` itself is still spec-only) and stays the default/recommended path until the OSI tier is built and verified.
- **OSI tier (new, this document):** every other entry in the OSI catalog, resolved and generated per §1.3/§3. Selected only when the user explicitly picks something outside the curated 8, until the point below changes that.

`licenseRegistry` (existing, from the curated spec) and the new OSI cache are **separate data sources checked in sequence**, not merged into one schema — an id present in both (e.g. `mit`, `unlicense` likely appear in OSI's list too) currently resolves to the curated tier first.

**Decision recorded 2026-08-24 (asked directly, answered directly): do not delete the curated tier yet.** Doing so now would leave zero working LICENSE-generation path, since the OSI tier isn't implemented. Once §4's now-confirmed HTML extraction is built and verified — including a check against the curated tier's own output once the known double-`"Copyright (C)"` GPLv3 bug is fixed (see the project's To-Do list in `CLAUDE.md`) — retire the curated tier in favor of the OSI tier for **every** id, curated or not. Keeping both permanently, once both work, would recreate exactly the "two competing implementations of one operation" problem this codebase has already resolved elsewhere (the git sync/push/commit consolidations) — the curated tier's only justification is "it's the only thing that currently works," which stops being true once the OSI tier is built.

### 1.3 Text Resolution — Verbatim-Only, Never Paraphrased

Carrying forward the principle already established for GPLv3 sourcing ("not a copyright concern, an accuracy one"): this service **never** generates license body text via `llmService`. Resolution order per OSI-tier id:

1. **Curated template exists for this id?** → use it (§1.2), done.
2. **Cached verbatim text available** (previously fetched and stored in `config/licenseRegistry.json`, §2.2)? → use it.
3. **Fetch `_links.html.href`** (OSI's own page — preferred over `license_steward_url` because it's one consistent template across every entry, not N arbitrary third-party formats) and run it through a narrow HTML-extraction step (§4) to isolate the license body. Cache the result on success.
4. **Fetch `license_steward_url` if it looks like plain text** (heuristic: URL path ends in `.txt`, or `Content-Type: text/plain` on response) — same caching.
5. **No reliable text source** (extraction failed, steward URL empty or non-text, network unavailable) → **do not fabricate text.** Generate a LICENSE file containing the license name, SPDX id (if any), and a link to `_links.html.href`/`license_steward_url`, clearly stating this is a reference, not the verbatim text, and log a warning that automated generation wasn't possible for this id.

### 1.4 `package.json` Sync

- Non-empty `spdx_id` on the selected entry → write it verbatim to `package.json`'s `license` field.
- Empty `spdx_id` → write `"SEE LICENSE IN LICENSE"` (npm's own documented convention for a non-SPDX license), and keep the actual chosen OSI `id`/`name` recorded separately (§1.7) so the choice itself isn't lost even though `package.json` can't express it precisely.
- Applies identically whether the target is the root project or a layer — always operates against whichever `package.json` sits next to the `LICENSE` file being written (§1.6).
- **Delete** resets `license` to `"UNLICENSED"` (matching the already-established proprietary-license convention from the curated registry spec) rather than leaving a stale value.

### 1.5 Selection Filtering

- `listLicenses()` (browsing) returns the full catalog, `approved` and unapproved alike, each row showing its `approved` state and `keywords` — this is the "complete reference" the original request asked for.
- `createLicense()`'s **interactive picker** defaults to `approved: true` entries only. Unapproved/proposal-stage entries remain selectable via an explicit `--include-unapproved` flag or an "show all" toggle in the interactive menu, never by default — picking a project's real license shouldn't default to showing rejected submissions alongside recognized ones.

### 1.6 Root vs. Layer — Path-Agnostic by Design

Every method below takes an explicit `targetPath` (the directory containing the `LICENSE`/`package.json` pair to act on) rather than assuming `targetRoot`. This means the service itself needs no knowledge of whether that path is the monorepo root, a submodule layer, or a layer still being developed in-place — that distinction belongs to whichever command calls this service (`settings.templates`, and eventually whatever layer-scoped command emerges from the still-open "develop layers within the app" workflow question). Not a new decision — confirmed as a non-issue during design discussion, recorded here so it isn't re-litigated later.

### 1.7 Dependency on the Not-Yet-Built Settings Persistence Layer

Same gap already flagged in `spec-settings-domain-commands-v01.md`: a durable `license.defaultType`-style setting (§3 of `spec-templates-license-v01.md`) needs the tiered `settings.json` persistence layer from the `app-config` domain spec, which doesn't exist in the real codebase yet (confirmed by reading the actual `configService.ts` — it only holds `cwd`/`gitUser`/`flags` in memory, no disk persistence at all). **Interim behavior, until that layer is built:** `licenseService` accepts an explicit `id` per call and does not attempt to read or write a persisted default — every `createLicense`/`changeLicense` call must be told which license to use, by flag or interactive prompt, every time. Wire up the persisted default once `configService`'s settings layer actually exists; don't build a parallel, one-off persistence mechanism just for this.

---

## 2. Data Model

### 2.1 Raw OSI Entry (mapped 1:1 from §1.1)

```ts
export interface OsiLicenseEntry {
	id: string;
	name: string;
	spdxId: string;            // mapped from spdx_id; may be ''
	version: string;
	approved: boolean;
	approvalDate: string;      // YYYYMMDD
	licenseStewardUrl: string; // may be ''
	stewards: string[];
	keywords: string[];
	htmlUrl: string;           // from _links.html.href
}
```

### 2.2 Cached Registry Entry (what actually lives in `config/licenseRegistry.json`)

Same `metadataEntity` envelope already used by `llmRegistry.json`/`repositoryRegistry.json`, per the established pattern:

```json
{
	"metadataEntity": {
		"description": "OSI license catalog cache",
		"targetFile": "~/config/licenseRegistry.json",
		"currentVersion": "1.0.0",
		"createdAt": "...",
		"lastSyncedAt": "...",
		"revisionHistory": [ ... ]
	},
	"entries": {
		"curl": {
			"id": "curl",
			"name": "curl License",
			"spdxId": "curl",
			"approved": true,
			"keywords": ["legacy"],
			"htmlUrl": "https://opensource.org/license/curl",
			"stewardUrl": "https://curl.se/docs/copyright.html",
			"textSource": "link-only",
			"cachedText": null,
			"cachedAt": null
		}
	}
}
```

`textSource` is one of `'curated' | 'osi-html' | 'osi-steward-text' | 'link-only'` — records *how* §1.3's resolution actually succeeded (or didn't) for this entry, so a repeat `createLicense` call doesn't re-attempt a fetch known to fail, and so `listLicenses()` can show the user which entries support full automated generation versus link-only.

---

## 3. Service Interface

```ts
export interface ILicenseService {
	// Fetches the full OSI catalog and merges it into config/licenseRegistry.json.
	// Does not overwrite cachedText for entries already successfully resolved,
	// unless force is passed (e.g. the steward changed their URL).
	syncCatalog(options?: { force?: boolean }): Promise<{ added: number; updated: number; total: number }>;

	// Reads the local cache only — no network call. Never throws for "not synced yet";
	// returns an empty list and lets the caller decide whether to prompt for a sync.
	listLicenses(options?: { approvedOnly?: boolean; keyword?: string }): Promise<CachedLicenseEntry[]>;

	// Resolution chain from §1.3. Returns the verbatim body text, or null if
	// only a link-only fallback is possible (caller decides how to render that).
	resolveText(id: string): Promise<{ text: string | null; source: TextSource; entry: CachedLicenseEntry }>;

	// Writes LICENSE at targetPath, syncs package.json's `license` field (§1.4).
	// context: { year, author, email } — same shape as the curated templates' LicenseContext.
	createLicense(targetPath: string, id: string, context: LicenseAuthorContext): Promise<void>;

	// Same as createLicense but requires an existing LICENSE to be present
	// (refuses on a genuinely empty target — use createLicense for that case).
	changeLicense(targetPath: string, newId: string, context: LicenseAuthorContext): Promise<void>;

	// Removes LICENSE, resets package.json's license field to 'UNLICENSED'.
	deleteLicense(targetPath: string): Promise<void>;
}
```

### 3.1 `createLicense` / `changeLicense` — Copyright Line Insertion (Resolved 2026-08-24)

**Previously a known simplification (hardcoded exceptions list, no per-license insertion knowledge) — now resolved against a real captured page.** A real fetch of `opensource.org/license/mit` shows OSI's own page structure already answers this, per-license, with no guessing needed:

```html
<div id="separator">
  <p><span ...>Copyright &lt;YEAR&gt; &lt;COPYRIGHT HOLDER&gt;</span></p>
</div>
<div id="LicenseText">
  <p>Permission is hereby granted, free of charge, ...</p>
  <p>The above copyright notice ...</p>
  <p>THE SOFTWARE IS PROVIDED ...</p>
</div>
```

**Rule (replaces the old hardcoded-exceptions-list approach):**
1. If `#separator` is present and non-empty, it contains the exact copyright line template for *this specific license*, with literal `<YEAR>` and `<COPYRIGHT HOLDER>` placeholder tokens — string-replace those two tokens with the resolved `context.year`/`{context.author}, {context.email}` (matching the curated templates' existing formatting convention) and prepend the result above the body.
2. If `#separator` is absent or empty for a given license's page, **do not add a copyright header at all** — this is the license steward's own signal that one doesn't apply (covers public-domain-style dedications correctly, without a hardcoded id list to maintain).
3. The `#LicenseText` div's `<p>` children, HTML-entity-decoded and joined with blank lines, are the verbatim body (§4).

This is a real per-license signal from the canonical source itself, not a heuristic — no more "known simplification" caveat needed once implemented this way, though the extraction code should still fail safe (§1.3 step 5) if either div is missing/malformed rather than guessing.

---

## 4. New Small Capability: HTML Text Extraction (Resolved 2026-08-24)

```ts
// New — a narrow, purpose-built extractor targeting two specific div IDs, not a general HTML-to-text library dependency
function extractLicenseBodyFromOsiPage(html: string): {
	copyrightTemplate: string | null; // raw contents of #separator, with <YEAR>/<COPYRIGHT HOLDER> tokens intact, or null if absent/empty
	body: string | null;              // #LicenseText's <p> children, entity-decoded and joined, or null if missing/empty
};
```

Scoped specifically to `opensource.org/license/<id>` pages' structure (confirmed via a real captured `opensource.org/license/mit` response, 2026-08-24 — this is a WordPress "license" custom-post-type page, per `class="... type-license status-publish ..."` on the `<article>` element, so every license's page shares this same template) — **not** designed to handle arbitrary `license_steward_url` HTML (§1.3 step 4 restricts steward-URL fetching to plain-text-looking responses precisely to avoid needing a general-purpose HTML scraper).

Implementation notes:
- Target `<div id="separator">...</div>` and `<div id="LicenseText">...</div>` specifically — both are stable, purpose-named element IDs, not CSS classes likely to change with theme updates, making them a reasonably durable extraction target.
- HTML entities in `#LicenseText`'s `<p>` content (observed: `&#8220;`/`&#8221;` smart quotes, `&amp;` etc.) must be decoded, not left as literal entity text in the generated LICENSE file.
- A fixture-based test using the real saved HTML sample (captured 2026-08-24, available in this conversation's history — save it as a test fixture rather than re-fetching live in CI) should back this function, not a hand-written approximation of the markup.
- Still worth a spot-check against a second license's page (e.g. one with no `#separator`, such as `unlicense` or a public-domain-style entry) before relying on rule 2 above in production — only MIT's page has been directly observed so far.

---

## 5. Consuming Commands

Updates `spec-settings-domain-commands-v01.md` §2/§5 (edited alongside this document) — `settings.appDefaults`'s License Type action and `settings.templates`'s Create/Delete License actions both call `licenseService` directly rather than the curated `licenseRegistry` alone. No other command in the existing specs needs to change.

---

## 6. Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| LS-01 | `syncCatalog()` on empty cache | All entries added, `cachedText: null`/`textSource: 'link-only'` until first resolution attempt |
| LS-02 | `resolveText('mit')` | Returns curated template output, no network call made |
| LS-03 | `resolveText()` for an OSI-only id, HTML extraction succeeds | `textSource: 'osi-html'`, cached for next call |
| LS-04 | `resolveText()` for an id with empty `stewardUrl` and failed HTML extraction | `text: null`, `source: 'link-only'` — no fabricated content |
| LS-05 | `createLicense()` for an entry with empty `spdxId` | `package.json`'s `license` set to `"SEE LICENSE IN LICENSE"`, not an empty string |
| LS-06 | `createLicense()` for an entry with a real `spdxId` | `package.json`'s `license` set to that exact SPDX id |
| LS-07 | `deleteLicense()` | `LICENSE` removed, `license` reset to `"UNLICENSED"` |
| LS-08 | `listLicenses({ approvedOnly: true })` | Only `approved: true` entries returned |
| LS-09 | `listLicenses()` (no filter) | Full catalog, approved and unapproved, matching the original "complete reference" request |
| LS-10 | Second `createLicense()` call for the same OSI id after a successful resolution | Uses `cachedText`, no repeat network fetch |
| LS-11 | `changeLicense()` called against a target with no existing `LICENSE` | Refused, points at `createLicense` instead |
| LS-12 | `extractLicenseBodyFromOsiPage()` against the real captured MIT fixture | Returns the correct `copyrightTemplate` (with `<YEAR>`/`<COPYRIGHT HOLDER>` tokens intact) and `body` (entity-decoded, `#LicenseText`'s three paragraphs joined) |
| LS-13 | `createLicense()` for an OSI-tier id whose page has no `#separator` | No copyright header prepended — verifies §3.1 rule 2 (no hardcoded exceptions list needed) |

---

## Final Architectural Notes

- **Update, 2026-08-24:** both items previously flagged as unresolved are now closed. §4's HTML selector logic is confirmed against a real captured `opensource.org/license/mit` page (§3.1/§4 above) — no longer a guess. §1.1's pagination question remains the one genuinely open item, still to verify against a real full-catalog fetch at implementation time.
- §1.7 is a repeat of a gap already flagged for the Settings domain — recorded again here because `licenseService` is a second, independent consumer of the same not-yet-built settings-persistence layer. Worth prioritizing that layer once two real features are blocked on it rather than one.
- §1.2/§3.1's curated-tier-retirement plan is new since the previous revision: the curated 8 templates were reframed from "the recommended default, permanently" to "the only thing that currently works, temporarily" — see `CLAUDE.md`'s To-Do list for the explicit decision not to delete them yet.
