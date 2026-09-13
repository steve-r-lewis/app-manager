# Template Engine — Functional Specification

**Component:** AppManager Template Engine  
**Specification Type:** Functional / Implementation Contract  
**Proposed Documentation Path:** `docs/specification/architecture/template-engine/spec-template-engine-functional-v01.md`  
**Runtime Code:** `app/template-engine/**`  
**Template Repository:** `app_manager/templates/**`  
**Project:** `app-manager`  
**Version:** 1.0.0

---

# 1. Scope

This specification defines the required functional behaviour of the AppManager Template Engine introduced by the accompanying architectural design specification.

It covers:

- template repository discovery;
- JSON template loading;
- definition validation;
- template lookup;
- variable validation;
- default values;
- interpolation;
- controlled transformations;
- conditions;
- iteration;
- reusable fragments;
- output filename generation;
- structured rendering;
- template collections;
- error handling;
- caching;
- generation results;
- validation tooling;
- migration compatibility.

It does not define command-specific workflows that consume generated templates.

---

# 2. Public Engine Contract

The principal application-facing interface should be equivalent to:

```ts
export interface ITemplateEngine {
  render(
    templateId: string,
    context?: TemplateContext,
    options?: TemplateRenderOptions,
  ): Promise<TemplateRenderResult>;

  validate(
    templateId: string,
    context?: TemplateContext,
  ): Promise<TemplateValidationResult>;

  getDefinition(
    templateId: string,
  ): Promise<TemplateDefinition>;

  list(
    filter?: TemplateQuery,
  ): Promise<TemplateDescriptor[]>;
}
```

The exact class/function organization may vary, but these capabilities are required.

---

# 3. Template Context

```ts
export type TemplateContext =
  Record<string, unknown>;
```

The engine shall validate this untrusted input against the selected template's variable definitions before rendering.

No undeclared context variable shall implicitly create executable behaviour.

---

# 4. Render Options

Recommended contract:

```ts
export interface TemplateRenderOptions {
  strictVariables?: boolean;
  includeTrace?: boolean;
  clock?: Date;
}
```

Defaults:

```text
strictVariables = true
includeTrace = false
clock = current time
```

The injectable clock is required for deterministic tests of date/time fragments.

---

# 5. Template Render Result

For a file:

```ts
export interface TemplateRenderResult {
  templateId: string;
  templateVersion: string;
  artifacts: GeneratedArtifact[];
  warnings: TemplateWarning[];
}
```

A normal single-file template returns:

```text
artifacts.length === 1
```

A fragment returns no publishable artifact when rendered only as a fragment unless explicit fragment-preview behaviour is requested.

A collection may return multiple artifacts.

---

# 6. Generated Artifact

```ts
export interface GeneratedArtifact {
  templateId: string;
  templateVersion: string;

  publishName: string;
  relativePath?: string;

  format: TemplateFormat;
  encoding: 'utf-8';

  content: string;
}
```

---

# 7. Repository Initialization

On initialization, `TemplateRepository` shall:

1. locate `app_manager/templates/`;
2. load `template-repository.json`;
3. validate repository configuration;
4. evaluate include/exclude discovery patterns;
5. recursively discover template definition files;
6. parse every discovered JSON file;
7. validate the definition schema;
8. index valid templates by `templateId`;
9. report duplicates;
10. make the catalogue available to consumers.

---

# 8. Discovery

Default discovery configuration:

```json
{
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

The implementation shall not require each template file to be manually listed.

---

# 9. Duplicate IDs

If two files define:

```text
templateId = nuxt.component.vue
```

within the same repository precedence level, initialization shall fail validation.

Example:

```text
Duplicate template ID 'nuxt.component.vue':

- templates/vue-component.json
- templates/custom/vue-component.json
```

Silent last-file-wins behaviour is prohibited.

---

# 10. Template Definition Validation

At minimum, every definition must contain:

```text
schemaVersion
templateId
templateName
templateVersion
templateKind
```

File templates additionally require:

```text
templatePublishName
```

unless output naming is explicitly supplied by a containing collection.

---

# 11. Valid Template Kinds

Version 1 supports:

```text
file
fragment
collection
```

Unknown template kinds fail schema validation.

---

# 12. File Template Example

```json
{
  "schemaVersion": "1.0.0",
  "templateId": "config.npmrc",
  "templateName": "NPM Configuration",
  "templateVersion": "1.0.0",
  "templateKind": "file",

  "category": "config",

  "templatePublishName": ".npmrc",

  "format": "text",

  "variables": {},

  "content": "shamefully-hoist=true\n"
}
```

Expected generation:

```text
publishName = .npmrc

content:
shamefully-hoist=true
```

---

# 13. Variable Definition

Canonical variable definition:

```json
{
  "variables": {
    "name": {
      "type": "string",
      "required": true,
      "description": "Name used by the generated artifact."
    }
  }
}
```

Possible fields:

```text
type
required
default
description
enum
items
properties
validation
```

---

# 14. Variable Resolution Order

For each declared variable:

```text
explicit render context
        ↓
template-defined default
        ↓
missing
```

The Template Engine shall not consult:

- AppManager settings;
- environment variables;
- Git;
- prompts.

Those values must be resolved before rendering.

---

# 15. Required Variables

If a required variable is unresolved:

```text
TEMPLATE_CONTEXT_MISSING
```

shall be returned/thrown.

Example:

```text
Template 'nuxt.component.vue' requires 'componentName'.
```

---

# 16. Optional Variables

Optional variables with no supplied/default value evaluate as absent.

How absence renders depends on context.

Direct interpolation of an absent value in strict mode shall be an error rather than silently producing:

```text
undefined
```

---

# 17. Defaults

Example:

```json
{
  "author": {
    "type": "string",
    "required": false,
    "default": "Unknown"
  }
}
```

Defaults may be scalar JSON values.

Dynamic defaults may reference controlled system values if explicitly supported:

```json
{
  "year": {
    "type": "number",
    "defaultFrom": "system.year"
  }
}
```

---

# 18. Interpolation

Basic interpolation:

```text
{{variable}}
```

Example:

```json
{
  "content": "export const name = '{{name}}';\n"
}
```

Context:

```json
{
  "name": "example"
}
```

Output:

```ts
export const name = 'example';
```

---

# 19. Nested Values

Dot notation shall support nested objects:

```text
{{author.name}}
{{module.path}}
{{package.version}}
```

Absent nested values follow normal missing-variable rules.

---

# 20. Transformations

Syntax:

```text
{{value | transform}}
```

Multiple transformations may be supported left-to-right:

```text
{{name | trim | pascalCase}}
```

Initial registered transformations:

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

# 21. Unknown Transformations

An unknown transform causes:

```text
TEMPLATE_TRANSFORM_UNKNOWN
```

The engine must not dynamically look up or execute arbitrary functions.

---

# 22. Publish Name Resolution

Given:

```json
{
  "templatePublishName":
    "{{componentName | pascalCase}}.vue"
}
```

and:

```json
{
  "componentName": "user profile"
}
```

the result is:

```text
UserProfile.vue
```

---

# 23. Publish Name Validation

Resolved filenames must:

- be non-empty;
- not contain NUL characters;
- not escape the authorized output root;
- satisfy platform-neutral path restrictions where possible.

Absolute paths in template specifications should be prohibited by default.

---

# 24. Relative Publish Paths

A template may optionally define:

```json
{
  "templatePublishPath":
    "components/{{category | kebabCase}}"
}
```

The final artifact location becomes:

```text
components/forms/UserForm.vue
```

The engine returns the relative path.

It does not perform the write.

---

# 25. Fragment Definition

Example:

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "block.file-header",
  "templateName": "Source File Header",

  "templateVersion": "1.0.0",
  "templateKind": "fragment",

  "format": "text",

  "variables": {
    "projectName": {
      "type": "string",
      "required": true
    },

    "filePath": {
      "type": "string",
      "required": true
    },

    "author": {
      "type": "string",
      "default": "Unknown"
    },

    "description": {
      "type": "string",
      "default": "TODO: Create description here"
    },

    "version": {
      "type": "string",
      "default": "1.0.0"
    }
  },

  "content": "/**\n * @project: {{projectName}}\n * @file: {{filePath}}\n * @version: {{version}}\n * @createDate: {{system.date}}\n * @createTime: {{system.time}}\n * @author: {{author}}\n *\n * @description:\n * {{description}}\n */"
}
```

---

# 26. System Namespace

Version 1 should expose:

```text
system.date
system.time
system.year
system.timestamp
```

Values shall derive from the render invocation's clock.

They must not be accepted from the template's ordinary context under the reserved `system` name.

---

# 27. Composition

A file may contain:

```json
{
  "parts": [
    {
      "template": "block.file-header",

      "with": {
        "projectName": "{{projectName}}",
        "filePath": "{{resolvedPublishName}}",
        "author": "{{author}}",
        "description": "Nuxt application configuration."
      }
    },

    {
      "content": "\n\n"
    },

    {
      "content":
        "export default defineNuxtConfig({\n})\n"
    }
  ]
}
```

Parts are evaluated in array order.

---

# 28. Fragment Context

A fragment receives only:

- values explicitly mapped using `with`; and/or
- values inherited according to a documented inheritance rule.

The preferred default is explicit mapping for clarity.

An optional:

```json
{
  "inheritContext": true
}
```

may be introduced if needed, but unrestricted implicit inheritance should not be the initial default.

---

# 29. Recursive Composition

The engine may support fragments containing other fragments.

It shall maintain a render stack.

Example:

```text
nuxt.config
  → source-header
      → revision-line
```

---

# 30. Circular References

If:

```text
A → B → C → A
```

rendering fails with:

```text
TEMPLATE_COMPOSITION_CYCLE
```

and reports the reference path.

---

# 31. Conditions

Canonical form:

```json
{
  "when": {
    "variable": "standalone",
    "equals": true
  },

  "content": "..."
}
```

Supported Version 1 operators:

```text
equals
notEquals
exists
notExists
truthy
falsy
includes
```

---

# 32. Conditional Else

A part may support:

```json
{
  "when": {
    "variable": "target",
    "equals": "root"
  },

  "content": "...",

  "else": {
    "content": "..."
  }
}
```

Complex nested condition languages should be avoided in Version 1.

If a template requires programming-language-level branching complexity, the definition language should be reassessed rather than immediately adding arbitrary expressions.

---

# 33. Iteration

Canonical structure:

```json
{
  "forEach": {
    "source": "modules",
    "item": "module",
    "separator": "\n"
  },

  "content":
    "[submodule \"{{module.name}}\"]\n\tpath = {{module.path}}\n\turl = {{module.url}}\n"
}
```

---

# 34. Iteration Behaviour

The engine shall:

1. resolve `source`;
2. ensure it is an array;
3. bind each element under `item`;
4. render the part once per element;
5. join using `separator`.

Empty arrays produce an empty result unless configured otherwise.

---

# 35. Structured JSON Templates

Example:

```json
{
  "schemaVersion": "1.0.0",
  "templateId": "nuxt.package-json",
  "templateName": "Nuxt package.json",
  "templateVersion": "1.0.0",
  "templateKind": "file",

  "templatePublishName": "package.json",

  "format": "json",

  "variables": {
    "packageName": {
      "type": "string",
      "required": true
    },

    "version": {
      "type": "string",
      "default": "0.1.0"
    }
  },

  "document": {
    "name": "{{packageName}}",
    "version": "{{version}}",
    "private": true
  }
}
```

---

# 36. JSON Type Preservation

When an entire structured field consists solely of a variable token:

```json
{
  "private": "{{private}}"
}
```

the engine shall preserve the variable's native type.

Therefore:

```json
{
  "private": true
}
```

must not become:

```json
{
  "private": "true"
}
```

---

# 37. JSON Serialization

The JSON renderer should default to:

```text
2-space indentation
final newline
```

unless format options specify otherwise.

Example:

```json
{
  "formatOptions": {
    "indent": 2,
    "finalNewline": true
  }
}
```

---

# 38. YAML/TOML

Version 1 implementation may initially support only:

```text
text
json
```

provided the schema reserves:

```text
yaml
toml
```

for later compatible expansion.

Alternatively, YAML/TOML support may be implemented immediately if required by migrated templates such as `pnpm-workspace.yaml`.

The crucial rule is that renderers remain generic by format.

---

# 39. Collections

Collection definition:

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "nuxt.component.complete",
  "templateName": "Vue Component with Tests",

  "templateVersion": "1.0.0",
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

The render result contains both artifacts.

---

# 40. Collection Context Mapping

Individual collection members may map context:

```json
{
  "template": "nuxt.component.test",

  "with": {
    "componentName": "{{componentName}}",
    "testFramework": "vitest"
  }
}
```

---

# 41. Collection Conditions

Collection members may be conditional:

```json
{
  "template": "nuxt.component.test",

  "when": {
    "variable": "includeTests",
    "equals": true
  }
}
```

This supports scaffold presets without hardcoding scaffold logic into TypeScript.

---

# 42. Repository Descriptor

New `template-repository.json`:

```json
{
  "schemaVersion": "2.0.0",

  "repository": {
    "id": "app-manager.default",
    "name": "AppManager Default Templates",
    "version": "1.0.0",
    "description":
      "Default template definitions distributed with AppManager."
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

The current `records` array is removed.

---

# 43. Template Repository API

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

# 44. Template Query

```ts
interface TemplateQuery {
  category?: string;
  kind?: TemplateKind;
  tags?: string[];
  publishName?: string;
}
```

This supports future interactive template browsing.

---

# 45. Repository Reload

Because users may add template JSON files, the repository should support:

```text
reload()
```

A process need not watch the filesystem continuously.

Reload may be triggered:

- explicitly;
- when entering template-management commands;
- between top-level command executions.

---

# 46. Invalid User Template

A malformed definition must not crash unrelated application functionality during lazy loading.

However, repository validation must clearly identify it.

Two modes are useful:

```text
strict initialization
validation/reporting mode
```

In normal generation, requesting an invalid template shall fail.

---

# 47. Template Lookup Failure

Unknown ID:

```text
TEMPLATE_NOT_FOUND
```

Example:

```text
Template 'nuxt.component.foo' was not found.

Repository:
app_manager/templates

Use the template-list command to view available templates.
```

---

# 48. Template Errors

Recommended codes:

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

# 49. Typed Error

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

# 50. Validation Trace

For development and debugging, the renderer may optionally produce:

```ts
interface TemplateRenderTrace {
  templateId: string;
  variables: VariableResolutionTrace[];
  fragments: string[];
  resolvedPublishName?: string;
}
```

Sensitive values must be redactable.

---

# 51. Repository Caching

Parsed and validated definitions should be cached after repository initialization.

Rendering should not re-read every JSON definition from disk.

Cache invalidation occurs on:

```text
reload()
```

---

# 52. Render Purity

Given:

```text
same definition
same context
same clock
same engine version
```

the rendered output must be identical.

This makes rendering deterministic and testable.

---

# 53. File Writing

The Template Engine shall never automatically call:

```text
fileService.write()
```

The caller receives artifacts and decides:

- target directory;
- overwrite policy;
- merge policy;
- dry run;
- backup;
- transaction behaviour.

---

# 54. Collision Handling

Filename collisions are an orchestrator responsibility.

However, collections should detect duplicate artifact paths within their own result and fail before returning an ambiguous set.

Example:

```text
TEMPLATE_OUTPUT_COLLISION

Two members of collection
'nuxt.component.complete'
resolved to:

components/User.vue
```

---

# 55. Existing File Headers

Header blocks become normal fragments.

No generated source file should need to import:

```ts
getHeaderBlock()
```

Instead:

```json
{
  "template": "block.file-header"
}
```

is included by the relevant definition.

---

# 56. Example Vue Component

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "nuxt.component.vue",
  "templateName": "Nuxt Vue Component",

  "templateVersion": "1.0.0",
  "templateKind": "file",

  "category": "nuxt.component",

  "templatePublishName":
    "{{componentName | pascalCase}}.vue",

  "format": "text",

  "variables": {
    "componentName": {
      "type": "string",
      "required": true
    },

    "projectName": {
      "type": "string",
      "required": true
    },

    "author": {
      "type": "string",
      "default": "Unknown"
    }
  },

  "parts": [
    {
      "template": "block.file-header",

      "with": {
        "projectName": "{{projectName}}",
        "filePath":
          "{{componentName | pascalCase}}.vue",
        "author": "{{author}}",
        "description":
          "{{componentName | pascalCase}} Vue component."
      }
    },

    {
      "content":
        "\n\n<script setup lang=\"ts\">\n</script>\n\n<template>\n  <div>\n  </div>\n</template>\n"
    }
  ]
}
```

Adding this template requires no TypeScript implementation.

---

# 57. Example TypeScript File

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "typescript.module",
  "templateName": "TypeScript Module",

  "templateVersion": "1.0.0",
  "templateKind": "file",

  "templatePublishName":
    "{{moduleName | camelCase}}.ts",

  "format": "text",

  "variables": {
    "moduleName": {
      "type": "string",
      "required": true
    },

    "projectName": {
      "type": "string",
      "required": true
    }
  },

  "parts": [
    {
      "template": "block.file-header",
      "with": {
        "projectName": "{{projectName}}",
        "filePath":
          "{{moduleName | camelCase}}.ts"
      }
    },

    {
      "content": "\n\n"
    }
  ]
}
```

---

# 58. Repository Validation Command Support

The subsystem shall expose sufficient API for a future command equivalent to:

```text
am template validate
```

which reports:

```text
Templates discovered: 34
Valid:                33
Invalid:               1

Invalid:
templates/custom/foo.json
  variables.name.type:
  Unsupported variable type 'str'.
```

The command itself is outside this specification.

---

# 59. Template Listing Support

The API must support future output such as:

```text
ID                       Kind       Output
------------------------------------------------
nuxt.component.vue       file       {{componentName}}.vue
nuxt.package-json        file       package.json
block.file-header        fragment   -
nuxt.layer.default       collection multiple
```

---

# 60. Template Inspection Support

Definitions should be obtainable without rendering so future commands can show:

- description;
- required variables;
- optional variables;
- defaults;
- output pattern;
- version;
- category.

---

# 61. Migration from `template-repository.json`

The existing monolithic records shall be migrated one record at a time.

For each existing record:

1. determine the canonical legacy source;
2. preserve all useful static content;
3. preserve required/default variable information;
4. convert code branching to declarative conditions;
5. convert repeated generation to iteration;
6. convert embedded header generation to fragment references;
7. define `templatePublishName`;
8. assign stable `templateId`;
9. add `schemaVersion`;
10. add `templateVersion`;
11. create `<template-name>.json`;
12. add parity tests;
13. remove the migrated record from the monolithic file.

After complete migration, `records` is removed entirely.

---

# 62. Migration from TypeScript Templates

For each legacy `app/templates/**/*.ts` implementation:

1. produce fixtures from representative contexts;
2. record existing expected outputs;
3. convert implementation into JSON definition;
4. render the same contexts using Template Engine;
5. compare outputs;
6. deliberately resolve known defects rather than blindly preserving them;
7. update consumers;
8. remove legacy implementation after parity acceptance.

---

# 63. Known Defects During Migration

Migration must not treat every legacy output as authoritative.

Existing audit findings include:

- duplicated template implementations;
- diverged Vitest definitions;
- personal information embedded in `.env.example`;
- dangerous `.gitmodules` defaults;
- duplicated project/layer definitions;
- incomplete GPLv3 content;
- README behaviour inconsistent with standalone layer mode.

These must be resolved according to the approved specifications when producing canonical JSON definitions.

---

# 64. Compatibility Adapter

During staged migration:

```ts
export async function renderLegacyTemplate(
  legacyName: string,
  context: Record<string, unknown>,
): Promise<string> {
  const templateId =
    legacyTemplateMap[legacyName];

  const result =
    await templateEngine.render(
      templateId,
      context,
    );

  return result.artifacts[0].content;
}
```

The mapping exists only during transition.

---

# 65. Test Requirements — Repository

Required tests:

| ID | Scenario | Expected |
|---|---|---|
| TR-01 | Valid repository | All definitions indexed |
| TR-02 | Nested template | Discovered recursively |
| TR-03 | Excluded repository file | Not treated as template |
| TR-04 | Duplicate template ID | Validation failure |
| TR-05 | Invalid JSON | Report offending file |
| TR-06 | Invalid schema | Structured validation error |
| TR-07 | Reload after adding file | New template appears |
| TR-08 | Reload after deletion | Removed template disappears |

---

# 66. Test Requirements — Interpolation

| ID | Scenario | Expected |
|---|---|---|
| TI-01 | Scalar variable | Correct substitution |
| TI-02 | Nested variable | Correct substitution |
| TI-03 | Required value missing | Error |
| TI-04 | Optional with default | Default substituted |
| TI-05 | Unknown transform | Error |
| TI-06 | Pascal transform | Correct output |
| TI-07 | Multiple transforms | Left-to-right application |

---

# 67. Test Requirements — Publish Names

| ID | Scenario | Expected |
|---|---|---|
| TN-01 | Constant name | Exact filename |
| TN-02 | Variable pattern | Resolved filename |
| TN-03 | Case transformation | Correct filename |
| TN-04 | Missing name variable | Error |
| TN-05 | `../` traversal | Rejected |
| TN-06 | Empty final filename | Rejected |

---

# 68. Test Requirements — Composition

| ID | Scenario | Expected |
|---|---|---|
| TC-01 | One fragment | Included correctly |
| TC-02 | Multiple fragments | Ordered correctly |
| TC-03 | Missing fragment | Error |
| TC-04 | Nested fragments | Render correctly |
| TC-05 | Circular fragment dependency | Cycle error |
| TC-06 | Fragment missing required mapped variable | Error |

---

# 69. Test Requirements — Conditions

| ID | Scenario | Expected |
|---|---|---|
| CD-01 | equals true | Part rendered |
| CD-02 | equals false | Part skipped |
| CD-03 | else branch | Alternate rendered |
| CD-04 | exists | Correct |
| CD-05 | includes | Correct |
| CD-06 | invalid operator | Validation error |

---

# 70. Test Requirements — Iteration

| ID | Scenario | Expected |
|---|---|---|
| IT-01 | Empty array | Empty output |
| IT-02 | One element | One block |
| IT-03 | Multiple elements | Correct separator |
| IT-04 | Non-array source | Error |
| IT-05 | Nested property interpolation | Correct |

---

# 71. Test Requirements — Structured JSON

| ID | Scenario | Expected |
|---|---|---|
| JS-01 | String value | Valid JSON |
| JS-02 | Boolean variable | Boolean preserved |
| JS-03 | Array variable | Array preserved |
| JS-04 | Object variable | Object preserved |
| JS-05 | Pretty print | Two spaces |
| JS-06 | Final newline | Present |

---

# 72. Test Requirements — Determinism

Two rendering calls using:

```text
same template
same context
same frozen clock
```

must return byte-identical content.

---

# 73. Performance Expectations

Template generation is not performance critical relative to filesystem/process operations, but the architecture should avoid unnecessary repeated parsing.

Expected sequence:

```text
repository initialize
    → parse once
    → validate once
    → cache

render
    → retrieve cached definition
    → render
```

---

# 74. Logging

Recommended debug logging:

```text
Template repository initialized: 34 definitions
Rendering template: nuxt.component.vue
Resolved publish name: UserProfile.vue
Included fragment: block.file-header
Rendered template successfully
```

Template content itself should not normally be logged.

---

# 75. Security Tests

Required cases include:

- path traversal;
- unknown transform injection;
- attempted JavaScript expression;
- prototype-sensitive object keys;
- cyclic fragments;
- extreme recursive composition depth;
- malformed definitions.

No template-controlled value may be executed as JavaScript or shell input by the engine.

---

# 76. Acceptance Criteria

The first Template Engine release is complete when:

1. the repository descriptor is redesigned;
2. individual JSON template definitions are discoverable;
3. templates require no registration in source code;
4. definition schemas are runtime validated;
5. variable defaults and required values work;
6. filename patterns work;
7. transformations work;
8. reusable fragments work;
9. conditions work;
10. iteration works;
11. file rendering works;
12. structured JSON rendering works;
13. collections can generate multiple artifacts;
14. generated artifacts are returned without direct writes;
15. users can add a valid `.json` template without rebuilding AppManager;
16. repository-wide validation is available programmatically;
17. at least representative legacy templates have parity tests;
18. no arbitrary executable code can be embedded in a template definition.

---

# 77. Final Functional Contract

A generation request shall follow this sequence:

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
Resolve Publish Name
    │
    ▼
Resolve Conditions / Iterations
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

Nothing in this pipeline performs persistence.

The caller then decides whether those artifacts should be:

```text
previewed
validated
diffed
written
replaced
or discarded
```

This separation is the central functional guarantee of the subsystem.