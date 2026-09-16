# DD-3/DD-4 Domain Rationalisation Clarification — Version 01

> **Status:** Active Detailed Design clarification
>
> **Scope:** DD-3.1 through DD-3.4 and DD-4.1 through DD-4.4 domain Detailed Designs
>
> **Normative effect:** Clarifies the rationalised reading of repeated DD-1/DD-2 authority prose and capability/domain boundary explanations across the eight Version 1 domain designs. It also carries forward the corrected Nuxt operation identity already established by the active Nuxt clarification. No domain-specific `DD-*` requirement is removed or weakened.

## 1. Purpose

The DD-3 and DD-4 domain designs were deliberately explicit about Application Core authority and delegated shared-capability boundaries. That repetition protected the architecture during initial authoring, but it now obscures the domain-specific delta: application intent, policy, orchestration, evidence interpretation and domain acceptance semantics.

DR-3 established canonical Design/Functional owners for recurrent invariants. DR-4 rationalised the DD-2 shared-capability family. This clarification applies the same canonical-owner -> local-binding -> local-delta rule to the domain layer.

## 2. Rationalised Domain Reading Rule

For DD-3.1 through DD-3.4 and DD-4.1 through DD-4.4:

1. DD-1 remains authoritative for invocation, canonical outcomes, managed project/scope, effective configuration and final Application Engine acceptance;
2. DD-2 capabilities remain authoritative for their bounded specialist mechanics and normalized evidence;
3. each domain owns the application intent, applicability/policy, orchestration, interpretation and domain-specific postconditions of its own use cases;
4. delegated capability execution does not transfer domain or application authority;
5. repeated explanations of DD-1/DD-2 contracts are inherited local bindings, not competing definitions;
6. capability contracts shall be referenced rather than recreated by a domain except where a concise local binding is required to state how the domain uses or interprets them;
7. capability-specific evidence becomes domain evidence only through the domain's explicit interpretation against its own intent/postconditions; final application acceptance remains DD-1.5-owned;
8. provider/tool/source topology is implementation evidence, not domain architecture;
9. domain-specific preconditions, postconditions, state models, policies, orchestration ordering, failure/partial semantics and recovery rules remain local normative delta.

## 3. Domain-Specific Delta

The rationalised family preserves these primary responsibilities:

| Domain | Permanent local delta |
|---|---|
| DD-3.1 App | application lifecycle/project-package intent, creation/start/stop/build/dev/script policy and orchestration, App-specific acceptance |
| DD-3.2 Git | Git application intent, repository eligibility/policy, repository-operation orchestration, Git-specific interpretation and acceptance above DD-2.3 |
| DD-3.3 Nuxt | Nuxt intent, target/applicability policy, configuration/layer orchestration, Nuxt relationship/lifecycle interpretation and acceptance above DD-2.10 |
| DD-3.4 Docs | documentation application intent, documentation target/output policy, generation/update/extract/aggregate/develop/build/preview orchestration and Docs-specific acceptance above DD-2.9 |
| DD-4.1 Quality | quality application intent, scope/check/gate policy, interpretation of quality evidence and domain acceptance above DD-2.8 |
| DD-4.2 Settings | Settings CRUD/licence/environment application intent, persistence policy and Settings-specific acceptance without taking DD-1.4 precedence authority |
| DD-4.3 AI | AI-domain instruction-resource intent and lifecycle policy above DD-2.7 provider-independent AI execution; generated content remains non-authoritative |
| DD-4.4 Utils | bounded source-header maintenance and narrowly classified cleanup intent/policy; stronger semantic owners take precedence |

The table is a navigation summary. The existing `DD-*` requirements remain the detailed normative contracts.

## 4. Capability/Domain Pairings

Several domain/capability pairs are intentionally adjacent but are not duplicate semantic owners:

- Git Domain / Repository Capability;
- Nuxt Domain / Nuxt Capability;
- Docs Domain / Documentation Capability;
- Quality Domain / Quality Capability;
- AI Domain / AI Capability.

For each pair, the capability owns bounded specialist mechanics/evidence and the domain owns application intent/policy/orchestration/interpretation. Similar terminology or similarly shaped result records do not justify merging the contracts or introducing a generic domain/capability framework.

Settings and Utils also compose shared capabilities but do not acquire their mechanics merely because the domain orchestrates them.

## 5. Recurrent DD-1 Bindings

The following repeated domain statements are references/bindings to canonical DD-1 authority and need not be treated as independent domain definitions:

- normalized invocation and authorization context comes from DD-1.1;
- canonical outcome/diagnostic/effect taxonomy comes from DD-1.2;
- managed identity, topology, scope and targetability come from DD-1.3;
- effective configuration and provenance come from DD-1.4;
- dispatch/final authority/final application acceptance remain DD-1.5-owned.

A domain may still define what its own successful postcondition means and how it interprets subordinate evidence. That domain interpretation is not the final application outcome publication.

## 6. Recurrent DD-2 Bindings

Repeated capability descriptions in domain documents shall be read as consumption bindings. The capability's own DD remains authoritative for mechanics such as resource access, process execution, repository primitives, source intelligence/transformation, registry/template rendering, AI execution, quality execution, documentation mechanics and Nuxt technical semantics.

A domain may impose a stricter domain precondition or interpret capability evidence differently for its use case, but it shall not silently redefine the capability contract.

## 7. Nuxt Operation Identity Fold-Forward

The active `nuxt-domain-operation-identity-clarification-v01.md` corrected stale text in DD-3.3 `DD-NUXT-005`. The canonical Version 1 Nuxt-domain operation identities are:

```text
inspect
inspect_configuration
list_configuration
add_configuration
remove_configuration
create_layer
integrate_layer
detach_layer
```

The `inspect_layer_state` label in the original DD-3.3 list is superseded and shall not be read as a ninth independently invocable operation. Layer lifecycle/integration/repository-relationship state remains required structured evidence exposed through `inspect` and relevant mutating-operation results.

This is a fold-forward of an already-settled correction, not a new command-model decision.

## 8. Cross-Domain Composition

One domain may coordinate another domain when the composed application intent genuinely requires it. Such coordination does not transfer ownership. In particular:

- App root creation may require Nuxt contributions without App owning Nuxt-specific scaffold semantics;
- Nuxt workflows may require Git work without Nuxt owning repository policy/primitives;
- Nuxt/App workflows may require documentation, Settings/licence, Quality or AI contributions without absorbing those domains;
- generated or proposed content does not become authorized mutation merely because a domain requested it.

Nested application use cases continue through the Application Engine where the architecture requires application-level composition.

## 9. Diagrams and Repeated Authority Prose

Generic diagrams of the form:

```text
Application Engine
    -> domain intent/policy/orchestration
    -> bounded capability work
    -> normalized evidence
    -> domain interpretation
    -> Application Engine acceptance
```

are explanatory unless they introduce domain-specific stage ordering, state transitions, safety boundaries or recovery semantics. Domain-specific diagrams remain meaningful where they add such delta.

## 10. Implementation Evidence

Historical source paths, services, command files and current implementation observations in DD-3/DD-4 are provenance only. Concrete Version 1 implementation disposition belongs to IS-14 through IS-21 for the corresponding domains, subject to upstream conformance.

| DD | Domain | Level 4 owner |
|---|---|---|
| DD-3.1 | App | IS-14 |
| DD-3.2 | Git | IS-15 |
| DD-3.3 | Nuxt | IS-16 |
| DD-3.4 | Docs | IS-17 |
| DD-4.1 | Quality | IS-18 |
| DD-4.2 | Settings | IS-19 |
| DD-4.3 | AI | IS-20 |
| DD-4.4 | Utils | IS-21 |

## 11. Non-Effect

This clarification does not:

- remove or renumber any domain `DD-*` requirement;
- remove or renumber any `FR-*` obligation;
- merge any capability/domain pair;
- create a generic domain framework;
- transfer DD-1 final authority into a domain;
- transfer domain intent/policy into DD-2;
- change the settled App/Nuxt root-creation composition boundary;
- remove Nuxt lifecycle-state observability;
- make AI output authoritative;
- make Settings persistence a competing configuration-precedence system;
- authorize Utils to absorb work with a stronger semantic owner;
- infer architecture from current implementation topology.

## 12. DR-5 Fold-Forward Rule

The eight primary domain DD bodies may be physically shortened in a later editorial pass only when every removed proposition is demonstrably preserved at its canonical owner or as explicit local domain delta. Until then, repeated prose remains readable context but shall not be interpreted as multiple independent normative owners.
