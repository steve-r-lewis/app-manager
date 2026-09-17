# AppManager Version 1 Coordinated Documentation Generation Clarification

> **Status:** Active Design clarification
>
> **Scope:** PBC-1 correction of coordinated Docs generation/update semantics before NCR
>
> **Lifecycle:** Temporary integration vehicle; NCR-1 shall fold this Design delta into the canonical Design owner and retire this clarification.

## 1. Purpose

Version 1 already supports documentation intent over the complete managed application, all managed layers and other multi-target scopes. This clarification makes explicit that one authorised Docs invocation may realise that semantic documentation scope through multiple independently planned documentation artefacts, with or without AI assistance.

The governing rule is:

> **A coordinated Docs operation is one documentation-domain application intent over an explicitly resolved managed documentation scope, realised through independently planned, validated and accepted documentation artefacts; target cardinality does not create new command identities, and AI assistance does not transfer documentation authority.**

Coordinated documentation is not an arbitrary filesystem bulk-write facility and is not a cross-resource transaction.

## 2. Canonical Command Model

The Version 1 Docs surface remains thirteen canonical commands:

```text
docs.document-application
docs.document-source
docs.document-layers
docs.document-layer
docs.document-tests
docs.document-file
docs.generate
docs.update
docs.extract
docs.aggregate
docs.develop
docs.build
docs.preview
```

No `docs.generate-all`, `docs.update-all`, `docs.bulk-generate`, `docs.bulk-update` or AI-specific competing command identity is introduced.

Documentation cardinality is structured semantic scope. The document-oriented use case establishes what is being documented; generation/update policy establishes the consequential output disposition for each planned artefact.

## 3. Coordinated Artefact Planning

For a resolved documentation target set, Docs shall derive a bounded artefact plan before consequential writes. Each planned artefact shall retain its semantic source target, output identity, evidence/provenance, proposed content and intended mutation disposition.

Each artefact shall independently resolve a disposition such as:

```text
generate
update_managed_document
update_managed_region
already_satisfied
skip
unsupported
collision_refuse
blocked
indeterminate
```

The exact implementation vocabulary may differ, but the observable distinction shall be preserved.

An existing artefact shall never become overwrite-authorised merely because it occurs inside a coordinated operation. Generation remains creation of a new resource. Existing-resource mutation remains explicit update intent and retains ownership, preservation, revision and stale-write requirements.

## 4. Deterministic and AI-Assisted Production

Coordinated documentation shall support a deterministic path that does not require AI availability. Authoritative project, source and domain evidence may be modeled and rendered through the Documentation Capability and approved declarative resources/templates.

Where effective policy permits AI assistance, Docs may request bounded enrichment or proposed documentation content through the AI Capability for one or more planned artefacts. AI output remains provenance-bearing proposal data.

A previously authorised Docs workflow may automatically accept a valid AI proposal without per-artefact human confirmation only when deterministic Docs-owned validation and acceptance criteria were resolved before generation. Interactive policy may instead require review, revision or explicit acceptance.

The AI provider shall not:

- select or broaden managed documentation scope;
- choose unrelated output destinations;
- convert generation into update authority;
- weaken preservation, sensitivity or disclosure policy;
- authorise or accept its own proposal;
- persist or transform documentation directly;
- determine Docs-domain or final application success.

## 5. Per-Artefact Validation and Acceptance

A coordinated operation shall not treat successful rendering, AI completion or resource persistence as sufficient acceptance for the complete operation.

Each consequential artefact shall be evaluated against its resolved target/profile, accepted facts, output policy, preservation requirements and relevant documentation validation. AI-assisted and deterministic artefacts are subject to the same owning Docs postconditions; AI provenance does not lower the acceptance threshold.

Where reliable structural or domain facts conflict with generated prose, those authoritative facts retain precedence according to existing provenance rules.

## 6. Partial Effects, Continuation and Cancellation

Coordinated documentation mutation is not universally atomic across artefacts.

If artefacts A and B have been created or updated successfully and artefact C later fails, A and B remain completed effects. AppManager shall preserve and report that truth rather than imply rollback.

Continuation after an individual artefact failure shall follow explicit Docs-domain continuation policy. Cancellation shall stop initiation of further consequential effects as soon as safely observed but shall not imply rollback of completed writes, AI usage or other completed effects.

The coordinated result shall preserve per-target and per-artefact outcomes so the Application Engine can publish truthful canonical success, partial-success, failure or cancellation semantics.

## 7. Authority Boundaries

This clarification does not alter established authority:

- DD-1 owns managed scope, effective configuration, invocation/authorization, canonical outcomes and final Application Engine acceptance;
- Docs Domain owns documentation intent, semantic target/profile selection, output policy, AI-enrichment acceptance, continuation and Docs-domain postconditions;
- Documentation Capability owns bounded documentation modeling, aggregation, rendering, tooling and documentation-oriented validation;
- Source Transformation owns existing-resource transformation mechanics and stale/preservation enforcement;
- Resource Access owns bounded creation/persistence mechanics for new resources;
- AI Capability supplies bounded inference/generation only.

Provider output, filesystem reachability, renderer output and tool/process completion remain subordinate evidence.

## 8. Catalogue Impact

Docs remains **13 canonical commands** and the complete Version 1 AppManager catalogue remains **96 canonical commands**.

## 9. NCR Integration

NCR-1 shall integrate this Design and Functional correction into their canonical owners. NCR-2 shall integrate the DD-3.4 delta. NCR-3 shall integrate the IS-17 delta. The temporary clarification vehicles shall then be retired under the established clarification lifecycle rule.
