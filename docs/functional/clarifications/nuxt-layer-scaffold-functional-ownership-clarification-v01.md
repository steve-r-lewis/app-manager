# Nuxt Layer Scaffold Functional Ownership Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** Nuxt Functional Specification, especially FR-NUXT-051 through FR-NUXT-070
>
> **Related downstream refinement:** DD-2.10 Nuxt Capability and Nuxt Layer Scaffold Artefact Ownership Clarification
>
> **Normative scope:** Functional ownership of Nuxt layer-creation orchestration and scaffold artefact classes

## 1. Purpose

This clarification removes an authority-direction ambiguity in the Nuxt Functional Specification. Functional semantics must be complete at Functional level and must not depend on a Detailed Design clarification for their meaning.

## 2. Canonical Functional Rule

For Version 1, Nuxt layer creation is a `nuxt`-domain use case with orchestration ownership over the requested Nuxt layer baseline.

That ownership includes:

- selecting the supported layer-creation profile;
- determining which artefact classes the selected profile requires;
- coordinating the creation workflow; and
- determining whether the resulting layer satisfies the Nuxt-specific Functional creation contract.

It does **not** transfer permanent semantic ownership of every participating artefact class to the `nuxt` domain.

Where package metadata, documentation, licence material, environment/settings material, repository work, source transformation or another artefact concern has an independently governed Functional owner, the Nuxt layer-creation workflow must preserve that ownership while coordinating the required result.

## 3. FR-NUXT-058 and FR-NUXT-059 Reading

FR-NUXT-058 is itself the Functional authority for the distinction between Nuxt scaffold/profile inclusion and independent artefact semantic ownership.

FR-NUXT-059 establishes that exact filenames, template functions, source text and concrete rendering/persistence mechanisms belong below Functional level.

Accordingly, the sentence in §11.1 stating that the “canonical detailed delegation model” is defined by a Detailed Design clarification shall be read only as a downstream refinement reference. It does not make FR-NUXT-058/059 dependent on that Detailed Design document for normative meaning.

## 4. Downstream Refinement

Detailed Design may refine how the Functional ownership rule is realised across Nuxt Capability, documentation, settings/resource, registry/template, repository, source-transformation and resource-access boundaries.

The existing Nuxt Layer Scaffold Artefact Ownership Clarification remains a valid Detailed Design refinement only insofar as it conforms to the Functional rule stated here.

## 5. Non-Effect

This clarification does not change the Version 1 artefact catalogue, add or remove a layer profile, alter App/Nuxt use-case ownership, or create new capability/provider topology. It corrects hierarchy direction only.