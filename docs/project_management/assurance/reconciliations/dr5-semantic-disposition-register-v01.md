# DR-5 Semantic Disposition Register — DD-3/DD-4 Domain Rationalisation

> **Status:** Complete on DR-5 review branch
>
> **Source semantic baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`
>
> **DR-5 branch baseline:** `f9c81503cdbdb6c361f9ead75e45cc8a553536fe`
>
> **Normative effect:** Accounting only. Normative clarification is in `docs/dd_3_high_coupling_domains/clarifications/dd3-dd4-domain-rationalisation-clarification-v01.md` and existing domain DDs/clarifications.

## 1. Purpose

This register accounts for the proposition classes reviewed by DR-5 so later physical reduction cannot silently delete domain semantics.

## 2. Dispositions

| ID | Proposition / repetition class | Disposition | Preserved owner / treatment |
|---|---|---|---|
| DR5-01 | DD-1 invocation/outcome/scope/config/final-authority explanations repeated across domains | REFERENCE | DD-1.1–DD-1.5; retained only as concise local domain bindings |
| DR5-02 | generic statement that delegated specialist work does not transfer application authority | REFERENCE | Design/Functional canonical owners from DR-3; DD-1.5; DR-5 clarification |
| DR5-03 | generic technical/provider success versus application success explanation | REFERENCE | DD-1.2/DD-1.5 and DR-3 owner map |
| DR5-04 | generic evidence versus interpretation explanation | REFERENCE | Design/Functional owner set; domain retains only domain-specific interpretation/postconditions |
| DR5-05 | repeated DD-2 capability mechanics in domain DDs | REFERENCE | owning DD-2 capability, read with DR-4 clarification |
| DR5-06 | domain intent/policy/orchestration/interpretation/acceptance semantics | RETAIN | each DD-3/DD-4 domain document |
| DR5-07 | capability/domain pair similarity | RETAIN | deliberate composition/specialisation; no merge/generic framework |
| DR5-08 | Git intent/policy versus Repository Capability primitives | RETAIN | DD-3.2 above DD-2.3 |
| DR5-09 | Nuxt intent/policy versus Nuxt Capability mechanics | RETAIN | DD-3.3 above DD-2.10 |
| DR5-10 | Docs intent/policy versus Documentation Capability mechanics | RETAIN | DD-3.4 above DD-2.9 |
| DR5-11 | Quality intent/policy versus Quality Capability mechanics | RETAIN | DD-4.1 above DD-2.8 |
| DR5-12 | AI-domain instruction-resource intent versus AI Capability execution | RETAIN | DD-4.3 above DD-2.7; active AI DD ownership clarification |
| DR5-13 | Settings persistence versus effective-configuration precedence | RETAIN / REFERENCE | DD-4.2 owns persistence intent; DD-1.4 owns precedence/effective configuration |
| DR5-14 | Utils stronger-owner rule | RETAIN | DD-4.4 local boundary |
| DR5-15 | App root creation may include Nuxt contribution without taking Nuxt semantics | RETAIN | DD-3.1/DD-3.3 deliberate composition; DR1-03 not sustained |
| DR5-16 | DD-3.3 `inspect_layer_state` as ninth Nuxt operation | CORRECT | superseded by active Nuxt operation-identity clarification; eight canonical identities carried forward by DR-5 clarification |
| DR5-17 | Nuxt lifecycle/integration state remains observable | RETAIN | FR-NUXT-013–020, FR-NUXT-089–092; DD-3.3/clarification/IS-16 |
| DR5-18 | generic domain delegation diagrams | ILLUSTRATE | explanatory unless they establish domain-specific stage/state/safety delta |
| DR5-19 | domain-specific stage/state/recovery diagrams | RETAIN | owning domain DD |
| DR5-20 | current implementation/source-path observations in DD-3/DD-4 | RELOCATE / REFERENCE | provenance only; concrete dispositions IS-14–IS-21 |
| DR5-21 | domain-specific preconditions/postconditions/failure/partial/recovery semantics | RETAIN | owning domain DD |
| DR5-22 | cross-domain composition transfers semantic ownership | CORRECT / REFERENCE | coordination does not transfer ownership; owning domain/capability remains authoritative |
| DR5-23 | AI generated content creates mutation authority | REFERENCE | AI Functional/DD ownership clarification + DD-2.7/DD-4.3 local bindings |
| DR5-24 | Settings persistence establishes competing precedence | REFERENCE | DD-1.4 canonical precedence; DD-4.2 persistence only |

## 3. Document-Level Accounting

| Document | Domain delta preserved | Primary rationalisation target |
|---|---|---|
| DD-3.1 | App lifecycle/create/run policy and orchestration | inherited DD-1/DD-2 authority prose |
| DD-3.2 | Git intent/policy/orchestration and repository-evidence interpretation | Repository Capability restatement |
| DD-3.3 | Nuxt target/config/layer policy, orchestration and lifecycle interpretation | Nuxt Capability + generic authority restatement; stale ninth operation corrected |
| DD-3.4 | Docs target/output/use-case policy and orchestration | Documentation Capability restatement |
| DD-4.1 | Quality scope/check/gate policy and quality interpretation | Quality Capability restatement |
| DD-4.2 | Settings CRUD/licence/environment persistence intent | Configuration Resolution/Resource Access restatement |
| DD-4.3 | AI instruction-resource application intent | AI Capability restatement |
| DD-4.4 | bounded header maintenance/cleanup intent and stronger-owner boundary | Source Intelligence/Transformation/Resource Access restatement |

## 4. Zero-Loss Check

No domain-specific `DD-*` requirement or `FR-*` obligation is deleted by DR-5. Recurrent inherited architecture is converted conceptually to `REFERENCE`; capability/domain pairings remain separate; the known Nuxt identity defect is carried forward as `CORRECT`; implementation observations remain provenance with Level 4 owners identified.

The DR-9 equivalence review must verify these dispositions against the frozen source baseline before accepting the lean baseline.
