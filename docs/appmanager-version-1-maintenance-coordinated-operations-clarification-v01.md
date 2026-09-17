# AppManager Version 1 Coordinated Maintenance Operations Clarification

> **Status:** Active Design clarification
>
> **Scope:** PBC-1 correction of coordinated Maintenance scope and effect semantics before NCR
>
> **Lifecycle:** Temporary integration vehicle; NCR-1 shall fold this Design delta into the canonical Design owner and retire this clarification.

## 1. Purpose

Version 1 Maintenance owns bounded source-header validation/repair, source-version maintenance and narrowly classified disposable-artefact cleanup. This clarification makes explicit that these intents may operate over one eligible resource, an explicitly selected eligible resource set, or the complete eligible managed scope where the command semantics permit it.

The governing rule is:

> **A Maintenance operation may resolve a bounded set of eligible managed maintenance resources when the selected command's semantic scope permits it; resource cardinality does not create new command identities, and each mutating resource effect retains independent eligibility, authorisation, stale-state protection, acceptance and truthful outcome semantics.**

Coordinated Maintenance is not arbitrary path traversal, a generic recursive repair/delete facility, or a cross-resource transaction.

## 2. Canonical Command Model

The Version 1 Maintenance surface remains four canonical commands:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

No `maintenance.validate-all`, `maintenance.repair-all`, `maintenance.cleanup-all`, `maintenance.bulk-*` or generic `maintenance.repair` identity is introduced.

Cardinality is part of structured command scope, not command identity.

## 3. Semantic Scope

Where supported by the selected operation, Maintenance scope may identify:

- one eligible managed resource;
- an explicit selected set of eligible managed resources;
- a semantic managed unit such as the root application or selected managed layer, resolved to operation-eligible resources;
- the complete eligible managed project scope.

A path glob, directory traversal result or filesystem reachability shall not itself establish Maintenance eligibility or mutation authority.

The resolved set shall remain within DD-1 authoritative managed scope and shall additionally satisfy the selected Maintenance operation's resource-class eligibility rules.

## 4. Classification Before Consequential Effects

Before a coordinated mutating Maintenance operation begins consequential effects, AppManager shall resolve and classify the requested scope sufficiently to construct a bounded maintenance plan.

A resource may be classified, as applicable, as:

```text
eligible
already_satisfied
ineligible
unsupported
ambiguous
protected
outside_managed_scope
stale_or_unresolved
```

The exact implementation vocabulary may differ, but AppManager shall preserve the observable distinction between an eligible consequential target and a resource that merely exists or was discovered.

Classification does not itself authorize mutation.

## 5. Header Validation

`maintenance.headers.validate` is non-mutating and may validate one, selected, semantic-unit or complete eligible managed source-header scope.

The result shall preserve per-resource conformance/diagnostic evidence and an aggregate Maintenance interpretation. One invalid or indeterminate header shall not erase the results for other inspected resources.

Validation shall not mutate a resource merely because a repair would be mechanically possible.

## 6. Header Repair

`maintenance.headers.repair` may repair multiple independently eligible managed source resources in one authorised invocation.

Before mutation, the operation shall establish the recognised header defect and planned bounded repair for each consequential resource. Existing-source mutation remains delegated to Source Transformation and retains per-resource revision, preservation and stale-state requirements.

A coordinated repair shall not infer that every non-conforming or merely unusual source file is repairable. Unsupported, ambiguous, protected or stale resources shall remain non-mutated and truthfully reported.

## 7. Source-Version Maintenance

`maintenance.source-version.maintain` may apply defined source-version policy across multiple independently eligible managed resources.

For each consequential resource, AppManager shall establish recognised current state, applicable maintenance policy, proposed version-metadata change and relevant revision/stale-state preconditions before mutation.

This does not become package versioning, application versioning, repository tagging, documentation versioning or Nuxt upgrade authority.

## 8. Cleanup

`maintenance.cleanup` may remove multiple recognised disposable maintenance artefacts within an authorised semantic scope.

Before deletion, AppManager shall classify the requested scope against explicitly supported disposable artefact classes. Only resources positively classified as eligible disposable maintenance artefacts may be deleted.

Cleanup shall not use bulk cardinality to acquire authority over:

- arbitrary recursive filesystem content;
- App-owned clean/reset state;
- Nuxt-owned generated/cache state;
- Git repositories/remotes;
- Settings resources;
- Docs content;
- AI resources;
- user-authored or otherwise protected resources not explicitly classified as disposable Maintenance artefacts.

Where practical, the consequential cleanup set shall be resolved before deletion begins so discovery during execution does not silently redefine the authorised cleanup intent.

## 9. Plan Before Effect

For coordinated mutating operations, the conceptual sequence is:

```text
Maintenance intent
  -> DD-1 managed scope
  -> Maintenance eligibility/classification
  -> bounded per-resource plan
  -> consequential authorisation
  -> per-resource effect
  -> per-resource validation/acceptance
  -> coordinated Maintenance result
  -> Application Engine final acceptance
```

The plan shall preserve stable resource identity, operation-specific evidence, proposed effect, applicable preconditions and acceptance criteria.

Facts that materially affect authority or safety becoming stale shall invalidate the affected planned effect rather than authorise overwrite, deletion or blind repair.

## 10. Partial Effects, Continuation and Cancellation

Coordinated Maintenance mutation is not universally atomic across resources.

If resources A through C are repaired or deleted successfully and resource D later fails or becomes stale, A through C remain completed effects. AppManager shall report those effects truthfully rather than imply rollback.

Continuation after a resource failure/refusal/indeterminate result shall follow explicit Maintenance policy and any dependency relationships. Cancellation shall stop initiation of further consequential effects as soon as safely practical while preserving already completed effects.

The coordinated result shall preserve per-resource outcomes so DD-1 can publish truthful canonical success, partial-success, failure or cancellation semantics.

## 11. Authority Boundaries

This clarification does not alter established ownership:

- DD-1 owns managed scope, effective configuration, invocation/authorisation, canonical outcomes and final Application Engine acceptance;
- Maintenance owns operation-specific eligibility, classification, maintenance policy, coordinated planning, continuation and Maintenance postconditions;
- Source Intelligence or other approved inspection capabilities may provide bounded evidence without granting mutation authority;
- Source Transformation owns existing-source transformation mechanics and stale/preservation enforcement;
- Resource Access owns bounded inspection/deletion mechanics for cleanup resources;
- provider/filesystem success remains subordinate evidence.

The stronger-owner rule remains mandatory. A resource being maintainable in ordinary language does not make its operation Maintenance-owned when another AppManager domain owns the primary semantic intent.

## 12. AI Boundary

No AI-specific Maintenance requirement is introduced. The four Version 1 Maintenance intents are deterministically classifiable/performable under their defined contracts. AI shall not be inserted merely to create symmetry with Git or Docs coordinated operations.

## 13. Catalogue Impact

Maintenance remains **4 canonical commands** and the complete Version 1 AppManager catalogue remains **96 canonical commands**.

## 14. NCR Integration

NCR-1 shall integrate this Design and Functional correction into their canonical owners. NCR-2 shall integrate the DD-4.4 delta. NCR-3 shall integrate the IS-21 delta. The temporary clarification vehicles shall then be retired under the established clarification lifecycle rule.
