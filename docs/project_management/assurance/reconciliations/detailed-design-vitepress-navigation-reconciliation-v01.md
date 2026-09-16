# AppManager Detailed Design VitePress Navigation Reconciliation

> **Status:** Version 1 project-management reconciliation record
>
> **Work package:** R-8 — VitePress/documentation navigation reconciliation
>
> **Baseline:** `master` at `e8ed6355854d78928f91bdba368390aa690e0f88`
>
> **Normative effect:** None. This work reconciles rendered documentation navigation with the already-approved Detailed Design repository taxonomy. It does not create or revise Detailed Design authority.

## 1. Purpose

R-8 reconciles the VitePress documentation surface with the canonical Detailed Design structure established by R-4 through R-7.

The required rendered taxonomy is:

```text
Detailed Design
├── DD-1 — Application Core
├── DD-2 — Shared Capabilities
├── DD-3 — High-Coupling Domains
└── DD-4 — Policy and Resource Domains
```

The filesystem taxonomy and rendered documentation taxonomy must communicate the same family structure without creating placeholder normative specifications for planned work.

## 2. Baseline Finding

At the R-8 baseline, `docs/.vitepress/config.ts` exposed top-level navigation for Guide, Layers, Commands, and Architecture only.

It contained no Detailed Design navigation entry and no sidebar mapping for:

- `docs/dd_1_application_core/`;
- `docs/dd_2_shared_capabilities/`;
- `docs/dd_3_high_coupling_domains/`;
- `docs/dd_4_policy_and_resource_domains/`.

The Detailed Design repository taxonomy was therefore correct on disk but not represented in rendered VitePress navigation.

## 3. Reconciliation

R-8 introduces a non-normative rendered navigation layer consisting of:

1. `docs/detailed-design.md` as the rendered Detailed Design navigation index;
2. a top-level **Detailed Design** VitePress navigation menu;
3. a Detailed Design overview sidebar containing all four approved DD families;
4. family-specific sidebars for authored DD-1, DD-2, and DD-3 material;
5. explicit clarification groups under DD-1 and DD-2;
6. planned DD-3 and DD-4 identities displayed as non-linked status entries until their normative documents are actually authored.

## 4. Navigation Rules

The rendered navigation follows these rules:

- stable `DD-<family>.<item>` identities are shown for primary Detailed Designs;
- completed primary DDs link to their canonical repository-backed VitePress routes;
- clarification documents are grouped separately and do not receive fictitious primary DD identities;
- planned DD identities may be displayed for orientation and sequencing but shall not link to nonexistent normative documents;
- DD-4 is represented in the rendered taxonomy even though no DD-4 primary specification is yet authored;
- the navigation index is explicitly non-normative and defers to the Project Documentation Guide and canonical Detailed Design register where any discrepancy exists.

## 5. Rendered Family Coverage

| Family | Rendered representation | Authored primary DD coverage |
|---|---|---:|
| DD-1 — Application Core | overview, family sidebar, clarification group | 5 of 5 |
| DD-2 — Shared Capabilities | overview, family sidebar, clarification group | 10 of 10 |
| DD-3 — High-Coupling Domains | overview, family sidebar, planned identities | 1 of 4 |
| DD-4 — Policy and Resource Domains | overview and planned identities | 0 of 4 |

The rendered structure therefore exposes all four approved families while accurately distinguishing current authored state from planned work.

## 6. Validation

The R-8 branch was checked against the repository state established by PR #109.

Validation confirms:

- `docs/.vitepress/config.ts` contains a top-level Detailed Design navigation entry;
- the Detailed Design overview exposes DD-1, DD-2, DD-3, and DD-4;
- every authored DD-1 primary document has a sidebar target;
- every authored DD-2 primary document has a sidebar target;
- DD-2.8 is labelled **Quality Capability** and DD-2.9 is labelled **Documentation Capability**;
- DD-3.1 App Domain has a sidebar target;
- all four migrated clarification documents have sidebar/index targets under their appropriate organisational family;
- no planned DD-3.2 through DD-4.4 entry points to a fabricated normative document;
- the VitePress route paths correspond to existing Markdown files for all linked Detailed Design items;
- no legacy `docs/detailed_design/` route is introduced by the VitePress reconciliation.

The repository does not currently define a dedicated VitePress build script in `package.json`; R-8 therefore validates the navigation configuration structurally rather than changing build tooling as part of this documentation-only work package.

## 7. R-8 Gate

R-8 is complete when:

- the rendered documentation taxonomy agrees with the canonical DD family taxonomy;
- authored primary DDs are navigable from VitePress;
- clarifications are navigable without being misrepresented as primary DDs;
- planned documents are visible without dead links or placeholder normative specifications;
- no legacy flat Detailed Design navigation remains active.

The changes in this work package satisfy those conditions.

## 8. Next Work Package

After this R-8 change is reviewed and merged, proceed to **R-9 — Repository-wide conformance audit**.
