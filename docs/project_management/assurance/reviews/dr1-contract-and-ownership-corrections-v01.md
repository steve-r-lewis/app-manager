# DR-1 — Contract and Ownership Corrections

> **Document type:** Project-management assurance review
>
> **Status:** Complete on review branch; post-merge verification required
>
> **Role:** DR-1 verification/correction evidence
>
> **Normative product effect:** None. Normative corrections are made only through the applicable specification/clarification files.

## 1. Objective

DR-1 verifies the three correctness/ownership candidates assigned by the Documentation Corpus Rationalisation Programme before structural deduplication begins.

The review is read-first and horizontal. External audit findings are evidence, not authority.

## 2. Verified Starting State

PR #158 was verified merged into live `master` before this branch was created. The exact DR-1 starting baseline is:

`358d17e3c9651ccda29fbe67215392ef4f6ff799`

This is the merge commit for PR #158 and therefore independently closes DR-0's post-merge state.

The immutable semantic source baseline for the overall DR programme remains the pre-rationalisation PR #157 merge commit:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

## 3. Candidate DR1-01 — IS-1 / IS-22 `InteractionCapabilities`

**Classification: CONFIRMED DEFECT.**

IS-1 defines the `InvocationRequest.interaction` field using a five-field `InteractionCapabilities` contract:

- `canRequestAdditionalInput`;
- `canAcquireAuthorization`;
- `canConsumeEvents`;
- `canRequestCancellation`;
- `canConsumeStructuredOutcome`.

IS-22 separately defines a six-field interface with the same name:

- `interactiveInput`;
- `explicitConfirmation`;
- `progressEvents`;
- `cancellation`;
- `structuredResults`;
- `humanDiagnostics`.

These are not two compatible declarations of one shared contract. IS-22 also states that its request builder converts adapter input into the IS-1 request contract, establishing that adapter-local capability description and application-boundary interaction capability are distinct abstraction levels.

### Correction

Added `docs/implementation/clarifications/interaction-capabilities-contract-clarification-v01.md`.

The correction establishes:

- IS-1's five-field `InteractionCapabilities` as the canonical application request contract;
- IS-22's six-field declaration as adapter-local `AdapterCapabilities`;
- explicit semantic mapping in the invocation-request builder;
- `humanDiagnostics` as presentation-only, with no IS-1 semantic capability field;
- no authority transfer through either capability declaration.

This resolves the implementation-blocking type-name/contract collision without changing the invocation architecture.

The primary IS documents may fold this clarification into their bodies during DR-7. Until then the active clarification is part of the required Level 4 reading set.

## 4. Candidate DR1-02 — DD-3.3 / Nuxt Operation Identity Clarification

**Classification: CONFIRMED STALE PRIMARY TEXT; NORMATIVE CONFLICT ALREADY RESOLVED BY ACTIVE CLARIFICATION.**

DD-3.3 `DD-NUXT-005` still lists nine identities including `inspect_layer_state`.

The active `nuxt-domain-operation-identity-clarification-v01.md` explicitly identifies that exact inconsistency, defines the eight canonical Version 1 operation identities, states that `inspect_layer_state` is not a ninth independently invocable operation, preserves lifecycle/integration-state evidence, and binds IS-16 to that corrected interpretation.

Therefore the external audit is correct that the primary DD body remains stale, but it is not correct to treat the semantic choice as unresolved when the required active clarification is read. The normative reading set already has one explicit answer.

### DR-1 disposition

No second clarification is created. Doing so would duplicate the correction and worsen the corpus problem DR exists to remove.

The stale `DD-NUXT-005` body is assigned a **CORRECT/fold-forward** disposition for DR-5, where DD-3.3 is already scheduled for rationalisation. DR-5 shall replace the stale nine-item list with the clarified eight-identity contract and then determine whether the now-redundant clarification can be retired under normal change control.

No implementation may introduce `nuxt.inspect-layer-state` as a ninth semantic owner in the interim.

## 5. Candidate DR1-03 — App Root Creation / Nuxt Configuration Ownership

**Classification: NOT SUSTAINED.**

`FR-APP-072` requires root-application creation to be capable of generating a Nuxt-configuration artefact class where applicable to the selected profile. The Functional requirement deliberately states that exact filenames, template functions and file contents belong below Functional level.

DD-3.1 supplies the missing lower-level ownership boundary explicitly:

- root creation coordinates Nuxt-specific artefact semantics where required;
- `DD-APP-045` states that App owns inclusion of an artefact class in the root-application creation plan but does not automatically own specialist content semantics;
- its explicit example states that Nuxt-specific configuration/scaffold semantics remain Nuxt-owned;
- generation/resource creation, Source Transformation and persistence remain separately owned.

This is deliberate composition, not duplicate ownership. App owns root-creation intent/profile orchestration and inclusion of the artefact class; Nuxt owns Nuxt-specific configuration/scaffold semantics.

No normative correction is required in DR-1. Any later readability reduction must preserve this distinction.

## 6. Semantic Accounting

| Candidate | Classification | Disposition | Semantic effect |
|---|---|---|---|
| DR1-01 IS-1/IS-22 interaction capabilities | confirmed defect | CORRECT | disambiguates two abstraction-level contracts and defines mapping |
| DR1-02 DD-3.3 operation identity | stale primary text; already normatively resolved | CORRECT/fold-forward in DR-5 | no new operation semantics; existing eight-identity clarification remains governing |
| DR1-03 App/Nuxt root configuration | not sustained | RETAIN | preserves deliberate App-orchestration/Nuxt-specialist ownership split |

No baseline proposition is silently removed.

## 7. Architectural Preservation Check

DR-1 preserves:

- one IS-1 application invocation path;
- IS-22 adapter presentation/input responsibility without application authority;
- DD-1 managed scope, configuration integration, authorization and final Application Engine acceptance;
- App-domain ownership of root-application lifecycle/creation intent;
- Nuxt-domain ownership of Nuxt-specific configuration/scaffold semantics;
- Nuxt Capability bounded specialist execution;
- evidence-versus-interpretation boundaries;
- provider replaceability and implementation-topology independence.

No generic capability framework, new command identity, provider dependency or domain authority is introduced.

## 8. Exit Result

**PASS — DR-1 CONTRACT AND OWNERSHIP CORRECTIONS COMPLETE ON BRANCH.**

DR-1 has:

- independently closed DR-0 against merged live `master`;
- verified all three assigned candidates;
- corrected the one implementation-blocking type/contract collision;
- confirmed the Nuxt primary-body staleness while avoiding a duplicate clarification;
- rejected the alleged App/Nuxt ownership conflict because the Detailed Design already separates orchestration from specialist semantics;
- preserved semantic accounting for later DR-5/DR-7 fold-forward work.

After this branch merges, live `master` must be independently verified before DR-2 branches.
