# Template Engine — Architectural Design Specification

**Component:** AppManager Template Engine  
**Specification Type:** Architectural / Design Specification  
**Proposed Documentation Path:** `docs/specification/architecture/template-engine/spec-template-engine-design-v01.md`  
**Proposed Runtime Code:** `app/template-engine/**`  
**Template Definition Repository:** `app_manager/templates/**`  
**Project:** `app-manager`  
**Language:** TypeScript / JSON  
**Status:** Proposed Architecture — Version 1

---

# 1. Executive Summary

AppManager shall replace its existing code-embedded template architecture with a **data-driven Template Engine**.

Under the existing architecture, individual templates are implemented as TypeScript functions under:

```text
app/templates/**
```

Template content, interpolation rules, output naming, defaults, branching behaviour, and composition logic are therefore distributed throughout application source code.

The replacement architecture separates:

```text
Template definitions
        ↓
JSON specification files

Template execution
        ↓
Generic TypeScript Template Engine
```

The Template Engine shall interpret validated JSON template specifications stored under:

```text
app_manager/templates/**
```

A new template shall ordinarily be added by creating a new:

```text
<template-name>.json
```

file rather than creating or modifying TypeScript source code.

This makes templates:

- user-extensible;
- discoverable;
- independently versionable;
- easier to inspect;
- easier to test;
- easier to override;
- independent of application releases;
- substantially less susceptible to duplicated implementation logic.

---

# 2. Architectural Principle

The defining principle of the new architecture is:

> **Template content and declarative generation rules belong in template definition data; the application code should implement only the generic capabilities required to interpret those definitions.**

The architecture must avoid replacing many TypeScript template implementations with equally template-specific TypeScript handlers.

The Template Engine must therefore remain generic.

---

# 3. Current Architecture

The current system can be represented as:

```text
Command / Orchestrator
        │
        ▼
Specific TypeScript Template Function
        │
        ├── hardcoded strings
        ├── hardcoded defaults
        ├── conditionals
        ├── interpolation
        ├── filename assumptions
        └── assembly logic
                │
                ▼
            output file
```

Examples include functions for:

- `package.json`;
- `nuxt.config.ts`;
- `tsconfig.json`;
- `.editorconfig`;
- `.npmrc`;
- `.gitmodules`;
- Vue components;
- TypeScript files;
- source headers;
- README files;
- Vitest configuration;
- environment files.

This architecture makes a template definition inseparable from application implementation.

Adding a template can therefore require:

1. adding TypeScript code;
2. adding template-specific types;
3. updating exports;
4. adding calling logic;
5. recompiling AppManager;
6. releasing a new application version.

That coupling is unnecessary for data-defined templates.

---

# 4. Target Architecture

The replacement architecture shall be:

```text
Command / Orchestrator
        │
        ▼
TemplateResolver
        │
        ▼
TemplateRepository
        │
        ▼
Template Definition JSON
        │
        ▼
TemplateEngine
        │
        ├── validates inputs
        ├── resolves variables
        ├── resolves filename
        ├── resolves reusable parts
        ├── evaluates conditions
        ├── renders content
        └── returns GeneratedArtifact
                │
                ▼
            FileService
                │
                ▼
            output file
```

The individual template no longer has an executable implementation.

It is a declarative specification interpreted by the engine.

---

# 5. Architectural Layers

The new subsystem consists of five principal elements.

## 5.1 Template Definition Repository

Location:

```text
app_manager/templates/**
```

Contains user-editable JSON template specifications.

---

## 5.2 Template Repository Index

Location:

```text
app_manager/templates/template-repository.json
```

Contains repository metadata and optional catalogue/index information.

It must no longer contain the full definitions of every template.

---

## 5.3 Template Repository Service

Proposed code:

```text
app/template-engine/repository/
```

Responsible for:

- discovering definition files;
- loading files;
- validating definitions;
- detecting duplicate IDs;
- indexing templates;
- resolving definition paths;
- optionally caching definitions.

---

## 5.4 Template Engine

Proposed code:

```text
app/template-engine/engine/
```

Responsible for interpreting a validated template definition.

---

## 5.5 Template Resolver

Proposed code:

```text
app/resolvers/templates/
```

Responsible for deciding **which template** applies when several templates or variants are available.

This maintains the architectural distinction:

```text
TemplateResolver
    → which template?

TemplateEngine
    → render the selected template
```

---

# 6. Proposed Source-Code Structure

```text
app/
├── template-engine/
│   ├── engine/
│   │   ├── templateEngine.ts
│   │   ├── expressionEngine.ts
│   │   ├── interpolationEngine.ts
│   │   ├── compositionEngine.ts
│   │   └── outputNameEngine.ts
│   │
│   ├── repository/
│   │   ├── templateRepository.ts
│   │   ├── templateLoader.ts
│   │   └── templateCache.ts
│   │
│   ├── validation/
│   │   ├── templateDefinitionSchema.ts
│   │   ├── templateRepositorySchema.ts
│   │   └── templateContextValidator.ts
│   │
│   ├── types/
│   │   └── templateEngineTypes.ts
│   │
│   └── index.ts
│
└── resolvers/
    └── templates/
        └── templateResolver.ts
```

Not every file is required for the initial implementation. They identify logical responsibilities rather than mandating unnecessary fragmentation.

---

# 7. Proposed Data Repository Structure

Initially:

```text
app_manager/
└── templates/
    ├── template-repository.json
    ├── file-header.json
    ├── package-json.json
    ├── nuxt-config.json
    ├── tsconfig.json
    ├── vue-component.json
    ├── typescript-module.json
    ├── editorconfig.json
    ├── npmrc.json
    ├── pnpm-workspace.json
    ├── gitmodules.json
    ├── readme.json
    ├── env-example.json
    └── ...
```

The repository may later support optional subdirectories:

```text
templates/
├── blocks/
├── nuxt/
├── languages/
├── testing/
├── deployment/
└── licenses/
```

However, lookup must be based on definition metadata rather than physical directory name.

Moving a template file between repository folders must not change its semantic identity.

---

# 8. Template Naming

Every template definition file shall use:

```text
<template-name>.json
```

where `<template-name>` is:

- descriptive;
- self-documenting;
- kebab-case;
- independent from its generated output filename.

Examples:

```text
package-json.json
vue-component.json
typescript-composable.json
file-header.json
nuxt-config.json
vitest-config.json
pnpm-workspace.json
```

The JSON filename identifies the **template specification**.

It does not necessarily identify the published file.

---

# 9. Template Identity

Every template requires a stable logical identity:

```json
{
  "templateId": "nuxt.component.vue"
}
```

`templateId` is the canonical internal identity.

It must not depend upon:

- JSON filename;
- filesystem location;
- display title;
- output filename.

This allows templates to move or be renamed without breaking consumers.

---

# 10. Published Filename

Every file-producing template shall define:

```json
{
  "templatePublishName": "package.json"
}
```

or a pattern:

```json
{
  "templatePublishName": "{{componentName | kebabCase}}.vue"
}
```

Examples:

```text
package.json
nuxt.config.ts
README.md
{{componentName | pascalCase}}.vue
{{composableName | camelCase}}.ts
{{subjectName | kebabCase}}.test.ts
```

The Template Engine shall evaluate `templatePublishName` using the same controlled interpolation mechanism used for content.

---

# 11. Template Kinds

The architecture should distinguish at least:

```text
file
fragment
collection
```

## 11.1 File

Produces one complete file.

```json
{
  "templateKind": "file"
}
```

---

## 11.2 Fragment

Produces reusable content intended for insertion into another template.

Examples:

- file header;
- licence notice;
- import block;
- JSDoc block;
- generated warning;
- revision-history block.

```json
{
  "templateKind": "fragment"
}
```

Fragments normally have:

```json
{
  "templatePublishName": null
}
```

---

## 11.3 Collection

Describes several generated artifacts as one logical scaffold.

Examples:

```text
Nuxt component
    ComponentName.vue
    ComponentName.test.ts

Nuxt layer
    package.json
    nuxt.config.ts
    tsconfig.json
    README.md
```

A collection references templates rather than duplicating their contents.

---

# 12. Template Definition Schema

A representative definition is:

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "nuxt.component.vue",
  "templateName": "Vue Component",
  "description": "Creates a Vue single-file component.",

  "templateVersion": "1.0.0",
  "templateKind": "file",

  "category": "nuxt.component",

  "templatePublishName": "{{componentName | pascalCase}}.vue",

  "format": "text",
  "encoding": "utf-8",

  "variables": {},

  "parts": [],

  "content": "",

  "metadata": {}
}
```

---

# 13. Template Metadata

Recommended metadata:

```json
{
  "metadata": {
    "author": "Steve R Lewis",
    "createdAt": "2026-08-29T00:00:00Z",
    "tags": [
      "nuxt",
      "vue",
      "component"
    ]
  }
}
```

Metadata is descriptive.

It must not be confused with render variables.

---

# 14. Variable Specification

Templates must declare the variables they consume.

Example:

```json
{
  "variables": {
    "componentName": {
      "type": "string",
      "required": true,
      "description": "Logical component name."
    },

    "author": {
      "type": "string",
      "required": false,
      "default": "Unknown"
    },

    "typescript": {
      "type": "boolean",
      "required": false,
      "default": true
    }
  }
}
```

Supported initial variable types should be:

```text
string
number
boolean
array
object
enum
```

---

# 15. Variable Sources

A template specification describes what it requires, not necessarily where the value originates.

Values may be supplied by:

- a command;
- an orchestrator;
- a resolver;
- AppManager settings;
- detected project information;
- system-generated context;
- another template collection.

This preserves separation of concerns.

The Template Engine shall not itself resolve project settings or prompt the user.

---

# 16. Rendering Context

Generation should use a canonical render context.

For example:

```ts
interface TemplateRenderContext {
  values: Record<string, unknown>;
  system: {
    now: Date;
    targetRoot: string;
  };
}
```

Application components resolve the values.

The Template Engine renders them.

---

# 17. Interpolation Syntax

A single interpolation syntax should apply to:

- template content;
- publish filenames;
- fragment parameters;
- conditional expressions where appropriate.

Recommended syntax:

```text
{{variable}}
```

Examples:

```text
{{projectName}}
{{author}}
{{componentName}}
```

Transformers may be expressed as:

```text
{{componentName | pascalCase}}
{{componentName | camelCase}}
{{componentName | kebabCase}}
{{name | upperCase}}
```

---

# 18. Controlled Transformation Functions

The Template Engine should expose an explicit whitelist of transformations.

Initial candidates:

```text
camelCase
pascalCase
kebabCase
snakeCase
lowerCase
upperCase
trim
json
quote
indent
```

Arbitrary JavaScript execution must not be supported.

A `.json` template specification is declarative data and shall never become an arbitrary code-execution mechanism.

---

# 19. File Content Parts

The architecture shall explicitly support reusable file-content fragments.

Example:

```json
{
  "parts": [
    {
      "template": "block.file-header",
      "with": {
        "projectName": "{{projectName}}",
        "filePath": "{{templatePublishName}}",
        "author": "{{author}}"
      }
    },
    {
      "content": "\n"
    },
    {
      "content": "export default defineNuxtConfig({\n})\n"
    }
  ]
}
```

This makes the existing header template a reusable fragment instead of a hardcoded TypeScript function.

---

# 20. Fragment Composition

Fragments shall be resolved by `templateId`.

For example:

```json
{
  "templateId": "block.file-header",
  "templateKind": "fragment"
}
```

A consuming template can then reference:

```json
{
  "template": "block.file-header"
}
```

The engine must detect:

- missing fragments;
- recursive references;
- cyclic composition;
- incompatible parameters.

---

# 21. Content Representation

Simple templates may use:

```json
{
  "content": "shamefully-hoist=true\n"
}
```

More complex templates should use ordered parts:

```json
{
  "parts": [
    {
      "content": "..."
    },
    {
      "template": "..."
    }
  ]
}
```

`content` and `parts` should be mutually exclusive for the root rendering body unless the schema defines explicit concatenation semantics.

---

# 22. Structured Content

Not all files should be treated as raw interpolated strings.

The engine should eventually support render formats such as:

```text
text
json
yaml
toml
```

A JSON-producing template could declare:

```json
{
  "format": "json",
  "document": {
    "name": "{{packageName}}",
    "version": "{{version}}",
    "private": true
  }
}
```

The engine would interpolate values and then serialize valid JSON.

This is safer than constructing JSON as text.

---

# 23. Format Renderers

The Template Engine should use pluggable renderers internally:

```text
TemplateEngine
    │
    ├── TextRenderer
    ├── JsonRenderer
    ├── YamlRenderer
    └── TomlRenderer
```

These are internal engine strategies, not one renderer per template.

This is a legitimate code-level Strategy pattern because the strategies correspond to **formats**, not individual templates.

---

# 24. Conditional Content

Template definitions require limited declarative conditions.

For example:

```json
{
  "when": {
    "variable": "standalone",
    "equals": true
  }
}
```

A part may therefore be:

```json
{
  "when": {
    "variable": "standalone",
    "equals": true
  },
  "content": "\"dev\": \"nuxt dev\""
}
```

Initial condition operations should be intentionally limited:

```text
equals
notEquals
exists
notExists
truthy
falsy
includes
```

No arbitrary JavaScript expressions.

---

# 25. Iteration

Some current templates render collections such as:

- workspace packages;
- Git submodules;
- dependency lists.

The schema therefore needs declarative iteration.

Example:

```json
{
  "forEach": {
    "source": "modules",
    "item": "module"
  },
  "content": "[submodule \"{{module.name}}\"]\n\tpath = {{module.path}}\n\turl = {{module.url}}\n"
}
```

The engine provides generic iteration rather than implementing `.gitmodules` logic directly.

---

# 26. Template Collections

A collection can define:

```json
{
  "templateId": "nuxt.component.with-test",
  "templateKind": "collection",

  "templates": [
    {
      "template": "nuxt.component.vue"
    },
    {
      "template": "nuxt.component.test"
    }
  ]
}
```

The engine returns multiple `GeneratedArtifact` objects.

File writing remains outside the rendering engine.

---

# 27. Generated Artifact

The primary engine output should be:

```ts
interface GeneratedArtifact {
  templateId: string;
  templateVersion: string;

  publishName: string | null;
  relativePath?: string;

  content: string;
  encoding: 'utf-8';

  format: TemplateFormat;
}
```

The engine returns content.

`FileService` performs filesystem operations.

---

# 28. No Direct File I/O in the Rendering Engine

The Template Engine should not write generated files itself.

Preferred flow:

```text
TemplateEngine.render()
        ↓
GeneratedArtifact
        ↓
Orchestrator
        ↓
FileService.write()
```

This provides:

- dry-run support;
- preview;
- testing;
- collision detection;
- comparison with existing files;
- transactional workflows.

---

# 29. Repository Discovery

The Template Repository must discover:

```text
app_manager/templates/**/*.json
```

excluding reserved repository-control files such as:

```text
template-repository.json
```

Discovery should be recursive.

Consequently, a user may add:

```text
app_manager/templates/my-custom-template.json
```

and have it discovered without changing application code.

---

# 30. Repository Index Redesign

`template-repository.json` shall cease storing template bodies.

Its new purpose is repository-level metadata and optional indexing/configuration.

Recommended structure:

```json
{
  "schemaVersion": "2.0.0",

  "repository": {
    "id": "app-manager.default",
    "name": "AppManager Default Template Repository",
    "description": "Default templates supplied with AppManager.",
    "version": "1.0.0"
  },

  "discovery": {
    "include": [
      "**/*.json"
    ],
    "exclude": [
      "template-repository.json"
    ]
  }
}
```

Optionally, after discovery, the application may maintain an in-memory catalogue.

The JSON repository file does not need to duplicate data already present in the definition files.

---

# 31. Repository Index Philosophy

The filesystem should be the authoritative list of available definition files.

This avoids the maintenance problem:

```text
new-template.json exists
but
template-repository.json wasn't updated
```

Therefore:

> **Template discovery should not require manual registration in `template-repository.json`.**

The repository metadata file controls discovery; it does not enumerate every definition unless there is a specific future requirement for explicit registration.

---

# 32. User-Defined Templates

Users shall be able to add a valid JSON specification to:

```text
app_manager/templates/
```

without:

- modifying TypeScript;
- updating an export;
- changing a registry;
- rebuilding AppManager.

At startup or first template access, the repository service discovers and validates the file.

---

# 33. Schema Validation

Every template must be validated against a runtime schema before use.

Zod is appropriate because it is already used elsewhere in AppManager.

Invalid templates shall never reach the renderer.

Example error:

```text
Invalid template definition:
app_manager/templates/vue-component.json

templatePublishName:
Required for templateKind "file".

variables.componentName.type:
Unsupported type "textValue".
```

---

# 34. Template Schema Versioning

Every definition contains:

```json
{
  "schemaVersion": "1.0.0"
}
```

This is the version of the **definition language**.

It is distinct from:

```json
{
  "templateVersion": "2.3.0"
}
```

which represents the version of that individual template.

This distinction is important.

---

# 35. Definition Compatibility

The loader should reject unsupported major schema versions.

For example:

```text
Engine supports schema 1.x
Template requests schema 2.0.0
→ incompatible definition error
```

Minor compatible extensions may be accepted according to semantic-versioning rules.

---

# 36. Template Versioning

Each template should contain:

```json
{
  "templateVersion": "1.0.0"
}
```

This enables future functionality such as:

- identifying which template version generated a file;
- migrations;
- template updates;
- reproducible scaffolding;
- template repositories from external sources.

---

# 37. Template Override Architecture

A future repository precedence model may support:

```text
project template repository
        ↓
user template repository
        ↓
AppManager built-in template repository
```

Resolution should be based on `templateId`.

This should be implemented by `TemplateResolver`, not hardcoded into the renderer.

The initial version need only support the built-in repository while preserving this extensibility.

---

# 38. Security

Template JSON files are potentially user-controlled.

Therefore the engine must not support:

- `eval`;
- `Function()`;
- shell execution;
- dynamic imports from template definitions;
- arbitrary filesystem reads;
- arbitrary filesystem writes;
- arbitrary Node.js expressions.

Templates may describe output.

They must not execute application code.

---

# 39. Path Security

`templatePublishName` and any generated relative path must be normalized and validated.

A definition must not be able to publish to:

```text
../../outside-project
```

unless a caller has explicitly authorized an external output root.

Path traversal must be rejected.

---

# 40. Separation from FileService

Template Engine:

```text
generate content
```

FileService:

```text
read/write/update files
```

Template orchestrator:

```text
decide when and where generated artifacts are persisted
```

These responsibilities must remain separate.

---

# 41. Separation from Resolvers

Template Resolver:

```text
which template?
```

Settings Resolver:

```text
which values?
```

Template Engine:

```text
render selected template with resolved values
```

This yields:

```text
Command
   │
   ├── TemplateResolver
   ├── SettingsResolver
   │
   ▼
Orchestrator
   │
   ▼
TemplateEngine
   │
   ▼
GeneratedArtifact
   │
   ▼
FileService
```

---

# 42. Separation from Strategies

Strategies operate on **existing files**.

The Template Engine creates new content.

Therefore:

```text
Template Engine
    → create

Strategy
    → inspect / modify
```

A workflow may use both, but the architecture must not merge them.

---

# 43. Existing Header Function Migration

The existing file-header generator becomes:

```text
app_manager/templates/file-header.json
```

with:

```json
{
  "templateId": "block.file-header",
  "templateKind": "fragment"
}
```

Dynamic date/time fields should be supplied by controlled engine system variables such as:

```text
{{system.date}}
{{system.time}}
{{system.timestamp}}
```

or explicitly supplied render context.

No template-specific TypeScript function should remain necessary.

---

# 44. System Variables

The engine may expose a restricted system namespace.

For example:

```text
system.date
system.time
system.timestamp
system.year
```

These are engine-owned computed values.

They must be documented and deterministic relative to the render invocation.

For testing, the caller must be able to supply/freeze the engine clock.

---

# 45. Existing Duplicate Templates

The migration provides the opportunity to eliminate documented duplication.

Instead of maintaining:

```text
project/packageJsonTemplate.ts
layer/packageJsonTemplate.ts
```

the repository can contain:

```text
package-json.json
```

with variables such as:

```text
target
standalone
```

and declarative conditions.

Likewise, duplicate `.editorconfig`, `.npmrc`, `.nuxtrc`, `.gitmodules`, and Vitest implementations can be replaced by canonical definitions.

---

# 46. Licences

Licence generation should be treated carefully.

A licence can still be represented as a template definition, but canonical legal text should preferably be stored verbatim rather than reconstructed by complex interpolation.

Example:

```text
mit-license.json
apache-2-license.json
gpl-3-license.json
```

Only explicitly permitted fields such as copyright year and holder should be interpolated.

The migration must not preserve the known incomplete GPL implementation from the current TypeScript template architecture.

---

# 47. Testing Philosophy

The new architecture permits three separate categories of tests.

## Engine Tests

Test generic language features:

- interpolation;
- conditions;
- loops;
- composition;
- transformations;
- filename rendering.

## Schema Tests

Test:

- malformed definitions;
- missing required fields;
- invalid combinations;
- incompatible schema versions.

## Template Contract Tests

Load every `.json` definition in the repository and verify:

- it validates;
- required fixture contexts render;
- expected filename is generated;
- content has expected structural characteristics.

Individual templates no longer require bespoke TypeScript unit tests.

---

# 48. Repository-Wide Validation

A dedicated operation should support:

```text
validate all templates
```

It shall discover every definition and report all failures rather than stopping after the first one.

This should eventually be exposed through AppManager's quality tooling.

---

# 49. Dry Run and Preview

Because rendering returns `GeneratedArtifact` rather than writing directly, callers can implement:

```text
preview
dry-run
diff
validate
generate
```

without changing template definitions.

---

# 50. Migration Strategy

Migration should occur incrementally.

## Phase 1 — Engine Foundation

Implement:

- schemas;
- repository discovery;
- loader;
- text interpolation;
- filename interpolation;
- fragment composition;
- conditions;
- loops;
- generated-artifact model.

## Phase 2 — Simple Templates

Migrate:

```text
.editorconfig
.npmrc
.nuxtrc
```

These provide low-risk validation of the architecture.

## Phase 3 — Composite Templates

Migrate:

```text
file-header
nuxt-config
vue-component
typescript
readme
```

## Phase 4 — Structured Templates

Migrate:

```text
package.json
tsconfig.json
```

using the structured JSON renderer.

## Phase 5 — Repository Migration

Split the current monolithic:

```text
template-repository.json
```

into individual definition files.

## Phase 6 — Remove Legacy TypeScript Templates

Only after consumers have migrated and parity tests pass:

```text
app/templates/**
```

is removed.

---

# 51. Backward Compatibility

During migration, a temporary adapter may expose the old functional interface.

Example:

```ts
async function packageJsonTemplate(
  context: PackageJsonContext,
): Promise<string> {
  const result = await templateEngine.render(
    'nuxt.package-json',
    context,
  );

  return result.content;
}
```

This permits command migration independently from template migration.

The adapter is transitional and should ultimately be removed.

---

# 52. Documentation Relocation

Existing specifications under:

```text
docs/specification/architecture/templates/
```

describe the legacy code-embedded Templates layer.

The new canonical documentation should live under:

```text
docs/specification/architecture/template-engine/
```

Recommended files:

```text
spec-template-engine-design-v01.md
spec-template-engine-functional-v01.md
```

The existing template audit documents should be retained as historical migration/audit references rather than silently deleted.

---

# 53. Architectural Boundary

The fundamental classification test becomes:

> Does this information describe a particular generated artifact, or does it implement a generic capability required to render every artifact?

If it describes a particular artifact, it belongs in:

```text
app_manager/templates/*.json
```

If it implements generic rendering capability, it belongs in:

```text
app/template-engine/**
```

For example:

```text
"package.json is called package.json"
    → template data

"component files use {{componentName}}.vue"
    → template data

"replace {{name}} with a context value"
    → engine code

"pascalCase is an allowed transform"
    → engine code

"iterate over modules"
    → engine capability

"this template iterates over modules"
    → template data
```

---

# 54. Canonical Definition

Within AppManager:

> **The Template Engine is a generic, data-driven rendering subsystem that discovers, validates, composes and renders declarative JSON template specifications into deterministic generated artifacts without embedding template-specific content or behaviour in application source code.**

The JSON template repository is therefore the source of truth for **what is generated**.

The Template Engine is the source of truth for **how declarative template specifications are interpreted**.