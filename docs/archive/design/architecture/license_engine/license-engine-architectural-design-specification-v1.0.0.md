# Licence Engine — Architectural Design Specification

**Component:** AppManager Licence Engine  
**Specification Type:** Architectural / Design Specification  
**Documentation Path:** `docs/specification/architecture/license-engine/spec-license-engine-design-v02.md`  
**Runtime Code:** `app/license-engine/**`  
**Licence Index:** `app_manager/licenses-engine/opensource-license-index.json`  
**Licence Templates:** `app_manager/templates/licenses/*.json`  
**Project:** `app-manager`  
**Language:** TypeScript / JSON  
**Status:** Proposed Architecture — Version 2

---

# 1. Executive Summary

The AppManager Licence Engine is a specialised application subsystem responsible for acquiring, cataloguing, validating, maintaining, selecting and publishing software licence templates.

The Licence Engine shall obtain authoritative licence information from recognised licence sources, initially centred on the Open Source Initiative licence API, and shall maintain a local catalogue at:

```text
app_manager/licenses-engine/opensource-license-index.json
```

Individual licence templates shall be stored as independent Template Engine definitions under:

```text
app_manager/templates/licenses/
```

using descriptive filenames such as:

```text
mit-license.json
apache-2-0-license.json
gpl-3-0-license.json
bsd-3-clause-license.json
mpl-2-0-license.json
```

The Licence Engine is responsible for the **lifecycle** of these templates.

The Template Engine is responsible for their **rendering**.

The central architectural distinction is:

> **The Licence Engine determines what authoritative licence data should exist locally and whether it remains current. The Template Engine interprets that stored licence definition and generates the final `LICENSE` artifact.**

Generation must not require a network request.

Licence retrieval and licence publication are separate operations.

---

# 2. Core Architectural Principles

The Licence Engine shall observe the following principles.

## 2.1 Verbatim Legal Text

Canonical licence text must be obtained from an authoritative source and stored verbatim.

The Licence Engine must never:

- invent licence clauses;
- paraphrase legal text;
- reconstruct missing licence text using an LLM;
- summarise licence text for publication;
- silently alter authoritative licence wording.

Template interpolation shall be limited to locations where the licence permits or requires project-specific information.

Typical examples include:

- copyright year;
- copyright holder;
- contact information.

---

## 2.2 Offline Publication

Once populated locally, licence generation shall operate without network access.

```text
Network
   │
   └── population / update checks only

Local licence template
   │
   └── normal LICENSE generation
```

This makes publication:

- deterministic;
- fast;
- reproducible;
- independent of third-party availability.

---

## 2.3 Separation of Acquisition and Rendering

```text
Licence Engine
    → acquire
    → validate
    → compare
    → update
    → catalogue
    → resolve licence metadata

Template Engine
    → validate template definition
    → interpolate approved values
    → render LICENSE
```

The Template Engine shall not know how a licence was acquired.

The Licence Engine shall not implement its own general-purpose interpolation engine.

---

# 3. Architectural Placement

Executable source code shall reside under:

```text
app/license-engine/
```

Persistent licence-engine data shall reside under:

```text
app_manager/licenses-engine/
```

Licence templates themselves shall reside under the common Template Engine repository:

```text
app_manager/templates/licenses/
```

This produces the distinction:

```text
app/
    executable application logic

app_manager/licenses-engine/
    licence catalogue and lifecycle metadata

app_manager/templates/licenses/
    executable-by-Template-Engine licence definitions
```

---

# 4. Proposed Directory Structure

```text
app/
└── license-engine/
    ├── licenseEngine.ts
    │
    ├── repository/
    │   ├── licenseRepository.ts
    │   └── licenseTemplateLocator.ts
    │
    ├── sources/
    │   ├── licenseSourceClient.ts
    │   ├── openSourceInitiativeClient.ts
    │   └── licenseSourceResolver.ts
    │
    ├── update/
    │   ├── licensePopulationService.ts
    │   ├── licenseUpdateService.ts
    │   └── licenseComparisonService.ts
    │
    ├── integrity/
    │   ├── licenseIntegrityService.ts
    │   └── licenseHashService.ts
    │
    ├── publishing/
    │   └── licensePublisher.ts
    │
    ├── validation/
    │   ├── licenseIndexSchema.ts
    │   └── licenseTemplateExtensionSchema.ts
    │
    ├── types/
    │   └── licenseEngineTypes.ts
    │
    └── index.ts
```

The physical decomposition may initially be smaller.

The important requirement is preservation of these responsibility boundaries.

---

# 5. Persistent Data Structure

```text
app_manager/
├── licenses-engine/
│   └── opensource-license-index.json
│
└── templates/
    └── licenses/
        ├── mit-license.json
        ├── apache-2-0-license.json
        ├── gpl-3-0-license.json
        ├── bsd-3-clause-license.json
        ├── isc-license.json
        ├── mpl-2-0-license.json
        └── ...
```

---

# 6. Open Source Licence Index

The file:

```text
app_manager/licenses-engine/opensource-license-index.json
```

is the local catalogue of licences known to the Licence Engine from the Open Source Initiative source.

It is not itself a template.

Its responsibilities are:

- catalogue licence identities;
- retain source metadata;
- identify approved licences;
- record source URLs;
- associate licences with local template IDs;
- record catalogue synchronization state;
- identify whether a local licence template exists;
- support update checks;
- support interactive licence selection.

---

# 7. Index Source

The initial catalogue source is the Open Source Initiative licence API associated with:

```text
https://opensource.org/api/license
```

The exact transport/API implementation belongs to the source-client layer and may evolve without changing the rest of the Licence Engine.

The index file therefore stores source information declaratively rather than embedding API-specific assumptions throughout application code.

---

# 8. Index Structure

Recommended structure:

```json
{
  "schemaVersion": "1.0.0",

  "repository": {
    "id": "opensource-licenses",
    "name": "Open Source Licence Catalogue",
    "source": "Open Source Initiative",
    "sourceType": "osi-api",
    "catalogueEndpoint": "https://opensource.org/api/license",
    "lastPopulatedAt": null,
    "lastCheckedAt": null
  },

  "licenses": {
    "mit": {
      "id": "mit",
      "name": "MIT License",
      "spdxId": "MIT",
      "approved": true,

      "source": {
        "catalogueUrl": "https://opensource.org/license/mit",
        "canonicalTextUrl": null
      },

      "template": {
        "templateId": "license.mit",
        "file": "../templates/licenses/mit-license.json",
        "available": false
      },

      "synchronization": {
        "lastFetchedAt": null,
        "lastCheckedAt": null,
        "sourceHash": null
      }
    }
  }
}
```

---

# 9. Index Versus Template

The index describes licences.

The individual template contains the data necessary to publish the licence.

Therefore:

```text
opensource-license-index.json
    → catalogue / discovery / lifecycle

mit-license.json
    → actual renderable licence definition
```

Neither file should duplicate unnecessary information.

Some duplication such as `id`, `name` and `spdxId` is acceptable when it permits the template to remain self-describing and independently validatable.

---

# 10. Licence Template Naming Convention

Licence template files shall use:

```text
<descriptive-license-name>-license.json
```

Examples:

```text
mit-license.json
apache-2-0-license.json
gpl-3-0-license.json
bsd-3-clause-license.json
mpl-2-0-license.json
```

The filename is descriptive.

The stable semantic identity is the Template Engine field:

```json
{
  "templateId": "license.mit"
}
```

---

# 11. Licence Templates Are Template Engine Definitions

A licence template must conform to the Template Engine schema.

Example:

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

    "source": {
      "authority": "Open Source Initiative",
      "catalogueUrl": "https://opensource.org/license/mit",
      "canonicalTextUrl": null
    },

    "provenance": {
      "retrievedAt": null,
      "checkedAt": null,
      "sourceHash": null,
      "contentHash": null
    }
  },

  "content": "Copyright {{year}} {{author}}\n\n..."
}
```

---

# 12. Licence-Specific Template Metadata

The general Template Engine shall remain licence-domain agnostic.

Licence definitions may therefore contain an optional domain extension:

```json
{
  "license": {}
}
```

The Template Engine ignores unknown validated domain metadata during rendering.

The Licence Engine validates and interprets this section.

This avoids contaminating generic Template Engine code with licence semantics.

---

# 13. Licence Template Provenance

Each licence template shall record sufficient provenance to establish where its legal text originated.

Recommended fields:

```json
{
  "license": {
    "provenance": {
      "sourceAuthority": "Open Source Initiative",
      "sourceUrl": "...",
      "canonicalTextUrl": "...",
      "retrievedAt": "...",
      "checkedAt": "...",
      "sourceHash": "sha256:...",
      "contentHash": "sha256:..."
    }
  }
}
```

---

# 14. Hashing

The Licence Engine shall calculate at least:

```text
sourceHash
contentHash
```

`sourceHash` represents the canonical source material retrieved.

`contentHash` represents the stored legal body after permitted placeholder normalization.

This distinction is useful because the stored template may replace a legally permitted project-specific field with an interpolation placeholder.

---

# 15. Placeholder Normalisation

Licence retrieval may require converting only designated project-specific portions into Template Engine variables.

Example source:

```text
Copyright <year> <copyright holders>
```

Local definition:

```text
Copyright {{year}} {{author}}
```

The Licence Engine must never perform broad or heuristic substitutions across legal prose.

Placeholder conversion must be based on a licence-specific, validated publication rule.

---

# 16. Immutable Legal Body Principle

With the exception of explicitly defined interpolation positions, canonical licence text shall be considered immutable template content.

Changes detected outside authorised interpolation positions must be treated as source updates requiring validation.

---

# 17. Initial Population

The Licence Engine shall support an explicit population operation.

Conceptually:

```text
populate licence catalogue
        │
        ▼
retrieve OSI index
        │
        ▼
store opensource-license-index.json
        │
        ▼
for selected/all licences
        │
        ▼
retrieve authoritative licence data
        │
        ▼
validate
        │
        ▼
construct Template Engine definition
        │
        ▼
write app_manager/templates/licenses/*.json
```

Population is not performed during ordinary licence publication.

---

# 18. One-Time Population Model

The first successful population establishes the local licence repository.

Subsequent operations shall normally use the local files.

A fresh population may be triggered explicitly if:

- the local catalogue is absent;
- the user requests rebuilding;
- schema migration requires regeneration.

---

# 19. Update Checking

The Licence Engine shall provide an explicit update-check function.

Update checking shall:

1. retrieve current source catalogue metadata;
2. compare the remote licence entry with local metadata;
3. retrieve canonical licence content when required;
4. compare hashes;
5. classify the result;
6. update `lastCheckedAt`;
7. report potential changes;
8. apply updates only according to update policy.

---

# 20. Update States

Recommended states:

```text
current
changed
metadata-changed
content-changed
source-unavailable
local-template-missing
local-template-invalid
requires-review
```

---

# 21. No Silent Legal Replacement

A changed licence body should not necessarily be silently overwritten.

The default policy should distinguish:

```text
metadata-only update
    → may be applied automatically

legal text change
    → validate and report
    → controlled replacement
```

This provides defence against:

- upstream corruption;
- unexpected API changes;
- parsing errors;
- source redirection;
- accidental legal-text modification.

---

# 22. Licence Engine and Template Engine Relationship

```text
                     ┌──────────────────────┐
                     │    Licence Engine    │
                     │                      │
                     │ acquire / maintain   │
                     └──────────┬───────────┘
                                │
                                ▼
                app_manager/templates/licenses/
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Template Engine    │
                     │                      │
                     │ validate / render    │
                     └──────────┬───────────┘
                                │
                                ▼
                       GeneratedArtifact
                                │
                                ▼
                           FileService
```

---

# 23. Licence Publisher

`LicensePublisher` is the adapter between the two subsystems.

Responsibilities:

- obtain the selected licence template ID;
- obtain required licence variables;
- provide them to Template Engine;
- verify that generated output is a licence artifact;
- return the generated artifact.

It shall not contain legal text.

---

# 24. Licence Selection

Licence selection is a resolution concern.

Recommended flow:

```text
explicit command option
        ↓
project setting
        ↓
configured default
        ↓
interactive selection
        ↓
unresolved error in headless mode
```

A `LicenseResolver` may be introduced under:

```text
app/resolvers/licenses/
```

or licence-setting resolution may initially use the general Settings Resolver.

---

# 25. Default Licence

The system must not silently assume a licence for a new project unless project policy explicitly defines one.

A licence is a legal/project-governance decision.

Therefore an unset licence should be resolved explicitly or fail in headless operation.

---

# 26. Supported Licence Catalogue

The Licence Engine catalogue may contain substantially more licences than are currently populated locally.

Therefore:

```text
known licence
≠
locally available licence template
```

The index must retain this distinction.

---

# 27. Lazy Population

Although full initial population is supported, the architecture may also permit:

```text
catalogue populated
        +
individual licence template absent
        ↓
explicit request to populate licence
```

This is optional but should remain architecturally possible.

---

# 28. User-Created Licence Templates

Files under:

```text
app_manager/templates/licenses/
```

may also contain non-OSI licences, such as:

- proprietary licence;
- internal corporate licence;
- custom contractual notice.

Such templates must identify their source type appropriately.

For example:

```json
{
  "license": {
    "sourceType": "custom"
  }
}
```

Custom licences must never be represented as OSI-approved unless that fact is independently established.

---

# 29. Source Types

Recommended source types:

```text
osi-api
license-steward
spdx
curated
custom
```

`curated` means manually verified canonical material.

It does not mean generated text.

---

# 30. Source Resolver

The Licence Engine may use a source resolution strategy:

```text
OSI metadata
    ↓
canonical steward text when available
    ↓
OSI-hosted canonical text
    ↓
verified curated fallback
```

The exact precedence may vary by licence.

The chosen source must be recorded in provenance.

---

# 31. Network Boundaries

Only source-client/update/population components may perform external requests.

The following components must be network-independent:

- Template Engine;
- LicensePublisher;
- licence selection;
- normal scaffold generation;
- licence repository reads.

---

# 32. Failure Behaviour

Network failure during update checking must not invalidate an already valid local template.

Example:

```text
remote source unavailable
        ↓
existing local licence remains usable
        ↓
update status = source-unavailable
```

A failure to check for updates is not equivalent to a failure to generate an existing licence.

---

# 33. Atomic Updates

Updating a licence definition shall be atomic.

Preferred sequence:

```text
fetch
validate
render-test
hash
write temporary file
replace existing definition
update index metadata
```

The existing valid template must not be destroyed by a partially failed update.

---

# 34. Template Validation Before Publication

Before a populated or updated licence template becomes active, the Licence Engine must ensure:

1. JSON parses;
2. Template Engine schema validates;
3. licence-domain extension validates;
4. `templateKind === "file"`;
5. `category === "license"`;
6. `templatePublishName === "LICENSE"` unless explicitly configured otherwise;
7. required provenance exists;
8. content is non-empty;
9. stored hashes are valid.

---

# 35. Publication Filename

The canonical default is:

```text
LICENSE
```

Individual workflows may permit alternatives such as:

```text
LICENSE.md
COPYING
```

but the local licence definition should default to `LICENSE`.

---

# 36. Copyright Handling

Copyright rendering differs between licences.

Accordingly, each licence definition shall declare its required variables and content placement.

The Licence Engine must not assume every licence has the same copyright syntax.

Some licences may require:

```text
year + author
```

Others may use:

```text
year + author + email
```

Others may require no project-specific copyright insertion.

---

# 37. Full-Text Integrity

The known historical GPLv3 truncation must not survive migration.

No licence template shall be considered production-ready if:

- known sections are absent;
- the authoritative source could not be validated;
- a migration note marks it incomplete.

Incomplete licence definitions must be:

```text
status = invalid
```

or:

```text
status = pending-source
```

and unavailable for publication.

---

# 38. Security

The Licence Engine must protect against:

- malicious remote content;
- path traversal;
- malformed JSON;
- template-ID collisions;
- spoofed source metadata;
- arbitrary Template Engine expression execution;
- unexpected HTML/script content where plain text is expected.

Canonical licence text is data.

It must never become executable code.

---

# 39. Logging

Operations should log:

```text
catalogue sync started
catalogue entries retrieved
licence template populated
licence unchanged
licence metadata changed
licence legal text changed
source unavailable
licence template invalid
```

Legal body text should not normally be emitted to application logs.

---

# 40. Testing Layers

The subsystem requires:

## Source Client Tests

- successful catalogue retrieval;
- malformed remote response;
- network failure;
- timeout;
- changed upstream data.

## Repository Tests

- discovery;
- lookup;
- missing templates;
- invalid templates.

## Integrity Tests

- content hash;
- source hash;
- altered local body;
- incomplete licence.

## Update Tests

- unchanged;
- metadata change;
- content change;
- failed refresh.

## Publication Tests

- Template Engine integration;
- required variables;
- correct output filename;
- byte-stable output.

---

# 41. Migration from Existing Architecture

The existing architecture contains:

```text
app/templates/license/*.ts
app_manager/license_engine/license-template.json
app_manager/license_engine/opensource-api.json
```

The target architecture becomes:

```text
app/license-engine/**

app_manager/licenses-engine/
└── opensource-license-index.json

app_manager/templates/licenses/
└── *.json
```

Migration shall preserve all valid metadata while discarding obsolete TypeScript template implementations.

---

# 42. Migration of Existing Monolithic Licence Data

For every existing entry:

1. inspect current metadata;
2. verify canonical source;
3. obtain complete legal text;
4. calculate source hash;
5. identify valid project-specific interpolation locations;
6. create independent Template Engine definition;
7. calculate template/content hash;
8. register template path in the licence index;
9. validate publication;
10. remove old aggregate entry only after successful migration.

---

# 43. Documentation Structure

Canonical documentation should be:

```text
docs/specification/architecture/license-engine/
├── spec-license-engine-design-v02.md
└── spec-license-engine-functional-v02.md
```

Earlier licence specifications remain historical records.

---

# 44. Canonical Architectural Definition

> **The AppManager Licence Engine is the domain subsystem responsible for acquiring, validating, cataloguing, preserving, monitoring and maintaining authoritative licence template definitions, while delegating generic template interpretation and final artifact rendering to the AppManager Template Engine.**

---

# 45. Boundary Test

Use this question:

> Is the operation about the legal licence corpus and its authority, provenance, availability or freshness, or is it merely about rendering a validated template definition?

If it concerns:

```text
source
catalogue
retrieval
provenance
hashes
updates
licence availability
licence identity
```

it belongs to the **Licence Engine**.

If it concerns:

```text
interpolation
conditions
filename rendering
fragment composition
structured rendering
GeneratedArtifact creation
```

it belongs to the **Template Engine**.