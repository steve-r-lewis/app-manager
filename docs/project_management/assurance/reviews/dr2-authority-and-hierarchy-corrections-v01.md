# DR-2 Authority and Hierarchy Corrections

> **Document type:** Project-management assurance review
>
> **Version:** 01
>
> **Status:** Complete on DR-2 branch; close after merge and live-master verification
>
> **Normative product effect:** None; normative corrections are carried by the cited active clarification documents
>
> **DR-2 source branch baseline:** `eca2d146b761d70dbef29c2145e50bef374c02f2`
>
> **Frozen DR semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

## 1. Objective

DR-2 verifies and corrects authority-direction and hierarchy defects before structural rationalisation begins.

The required candidates are:

1. FR-NUXT-058/059 dependence on a DD-level clarification;
2. AI Functional ownership clarification authority/filing level;
3. DD-2 sibling `Conformance Rules for Later DD-2 Designs`;
4. DD-level architectural subsystem vocabulary appearing as Functional `current authority`.

External audit findings are evidence only. Each candidate was checked against the live hierarchy and current normative documents.

## 2. Live-State Verification

The user referred to PR #158, but #158 is the already-merged DR-0 PR. The immediately preceding DR-1 work was PR #159.

PR #159 was independently verified `closed` and `merged`, with merge commit:

`eca2d146b761d70dbef29c2145e50bef374c02f2`

Live `master` was then independently fetched and verified at that exact commit before `ai/dr2-authority-hierarchy-corrections` was created.

This closes DR-1's required post-merge verification without relying on the user's PR-number wording.

## 3. DR2-01 — FR-NUXT-058/059 and DD-Level Dependency

**Classification: CONFIRMED AUTHORITY-DIRECTION DEFECT.**

The Nuxt Functional Specification already states the substantive Functional rule: Nuxt layer creation owns scaffold/profile orchestration but does not acquire permanent semantic ownership of independently owned artefact classes. FR-NUXT-058 states this directly, and FR-NUXT-059 places exact file/template/rendering mechanics below Functional level.

However, §11.1 says the `canonical detailed delegation model` is defined by the DD-level Nuxt Layer Scaffold Artefact Ownership Clarification. Read literally, this can make Functional meaning appear dependent on a downstream Detailed Design document.

### Correction

Added `docs/functional/clarifications/nuxt-layer-scaffold-functional-ownership-clarification-v01.md`.

It establishes at Functional level that:

- FR-NUXT-058/059 are self-sufficient Functional authority;
- Nuxt owns layer-baseline/profile orchestration;
- independent artefact semantic ownership remains with its Functional owner;
- the DD-level scaffold clarification is downstream refinement only.

Primary-body fold-forward is assigned to DR-6.

## 4. DR2-02 — AI Functional Ownership Clarification Filing/Authority

**Classification: CONFIRMED MIXED-LEVEL CLARIFICATION DEFECT.**

The existing Functional clarification contained two different kinds of material:

1. valid Functional-level statements about observable AI-domain and cross-domain AI ownership; and
2. same-level Detailed Design allocation interpreting DD-2.7 versus DD-4.3.

The first belongs at Functional level. The second belongs at Detailed Design level. Moving the whole document would incorrectly remove useful Functional authority, while leaving it unchanged lets a Functional clarification act as a DD allocation instrument.

### Correction

The existing Functional clarification was rewritten to clarify only the AI Functional Specification and to state the downstream refinement boundary without allocating DD sibling responsibilities.

Added `docs/dd_2_shared_capabilities/clarifications/ai-functional-refinement-relationship-clarification-v01.md` to own the DD-2.7/DD-4.3 allocation:

- DD-4.3 owns AI-domain application intent/policy/orchestration and domain interpretation;
- DD-2.7 owns bounded provider-independent AI capability semantics/evidence;
- a consuming non-AI domain retains its own application intent;
- DD-1 retains final application authority.

This is a split by abstraction level, not a semantic change.

## 5. DR2-03 — DD-2 Sibling Conformance Rules

**Classification: CONFIRMED AUTHORITY-PRESENTATION DEFECT; MOST UNDERLYING BOUNDARY RULES REMAIN VALID.**

DD-2.1 and other sequentially authored DD-2 documents use headings such as `Conformance Rules for Later DD-2 Designs` and issue `shall` statements to later-numbered siblings.

The underlying constraints often express legitimate owner-contract boundaries. For example, Resource Access may define the conditions under which another capability consumes Resource Access. But DD numbering and authoring order do not make DD-2.1 a superior specification level over DD-2.2 through DD-2.10.

### Correction

Added `docs/dd_2_shared_capabilities/clarifications/dd2-sibling-authority-clarification-v01.md`.

It establishes:

- DD-2 numbers are identity/organisation, not authority rank;
- a capability DD may govern consumption of its own contract;
- genuine cross-capability invariants derive from upstream Design/Functional/DD-1 owners or the specialist contract actually being consumed;
- sibling references do not create a specification hierarchy;
- DR-4 shall fold the correction into the DD-2 primary bodies and rationalise the affected sections.

No valid specialist safety boundary is removed in DR-2.

## 6. DR2-04 — DD Vocabulary in Functional Traceability Tables

**Classification: CONFIRMED TRACEABILITY/AUTHORITY VOCABULARY DEFECT.**

Functional traceability tables use lower-level architectural names such as `Repository Capability`, `Source Intelligence`, `Resource Registry and Template`, `Process Execution boundary` and related labels in columns titled `Current authority` or `Primary current authority`.

The root Design permits architectural subsystem/capability decomposition, but a downstream DD subsystem is not an upstream Functional authority. The tables conflate normative source with downstream refinement destination.

### Correction

Added `docs/functional/clarifications/functional-traceability-authority-vocabulary-clarification-v01.md`.

It establishes that:

- Functional authority comes from Root Design plus the applicable same-level Functional contracts;
- DD subsystem names in existing Functional tables are downstream traceability/orientation only;
- DR-6 must split upstream/same-level normative authority from downstream refinement destination while preserving useful traceability links.

No `FR-*` requirement is changed.

## 7. Horizontal Architecture Check

The DR-2 corrections preserve:

- Design -> Functional -> Detailed Design -> Implementation direction;
- DD numbering as identity rather than authority rank;
- DD-1 authority for invocation, outcomes, managed scope, effective configuration and final Application Engine acceptance;
- domain intent/policy/orchestration versus shared capability mechanics;
- evidence versus interpretation;
- recognition/reachability versus mutation authority;
- provider replaceability and topology independence.

No new generic framework, cross-capability super-layer, command identity, provider contract or implementation topology is introduced.

## 8. Semantic Accounting

DR-2 does not delete meaningful baseline propositions. It corrects the authority level at which they are interpreted and records fold-forward destinations.

The companion register is:

`docs/project_management/assurance/reconciliations/dr2-semantic-disposition-register-v01.md`

All corrections remain accountable against the frozen DR source baseline.

## 9. Exit Criteria

DR-2 passes on branch because:

1. DR-1 was independently verified merged before branching;
2. all four required candidates were read horizontally against the governing hierarchy;
3. each candidate received an explicit classification;
4. confirmed defects were corrected at the appropriate abstraction level;
5. no lower-level document is made the source of higher-level meaning;
6. no DD sibling receives authority from numbering or authoring order;
7. no `FR-*` obligation was removed or weakened;
8. primary-body rationalisation is deferred to the package that owns that corpus rather than mixed into DR-2;
9. semantic dispositions are recorded.

## 10. Decision

**PASS — DR-2 COMPLETE ON BRANCH.**

After merge and independent live-master verification, proceed to **DR-3 — Design and Functional Normative Ownership**.