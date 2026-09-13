# Licence Engine — Functional Specification

**Component:** AppManager Licence Engine  
**Specification Type:** Functional / Implementation Contract  
**Documentation Path:** `docs/specification/architecture/license-engine/spec-license-engine-functional-v02.md`  
**Runtime Code:** `app/license-engine/**`  
**Catalogue:** `app_manager/licenses-engine/opensource-license-index.json`  
**Templates:** `app_manager/templates/licenses/*.json`  
**Version:** 2.0.0

---

# 1. Purpose

This specification defines the functional behaviour required from the AppManager Licence Engine.

The Licence Engine shall provide:

- Open Source licence catalogue population;
- local catalogue persistence;
- individual licence template population;
- licence-template discovery;
- source/provenance management;
- integrity validation;
- update checking;
- controlled template updates;
- licence selection support;
- Template Engine publication integration;
- offline licence generation.

---

# 2. Primary Public Interface

Recommended application-facing contract:

```ts
export interface ILicenseEngine {
  initialize(): Promise<void>;

  populateIndex(
    options?: PopulateLicenseIndexOptions,
  ): Promise<LicenseIndexSyncResult>;

  populateLicense(
    licenseId: string,
    options?: PopulateLicenseOptions,
  ): Promise<LicensePopulationResult>;

  populateAll(
    options?: PopulateLicenseOptions,
  ): Promise<LicensePopulationBatchResult>;

  checkForUpdates(
    options?: LicenseUpdateCheckOptions,
  ): Promise<LicenseUpdateReport>;

  checkLicenseForUpdates(
    licenseId: string,
  ): Promise<LicenseUpdateResult>;

  updateLicense(
    licenseId: string,
    options?: LicenseUpdateOptions,
  ): Promise<LicenseUpdateResult>;

  list(
    filter?: LicenseQuery,
  ): Promise<LicenseDescriptor[]>;

  get(
    licenseId: string,
  ): Promise<LicenseDescriptor | undefined>;

  require(
    licenseId: string,
  ): Promise<LicenseDescriptor>;

  generate(
    licenseId: string,
    context: LicenseRenderContext,
  ): Promise<GeneratedArtifact>;
}
```

Exact class organization may differ, but all capabilities are required.

---

# 3. Initialization

`initialize()` shall:

1. locate `app_manager/licenses-engine/`;
2. locate `opensource-license-index.json`;
3. validate the index if it exists;
4. discover `app_manager/templates/licenses/*.json`;
5. validate discovered licence template metadata;
6. associate local templates with index entries;
7. build an in-memory catalogue;
8. expose catalogue state to consumers.

Initialization must not require network access.

---

# 4. Missing Index Behaviour

If:

```text
opensource-license-index.json
```

does not exist, the Licence Engine shall remain operational in a limited state.

Locally discovered licence templates may still be used.

Operations requiring the remote catalogue shall report:

```text
LICENSE_INDEX_NOT_POPULATED
```

and may instruct the caller to invoke population.

---

# 5. Index Population

`populateIndex()` shall:

1. call the configured Open Source Initiative catalogue source;
2. validate the remote response;
3. normalize catalogue metadata;
4. preserve source identifiers;
5. merge local template availability state;
6. preserve local synchronization history where appropriate;
7. write the resulting index atomically;
8. set `lastPopulatedAt`;
9. set `lastCheckedAt`.

---

# 6. Index Population Must Not Populate Templates Implicitly

Populating:

```text
opensource-license-index.json
```

and populating:

```text
templates/licenses/*.json
```

are logically distinct operations.

This permits:

```text
catalogue of 100+ known licences

but

10 locally populated licence templates
```

---

# 7. Individual Licence Population

`populateLicense(licenseId)` shall:

1. locate the licence in the local index;
2. resolve its authoritative source;
3. retrieve full source data;
4. validate source response;
5. obtain canonical legal text;
6. identify permitted interpolation positions;
7. construct a Template Engine definition;
8. validate the definition;
9. calculate integrity hashes;
10. render a test fixture;
11. persist the template atomically;
12. update index availability/provenance;
13. return a structured result.

---

# 8. Unknown Licence Population

If a requested licence does not exist in the index:

```text
LICENSE_NOT_FOUND
```

shall be returned.

The error should identify the requested ID and suggest listing known licences.

---

# 9. Licence Source Resolution

Recommended resolution order:

```text
explicit canonical steward source
        ↓
OSI canonical/hosted text
        ↓
verified curated source
        ↓
unavailable
```

The exact source used must be persisted.

---

# 10. Authoritative Source Requirement

A source is acceptable only when it is classified by Licence Engine policy as sufficiently authoritative.

General web search results are not an authoritative source.

LLM output is never an authoritative source.

---

# 11. Licence Template Construction

The output of population shall conform to the Template Engine definition schema.

Minimum required fields include:

```text
schemaVersion
templateId
templateName
templateVersion
templateKind
category
templatePublishName
format
variables
content or parts
license
```

---

# 12. Template ID Convention

Licence template IDs shall use:

```text
license.<canonical-id>
```

Examples:

```text
license.mit
license.apache-2-0
license.gpl-3-0
license.bsd-3-clause
```

---

# 13. File Naming Convention

Template filenames shall use:

```text
<canonical-id>-license.json
```

Examples:

```text
mit-license.json
apache-2-0-license.json
gpl-3-0-license.json
```

The index shall map the licence ID to this template.

---

# 14. Template Publish Name

Default:

```json
{
  "templatePublishName": "LICENSE"
}
```

---

# 15. Licence Domain Extension

Every licence template must contain:

```json
{
  "license": {
    "licenseId": "...",
    "spdxId": "...",
    "approved": true,
    "sourceType": "...",
    "source": {},
    "provenance": {}
  }
}
```

---

# 16. Recommended Full Licence Template Shape

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "license.mit",
  "templateName": "MIT License",

  "templateVersion": "1.0.0",
  "templateKind": "file",

  "category": "license",

  "templatePublishName": "LICENSE",

  "format": "text",
  "encoding": "utf-8",

  "variables": {
    "year": {
      "type": "number",
      "required": true
    },

    "author": {
      "type": "string",
      "required": true
    }
  },

  "license": {
    "licenseId": "mit",
    "spdxId": "MIT",
    "approved": true,

    "sourceType": "osi-api",

    "source": {
      "authority": "Open Source Initiative",
      "catalogueUrl": "https://opensource.org/license/mit",
      "canonicalTextUrl": null
    },

    "provenance": {
      "retrievedAt": "2026-08-29T00:00:00Z",
      "checkedAt": "2026-08-29T00:00:00Z",
      "sourceHash": "sha256:...",
      "contentHash": "sha256:..."
    }
  },

  "content": "Copyright {{year}} {{author}}\n\n..."
}
```

---

# 17. Variable Rules

Only variables actually permitted by the licence publication convention may be exposed.

Common examples:

```text
year
author
email
organization
```

Not every licence uses every field.

---

# 18. No Universal Copyright Pattern

The engine shall not assume:

```text
Copyright {{year}} {{author}}
```

for every licence.

Copyright syntax belongs to each licence definition.

---

# 19. Canonical Text Preservation

During population, the Licence Engine must distinguish:

```text
legal text

from

project-specific insertion instructions
```

Only the latter may be replaced with Template Engine variables.

---

# 20. Source Hash

The source hash shall be computed over the canonical source representation used for comparison.

Recommended algorithm:

```text
SHA-256
```

---

# 21. Content Hash

The content hash shall be computed over the locally stored canonical template body after controlled placeholder conversion.

This enables detection of local corruption or manual modification.

---

# 22. Local Modification Detection

If the calculated local content hash differs from the stored content hash:

```text
LICENSE_TEMPLATE_MODIFIED
```

shall be reported.

The update process must not blindly overwrite the modification unless explicitly instructed.

---

# 23. Update Check — Index

`checkForUpdates()` shall first determine whether the remote catalogue changed.

It shall update:

```text
repository.lastCheckedAt
```

even when no changes are found.

---

# 24. Update Check — Individual Licence

For each locally populated licence:

1. determine current source;
2. retrieve current source metadata/content as necessary;
3. calculate current source hash;
4. compare with stored `sourceHash`;
5. classify result.

---

# 25. Update Classification

```ts
type LicenseUpdateState =
  | 'current'
  | 'metadata-changed'
  | 'content-changed'
  | 'local-modified'
  | 'source-unavailable'
  | 'template-invalid'
  | 'template-missing'
  | 'requires-review';
```

---

# 26. Unchanged Licence

When unchanged:

- do not rewrite the template;
- update `checkedAt`;
- update index synchronization metadata;
- return `current`.

---

# 27. Metadata-Only Change

Examples:

- source URL changed;
- display name changed;
- keywords changed.

If legal text is unchanged, metadata may be updated automatically according to policy.

---

# 28. Legal Content Change

If legal text changes:

1. retain the current template until replacement validates;
2. retrieve the full new authoritative text;
3. compare differences;
4. verify source;
5. generate replacement definition;
6. validate replacement;
7. test-render replacement;
8. calculate hashes;
9. classify as `requires-review` or apply according to explicit update policy.

---

# 29. Default Update Policy

Recommended default:

```text
catalogue metadata:
    automatic

licence metadata:
    automatic when content unchanged

legal text:
    explicit controlled update
```

---

# 30. Update Application

`updateLicense()` shall only replace the active definition after the new definition passes all validation.

---

# 31. Atomic Write

Required write sequence:

```text
build replacement
    ↓
validate
    ↓
hash
    ↓
test render
    ↓
write temporary
    ↓
replace active file
    ↓
update index
```

---

# 32. Rollback

If any operation before final replacement fails, the current valid licence definition remains untouched.

---

# 33. Batch Population

`populateAll()` shall support populating multiple catalogue licences.

A failure for one licence must not corrupt successful licences.

Recommended result:

```ts
interface LicensePopulationBatchResult {
  succeeded: LicensePopulationResult[];
  failed: LicensePopulationFailure[];
}
```

---

# 34. Batch Update Checking

Update checking should report all results rather than stopping at the first failure.

---

# 35. Catalogue Query

Recommended filter:

```ts
interface LicenseQuery {
  approved?: boolean;
  populated?: boolean;
  spdxId?: string;
  search?: string;
  sourceType?: string;
}
```

---

# 36. Licence Descriptor

```ts
interface LicenseDescriptor {
  id: string;
  name: string;
  spdxId?: string;

  approved?: boolean;

  populated: boolean;
  templateId?: string;
  templatePath?: string;

  sourceType?: LicenseSourceType;

  lastFetchedAt?: string | null;
  lastCheckedAt?: string | null;
}
```

---

# 37. Publication

`generate()` shall:

1. resolve licence descriptor;
2. verify local template exists;
3. verify template remains valid;
4. determine Template Engine `templateId`;
5. validate provided render values;
6. call Template Engine;
7. require exactly one generated licence artifact;
8. return that artifact.

---

# 38. Publication Does Not Check the Network

`generate()` shall never automatically:

- refresh the index;
- fetch licence content;
- check for updates.

Those are explicit Licence Engine lifecycle operations.

---

# 39. Render Context

Example:

```ts
interface LicenseRenderContext {
  year?: number;
  author?: string;
  email?: string;
  organization?: string;
}
```

Actual required values are determined from the selected template definition.

---

# 40. Settings Integration

Recommended setting:

```text
license.defaultType
```

Its value should use the licence catalogue ID:

```text
mit
apache-2-0
gpl-3-0
```

rather than a filename.

---

# 41. Resolution

Recommended application flow:

```text
Command
    ↓
SettingsResolver / LicenseResolver
    ↓
licence ID
    ↓
LicenseEngine.require()
    ↓
resolve required author/context values
    ↓
LicenseEngine.generate()
```

---

# 42. Interactive Selection

Interactive licence selection should be generated dynamically from the local licence catalogue.

It should be possible to display:

```text
MIT License
Apache License 2.0
GNU General Public License v3.0
...
```

Availability may also be indicated:

```text
available locally
catalogued but not populated
```

---

# 43. Headless Mode

If no licence can be resolved in headless mode, fail immediately with an actionable error.

No prompt may occur.

---

# 44. Template Missing

If the selected licence exists in the catalogue but has not been populated:

```text
LICENSE_TEMPLATE_NOT_POPULATED
```

Example remediation:

```text
Populate licence template 'mit' before generation.
```

Whether a command may auto-populate it must be an explicit workflow decision, not implicit generation behaviour.

---

# 45. Invalid Template

An invalid local licence template must not be published.

Return:

```text
LICENSE_TEMPLATE_INVALID
```

---

# 46. Pending / Incomplete Licence

A definition marked:

```text
status = pending-source
```

or:

```text
status = incomplete
```

shall not be available for publication.

This explicitly prevents recurrence of the truncated GPLv3 defect.

---

# 47. Source Failure

When an update source cannot be reached:

```text
LICENSE_SOURCE_UNAVAILABLE
```

Existing valid local definitions remain usable.

---

# 48. Index Validation

`opensource-license-index.json` shall be validated at runtime.

Minimum required repository fields:

```text
schemaVersion
repository.id
repository.sourceType
repository.catalogueEndpoint
licenses
```

---

# 49. Index Entry Validation

Minimum entry fields:

```text
id
name
template
synchronization
```

`spdxId` and `approved` may be optional for non-OSI/custom entries.

---

# 50. Template Engine Validation

All local licence templates shall first pass the ordinary Template Engine definition validator.

The Licence Engine then performs additional licence-domain validation.

---

# 51. Licence-Domain Validation

Required checks include:

- `category === "license"`;
- `templateKind === "file"`;
- licence metadata present;
- licence ID consistent with catalogue;
- SPDX ID consistent where known;
- provenance valid;
- source hashes well formed;
- content non-empty;
- no unresolved illegal placeholders;
- publication filename valid.

---

# 52. Index-to-Template Consistency

The following must agree:

```text
index licence ID
template license.licenseId
template templateId mapping
SPDX ID
template path
```

Mismatch shall be reported as:

```text
LICENSE_REPOSITORY_INCONSISTENT
```

---

# 53. Template Discovery

Licence template files are discovered recursively under:

```text
app_manager/templates/licenses/**/*.json
```

The Licence Engine need not manually register each path in source code.

---

# 54. Template Engine Repository Interaction

Because licence definitions live inside the Template Engine repository, the general Template Repository will also discover them.

This is intentional.

The general Template Repository knows:

```text
this is a valid template
```

The Licence Engine additionally knows:

```text
this is an authoritative licence template with provenance and lifecycle metadata
```

---

# 55. Deletion

If a populated licence template is deleted manually:

```text
index entry remains known
template.available = false
```

after repository synchronization.

The catalogue entry should not be deleted merely because the local template is absent.

---

# 56. Removing a Licence from the Remote Catalogue

If a remote licence disappears from the catalogue:

- retain the existing local licence entry;
- mark remote status appropriately;
- do not silently delete the local template;
- report the condition for review.

---

# 57. Deprecation

If a licence becomes deprecated:

```text
deprecated = true
```

shall be reflected in metadata.

Existing projects may still require that licence for reproducibility.

Therefore deprecation does not imply automatic deletion.

---

# 58. Reproducibility

Existing licence templates should retain:

```text
templateVersion
retrievedAt
sourceHash
contentHash
```

so generation history can be traced.

---

# 59. Template Version Increment

A licence template's `templateVersion` shall increment when the local renderable definition changes.

Examples:

```text
1.0.0 → 1.0.1
metadata correction only

1.0.0 → 1.1.0
compatible publication metadata improvement

1.x → 2.0.0
incompatible definition/schema behaviour
```

Canonical legal-text source changes should always be explicitly recorded in provenance.

---

# 60. Repository Schema Versioning

The index contains its own:

```text
schemaVersion
```

independent of:

```text
Template Engine schemaVersion
```

and:

```text
individual templateVersion
```

These three concepts must not be conflated.

---

# 61. Error Codes

Recommended domain errors:

```text
LICENSE_INDEX_NOT_POPULATED
LICENSE_INDEX_INVALID
LICENSE_NOT_FOUND
LICENSE_TEMPLATE_NOT_POPULATED
LICENSE_TEMPLATE_INVALID
LICENSE_TEMPLATE_MODIFIED
LICENSE_TEMPLATE_INCOMPLETE
LICENSE_SOURCE_UNAVAILABLE
LICENSE_SOURCE_INVALID
LICENSE_SOURCE_MISMATCH
LICENSE_CONTENT_CHANGED
LICENSE_UPDATE_REQUIRES_REVIEW
LICENSE_REPOSITORY_INCONSISTENT
LICENSE_RENDER_FAILED
```

---

# 62. Typed Error

```ts
export class LicenseEngineError extends Error {
  constructor(
    public readonly code: LicenseEngineErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}
```

---

# 63. Test Requirements — Index

| ID | Scenario | Expected |
|---|---|---|
| LI-01 | Valid local index | Loads successfully |
| LI-02 | Missing index | Limited offline mode |
| LI-03 | Invalid schema | Structured error |
| LI-04 | Remote catalogue population | Index created |
| LI-05 | Existing index refresh | Metadata merged |
| LI-06 | Remote unavailable | Existing index retained |

---

# 64. Test Requirements — Population

| ID | Scenario | Expected |
|---|---|---|
| LP-01 | Populate MIT | Valid `mit-license.json` |
| LP-02 | Unknown licence | Not-found error |
| LP-03 | Missing canonical text | Population fails |
| LP-04 | Invalid remote text | Existing template preserved |
| LP-05 | Valid population | Index marks template available |
| LP-06 | Batch partial failure | Successful templates preserved |

---

# 65. Test Requirements — Integrity

| ID | Scenario | Expected |
|---|---|---|
| LG-01 | Hashes match | Valid |
| LG-02 | Local text modified | Modification detected |
| LG-03 | Stored hash malformed | Validation failure |
| LG-04 | Truncated known licence | Invalid/incomplete |
| LG-05 | Metadata/template mismatch | Repository inconsistency |

---

# 66. Test Requirements — Updates

| ID | Scenario | Expected |
|---|---|---|
| LU-01 | No remote change | `current` |
| LU-02 | Metadata only | Metadata updated |
| LU-03 | Legal body changed | Review required |
| LU-04 | Source unavailable | Local template retained |
| LU-05 | Local modification + upstream update | No blind overwrite |
| LU-06 | Successful controlled update | Atomic replacement |

---

# 67. Test Requirements — Publication

| ID | Scenario | Expected |
|---|---|---|
| LPR-01 | MIT + valid context | `LICENSE` artifact |
| LPR-02 | Missing required author | Context error |
| LPR-03 | Licence not populated | Population error |
| LPR-04 | Invalid local template | Publication rejected |
| LPR-05 | Offline system | Generation succeeds |
| LPR-06 | Same template/context | Byte-identical output |

---

# 68. Test Requirements — Template Engine Integration

Verify that licence definitions support:

- variable interpolation;
- static legal body preservation;
- correct output filename;
- deterministic rendering;
- ordinary Template Repository discovery.

---

# 69. Migration Requirements

Migration shall:

1. preserve current usable MIT data;
2. replace incomplete GPLv3 with canonical complete text before enabling it;
3. split aggregate entries into individual template files;
4. populate the new OSI index;
5. remove obsolete TypeScript licence-template functions;
6. stop using the old monolithic licence-template store;
7. update commands to use Licence Engine + Template Engine;
8. preserve prior specification files as historical records.

---

# 70. Acceptance Criteria

The Licence Engine Version 2 architecture is complete when:

1. `opensource-license-index.json` exists and validates;
2. licence catalogue population works;
3. individual licence definitions reside under `app_manager/templates/licenses/`;
4. all licence definitions conform to Template Engine schema;
5. licence-domain metadata/provenance validates;
6. individual population works;
7. batch population works;
8. update checking works independently of publication;
9. remote failure does not prevent existing licence generation;
10. integrity hashes are maintained;
11. incomplete licence text cannot be published;
12. Template Engine renders licence definitions;
13. generation performs no network access;
14. `LICENSE` is returned as a `GeneratedArtifact`;
15. the legacy TypeScript licence-template registry is no longer required.

---

# 71. Canonical Functional Flow — Population

```text
OSI catalogue
    ↓
LicenseSourceClient
    ↓
LicensePopulationService
    ↓
source validation
    ↓
canonical legal text
    ↓
controlled placeholder conversion
    ↓
TemplateDefinition
    ↓
Template Engine schema validation
    ↓
Licence-domain validation
    ↓
hashing
    ↓
atomic persistence
    ↓
app_manager/templates/licenses/*.json
```

---

# 72. Canonical Functional Flow — Update Check

```text
local licence
    +
remote authoritative source
          ↓
        compare
          ↓
 ┌────────┼─────────────┐
 │        │             │
same   metadata       legal
       changed        changed
 │        │             │
touch   update       validate /
date    metadata      review
```

---

# 73. Canonical Functional Flow — Publication

```text
resolved licence ID
        ↓
LicenceEngine.require()
        ↓
local licence template
        ↓
resolved render context
        ↓
TemplateEngine.render()
        ↓
GeneratedArtifact
        ↓
FileService
        ↓
LICENSE
```

No network operation occurs in this flow.

---

# 74. Final Functional Guarantee

> **Licence acquisition and maintenance are explicit lifecycle operations. Licence publication is a deterministic local rendering operation.**

This separation is mandatory.

A user must be able to generate a previously populated licence while completely offline, while retaining a separate facility for checking whether the authoritative licence catalogue or canonical text has changed.