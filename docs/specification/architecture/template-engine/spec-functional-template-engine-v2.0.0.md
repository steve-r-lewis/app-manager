# AppManager Template Engine — Functional Specification

**Component:** Template Engine  
**Specification Type:** Functional / Implementation Contract  
**Documentation Path:** `docs/specification/architecture/template-engine/spec-template-engine-functional-v02.md`  
**Runtime Code:** `app/template-engine/**`  
**Template Repository:** `app_manager/templates/**`  
**Project:** `app-manager`  
**Language:** TypeScript / JSON  
**Specification Version:** 2.0.0  
**Status:** Proposed Canonical Functional Specification

---

# 1. Purpose

This specification defines the externally observable behaviour and implementation contract of the AppManager Template Engine.

It defines:

- repository discovery;
- template loading;
- runtime validation;
- template lookup;
- variable resolution;
- interpolation;
- transforms;
- publication-name resolution;
- fragments;
- conditional rendering;
- iteration;
- structured rendering;
- collections;
- render results;
- errors;
- caching;
- validation;
- testing;
- licence-template integration.

The Template Engine shall remain generic.

Domain-specific systems may produce or maintain definitions stored in the Template Repository, but their lifecycle responsibilities remain outside the Template Engine.

---

# 2. Principal Interface

Recommended public interface:

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

---

# 3. Template Context

Recommended type:

```ts
export type TemplateContext =
  Record<string, unknown>;
```

The Template Engine must not require a domain-specific context interface for every template.

Individual template definitions declare their own variables.

---

# 4. Render Options

Recommended options:

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
clock = current system time
```

A supplied clock overrides real time for all Template Engine system variables during that render.

---

# 5. Render Result

```ts
export interface TemplateRenderResult {
  templateId: string;
  templateVersion: string;

  artifacts: GeneratedArtifact[];

  warnings: TemplateWarning[];

  trace?: TemplateRenderTrace;
}
```

---

# 6. Generated Artifact

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

The Template Engine does not write this artifact to disk.

---

# 7. Template Repository Interface

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

# 8. Repository Initialization

`initialize()` shall:

1. locate `app_manager/templates`;
2. load `template-repository.json`;
3. parse the descriptor;
4. validate the descriptor;
5. evaluate discovery include rules;
6. evaluate exclusion rules;
7. recursively discover candidate JSON files;
8. parse each candidate;
9. validate each definition;
10. index valid templates by `templateId`;
11. detect duplicates;
12. make the catalogue available to consumers.

---

# 9. Repository Descriptor

The canonical repository descriptor is:

```text
app_manager/templates/template-repository.json
```

Representative shape:

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

---

# 10. Repository Descriptor Is Not a Template

`template-repository.json` shall not itself be loaded as a renderable template.

---

# 11. Filesystem Discovery

The repository shall recursively discover:

```text
app_manager/templates/**/*.json
```

subject to exclusion rules.

Examples include:

```text
app_manager/templates/blocks/file-header.json
app_manager/templates/nuxt/vue-component.json
app_manager/templates/package/package-json.json
app_manager/templates/licenses/mit-license.json
```

---

# 12. Adding a New Template

A valid new template placed in the discovery tree shall require:

```text
zero application source-code changes
```

to become available after repository initialization or reload.

---

# 13. Repository Reload

`reload()` shall:

1. discard or invalidate definition caches;
2. re-read the repository descriptor;
3. repeat discovery;
4. repeat validation;
5. rebuild the template index;
6. report errors.

Continuous filesystem watching is not required.

---

# 14. Duplicate IDs

If two discovered templates define the same `templateId` at the same precedence level:

```text
TEMPLATE_DUPLICATE_ID
```

shall be raised.

The repository must not silently select one.

---

# 15. Template Retrieval

`get(templateId)`:

- returns the definition if available;
- returns `undefined` if unavailable.

`require(templateId)`:

- returns the definition if available;
- throws `TEMPLATE_NOT_FOUND` if unavailable.

---

# 16. Template Query

Recommended interface:

```ts
export interface TemplateQuery {
  category?: string;
  kind?: TemplateKind;
  tags?: string[];
  publishName?: string;
}
```

Multiple filter properties should use AND semantics unless documented otherwise.

---

# 17. Template Descriptor

Recommended shape:

```ts
export interface TemplateDescriptor {
  templateId: string;
  templateName: string;
  templateVersion: string;
  templateKind: TemplateKind;
  category?: string;
  description?: string;
  publishName?: string | null;
  tags?: string[];
  sourcePath: string;
}
```

---

# 18. Definition Schema

Every template shall include:

```text
schemaVersion
templateId
templateName
templateVersion
templateKind
```

A `file` template shall normally also include:

```text
templatePublishName
```

unless its publication name is explicitly supplied through defined collection semantics.

---

# 19. Representative File Definition

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
  "variables": {
    "componentName": {
      "type": "string",
      "required": true
    }
  },
  "content": "<template>\n</template>\n"
}
```

---

# 20. Schema Version Validation

A definition declaring an unsupported schema major version shall fail with:

```text
TEMPLATE_SCHEMA_UNSUPPORTED
```

---

# 21. Template Version

`templateVersion` is the version of the individual template.

The Template Engine shall return it in every generated artifact.

---

# 22. Template Kinds

Required initial kinds:

```ts
export type TemplateKind =
  | 'file'
  | 'fragment'
  | 'collection';
```

---

# 23. File Template Behaviour

Rendering a file template shall normally return exactly one artifact.

---

# 24. Fragment Behaviour

A fragment is intended for composition and does not independently produce a filesystem artifact.

Calling `render()` directly on a fragment may either:

1. return a content-only artifact with `publishName: null`; or
2. use a dedicated fragment render result internally.

The chosen implementation must remain consistent.

The preferred external representation is an artifact with:

```ts
publishName: null;
```

---

# 25. Collection Behaviour

A collection may return zero, one or many generated artifacts depending on conditional members.

---

# 26. Variable Definitions

Representative variable definition:

```json
{
  "componentName": {
    "type": "string",
    "required": true,
    "description": "Logical component name."
  }
}
```

---

# 27. Supported Variable Types

Initial types:

```text
string
number
boolean
array
object
enum
```

---

# 28. Required Variable Validation

For every `required: true` variable:

- a value must exist in explicit context; or
- the template must provide a valid default.

Otherwise:

```text
TEMPLATE_CONTEXT_MISSING
```

---

# 29. Optional Variables

For `required: false` variables:

- absence is permitted;
- interpolation still requires that the template handle absence safely.

In strict mode, directly interpolating an unresolved optional value shall fail rather than emit `undefined`.

---

# 30. Default Values

Variable resolution order is:

```text
explicit context value
        ↓
template default
        ↓
missing
```

The Template Engine shall not ask other application systems for fallback values.

---

# 31. Context Type Validation

A supplied context value incompatible with the declared variable type shall fail:

```text
TEMPLATE_CONTEXT_INVALID
```

Example:

```text
expected number for year
received string
```

---

# 32. Enum Validation

Example:

```json
{
  "visibility": {
    "type": "enum",
    "values": [
      "public",
      "private"
    ],
    "required": true
  }
}
```

Supplying another value shall fail context validation.

---

# 33. Nested Context Values

Interpolation shall support dot notation:

```text
{{author.name}}
{{author.email}}
{{package.name}}
```

Missing intermediate values follow normal missing-variable semantics.

---

# 34. Interpolation

Simple interpolation:

```text
{{componentName}}
```

shall replace the token with the resolved value.

---

# 35. String Conversion

When an interpolation token forms part of a larger text string, the resolved value shall be converted to its textual representation according to defined Template Engine rules.

Objects and arrays should not be implicitly converted to `[object Object]`.

They require an explicit transform such as:

```text
| json
```

unless the target renderer handles native values structurally.

---

# 36. Transform Syntax

```text
{{value | transform}}
```

Multiple transforms may be supported sequentially:

```text
{{name | trim | pascalCase}}
```

if included in the initial grammar.

---

# 37. Transform Whitelist

Initial transforms:

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

# 38. Unknown Transform

An unknown transform shall produce:

```text
TEMPLATE_TRANSFORM_UNKNOWN
```

---

# 39. No User-Defined Executable Transforms

JSON definitions must not embed JavaScript functions or function references.

Additional transforms require application-code implementation and explicit registration as trusted Template Engine capabilities.

---

# 40. Render Clock

When `options.clock` is supplied, all time-derived system values must use that exact clock.

Example system values:

```text
system.year
system.date
system.time
system.timestamp
```

---

# 41. Deterministic Clock Testing

A template using:

```text
{{system.year}}
```

rendered with:

```ts
clock: new Date('2030-01-01T12:00:00Z')
```

must always resolve against that supplied time.

---

# 42. Publish Name Resolution

`templatePublishName` is rendered using the same safe interpolation mechanism as content.

Example:

```json
{
  "templatePublishName": "{{componentName | pascalCase}}.vue"
}
```

---

# 43. Empty Publish Name

A file template whose resolved publish name is empty shall fail with:

```text
TEMPLATE_PUBLISH_NAME_INVALID
```

---

# 44. Publish Path

Optional:

```json
{
  "templatePublishPath": "components"
}
```

may be combined with `templatePublishName`.

The Template Engine shall return:

```ts
relativePath: 'components';
publishName: 'Example.vue';
```

or an equivalent canonical representation.

---

# 45. Path Traversal Protection

After interpolation, the Template Engine shall reject path values containing traversal outside the intended relative output boundary.

Examples rejected:

```text
../
../../
..\..\
```

Error:

```text
TEMPLATE_PATH_TRAVERSAL
```

---

# 46. Absolute Path Protection

Template definitions shall not normally be permitted to generate arbitrary absolute output paths.

The Template Engine should return relative publication information only.

---

# 47. Text Content

Simple text template:

```json
{
  "format": "text",
  "content": "export const name = '{{name}}';\n"
}
```

---

# 48. Parts

A complex template may use:

```json
{
  "parts": [
    {
      "template": "block.file-header"
    },
    {
      "content": "\n"
    },
    {
      "content": "export default {};\n"
    }
  ]
}
```

---

# 49. Root Content and Parts

Unless a future schema explicitly defines otherwise, a definition shall not provide both root:

```text
content
```

and:

```text
parts
```

simultaneously.

Such a definition should fail schema validation.

---

# 50. Fragment Invocation

A fragment may be referenced by:

```json
{
  "template": "block.file-header"
}
```

---

# 51. Fragment Context Mapping

Preferred fragment use:

```json
{
  "template": "block.file-header",
  "with": {
    "projectName": "{{projectName}}",
    "author": "{{author}}"
  }
}
```

Explicit variable mapping is preferred over automatic context inheritance.

---

# 52. Fragment Context Isolation

By default, a fragment should receive only:

- explicitly mapped values; and
- explicitly defined system context.

Automatic inheritance of all caller variables should not be the initial default because it makes fragment dependencies implicit.

---

# 53. Missing Fragment

A missing fragment shall fail with:

```text
TEMPLATE_FRAGMENT_NOT_FOUND
```

The error should identify both the requesting template and missing template ID.

---

# 54. Recursive Composition

Fragments may reference other fragments.

The engine shall maintain a composition stack.

---

# 55. Composition Cycle Detection

If a template ID already exists in the active composition stack:

```text
TEMPLATE_COMPOSITION_CYCLE
```

shall be thrown.

The error should include the cycle where possible.

Example:

```text
block.a → block.b → block.c → block.a
```

---

# 56. Conditions

Representative condition:

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

# 57. Conditional Operators

Supported operators:

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

# 58. Equals

```json
{
  "variable": "typescript",
  "equals": true
}
```

renders the guarded part only when strict equality or schema-defined equivalent equality succeeds.

---

# 59. Exists

`exists` is true if the value is present.

Presence shall be distinguished from truthiness.

For example:

```text
false exists
0 exists
"" exists
```

if those are valid supplied values.

---

# 60. Includes

`includes` may operate on:

- arrays;
- strings;

according to type-safe rules.

Invalid operand types shall produce:

```text
TEMPLATE_CONDITION_INVALID
```

---

# 61. Else Branch

Example:

```json
{
  "when": {
    "variable": "typescript",
    "truthy": true
  },
  "content": "<script setup lang=\"ts\">\n</script>\n",
  "else": {
    "content": "<script setup>\n</script>\n"
  }
}
```

---

# 62. No Arbitrary Expressions

The following shall not be permitted:

```text
{{ eval(...) }}
{{ process.env.SECRET }}
{{ require(...) }}
{{ someFunction() }}
```

---

# 63. Iteration

Representative iteration:

```json
{
  "forEach": {
    "source": "modules",
    "item": "module"
  },
  "content": "{{module.name}}\n"
}
```

---

# 64. Iteration Source

The source must resolve to an array.

Otherwise:

```text
TEMPLATE_ITERATION_INVALID
```

---

# 65. Iteration Item Binding

For each element:

```text
item = current element
```

may be interpolated normally.

Nested values are permitted.

---

# 66. Iteration Index

The schema may optionally support:

```json
{
  "index": "index"
}
```

yielding:

```text
{{index}}
```

inside the repeated part.

---

# 67. Iteration Separator

Optional:

```json
{
  "separator": ",\n"
}
```

shall render only between entries.

---

# 68. Empty Iteration

An empty source array renders no repeated content unless an explicit fallback is defined.

---

# 69. Structured JSON Templates

A JSON template may define:

```json
{
  "format": "json",
  "document": {
    "name": "{{packageName}}",
    "private": "{{private}}"
  }
}
```

---

# 70. Native Value Preservation

When a structured property value is exactly one interpolation token, the underlying native type shall be preserved.

For:

```ts
private = true;
```

output:

```json
{
  "private": true
}
```

not:

```json
{
  "private": "true"
}
```

---

# 71. Embedded Structured Interpolation

A token embedded in a larger string remains text.

Example:

```json
{
  "description": "Package for {{projectName}}"
}
```

always produces a string.

---

# 72. JSON Serialization

Default JSON output:

- two spaces;
- no comments;
- valid JSON;
- final newline.

---

# 73. YAML Renderer

When implemented, YAML rendering shall:

- preserve native types;
- use deterministic output;
- avoid template-specific logic.

---

# 74. TOML Renderer

When implemented, TOML rendering shall follow the same generic principles.

---

# 75. Collections

Representative definition:

```json
{
  "schemaVersion": "1.0.0",
  "templateId": "nuxt.component.with-test",
  "templateName": "Vue Component With Test",
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

---

# 76. Collection Member Context

Each member may provide:

```json
{
  "with": {}
}
```

to map parent context to child context.

---

# 77. Conditional Collection Members

A collection member may include a `when` rule.

For example, a test file may only be included when:

```text
generateTests = true
```

---

# 78. Collection Result

All generated child artifacts shall be flattened into the parent result.

---

# 79. Duplicate Artifact Paths in Collections

If two child templates resolve to the same target relative path and publish name, the Template Engine shall report a collision.

This may use:

```text
TEMPLATE_RENDER_FAILED
```

or a dedicated future error such as:

```text
TEMPLATE_ARTIFACT_COLLISION
```

A dedicated error is preferred.

---

# 80. Validation API

`validate(templateId, context)` shall validate without requiring final filesystem output.

Recommended result:

```ts
export interface TemplateValidationResult {
  valid: boolean;
  errors: TemplateValidationIssue[];
  warnings: TemplateWarning[];
}
```

---

# 81. Definition Validation

Definition validation checks:

- JSON structure;
- required fields;
- valid schema version;
- valid template kind;
- variable definitions;
- content/parts rules;
- valid condition syntax;
- valid iteration syntax;
- valid collection structure.

---

# 82. Context Validation

Context validation checks:

- required values;
- value types;
- enum membership;
- optionally unknown context values according to policy.

Extra unused context properties should normally be allowed.

---

# 83. Repository Validation

`validateAll()` shall:

1. discover all templates;
2. validate every definition;
3. check duplicate IDs;
4. check static fragment references where possible;
5. check collection references;
6. report all errors rather than only the first.

---

# 84. Domain Metadata Extensions

A template may include domain metadata not interpreted by the generic renderer.

Example:

```json
{
  "license": {
    "licenseId": "mit"
  }
}
```

The Template Engine shall:

- preserve the metadata;
- permit it when allowed by the definition schema;
- expose it through `getDefinition()`;
- not infer domain-specific behaviour from it.

---

# 85. Licence Template Repository Location

Licence template definitions shall be stored under:

```text
app_manager/templates/licenses/
```

Examples:

```text
mit-license.json
apache-2-0-license.json
gpl-3-0-license.json
bsd-3-clause-license.json
```

---

# 86. Licence Templates Participate in Normal Discovery

No special Template Repository registration is required.

For example:

```text
app_manager/templates/licenses/mit-license.json
```

shall be discovered because it matches the general repository discovery rule.

---

# 87. Licence Template Example

Representative structure:

```json
{
  "schemaVersion": "1.0.0",

  "templateId": "license.mit",
  "templateName": "MIT License",

  "templateVersion": "1.0.0",
  "templateKind": "file",

  "category": "license",

  "templatePublishName": "LICENSE",

  "format": "text",
  "encoding": "utf-8",

  "variables": {
    "year": {
      "type": "number",
      "required": true
    },

    "author": {
      "type": "string",
      "required": true
    }
  },

  "license": {
    "licenseId": "mit",
    "spdxId": "MIT",
    "approved": true,

    "sourceType": "osi-api",

    "source": {
      "authority": "Open Source Initiative",
      "catalogueUrl": "https://opensource.org/license/mit",
      "canonicalTextUrl": null
    },

    "provenance": {
      "retrievedAt": null,
      "checkedAt": null,
      "sourceHash": null,
      "contentHash": null
    }
  },

  "content": "Copyright {{year}} {{author}}\n\n..."
}
```

---

# 88. Licence Template Base Validation

The Template Engine validates licence templates using ordinary Template Engine rules:

- schema version;
- template ID;
- template kind;
- publish name;
- variables;
- interpolation;
- content;
- paths.

---

# 89. Licence Domain Validation Is External

The Template Engine shall not determine whether:

- a licence is OSI-approved;
- a source is authoritative;
- licence text is complete;
- the SPDX ID is correct;
- the licence changed upstream;
- provenance hashes are correct;
- the licence template should be refreshed.

Those responsibilities belong to the Licence Engine.

---

# 90. Licence Engine Catalogue

The Licence Engine maintains:

```text
app_manager/licenses-engine/opensource-license-index.json
```

The Template Engine shall not load this file as a template.

---

# 91. Licence Template Lifecycle

Creation and update of:

```text
app_manager/templates/licenses/*.json
```

may be performed programmatically by the Licence Engine.

The Template Repository shall treat those resulting files exactly like valid definitions created by any other trusted source.

---

# 92. Licence Generation

Normal licence generation is:

```text
Licence Engine / Orchestrator
        ↓
TemplateEngine.render("license.mit", context)
        ↓
GeneratedArtifact
```

No network activity shall occur in `TemplateEngine.render()`.

---

# 93. Licence Update Checks

A licence update check shall not be initiated by:

```text
TemplateEngine.render()
```

or:

```text
TemplateRepository.require()
```

The Licence Engine controls update timing.

---

# 94. Licence Template Mutation

The Template Engine shall never modify an existing licence template definition during rendering.

This is equally true for all other templates.

---

# 95. Repository Cache and Licence Updates

When the Licence Engine replaces or adds a licence definition, it or its orchestrating workflow shall invoke:

```ts
templateRepository.reload();
```

or an equivalent targeted cache invalidation mechanism before expecting the Template Engine to use the new definition in the same process.

---

# 96. Public Engine Render Flow

`render(templateId, context, options)` shall:

1. call `TemplateRepository.require(templateId)`;
2. obtain validated definition;
3. validate context;
4. apply defaults;
5. create fixed render environment;
6. resolve publication name/path where applicable;
7. render definition according to kind;
8. resolve conditions;
9. resolve iterations;
10. resolve fragments;
11. interpolate values;
12. invoke format renderer;
13. produce artifact(s);
14. produce warnings;
15. produce optional trace;
16. return result.

---

# 97. File Template Render Flow

```text
TemplateDefinition
    ↓
context validation
    ↓
defaults
    ↓
publish-name resolution
    ↓
content / parts
    ↓
conditions
    ↓
iteration
    ↓
fragments
    ↓
interpolation
    ↓
renderer
    ↓
GeneratedArtifact
```

---

# 98. Fragment Render Flow

```text
fragment definition
    ↓
mapped context
    ↓
validation
    ↓
conditions / loops / nested fragments
    ↓
interpolation
    ↓
string result
```

---

# 99. Collection Render Flow

```text
collection definition
    ↓
validate parent context
    ↓
for each member
    ↓
evaluate condition
    ↓
map context
    ↓
render child template
    ↓
flatten artifacts
    ↓
detect duplicate paths
    ↓
TemplateRenderResult
```

---

# 100. Strict Variables Default

`strictVariables` shall default to:

```text
true
```

This prevents accidental generated output containing unresolved markers or implicit `"undefined"` values.

---

# 101. Unresolved Interpolation Token

An unresolved required interpolation token in strict mode shall produce:

```text
TEMPLATE_INTERPOLATION_ERROR
```

or the more specific context error when detected earlier.

---

# 102. Literal Delimiters

The grammar must define an escaping mechanism if users need to output a literal:

```text
{{...}}
```

sequence.

The specific escape syntax shall be documented alongside parser implementation.

Until escape syntax is implemented, templates requiring literal delimiters must use an alternative safe representation.

---

# 103. Rendering Warnings

Warnings may include:

- deprecated template field;
- deprecated transform;
- unused declared variable;
- unused supplied context value if strict diagnostics are enabled;
- deprecated template version.

Warnings shall not silently change rendering.

---

# 104. Trace

Representative trace:

```ts
export interface TemplateRenderTrace {
  variables: TemplateVariableTrace[];
  fragments: string[];
  conditions: TemplateConditionTrace[];
  iterations: TemplateIterationTrace[];
  resolvedPublishNames: string[];
}
```

Trace output is diagnostic only.

---

# 105. Sensitive Value Redaction

Values such as tokens, credentials or secrets must not be exposed through tracing.

Templates should generally not be used to embed secrets unless explicitly required by a secure workflow.

---

# 106. Error Codes

Required initial error set:

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
TEMPLATE_ARTIFACT_COLLISION
TEMPLATE_RENDER_FAILED
```

---

# 107. Error Details

Errors should include appropriate details such as:

```ts
{
  templateId?: string;
  sourcePath?: string;
  field?: string;
  variable?: string;
  fragmentId?: string;
}
```

Sensitive values must not be included unnecessarily.

---

# 108. Typed Error

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

# 109. Cache Behaviour

The Template Repository may cache:

- parsed JSON;
- validated definitions;
- descriptor indexes.

---

# 110. Cache Invalidation

`reload()` shall invalidate cached repository state.

The engine must not continue indefinitely using a deleted or replaced definition after an explicit reload.

---

# 111. No Render-Side Persistence

The Template Engine shall not:

```ts
fs.writeFile(...)
```

to final generated destinations as part of `render()`.

---

# 112. No Render-Side Network Access

The Template Engine shall not:

- fetch URLs;
- call APIs;
- query GitHub;
- query OSI;
- query package registries;
- call LLM providers.

---

# 113. No Render-Side Prompting

The Template Engine shall not import or use interactive prompt libraries to resolve missing values.

Missing required context must be reported to the caller.

---

# 114. No Render-Side Settings Resolution

The Template Engine shall not call:

```text
ConfigService.resolve()
SettingsResolver
```

during rendering.

Values must be supplied by the caller.

---

# 115. Security — Executable Content

The parser shall not execute template-supplied source code.

Fields containing JavaScript-looking content are treated as plain output data unless the template is explicitly generating a JavaScript/TypeScript file.

---

# 116. Security — Paths

Publication paths shall reject:

- NUL;
- traversal;
- unauthorised absolute paths;
- malformed path values.

---

# 117. Security — Repository Files

A malformed or malicious template definition must fail validation without affecting unrelated valid templates beyond the configured repository failure policy.

For application startup, the preferred policy is to report repository validation failure clearly rather than silently ignoring malformed built-in templates.

---

# 118. Generic Engine Unit Tests

Required test categories:

```text
interpolation
transforms
defaults
validation
conditions
iteration
composition
publish names
structured formats
collections
security
determinism
```

---

# 119. Repository Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| TR-01 | Valid repository | Initializes |
| TR-02 | Missing repository descriptor | Structured error |
| TR-03 | Malformed descriptor | Structured error |
| TR-04 | Valid template discovered recursively | Indexed |
| TR-05 | Excluded file | Not indexed |
| TR-06 | Duplicate template ID | Fails |
| TR-07 | Invalid definition | Reported |
| TR-08 | New file + reload | New template available |
| TR-09 | Licence template in `licenses/` | Indexed normally |

---

# 120. Interpolation Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| TI-01 | Simple variable | Replaced |
| TI-02 | Nested variable | Replaced |
| TI-03 | Required missing | Error |
| TI-04 | Optional with default | Default used |
| TI-05 | Unknown transform | Error |
| TI-06 | Pascal transform | Correct value |
| TI-07 | Kebab transform | Correct value |
| TI-08 | JSON transform | Valid encoded value |

---

# 121. Publish Name Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| PN-01 | Static name | Correct |
| PN-02 | Patterned name | Correct |
| PN-03 | Missing variable | Error |
| PN-04 | Empty result | Error |
| PN-05 | Traversal | Rejected |
| PN-06 | Absolute path | Rejected |

---

# 122. Fragment Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| TF-01 | Valid fragment | Rendered |
| TF-02 | Missing fragment | Error |
| TF-03 | Mapped context | Correct |
| TF-04 | Nested fragments | Correct |
| TF-05 | Composition cycle | Error |

---

# 123. Condition Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| TC-01 | equals true | Included |
| TC-02 | equals false | Excluded |
| TC-03 | else branch | Correct branch |
| TC-04 | exists on `false` | Exists |
| TC-05 | invalid operator | Error |
| TC-06 | invalid operand | Error |

---

# 124. Iteration Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| IT-01 | Array | Repeated |
| IT-02 | Empty array | Empty |
| IT-03 | Non-array | Error |
| IT-04 | Separator | Correct |
| IT-05 | Nested item fields | Correct |
| IT-06 | Index | Correct |

---

# 125. JSON Renderer Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| JR-01 | String field | String |
| JR-02 | Boolean token | Boolean |
| JR-03 | Array token | Array |
| JR-04 | Object token | Object |
| JR-05 | Embedded token | String |
| JR-06 | Output formatting | 2-space + newline |

---

# 126. Collection Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| CL-01 | Two child files | Two artifacts |
| CL-02 | Conditional child disabled | Omitted |
| CL-03 | Missing child template | Error |
| CL-04 | Context mapping | Correct |
| CL-05 | Duplicate output path | Collision error |

---

# 127. Licence Template Integration Tests

Generic Template Engine tests shall verify:

| ID | Scenario | Expected Result |
|---|---|---|
| LT-01 | `mit-license.json` discovered | Indexed |
| LT-02 | `templateId = license.mit` | Retrievable |
| LT-03 | Valid context | `LICENSE` artifact |
| LT-04 | Required licence variable missing | Context error |
| LT-05 | Offline environment | Render succeeds |
| LT-06 | Domain metadata present | Preserved |
| LT-07 | OSI index unavailable | Render unaffected |

The Licence Engine shall maintain its own additional tests for source integrity and legal completeness.

---

# 128. Determinism Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| DT-01 | Same static template | Byte-identical |
| DT-02 | Same context | Byte-identical |
| DT-03 | Same fixed clock | Byte-identical |
| DT-04 | Different fixed clock | Time-derived values change predictably |

---

# 129. Security Test Matrix

| ID | Scenario | Expected Result |
|---|---|---|
| ST-01 | `eval`-style expression | Not executed |
| ST-02 | Function expression | Not executed |
| ST-03 | Traversal publish name | Rejected |
| ST-04 | Absolute output path | Rejected |
| ST-05 | Composition cycle | Rejected |
| ST-06 | Arbitrary unknown transform | Rejected |

---

# 130. Repository Contract Test

A repository-wide test shall recursively inspect:

```text
app_manager/templates/**/*.json
```

excluding repository control files.

Every candidate must:

1. parse;
2. validate;
3. possess a unique `templateId`;
4. satisfy template-kind rules;
5. pass static reference validation where possible.

---

# 131. Licence Contract Test Boundary

The generic repository test verifies that a licence file is a valid Template Engine definition.

A separate Licence Engine repository test verifies:

- source authority;
- provenance;
- hashes;
- SPDX mapping;
- completeness;
- update state.

This distinction is mandatory.

---

# 132. Legacy Template Migration Tests

Before removing a legacy TypeScript template:

1. create representative legacy output fixture;
2. render new JSON definition using same input;
3. compare;
4. document intentional differences;
5. accept parity or deliberate correction.

---

# 133. Known Defects Must Not Become Parity Requirements

Migration parity shall not require reproduction of known defects.

Examples include:

- incomplete GPLv3 text;
- unsafe `.gitmodules` defaults;
- personal values in `.env.example`;
- duplicated or diverged Vitest definitions.

Correcting such issues shall be documented as intentional migration changes.

---

# 134. Template Repository Migration Sequence

Recommended sequence:

## Phase 1 — Engine Foundation

Implement:

- repository discovery;
- schemas;
- interpolation;
- output names;
- text renderer.

## Phase 2 — Simple Static Templates

Migrate:

- `.editorconfig`;
- `.npmrc`;
- `.nuxtrc`.

## Phase 3 — Fragments and Composite Text

Migrate:

- file header;
- Nuxt config;
- Vue component;
- TypeScript source templates;
- README.

## Phase 4 — Structured Documents

Migrate:

- `package.json`;
- `tsconfig`;
- other structured configuration.

## Phase 5 — Licence Integration

Ensure:

```text
app_manager/templates/licenses/*.json
```

is supported as ordinary Template Repository content while leaving acquisition and update lifecycle with the Licence Engine.

## Phase 6 — Repository Split Completion

Remove migrated records from the old aggregate template data file.

## Phase 7 — Legacy Source Removal

Remove old `app/templates/**` template functions only after consumers have migrated and tests pass.

---

# 135. Compatibility Adapter

During migration:

```ts
export async function renderLegacyTemplate(
  legacyName: string,
  context: Record<string, unknown>,
): Promise<string> {
  const templateId = legacyTemplateMap[legacyName];

  const result = await templateEngine.render(
    templateId,
    context,
  );

  return result.artifacts[0].content;
}
```

The legacy map is temporary migration infrastructure.

---

# 136. Consumer Migration

A migrated consumer should eventually use semantic template IDs directly.

Example:

```ts
const result = await templateEngine.render(
  'nuxt.component.vue',
  {
    componentName,
  },
);
```

rather than importing a template-specific TypeScript function.

---

# 137. Licence Consumer Migration

A licence consumer should not call a hardcoded function such as:

```text
mitLicenseTemplate(...)
```

Instead:

```text
resolve licence
    ↓
LicenceEngine
    ↓
TemplateEngine.render("license.mit", context)
```

The Licence Engine remains responsible for confirming that `license.mit` is a valid locally maintained licence definition.

---

# 138. Acceptance Criteria

Template Engine Version 2 is functionally complete when:

1. `template-repository.json` contains repository metadata rather than embedded template records;
2. individual template definitions are stored beneath `app_manager/templates/`;
3. recursive discovery works;
4. new definitions require no source registration;
5. runtime definition validation works;
6. required variables work;
7. defaults work;
8. type validation works;
9. filename patterns work;
10. path validation works;
11. transforms work;
12. fragments work;
13. nested fragments work;
14. composition cycles are detected;
15. conditions work;
16. else branches work;
17. iteration works;
18. structured JSON rendering works;
19. native JSON types are preserved;
20. collections work;
21. duplicate output collisions are detected;
22. generated artifacts are returned without final filesystem writes;
23. repository reload discovers new definitions;
24. repository-wide validation works;
25. deterministic rendering is demonstrated;
26. arbitrary code execution is unavailable;
27. licence definitions under `templates/licenses/` are discovered normally;
28. licence rendering performs no network operation;
29. licence-domain metadata is preserved but not interpreted by the generic renderer;
30. Licence Engine lifecycle concerns remain outside Template Engine implementation.

---

# 139. Canonical Runtime Pipeline

```text
templateId
    ↓
TemplateRepository.require()
    ↓
TemplateDefinition
    ↓
schema validation
    ↓
context validation
    ↓
defaults
    ↓
fixed render environment
    ↓
publish-name/path resolution
    ↓
condition processing
    ↓
iteration processing
    ↓
fragment composition
    ↓
interpolation
    ↓
format rendering
    ↓
GeneratedArtifact[]
    ↓
TemplateRenderResult
```

---

# 140. Canonical Licence Runtime Pipeline

```text
resolved licence ID
    ↓
Licence Engine
    ↓
templateId = license.<id>
    ↓
TemplateRepository.require()
    ↓
local licence template
    ↓
TemplateEngine.render()
    ↓
GeneratedArtifact
    ↓
caller / orchestrator
    ↓
FileService
    ↓
LICENSE
```

This pipeline shall not access:

```text
opensource.org
SPDX
licence steward websites
```

during rendering.

---

# 141. Canonical Licence Maintenance Pipeline

This pipeline exists outside the Template Engine:

```text
Open Source Initiative / licence steward
        ↓
Licence Engine
        ↓
validate / compare / hash
        ↓
app_manager/licenses-engine/
opensource-license-index.json
        +
app_manager/templates/licenses/*.json
```

When a definition changes, the Template Repository may subsequently be reloaded.

---

# 142. Final Functional Rule

> **The Template Engine must remain capable of rendering any valid definition solely from local template data, supplied context and controlled system context.**

And for domain-managed templates:

> **A domain subsystem may create, update and validate the lifecycle of a template definition, but once rendering begins, that definition is processed using the same generic Template Engine contract as every other template.**

For licence templates specifically:

> **The Licence Engine owns acquisition, provenance, integrity and updates. The Template Engine owns validation of the generic template structure and deterministic rendering into the final `LICENSE` artifact.**