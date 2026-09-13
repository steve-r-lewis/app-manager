# AppManager App / Settings Environment-Definition Ownership Clarification

> **Status:** Version 1 Functional Specification clarification
>
> **Clarifies:** `app-functional-specification-v01.md` `FR-APP-013`–`FR-APP-018` and `settings-functional-specification-v01.md` `FR-SET-058`–`FR-SET-071`
>
> **Normative role:** This document clarifies the cross-domain ownership and delegation seam for persisted managed-project environment definitions. It does not create a third environment-management domain, redefine Configuration authority, or prescribe implementation topology.

---

## 1. Purpose

The App Functional Specification permits existing-application initialisation to create a missing local environment artefact from an established project example. The Settings Functional Specification separately owns retained create/read/update/delete behaviour for managed-project environment-variable definitions, including creation from an approved example/default source.

These requirements describe a composed use case, not two independent owners of persisted environment-definition semantics.

The governing rule is:

> **App owns the higher-level intent to initialise an existing managed application; Settings owns the persisted environment-definition operation used to satisfy the environment portion of that lifecycle intent.**

---

## 2. Canonical Ownership

### 2.1 App ownership

The `app` domain owns:

- the user/automation intent to initialise an existing managed root application;
- whether environment-definition readiness is a required or applicable lifecycle step for that initialisation;
- sequencing that step with dependency readiness and other App-owned lifecycle preparation;
- interpretation of the delegated Settings result in the context of the overall initialisation use case;
- reporting remaining user action, including unresolved required sensitive values;
- final App initialisation success, failure or partial-success semantics under the common outcome contract.

App does **not** thereby own a second environment-definition CRUD contract.

### 2.2 Settings ownership

The `settings` domain owns persisted managed-project environment-definition semantics, including:

- identification of the selected supported environment definition/source;
- create/read/update/delete intent for that definition;
- creation from an approved example/default source where requested and permitted;
- existing-definition protection;
- environment-key/value mutation semantics;
- preservation of unrelated supported content where practical;
- environment syntax handling;
- sensitive-value presentation/redaction rules applicable to Settings results;
- the Settings-level result describing whether the requested environment-definition operation was satisfied.

Settings does not acquire App lifecycle sequencing or final initialisation authority merely because App delegates an environment step to it.

### 2.3 Configuration remains separate

Persisted environment definitions may supply configuration candidates, but neither App nor Settings may redefine candidate applicability, precedence, provenance or effective-value construction owned by the Configuration Functional Specification.

Creating a persisted environment definition therefore does not by itself establish that the resulting values are the effective runtime configuration.

---

## 3. Delegation Contract

When existing-application initialisation determines that a missing local environment definition should be created from an established project example, the semantic flow is:

```text
App existing-application initialisation
        |
        | determines lifecycle need and approved target/example context
        v
Settings-owned environment-definition create operation
        |
        | validates target/source and existing-definition protection
        | delegates bounded resource/template/transformation mechanics as required
        v
Settings environment-operation result/evidence
        |
        v
App initialisation interpretation / aggregation
        |
        v
final App initialisation outcome
```

### FCL-APPSET-001 — Delegation, not duplicated ownership

`FR-APP-016` shall be interpreted as App orchestration of the Settings-owned create-environment-definition behaviour. App shall not implement an independent competing environment-definition authority merely because the creation occurs during initialisation.

### FCL-APPSET-002 — App supplies lifecycle context

The App use case shall supply or resolve enough governed context to identify the managed project, intended environment definition and approved example/default source. Settings shall not infer broader App lifecycle scope from filesystem discoverability.

### FCL-APPSET-003 — Settings protection semantics apply

When App delegates environment-definition creation, `FR-SET-059`–`FR-SET-061` and the applicable Settings validation, preservation and sensitive-information requirements remain authoritative for the persisted environment operation.

### FCL-APPSET-004 — Existing definition remains protected

`FR-APP-018` and `FR-SET-061` express the same cross-domain safety outcome at different use-case levels. The Settings-owned create operation enforces existing-definition protection; App consumes that result and shall not bypass it through an alternate file-copy path.

### FCL-APPSET-005 — No secret fabrication

`FR-APP-017` remains an App initialisation acceptance constraint: initialisation shall not claim a fully configured environment by inventing missing secrets. Settings may create or manage the persisted definition only from approved supplied/example/default values and shall preserve its own sensitive-value rules.

### FCL-APPSET-006 — Mechanics remain delegated

Neither functional domain acquires ownership of generic persistence, template rendering or structured-source transformation mechanics. Those remain delegated through the applicable shared capability contracts at Detailed Design.

### FCL-APPSET-007 — Delegated success is not App success

A successful Settings environment-definition operation is evidence for App initialisation. App remains responsible for deciding whether the overall initialisation intent completed, partially completed or still requires user action.

---

## 4. Non-Goals

This clarification does not require:

- App and Settings to be separate runtime processes, packages, classes or services;
- a new shared `EnvironmentService` or generic environment-definition framework;
- a particular `.env` filename or example filename;
- a particular parser, serializer, filesystem API or template provider;
- Settings to invoke App or App to access Settings provider internals;
- environment-definition persistence to become Configuration Resolution;
- copying secrets from uncontrolled ambient process state;
- creation to overwrite an existing environment definition.

The implementation may choose any topology that preserves the semantic ownership and delegation contract above.

---

## 5. Conformance Invariants

A conforming Version 1 design shall preserve all of the following:

1. App owns existing-application initialisation intent and lifecycle acceptance.
2. Settings owns persisted environment-definition CRUD semantics.
3. App initialisation uses the Settings-owned environment operation rather than creating a second environment-definition authority.
4. Existing environment definitions are not silently overwritten by the create path.
5. Missing secrets are not fabricated to satisfy App initialisation.
6. Persisted environment management does not redefine effective-configuration precedence or runtime interpretation.
7. Generic resource/template/transformation mechanics remain below the functional ownership boundary.
8. Delegated Settings success does not automatically establish overall App initialisation success.
9. No concrete service/package/process topology is mandated by this clarification.

---

## 6. Final Position

The apparent overlap is resolved by distinguishing **orchestration ownership** from **persisted-resource semantic ownership**:

> **App may require an environment definition as part of existing-application initialisation; Settings performs and owns the environment-definition management operation; App interprets that result as one step of the lifecycle use case.**

This preserves one semantic owner for environment-definition CRUD while allowing App to compose that behaviour without surrendering application-lifecycle authority.
