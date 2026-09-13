# AppManager Nuxt Layer Scaffold Artefact Ownership Clarification

> **Document type:** Detailed Design clarification
>
> **Clarifies:** DD-2.10, DD-2.5, DD-2.6, DD-2.9

> **Status:** Version 1 Detailed Design Clarification
>
> **Purpose:** Resolve DD-2 reconciliation item R-03 by distinguishing Nuxt layer-creation orchestration from artefact semantic ownership, declarative rendering, and persistence authority.
>
> **Reconciliation source:** [docs/project_management/dd2-independent-review-reconciliation-v01.md](../../project_management/dd2-independent-review-reconciliation-v01.md)

## 1. Governing distinction

`FR-NUXT-058` and DD-2.10 allow a Nuxt layer profile to require artefact classes such as README/introduction material and licence material.

The presence of an artefact class in a Nuxt profile does not transfer that artefact class's permanent semantic authority to Nuxt Capability.

> **A use case may own orchestration of a composed result without owning the internal semantics of every artefact required to produce that result.**

For Nuxt layer creation, the `nuxt` domain owns the intent to establish a valid layer under the selected profile. Specialist capabilities retain their permanent contracts while contributing to that result.

## 2. Ownership dimensions

A scaffold artefact shall be considered across separate dimensions:

1. **use-case orchestration** — which use case requires the artefact and interprets its contribution;
2. **artefact semantics** — which capability/domain defines its meaning or correctness;
3. **resource/template rendering** — which capability resolves declarative resources and renders proposed content;
4. **persistence/mutation** — which capability creates or modifies project resources;
5. **final acceptance** — which owning use case/Application Engine decides whether the requested operation succeeded.

These dimensions shall not be collapsed merely because one workflow coordinates them.

## 3. Nuxt layer-creation ownership

Nuxt layer creation owns:

- profile selection and interpretation;
- the Nuxt-specific layer baseline;
- which artefact classes are required or optional for that profile;
- Nuxt-specific facts supplied to specialist producers;
- Nuxt-specific scaffold validation;
- interpretation of subordinate evidence against layer-creation acceptance criteria.

Nuxt Capability does not thereby acquire generic documentation, licence-management, registry/template, filesystem, or source-transformation authority.

```text
Nuxt layer-creation use case
        |
        +--> selected profile / Nuxt baseline
        +--> approved target / effective inputs
        |
        +--> Documentation Capability where documentation semantics are required
        +--> Settings/application licence semantics where licence management is required
        +--> Resource Registry/Templates for declarative resolution/rendering
        +--> Resource Access for authorized new-resource creation
        +--> Source Transformation for authorized existing-resource modification
        |
        v
Nuxt-specific scaffold validation
        |
        v
Application Engine / Nuxt-use-case acceptance
```

## 4. README / introduction material

A layer profile may require README/introduction material for profile completeness. That requirement does not create a second Nuxt documentation subsystem.

Where README content is a bounded declarative scaffold resource already defined by an approved template/resource, DD-2.6 owns resource identity, parameter binding and non-mutating rendering. Nuxt may supply Nuxt-specific parameters and require the rendered artefact as part of the profile.

Where README content requires documentation-specific fact aggregation, generated explanatory content, documentation-model composition, or documentation update semantics, DD-2.9 Documentation Capability owns those semantics. Nuxt supplies authoritative Nuxt facts and profile intent without recreating a parallel documentation model.

> **Documentation Capability owns documentation semantics; Nuxt owns whether documentation is required for the selected Nuxt creation profile and how its result contributes to layer-creation acceptance.**

## 5. Licence material

A Nuxt layer profile may require licence material, but Nuxt Capability does not thereby own licence catalogue semantics, licence-management CRUD, or project-wide licence synchronization.

The requested licence identity shall come from explicit invocation values or governed effective configuration where applicable. Nuxt shall not establish a competing licence-selection precedence.

Where AppManager exposes licence resource management, Settings/application-level licence semantics remain authoritative for retained licence-management intent and any explicitly coupled project-metadata effects. DD-2.6 owns bounded licence resource identity, provenance, compatibility and non-mutating resolution/rendering where declarative licence resources are used.

Nuxt layer creation may coordinate the approved licence operation or consume the approved rendered licence resource as part of its selected profile. This does not transfer licence-management authority to Nuxt Capability.

> **Nuxt may require licence material for profile completeness; Settings/application licence semantics and DD-2.6 licence-resource semantics remain authoritative for the licence itself.**

## 6. Persistence boundary

For every scaffold artefact, including README and licence material:

- rendering proposed content does not persist it;
- creation of a new authorized resource uses DD-2.1 Resource Access;
- bounded modification of an existing resource uses DD-2.5 Source Transformation where applicable;
- collision with an existing resource does not create implicit overwrite authority;
- final persistence evidence returns to the Nuxt layer-creation workflow for interpretation.

No content-producing capability gains direct filesystem authority merely because it produced content.

## 7. Ownership matrix

| Concern | Primary semantic owner | Nuxt layer-creation role |
|---|---|---|
| Nuxt layer profile and baseline | Nuxt domain / DD-2.10 | Owns |
| Nuxt configuration meaning | DD-2.10 | Owns Nuxt semantics; delegates mutation mechanics |
| README profile requirement | Nuxt layer-creation use case | Decides required/optional contribution |
| Declarative README rendering | DD-2.6 Registry/Templates | Supplies bounded rendered proposal |
| Documentation modeling/generation | DD-2.9 Documentation Capability | Supplies documentation proposal/evidence |
| Licence selection input | Invocation/effective configuration/application policy | Consumes; does not invent precedence |
| Licence management semantics | Settings/application licence use case | Coordinates/consumes where required |
| Licence resource resolution/rendering | DD-2.6 Registry/Templates | Supplies bounded resource/proposal |
| New-resource creation | DD-2.1 Resource Access | Delegated authorized effect |
| Existing-resource modification | DD-2.5 Source Transformation | Delegated authorized effect |
| Final Nuxt layer validity | DD-2.10 | Supplies Nuxt validity evidence |
| Final layer-creation acceptance | Nuxt use case / Application Engine | Owns |

The matrix describes semantic ownership, not mandatory classes, packages, modules, or runtime topology.

## 8. Modularity requirements

To preserve loose coupling:

1. Nuxt requests specialist work through AppManager-oriented contracts rather than provider-native implementations.
2. Nuxt profiles express semantic artefact classes and required inputs rather than implementation filenames as architectural identity.
3. Specialist capabilities return proposed content/evidence without acquiring Nuxt workflow authority.
4. Nuxt does not inspect specialist provider internals to determine application success.
5. Required and optional specialist stages remain distinguishable in composed results.
6. Specialist capabilities do not call upward to redefine the Nuxt profile or its acceptance policy.

## 9. Reconciliation decision

R-03 is classified as:

> **CLARIFICATION REQUIRED — the intended architecture is modular, but the live Nuxt specifications do not currently make artefact-class orchestration versus semantic ownership explicit enough.**

The corrected position is:

> **Nuxt layer creation owns the composed Nuxt layer-creation intent and profile acceptance. Inclusion of README, licence, or another cross-owned artefact class in that profile does not transfer that artefact's permanent semantic authority to Nuxt Capability.**

R-03 is fully resolved only after this model is propagated into the primary Nuxt Functional and DD-2.10 specifications and horizontally checked against DD-2.6, DD-2.9, and Settings licence semantics.
