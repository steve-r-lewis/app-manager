# AppManager Template Engine — Architectural Design Specification

**Component:** Template Engine  
**Specification Type:** Architectural / Design Specification  
**Documentation Path:** `docs/specification/architecture/template-engine/spec-template-engine-design-v02.md`  
**Runtime Code:** `app/template-engine/**`  
**Template Repository:** `app_manager/templates/**`  
**Project:** `app-manager`  
**Language:** TypeScript / JSON  
**Specification Version:** 2.0.0  
**Status:** Proposed Canonical Architecture

---

# 1. Purpose

This specification defines the architecture, responsibilities, boundaries, data model and design principles of the AppManager Template Engine.

The Template Engine replaces the previous architecture in which individual scaffolding templates were substantially embedded in TypeScript source code.

The new architecture separates:

1. **template-specific data and declarative generation rules**, which belong in JSON template definition files; from
2. **generic template-processing behaviour**, which belongs in reusable TypeScript Template Engine code.

The principal architectural objective is to allow templates to be added, removed, updated and organised without requiring corresponding changes to application source code.

The Template Engine shall discover valid template definition files dynamically from the AppManager template repository:

```text
app_manager/templates/**
```

A user, developer or another AppManager subsystem shall therefore be able to add a valid template definition to the repository without registering a new TypeScript template function.

---

# 2. Canonical Definition

The AppManager Template Engine is:

> **A generic, data-driven rendering subsystem that discovers, validates, composes and renders declarative JSON template specifications into deterministic generated artifacts without embedding template-specific content or behaviour in application source code.**

The JSON template repository is the source of truth for:

> **what is generated.**

The Template Engine implementation is the source of truth for:

> **how declarative template specifications are interpreted.**

---

# 3. Architectural Principles

The Template Engine shall be designed around the following principles.

## 3.1 Template Data Is Not Application Code

Template-specific:

- file contents;
- file names;
- file-name patterns;
- variables;
- defaults;
- reusable fragments;
- conditional blocks;
- repeated blocks;
- structured document definitions;
- template metadata;
- template composition;

shall be represented declaratively wherever practical.

Application source code shall not contain one implementation function per template.

---

## 3.2 Generic Capabilities Belong in the Engine

Application source code may implement reusable capabilities required by many templates, including:

- template discovery;
- schema validation;
- interpolation;
- controlled string transforms;
- conditions;
- iteration;
- fragment composition;
- filename resolution;
- structured-format serialization;
- template caching;
- rendering diagnostics.

A capability belongs in source code only when it is generic rather than specific to one generated artifact.

---

## 3.3 No Arbitrary Code Execution

Template definitions are data.

They must not become an alternative application scripting environment.

The Template Engine shall not permit template definitions to execute arbitrary:

- JavaScript;
- TypeScript;
- shell commands;
- Node.js expressions;
- filesystem operations;
- dynamic imports;
- `eval`;
- `Function` constructors.

---

## 3.4 Deterministic Rendering

For a fixed:

- template definition;
- render context;
- supplied system clock;
- Template Engine version;

the Template Engine should produce the same output.

Network access, prompts, environment discovery and external service calls shall not occur during template rendering.

---

## 3.5 Rendering Is Separate from Persistence

The Template Engine generates artifacts.

It does not write those artifacts to their final destination.

The canonical boundary is:

```text
TemplateEngine.render()
        ↓
GeneratedArtifact[]
        ↓
Orchestrator / Caller
        ↓
FileService
        ↓
Filesystem
```

This separation permits:

- dry runs;
- previews;
- comparisons;
- diffs;
- collision detection;
- transactional workflows;
- user confirmation;
- alternative output targets.

---

# 4. Architectural Boundary

The primary boundary question is:

> **Does this information describe a particular generated artifact, or implement a generic capability required to render many different artifacts?**

If it describes a particular artifact, it belongs in:

```text
app_manager/templates/**
```

If it implements generic template interpretation, it belongs in:

```text
app/template-engine/**
```

Examples:

| Concern | Ownership |
|---|---|
| Contents of `.editorconfig` | Template definition |
| Structure of a Nuxt config template | Template definition |
| Vue component filename pattern | Template definition |
| MIT licence legal text | Licence template definition |
| `camelCase` conversion | Template Engine |
| Variable interpolation | Template Engine |
| `forEach` support | Template Engine |
| JSON serialization | Template Engine |
| Template discovery | Template Engine |
| File writing | FileService / orchestrator |
| Prompting for missing values | Resolver / interaction layer |
| Fetching licence text from OSI | Licence Engine |

---

# 5. Relationship to Commands, Resolvers, Orchestrators and Services

The Template Engine occupies a lower-level application capability boundary.

The preferred dependency direction is:

```text
User / CI
    ↓
Interactive / Headless Mode
    ↓
Command
    ↓
Orchestrator
    ├── Resolver
    ├── Service
    ├── TemplateResolver
    │       ↓
    │   TemplateRepository
    │       ↓
    │   TemplateEngine
    │
    └── FileService
```

The Template Engine shall not determine application workflow.

---

# 6. Template Resolver Boundary

A Template Resolver determines:

> **Which template should be used?**

The Template Engine determines:

> **How should the selected template be rendered?**

For example:

```text
TemplateResolver
    ↓
"nuxt.component.vue"
    ↓
TemplateEngine.render(...)
```

The Template Engine shall not infer a requested template from vague user intent.

---

# 7. Settings Resolver Boundary

A Settings Resolver or domain resolver may determine:

- author;
- package manager;
- default licence;
- organisation;
- repository name;
- default branch;
- provider;
- project configuration.

The Template Engine receives resolved values.

It does not itself:

- read application settings;
- prompt the user;
- inspect Git configuration;
- query GitHub;
- call LLM services;
- infer project configuration.

---

# 8. Strategy Boundary

Strategies understand and modify existing source code.

Templates create new content.

The preferred distinction is:

```text
Template Engine
    → create a new artifact from declarative data

Strategy
    → understand or modify an existing artifact
```

A workflow may use both.

---

# 9. FileService Boundary

The Template Engine does not perform final filesystem persistence.

It may validate a requested output path, but actual file creation belongs to the FileService or another caller-controlled persistence layer.

---

# 10. Runtime Code Placement

Executable Template Engine code shall reside under:

```text
app/template-engine/
```

Recommended logical structure:

```text
app/
└── template-engine/
    ├── engine/
    │   ├── templateEngine.ts
    │   ├── interpolationEngine.ts
    │   ├── expressionEngine.ts
    │   ├── compositionEngine.ts
    │   └── outputNameEngine.ts
    │
    ├── repository/
    │   ├── templateRepository.ts
    │   ├── templateLoader.ts
    │   └── templateCache.ts
    │
    ├── renderers/
    │   ├── textRenderer.ts
    │   ├── jsonRenderer.ts
    │   ├── yamlRenderer.ts
    │   └── tomlRenderer.ts
    │
    ├── validation/
    │   ├── templateDefinitionSchema.ts
    │   ├── templateRepositorySchema.ts
    │   └── templateContextValidator.ts
    │
    ├── transforms/
    │   └── templateTransforms.ts
    │
    ├── types/
    │   └── templateEngineTypes.ts
    │
    └── index.ts
```

This structure expresses responsibilities.

It is not a requirement that Version 1 implementation create a separate source file for every listed concern.

---

# 11. Template Data Placement

Template definitions shall reside under:

```text
app_manager/templates/
```

Recommended organisation:

```text
app_manager/
└── templates/
    ├── template-repository.json
    │
    ├── blocks/
    │   ├── file-header.json
    │   ├── generated-warning.json
    │   └── revision-history.json
    │
    ├── configuration/
    │   ├── editorconfig.json
    │   ├── npmrc.json
    │   └── nuxtrc.json
    │
    ├── nuxt/
    │   ├── nuxt-config.json
    │   ├── app-config.json
    │   ├── vue-component.json
    │   └── composable.json
    │
    ├── package/
    │   ├── package-json.json
    │   └── pnpm-workspace.json
    │
    ├── testing/
    │   ├── vitest-config.json
    │   └── unit-test.json
    │
    ├── documentation/
    │   └── readme.json
    │
    └── licenses/
        ├── mit-license.json
        ├── apache-2-0-license.json
        ├── gpl-3-0-license.json
        └── ...
```

Subdirectories are organisational only.

Template identity shall not depend upon the physical directory structure.

---

# 12. Template Repository Descriptor

The root file:

```text
app_manager/templates/template-repository.json
```

shall describe the repository rather than contain all template definitions.

Recommended structure:

```json
{
  "schemaVersion": "2.0.0",
  "repository": {
    "id": "app-manager.default",
    "name": "AppManager Default Template Repository",
    "description": "Default template repository supplied with AppManager.",
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

---

# 13. Filesystem Discovery Is Authoritative

The Template Repository shall not require every template to be manually registered inside `template-repository.json`.

The filesystem is the authoritative list of available definitions.

The repository descriptor controls:

- repository identity;
- repository metadata;
- discovery patterns;
- exclusions;
- future repository-wide policies.

This prevents the invalid state:

```text
new-template.json exists
        +
repository index was not updated
        ↓
template silently unavailable
```

---

# 14. Recursive Discovery

Template discovery shall support:

```text
app_manager/templates/**/*.json
```

subject to repository exclusions.

This includes:

```text
app_manager/templates/licenses/*.json
```

Licence templates are therefore ordinary Template Repository entries from the Template Engine's perspective.

Their specialised lifecycle is described later in this specification.

---

# 15. Stable Template Identity

Every template shall define a stable semantic identifier.

Example:

```json
{
  "templateId": "nuxt.component.vue"
}
```

Template identity shall not depend on:

- filename;
- directory;
- display name;
- output filename;
- title.

A template may therefore be reorganised physically without changing API callers.

---

# 16. Template File Naming

Template definition filenames should be:

- descriptive;
- self-documenting;
- kebab-case;
- suffixed with `.json`.

Examples:

```text
vue-component.json
package-json.json
file-header.json
mit-license.json
vitest-config.json
```

The definition filename is not necessarily the same as the generated filename.

---

# 17. Template Publish Name

The generated artifact name is specified using:

```json
{
  "templatePublishName": "package.json"
}
```

or a filename pattern:

```json
{
  "templatePublishName": "{{componentName | pascalCase}}.vue"
}
```

Examples include:

```text
package.json
nuxt.config.ts
README.md
LICENSE
{{componentName | pascalCase}}.vue
{{composableName | camelCase}}.ts
{{subjectName | kebabCase}}.test.ts
```

---

# 18. Template Publish Path

A template may optionally define a relative publication path.

Example:

```json
{
  "templatePublishPath": "components"
}
```

The final path would conceptually be:

```text
components/{{componentName | pascalCase}}.vue
```

Path traversal shall be rejected.

---

# 19. Template Kinds

The initial Template Engine shall recognise three conceptual template kinds:

```text
file
fragment
collection
```

---

# 20. File Templates

A `file` template produces one generated artifact.

Example:

```json
{
  "templateKind": "file",
  "templatePublishName": "nuxt.config.ts"
}
```

---

# 21. Fragment Templates

A `fragment` template produces reusable content intended to be composed into another template.

Examples:

- file header;
- generated-file warning;
- copyright block;
- import block;
- JSDoc block;
- revision history.

A fragment normally has:

```json
{
  "templatePublishName": null
}
```

Fragments do not independently write files.

---

# 22. Collection Templates

A `collection` template references multiple other templates.

Example:

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

Collections support compound scaffolding while preventing duplicated content definitions.

---

# 23. Canonical Template Definition Shape

Representative definition:

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
  "metadata": {},
  "content": ""
}
```

---

# 24. Schema Version and Template Version

The following concepts are distinct.

## 24.1 `schemaVersion`

The version of the Template Definition Language.

Example:

```json
{
  "schemaVersion": "1.0.0"
}
```

## 24.2 `templateVersion`

The version of the individual template.

Example:

```json
{
  "templateVersion": "2.1.0"
}
```

A new Template Engine schema does not imply every template has changed.

A changed template does not imply the Template Engine schema has changed.

---

# 25. Unsupported Schema Versions

The engine shall reject unsupported major schema versions.

Example:

```text
engine supports 1.x
definition declares 2.0.0
        ↓
TEMPLATE_SCHEMA_UNSUPPORTED
```

Minor backwards-compatible schema evolution may be supported according to implementation policy.

---

# 26. Variables

Templates shall declare expected variables.

Example:

```json
{
  "variables": {
    "componentName": {
      "type": "string",
      "required": true,
      "description": "Logical component name."
    },
    "typescript": {
      "type": "boolean",
      "required": false,
      "default": true
    }
  }
}
```

---

# 27. Initial Variable Types

Initial supported types should include:

```text
string
number
boolean
array
object
enum
```

Additional types may be introduced through schema evolution.

---

# 28. Variable Sources

Variable values may originate from:

- command options;
- orchestrators;
- settings resolvers;
- domain resolvers;
- project inspection;
- detected environment information;
- collection context;
- system context.

The Template Engine itself shall not determine those external values.

---

# 29. Variable Resolution Precedence

Inside the Template Engine:

```text
explicit render context
        ↓
template-defined default
        ↓
missing
```

The Template Engine shall not automatically query other application systems to fill missing values.

---

# 30. Required Variables

A missing required variable shall cause rendering to fail.

It shall not become:

```text
undefined
null
""
```

unless the template definition explicitly permits that representation.

---

# 31. Optional Variables

An optional variable may be absent.

However, direct interpolation of an absent optional variable in strict rendering mode shall be treated as an error unless the template provides suitable conditional handling or a default.

---

# 32. Render Context

Representative runtime context:

```ts
export interface TemplateRenderContext {
  values: Record<string, unknown>;

  system: {
    now: Date;
    targetRoot: string;
  };
}
```

The system object may be expanded carefully in future versions.

---

# 33. System Variables

The Template Engine may expose controlled system values such as:

```text
system.date
system.time
system.timestamp
system.year
```

These values must derive from the render clock.

Tests shall be able to supply a fixed clock to preserve determinism.

---

# 34. Interpolation Syntax

The canonical interpolation form is:

```text
{{variable}}
```

Nested values may use dot notation:

```text
{{package.name}}
{{author.email}}
```

---

# 35. Controlled Transforms

Interpolation may apply whitelisted transforms:

```text
{{componentName | pascalCase}}
{{componentName | kebabCase}}
{{name | trim}}
```

Initial transform set should include:

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

---

# 36. Transform Safety

Transforms shall be implemented by the Template Engine.

Definitions cannot register arbitrary JavaScript functions as transforms.

Unknown transforms shall fail validation or rendering.

---

# 37. Content Representation

Simple templates may define:

```json
{
  "content": "..."
}
```

Complex templates may define:

```json
{
  "parts": []
}
```

Root `content` and root `parts` should be mutually exclusive unless a future schema explicitly defines their composition semantics.

---

# 38. Template Parts

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

---

# 39. Fragment Resolution

Fragment references shall resolve by stable `templateId`.

The engine shall detect:

- missing fragments;
- invalid variable mappings;
- incompatible parameters;
- composition cycles.

---

# 40. Composition Cycles

Recursive fragment composition is permitted only when it terminates.

A cycle such as:

```text
fragment.a
    → fragment.b
        → fragment.a
```

shall fail with:

```text
TEMPLATE_COMPOSITION_CYCLE
```

---

# 41. Conditions

Templates may include declarative conditions.

Example:

```json
{
  "when": {
    "variable": "standalone",
    "equals": true
  },
  "content": "..."
}
```

---

# 42. Supported Conditional Operators

Initial operators should include:

```text
equals
notEquals
exists
notExists
truthy
falsy
includes
```

Conditions shall not permit arbitrary expressions.

---

# 43. Conditional Else Branch

A conditional part may optionally define an alternative branch.

Example:

```json
{
  "when": {
    "variable": "typescript",
    "equals": true
  },
  "content": "lang=\"ts\"",
  "else": {
    "content": ""
  }
}
```

---

# 44. Iteration

Templates may render repeated sections declaratively.

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

---

# 45. Iteration Requirements

Iteration shall:

- require an array source;
- bind one item variable;
- optionally bind an index;
- permit a separator;
- maintain deterministic ordering.

---

# 46. Structured Formats

The Template Engine shall support generic format renderers rather than per-template TypeScript generation strategies.

Initial or planned formats include:

```text
text
json
yaml
toml
```

---

# 47. Text Renderer

The text renderer processes:

- interpolation;
- composition;
- conditions;
- iteration.

It returns the resulting text unchanged except for defined Template Engine semantics.

---

# 48. JSON Renderer

JSON templates may define a structured document.

Example:

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

---

# 49. Structured Type Preservation

If an entire structured value consists of one variable reference, the renderer should preserve its native data type.

For example:

```json
{
  "private": "{{isPrivate}}"
}
```

with:

```ts
isPrivate = true
```

should result in:

```json
{
  "private": true
}
```

rather than:

```json
{
  "private": "true"
}
```

---

# 50. JSON Formatting

The canonical JSON renderer should default to:

- two-space indentation;
- deterministic property order inherited from the template definition;
- final newline.

---

# 51. YAML and TOML

YAML and TOML may be implemented when required by migrated templates.

Examples include:

```text
pnpm-workspace.yaml
```

Their behaviour must be generic format rendering, not template-specific source code.

---

# 52. Collection Context

Collections may provide context to child templates.

Example:

```json
{
  "template": "nuxt.component.test",
  "with": {
    "componentName": "{{componentName}}"
  }
}
```

Collection members may also be conditional.

---

# 53. Generated Artifact

The Template Engine shall return a domain-neutral artifact representation.

Recommended interface:

```ts
export interface GeneratedArtifact {
  templateId: string;
  templateVersion: string;

  publishName: string | null;
  relativePath?: string;

  content: string;

  encoding: 'utf-8';
  format: TemplateFormat;
}
```

---

# 54. Render Result

A render operation may produce more than one artifact.

Recommended result:

```ts
export interface TemplateRenderResult {
  templateId: string;
  templateVersion: string;

  artifacts: GeneratedArtifact[];

  warnings: TemplateWarning[];
}
```

A collection naturally produces multiple artifacts.

---

# 55. Render Trace

Optional diagnostic tracing may report:

- variables resolved;
- defaults used;
- fragments included;
- conditions evaluated;
- iterations performed;
- publication name resolved.

Sensitive values shall be redacted where appropriate.

Tracing shall not change render output.

---

# 56. Template Repository Interface

Recommended interface:

```ts
export interface ITemplateRepository {
  initialize(): Promise<void>;

  get(
    templateId: string,
  ): TemplateDefinition | undefined;

  require(
    templateId: string,
  ): TemplateDefinition;

  list(
    filter?: TemplateQuery,
  ): TemplateDescriptor[];

  reload(): Promise<void>;

  validateAll(): TemplateRepositoryValidationResult;
}
```

---

# 57. Template Query

Recommended query shape:

```ts
export interface TemplateQuery {
  category?: string;
  kind?: TemplateKind;
  tags?: string[];
  publishName?: string;
}
```

---

# 58. Dynamic Repository Reload

A repository `reload()` operation shall permit newly added JSON definitions to become available without rebuilding the application.

Continuous filesystem watching is not required for the initial implementation.

---

# 59. Duplicate Template IDs

Two definitions at the same repository precedence level must not silently override each other.

Duplicate IDs shall produce:

```text
TEMPLATE_DUPLICATE_ID
```

There shall be no implicit last-file-wins policy.

---

# 60. Future Repository Precedence

The architecture should permit multiple repositories in future.

Possible precedence:

```text
project-local templates
        ↓
user templates
        ↓
AppManager built-in templates
```

Resolution between repositories belongs to a Template Resolver or repository composition layer.

The initial implementation may support only the AppManager repository.

---

# 61. Runtime Schema Validation

All template definitions shall be runtime validated.

A library such as Zod is suitable.

Validation errors should identify:

- file path;
- template ID when available;
- invalid field;
- expected type or constraint;
- actual value where safe.

---

# 62. Validation Stages

Validation should occur at multiple levels:

```text
JSON syntax
    ↓
Template Definition schema
    ↓
repository-level consistency
    ↓
render-context validation
    ↓
render operation
```

---

# 63. Domain Extension Metadata

Template definitions may contain optional domain-specific metadata sections.

Examples may include:

```json
{
  "license": {}
}
```

or future domain extensions.

The generic Template Engine shall not implement domain semantics merely because domain metadata is present.

Instead:

- the generic template schema defines how extension metadata may be stored;
- the owning domain subsystem validates and interprets its own extension;
- the Template Engine preserves that metadata while rendering only generic Template Engine fields.

---

# 64. Licence Template Integration

Licence templates shall reside under:

```text
app_manager/templates/licenses/
```

Examples:

```text
app_manager/templates/licenses/mit-license.json
app_manager/templates/licenses/apache-2-0-license.json
app_manager/templates/licenses/gpl-3-0-license.json
```

They are discoverable by the Template Repository exactly like other templates.

---

# 65. Licence Template Identity

Licence template IDs shall conventionally use:

```text
license.<canonical-license-id>
```

Examples:

```text
license.mit
license.apache-2-0
license.gpl-3-0
```

The Template Engine does not itself enforce the semantics of those IDs beyond ordinary ID validity and uniqueness.

---

# 66. Licence Template Publish Name

Licence templates normally publish:

```json
{
  "templatePublishName": "LICENSE"
}
```

Alternative names may exist where explicitly required.

---

# 67. Licence Engine Ownership

Although licence definitions are physically stored in the Template Repository, their lifecycle is owned by the Licence Engine.

The Licence Engine owns:

- licence catalogue acquisition;
- authoritative source selection;
- initial licence-template population;
- licence-template refresh;
- provenance;
- source hashing;
- content hashing;
- integrity checks;
- legal-text completeness checks;
- OSI catalogue synchronization;
- update detection;
- controlled replacement of licence templates.

---

# 68. Template Engine Ownership for Licences

For a licence template, the Template Engine owns only generic template behaviours:

- repository discovery;
- base schema validation;
- variable validation;
- interpolation;
- conditions;
- composition where used;
- publish-name resolution;
- deterministic rendering;
- `GeneratedArtifact` construction.

---

# 69. Licence Engine Data Placement

Licence Engine catalogue data resides separately at:

```text
app_manager/licenses-engine/
└── opensource-license-index.json
```

That file is not a Template Engine definition and must be excluded from Template Repository discovery because it is outside `app_manager/templates/`.

---

# 70. Licence Catalogue Boundary

The distinction is:

```text
app_manager/licenses-engine/opensource-license-index.json
    → licence discovery, source and lifecycle catalogue

app_manager/templates/licenses/mit-license.json
    → renderable template definition
```

The Template Engine does not parse the OSI catalogue as part of rendering.

---

# 71. Licence Generation Must Be Offline

Rendering a previously populated licence template shall not:

- query the Open Source Initiative;
- fetch licence steward data;
- check whether a licence is current;
- update the licence index;
- modify the licence template.

Normal generation is a local deterministic operation.

---

# 72. Licence Domain Metadata

A licence template may contain an extension such as:

```json
{
  "license": {
    "licenseId": "mit",
    "spdxId": "MIT",
    "approved": true,
    "sourceType": "osi-api",
    "source": {},
    "provenance": {}
  }
}
```

The Licence Engine interprets these fields.

The Template Engine treats them as domain metadata.

---

# 73. No Generic Licence-Specific Rendering Logic

The Template Engine shall not contain special logic such as:

```text
if licence is MIT ...
if licence is GPL ...
if licence is Apache ...
```

The individual template definition expresses any permitted interpolation location.

The Licence Engine is responsible for ensuring that the definition is legally and structurally correct before it is made available for publication.

---

# 74. File Header Fragment Migration

The existing TypeScript file-header template should migrate to a fragment definition such as:

```text
app_manager/templates/blocks/file-header.json
```

with:

```text
templateId = block.file-header
templateKind = fragment
```

System time variables shall use the Template Engine render clock.

---

# 75. Existing Template Migration

The previous `app/templates/**` TypeScript tree contains substantial duplication and divergence.

Migration must not blindly preserve known defects.

Known areas requiring deliberate review include:

- duplicated root configuration templates;
- duplicated Nuxt project and layer templates;
- diverged Vitest templates;
- unsafe `.gitmodules` defaults;
- personal values embedded in `.env.example`;
- README behaviour differing between project modes;
- incomplete licence content.

---

# 76. Template Migration Process

For every legacy template:

1. identify canonical implementation;
2. record representative outputs;
3. identify variables;
4. identify defaults;
5. identify conditional logic;
6. identify repetition;
7. identify reusable fragments;
8. create declarative definition;
9. validate definition;
10. render equivalent fixture contexts;
11. compare output;
12. intentionally correct known defects;
13. update consumers;
14. remove legacy implementation only after acceptance.

---

# 77. Monolithic Repository Migration

The current `template-repository.json` data catalogue shall be decomposed.

For every record:

1. determine canonical legacy source;
2. determine template ID;
3. determine template kind;
4. determine publish name;
5. migrate variables;
6. migrate static content;
7. convert branching to conditions;
8. convert loops to declarative iteration;
9. convert repeated shared content to fragments;
10. create individual JSON definition;
11. validate;
12. parity test;
13. remove migrated aggregate record.

After migration, `template-repository.json` shall remain repository metadata only.

---

# 78. Compatibility Adapter

A transitional adapter may preserve existing TypeScript call sites.

Example:

```ts
export async function packageJsonTemplate(
  context: PackageJsonContext,
): Promise<string> {
  const result = await templateEngine.render(
    'nuxt.package-json',
    context,
  );

  return result.artifacts[0].content;
}
```

Compatibility adapters are temporary migration infrastructure.

They shall not become the permanent template architecture.

---

# 79. Security Requirements

The Template Engine shall reject or prevent:

- `eval`;
- arbitrary functions;
- shell execution;
- dynamic code imports;
- template-triggered network requests;
- arbitrary filesystem reads;
- template-triggered filesystem writes;
- path traversal;
- NUL characters in output paths;
- unauthorised absolute paths;
- duplicate template identities;
- composition cycles.

---

# 80. Path Safety

Resolved publication paths must be validated after interpolation.

Values such as:

```text
../../secret
..\..\secret
/absolute/path
C:\absolute\path
```

shall be rejected unless a future explicitly defined output policy permits them.

---

# 81. Caching

Parsed and validated definitions may be cached.

`reload()` shall invalidate relevant repository caches.

Rendering results should not normally be globally cached because context may vary.

---

# 82. Purity

The core renderer should behave as close as practical to a pure transformation:

```text
TemplateDefinition
+
RenderContext
+
RenderOptions
        ↓
TemplateRenderResult
```

External side effects belong outside this transformation.

---

# 83. Error Model

Recommended Template Engine error codes:

```text
TEMPLATE_NOT_FOUND
TEMPLATE_DEFINITION_INVALID
TEMPLATE_SCHEMA_UNSUPPORTED
TEMPLATE_DUPLICATE_ID
TEMPLATE_CONTEXT_MISSING
TEMPLATE_CONTEXT_INVALID
TEMPLATE_INTERPOLATION_ERROR
TEMPLATE_TRANSFORM_UNKNOWN
TEMPLATE_FRAGMENT_NOT_FOUND
TEMPLATE_COMPOSITION_CYCLE
TEMPLATE_CONDITION_INVALID
TEMPLATE_ITERATION_INVALID
TEMPLATE_PUBLISH_NAME_INVALID
TEMPLATE_PATH_TRAVERSAL
TEMPLATE_RENDER_FAILED
```

---

# 84. Typed Error

Recommended form:

```ts
export class TemplateEngineError extends Error {
  constructor(
    public readonly code: TemplateEngineErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}
```

---

# 85. Testing Architecture

Testing shall be divided into at least:

1. Template Engine behaviour tests;
2. schema tests;
3. repository tests;
4. template contract tests;
5. migration/parity tests;
6. integration tests.

---

# 86. Engine Behaviour Tests

Engine tests shall cover:

- interpolation;
- nested values;
- transforms;
- defaults;
- missing required variables;
- publish names;
- fragments;
- conditions;
- else branches;
- iteration;
- structured formats;
- collections;
- path safety;
- deterministic output.

---

# 87. Template Contract Tests

A repository-wide contract test shall discover every definition under:

```text
app_manager/templates/**/*.json
```

and verify that each definition validates.

Licence templates are included in this generic Template Engine contract test.

Additional legal/source validation remains the Licence Engine's responsibility.

---

# 88. Determinism Tests

Render the same definition using the same context and fixed clock multiple times.

The resulting artifacts shall be byte-identical.

---

# 89. Repository Acceptance Criteria

The repository layer is complete when:

- definitions are recursively discovered;
- exclusions work;
- duplicate IDs fail;
- invalid JSON is reported;
- invalid schemas are reported;
- templates can be listed;
- templates can be retrieved by ID;
- `reload()` discovers newly added files.

---

# 90. Engine Acceptance Criteria

Version 2 is architecturally complete when:

1. template data is stored independently from source code;
2. individual JSON definitions are discoverable;
3. no source-code registration is required for a new template;
4. runtime schema validation exists;
5. required and default variables are supported;
6. filename patterns are supported;
7. controlled transforms are supported;
8. fragments are supported;
9. conditions are supported;
10. iteration is supported;
11. text rendering is supported;
12. structured JSON rendering is supported;
13. collections are supported;
14. artifacts are returned without filesystem persistence;
15. user-added templates can become available through repository reload;
16. repository-wide validation is available;
17. representative legacy templates have parity tests;
18. arbitrary executable template code is prohibited;
19. licence templates are discovered under `templates/licenses/`;
20. licence lifecycle management remains outside Template Engine scope.

---

# 91. Canonical Render Pipeline

```text
Template ID
    │
    ▼
TemplateRepository.require()
    │
    ▼
Validated TemplateDefinition
    │
    ▼
Validate Render Context
    │
    ▼
Apply Defaults
    │
    ▼
Resolve Publish Name / Path
    │
    ▼
Resolve Conditions
    │
    ▼
Resolve Iterations
    │
    ▼
Resolve Fragments
    │
    ▼
Interpolate Values
    │
    ▼
Format Renderer
    │
    ▼
GeneratedArtifact[]
```

---

# 92. Caller-Controlled Completion Pipeline

After rendering:

```text
GeneratedArtifact[]
        │
        ▼
Orchestrator
        │
        ├── preview
        ├── inspect
        ├── compare
        ├── detect collisions
        ├── confirm
        └── apply policy
                │
                ▼
            FileService
                │
                ▼
            filesystem
```

---

# 93. Licence Publication Pipeline

Licence publication is a specialised caller workflow:

```text
Resolved licence ID
        │
        ▼
Licence Engine
        │
        ▼
app_manager/templates/licenses/<licence>.json
        │
        ▼
TemplateEngine.render()
        │
        ▼
GeneratedArtifact
        │
        ▼
FileService
        │
        ▼
LICENSE
```

No catalogue refresh or remote retrieval occurs in this render pipeline.

---

# 94. Canonical Ownership Summary

## Template Definitions Own

- artifact-specific content;
- output name;
- output-name pattern;
- variables;
- defaults;
- composition;
- conditions;
- iteration;
- structured document definition;
- descriptive template metadata;
- optional domain metadata.

## Template Engine Owns

- discovery;
- base validation;
- variable validation;
- interpolation;
- transforms;
- composition;
- iteration;
- conditions;
- format rendering;
- output-name resolution;
- deterministic artifact generation.

## Resolvers Own

- ambiguous input resolution;
- settings resolution;
- interactive fallback policy;
- resource selection.

## Orchestrators Own

- workflow sequencing;
- collision policy;
- previews;
- confirmation;
- transactions;
- persistence coordination.

## FileService Owns

- filesystem persistence.

## Licence Engine Owns

- OSI catalogue population;
- licence source resolution;
- authoritative legal text acquisition;
- licence-template creation;
- licence-template updating;
- provenance;
- integrity;
- legal-text completeness;
- licence update checking.

---

# 95. Final Architectural Rule

> **Template definitions describe generated artifacts. The Template Engine provides only the generic capabilities necessary to interpret those definitions. Domain systems may create and maintain template definitions, but domain lifecycle logic must not be absorbed into the generic Template Engine.**

For licence templates specifically:

> **The Licence Engine owns the licence template lifecycle; the Template Engine owns licence template rendering.**