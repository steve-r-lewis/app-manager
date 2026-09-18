# AppManager Version 1 — Final Human-Readable Command Catalogue

This report is based on the **semantically complete command model** now represented on the post-PR #84 baseline. It deliberately describes commands in terms of **AppManager user intent**, rather than whichever Nuxt, Git, package-manager, filesystem, AI-provider, or other mechanism may ultimately perform the work.

The final Version 1 catalogue contains **96 canonical commands across eight domains**: App 8, Git 8, Nuxt 13, Docs 13, Quality 10, Settings 18, AI 22, and Maintenance 4. The AI review records the same final 96-command total.

A useful principle for reading the catalogue is:

> **A command tells the user what AppManager is being asked to accomplish. It does not merely expose the underlying tool command used to accomplish it.**

---

## 1. App Domain — 8 commands

The **App domain** provides the straightforward operational lifecycle of the managed **root Nuxt application**. It deliberately hides unnecessary monorepo, layer and provider complexity. Nuxt-aware structural/compositional work belongs to the Nuxt domain instead. The canonical eight-command surface and its intended meanings are explicitly defined by the App command-model correction.

| Command        | Human-readable purpose                                                                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app.create`   | **Create a new root Nuxt application.** Establishes a new managed root application using the selected creation profile and brings its initial application state under AppManager management. It creates the root application, not a Nuxt layer.                                                                    |
| `app.prepare`  | **Prepare an existing application for development or normal use.** Performs the readiness work required by an already-created managed root application without treating that application as something that needs to be created again.                                                                              |
| `app.develop`  | **Start the application's development environment.** Runs the root application's normal development lifecycle, such as the development server and associated development-time facilities.                                                                                                                          |
| `app.build`    | **Build the application for production.** Performs the root application's production build through the appropriate managed mechanism.                                                                                                                                                                              |
| `app.preview`  | **Preview the production build.** Runs the built application in its production-preview mode so the resulting build can be inspected before deployment or other downstream use.                                                                                                                                     |
| `app.generate` | **Generate or prerender the application.** Performs the ordinary Nuxt generation/prerender lifecycle for the root application where that mode is supported.                                                                                                                                                        |
| `app.clean`    | **Clean safely regenerable application state.** Removes recognised root-application build/cache state that AppManager knows can safely be regenerated. It is deliberately narrower and safer than arbitrary filesystem deletion.                                                                                   |
| `app.reset`    | **Reset the application's regenerable installation/build state.** Performs the broader reset needed to return the root application to a state from which it can subsequently be prepared again. Conceptually, “reinitialise” is therefore `reset` followed by `prepare`, rather than a separate canonical command. |

The distinction between the final two commands is important. **Clean** removes a bounded class of regenerable application artefacts; **reset** represents the more consequential application-level reset of approved regenerable installation/build state.

---

# 2. Git Domain — 8 commands

The **Git domain** owns the user's repository-management intent: inspection, repository establishment, committing, pushing, synchronisation, repository relationships and controlled remote deletion. It decides Git-domain policy and coordinates repository operations; the lower-level Repository Capability supplies bounded Git/repository primitives rather than deciding what the user's Git operation means.

The eight identities remain the established Git catalogue.

| Command                             | Human-readable purpose                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git.inspect`                       | **Inspect the Git state of managed repositories.** Presents repository status and relevant repository/remote/configuration facts without changing them. It can be used to understand the repository topology and current Git condition of the managed project.                                                                                                                                                                                                  |
| `git.initialise`                    | **Turn an eligible managed project location into a Git repository.** Establishes Git repository state where AppManager has determined that repository initialisation is appropriate. It does not simply initialise arbitrary reachable directories.                                                                                                                                                                                                             |
| `git.commit`                        | **Commit approved changes to one or more managed repositories.** Resolves the intended repository scope, eligible changes and commit message for each repository, then performs independent commits. A single invocation can deliberately target one repository, a selected repository set, or all eligible managed repositories. Optional AI-generated messages remain proposals accepted under Git-owned policy; they do not transfer commit authority to AI. |
| `git.push`                          | **Push managed repository changes to the appropriate remote/upstream.** Performs an authorised repository-scoped or coordinated push while retaining explicit repository and remote selection rather than relying blindly on provider defaults.                                                                                                                                                                                                                 |
| `git.synchronise`                   | **Reconcile a managed repository with its upstream state.** Coordinates the supported local/upstream synchronisation workflow and handles relevant divergence/conflict conditions. It is not simply an alias for blindly executing `git pull` followed by `git push`.                                                                                                                                                                                           |
| `git.establish-relationship`        | **Establish the intended relationship between a managed local repository and its remote repository.** Connects the appropriate local and remote repository identities under AppManager's repository-management model rather than assuming that a remote called `origin` is automatically authoritative.                                                                                                                                                         |
| `git.initialise-layer-repositories` | **Initialise repositories for eligible managed layers.** Coordinates repository establishment across the layer structure where those layers are intended to have their own repositories. This is a deliberate multi-repository Git workflow rather than generic directory traversal.                                                                                                                                                                            |
| `git.delete-remote-repository`      | **Delete an explicitly selected remote repository.** Provides the deliberately destructive remote-repository deletion operation, requiring exact target resolution and applicable authorisation. Discovery of a remote does not itself authorise deletion.                                                                                                                                                                                                      |

The coordinated `git.commit` behaviour is especially significant: **repository cardinality is scope, not command identity**. AppManager therefore does not need a separate `git.commit-all`.

---

# 3. Nuxt Domain — 13 commands

The **Nuxt domain** owns operations whose meaning depends specifically on **Nuxt structure, configuration, framework concepts, modules, layers, composition or advanced Nuxt tooling**.

This is the key boundary with App:

**App = simple root-application lifecycle.**
**Nuxt = Nuxt-aware structural/compositional/framework management.**

The corrected surface contains thirteen commands.

| Command                      | Human-readable purpose                                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nuxt.inspect`               | **Inspect the Nuxt structure of the managed project.** Provides a Nuxt-aware view of the root application, layers and relevant structural/compositional facts without modifying them.                                                                                                            |
| `nuxt.inspect-configuration` | **Inspect the effective Nuxt configuration of a selected Nuxt target.** Provides a detailed view of recognised configuration and its Nuxt meaning for the root application or applicable layer.                                                                                                  |
| `nuxt.list-configuration`    | **List recognised Nuxt configuration entries.** Gives a structured inventory of the configuration AppManager understands, useful when the user wants to discover what is configured rather than inspect one item in depth.                                                                       |
| `nuxt.add-configuration`     | **Add supported Nuxt configuration.** Introduces a recognised configuration item into the selected managed Nuxt target using structure-aware mutation rather than unsafe textual insertion.                                                                                                      |
| `nuxt.remove-configuration`  | **Remove supported Nuxt configuration.** Removes an explicitly selected recognised configuration item while preserving unrelated configuration and source content.                                                                                                                               |
| `nuxt.add`                   | **Add a supported Nuxt framework artefact.** Scaffolds a recognised Nuxt artefact—such as a component, composable, plugin, middleware, page or layout—at an explicitly selected managed Nuxt target. It is not generic arbitrary file creation.                                                  |
| `nuxt.add-module`            | **Add a Nuxt module to a managed Nuxt target.** Coordinates the dependency and Nuxt-configuration work necessary to establish the selected module correctly. Success means the module's required Nuxt state has been established, not merely that a package-install command exited successfully. |
| `nuxt.upgrade`               | **Upgrade an explicitly selected Nuxt target.** Applies an explicit supported version, range or upgrade policy to a root application or layer and verifies the resulting Nuxt state. It does not silently mean “upgrade everything to latest.”                                                   |
| `nuxt.analyze`               | **Analyse a Nuxt application or bundle.** Runs supported Nuxt-specific analysis and exposes the resulting evidence and diagnostics. Analysis findings do not themselves become a Quality pass/fail decision; Quality owns that interpretation when appropriate.                                  |
| `nuxt.cleanup`               | **Remove Nuxt-generated/cache state.** Cleans explicitly recognised state that Nuxt itself can regenerate for the selected target. It does not remove user-authored source, repositories, dependencies or unrelated application state.                                                           |
| `nuxt.create-layer`          | **Create a new managed Nuxt layer.** Establishes a new layer with the supported structure and metadata required for it to exist as a Nuxt layer. This is distinct from `app.create`, which creates the root application.                                                                         |
| `nuxt.integrate-layer`       | **Integrate a Nuxt layer into the managed application composition.** Establishes the required Nuxt/project relationship so the selected layer participates in the intended application structure.                                                                                                |
| `nuxt.detach-layer`          | **Detach a layer from the application's Nuxt composition.** Removes the selected integration relationship without pretending that detachment necessarily means deleting the layer, its source, or its repository.                                                                                |

The newer `nuxt.add`, `add-module`, `upgrade`, `analyze`, and `cleanup` operations explicitly resolve their managed targets and do not silently expand a root operation across the whole monorepo.

---

# 4. Docs Domain — 13 commands

The **Docs domain** owns documentation as a product intent: documenting the application, source, layers, tests and individual files; producing/updating documentation artefacts; extracting and aggregating documentation information; and operating the documentation site.

The canonical identities include the documentation-target commands plus the generation and site-lifecycle commands.

| Command                     | Human-readable purpose                                                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs.document-application` | **Document the application as a whole.** Produces or plans application-level documentation from recognised project facts and documentation policy.                                                                                                                 |
| `docs.document-source`      | **Document the project's source.** Produces documentation concerned with recognised source structure/content rather than the application overview or one particular file.                                                                                          |
| `docs.document-layers`      | **Document the project's layer architecture collectively.** Describes the managed Nuxt layer set and its relevant composition/relationships.                                                                                                                       |
| `docs.document-layer`       | **Document one selected managed layer.** Produces documentation specifically for an identified layer and its relevant structure and role.                                                                                                                          |
| `docs.document-tests`       | **Document the project's tests and testing structure.** Describes recognised tests/test organisation; it does not itself run the tests, because execution and evaluation belong to Quality.                                                                        |
| `docs.document-file`        | **Document a selected source or project file.** Produces documentation for a particular recognised file using the appropriate source/documentation evidence.                                                                                                       |
| `docs.generate`             | **Generate documentation artefacts.** Materialises planned documentation that does not already exist. A single authorised Docs intent may plan multiple targets and artefacts. Existing-target collisions are handled explicitly rather than silently overwritten. |
| `docs.update`               | **Update existing documentation.** Semantically revises existing documentation under Docs-owned policy while using the controlled source-transformation machinery appropriate to existing content.                                                                 |
| `docs.extract`              | **Extract useful documentation material from recognised project/source information.** Produces bounded documentation-oriented information that can be consumed directly or by subsequent Docs workflows.                                                           |
| `docs.aggregate`            | **Combine documentation material into a coherent aggregate.** Brings together recognised documentation information or artefacts according to Docs-owned structure rather than merely concatenating arbitrary files.                                                |
| `docs.develop`              | **Run the documentation site in development mode.** Starts the development workflow for the managed documentation system, such as its VitePress development environment.                                                                                           |
| `docs.build`                | **Build the documentation site.** Produces the deployable/static documentation build through the configured documentation provider.                                                                                                                                |
| `docs.preview`              | **Preview the built documentation site.** Runs the built documentation output in preview mode for human inspection.                                                                                                                                                |

Generation/update can coordinate multiple documentation artefacts in one intent, but each artefact retains its own generation/update/refusal/no-effect outcome. A failure later in a coordinated operation does not erase successful earlier effects.

---

# 5. Quality Domain — 10 commands

The **Quality domain** owns evaluation of the managed project's quality: tests, coverage, linting, type checking, validation and policy-based quality gates.

It deliberately distinguishes **technical execution evidence** from **quality interpretation**. A tool exiting successfully does not automatically mean every requested quality condition has passed.

The ten identities remain Quality-owned.

| Command              | Human-readable purpose                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `quality.test`       | **Run the project's applicable general/default test workflow.** Executes the recognised test activity appropriate to the selected managed scope and reports the resulting test evidence.                                                                                     |
| `quality.test-unit`  | **Run unit tests.** Executes the recognised unit-test suite for the selected scope and returns structured test results.                                                                                                                                                      |
| `quality.test-e2e`   | **Run end-to-end tests.** Executes the project's recognised E2E test workflow and reports its evidence independently from unit-test results.                                                                                                                                 |
| `quality.coverage`   | **Measure test coverage.** Obtains recognised coverage evidence and reports what was actually measured. Missing coverage information remains unknown/incomplete rather than being invented as zero.                                                                          |
| `quality.test-ui`    | **Launch the supported interactive test UI.** Opens the project's test-tool interface where supported. Successfully launching the UI is not equivalent to tests having passed.                                                                                               |
| `quality.lint`       | **Evaluate source against the project's recognised linting rules.** Reports lint findings. The command does not imply an automatic fix merely because a particular underlying linter might support one.                                                                      |
| `quality.type-check` | **Perform type checking.** Evaluates the managed source against the applicable type system/tooling. This remains Quality-owned even when Nuxt tooling supplies the underlying type-check mechanism.                                                                          |
| `quality.validate`   | **Run recognised validation checks.** Evaluates the selected scope against the applicable validation contract and returns structured validation evidence.                                                                                                                    |
| `quality.gate`       | **Evaluate quality evidence against an explicit quality policy.** Converts the relevant evidence into a gate result such as passed, failed, incomplete or indeterminate. It does not invent default thresholds that have not been configured or otherwise authorised.        |
| `quality.run`        | **Run an explicitly defined coordinated Quality workflow.** Coordinates a recognised set/plan of Quality checks while preserving the results of its constituent checks. It is not a generic “run anything” command and does not absorb workflows belonging to other domains. |

Quality operations can already operate over appropriate root, layer, selected-set or broader managed scopes where their semantics permit it; that scope does not create extra command identities.

---

# 6. Settings Domain — 18 commands

The **Settings domain** manages persisted project-management settings and recognised project resources. A central distinction is:

> **Persisting a setting is not the same thing as deciding configuration precedence.**

Settings owns the user's resource-management intent; effective-configuration resolution remains the responsibility of the application configuration architecture.

| Command                             | Human-readable purpose                                                                                                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `settings.inspect`                  | **Inspect persisted AppManager settings.** Shows recognised settings and their persisted state without pretending that every persisted value is necessarily the effective value after configuration resolution.                      |
| `settings.set`                      | **Set a recognised persisted setting.** Writes an explicitly selected setting at an appropriate supported semantic scope.                                                                                                            |
| `settings.unset`                    | **Remove a persisted setting value.** Removes the selected persisted value so normal configuration resolution can determine what applies instead; it does not itself dictate the fallback result.                                    |
| `settings.project-metadata.inspect` | **Inspect recognised project metadata.** Presents project-owned metadata such as applicable application/project information without turning that metadata into authority belonging to another domain.                                |
| `settings.project-metadata.update`  | **Update recognised project metadata.** Semantically changes selected project metadata while preserving unrelated content and respecting the ownership of specialised concerns.                                                      |
| `settings.environment.create`       | **Create a managed environment definition.** Establishes a new recognised environment resource with explicit collision protection rather than silently replacing an existing definition.                                             |
| `settings.environment.read`         | **Read a managed environment definition.** Returns recognised environment information while applying appropriate protection/redaction to sensitive values.                                                                           |
| `settings.environment.set`          | **Set a value in a managed environment definition.** Performs a controlled semantic update to an explicitly selected environment resource.                                                                                           |
| `settings.environment.unset`        | **Remove a value from a managed environment definition.** Removes the selected entry while preserving unrelated entries and source content.                                                                                          |
| `settings.environment.delete`       | **Delete an explicitly selected managed environment definition.** Removes the resource under the applicable consequential-operation policy rather than deleting arbitrary environment-like files.                                    |
| `settings.contributor.list`         | **List project contributors recorded in managed metadata.** Presents the recognised contributor collection.                                                                                                                          |
| `settings.contributor.add`          | **Add a contributor to project metadata.** Adds an explicitly defined contributor while respecting the semantic contributor model.                                                                                                   |
| `settings.contributor.remove`       | **Remove a selected contributor from project metadata.** Removes the contributor relationship/record without treating contributor metadata as Git identity or operating-system identity.                                             |
| `settings.licence.create`           | **Create the selected supported licence resource.** Generates the chosen licence material and coordinates associated metadata where required. Selection does not constitute legal advice about which licence the user should choose. |
| `settings.licence.delete`           | **Delete an explicitly selected managed licence resource.** Removes the managed licence under the applicable policy and coordinates related metadata where required.                                                                 |
| `settings.template.list`            | **List recognised declarative templates.** Shows the templates available to the managed project without executing them.                                                                                                              |
| `settings.template.add`             | **Add/register a declarative template resource.** Makes a supported template available as managed declarative material; registration does not itself grant the template application authority.                                       |
| `settings.template.delete`          | **Remove a selected managed template resource.** Removes the template definition according to its class/source policy without treating deletion as execution of that template's associated domain behaviour.                         |

The final implementation catalogue explicitly contains these Settings families and eighteen identities.

---

# 7. AI Domain — 22 commands

The **AI domain** needs the most careful explanation because its purpose is easy to misunderstand.

It does **not** mean “all things AppManager does using AI.”

Instead:

> **AI Domain = managing the project's AI-development environment.**

The separate **AI Capability** is what AppManager itself can use when another domain needs AI assistance. Git can therefore use AI to propose a commit message while the operation remains Git-owned; Docs can use AI to assist documentation while the operation remains Docs-owned.

The AI Domain manages seven semantic resource areas: **instructions, prompts, agents, skills, tools, policy, and their provider/environment representations**.

### Environment inspection

| Command      | Human-readable purpose                                                                                                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.inspect` | **Inspect the project's recognised AI-development environment.** Provides an aggregate view across supported AI instructions, prompts, agents, skills, tool integrations and policy, including the relevant project scope/representations where supported. |

### Instructions

An **instruction** is persistent guidance supplied to an AI development environment—for example project conventions, constraints or operating guidance.

| Command                 | Human-readable purpose                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ai.instruction.list`   | **List recognised project AI instructions.** Shows the persistent instruction resources AppManager recognises and their relevant scope/representation. |
| `ai.instruction.create` | **Create a supported AI instruction resource.** Establishes persistent project guidance using the appropriate supported representation.                |
| `ai.instruction.update` | **Update an existing AI instruction resource.** Semantically changes the selected instruction while preserving the surrounding resource as required.   |
| `ai.instruction.delete` | **Delete an explicitly selected AI instruction resource.** Removes the selected instruction under controlled resource-management semantics.            |

### Prompts

A **prompt** is different from an instruction: it is a reusable, deliberately invoked AI task/request rather than permanently applicable guidance.

| Command            | Human-readable purpose                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `ai.prompt.list`   | **List reusable project prompts.** Shows recognised prompt resources available to supported AI environments. |
| `ai.prompt.create` | **Create a reusable prompt.** Adds a project-managed reusable AI request/task definition.                    |
| `ai.prompt.update` | **Update an existing reusable prompt.** Changes the selected prompt definition semantically.                 |
| `ai.prompt.delete` | **Delete an explicitly selected reusable prompt.** Removes that prompt resource.                             |

There is intentionally **no `ai.prompt.run`**. If a prompt contributes to a Git, Docs, Nuxt or other operation, the resulting application intent remains with that owning domain.

### Agents

An **agent** is a named specialist AI worker/configuration definition.

| Command           | Human-readable purpose                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai.agent.list`   | **List recognised project AI agents.** Shows the specialist agent definitions configured for supported development environments.                                     |
| `ai.agent.create` | **Create a supported specialist agent definition.** Establishes a new project-side agent configuration.                                                              |
| `ai.agent.update` | **Update an existing agent definition.** Changes its supported project-side configuration.                                                                           |
| `ai.agent.delete` | **Delete an explicitly selected agent definition.** Removes the project-side definition without implying arbitrary execution or termination of autonomous processes. |

### Skills

A **skill** is a reusable specialist knowledge/procedure/capability package made available to a supported AI environment.

| Command           | Human-readable purpose                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `ai.skill.list`   | **List available project AI skills.** Shows recognised skills available to supported AI environments.      |
| `ai.skill.add`    | **Add or install a supported AI skill.** Makes the selected skill available to the project AI environment. |
| `ai.skill.remove` | **Remove a selected AI skill.** Removes that project-side skill from the supported environment.            |

### Tools

A **tool** is a provider-neutral external AI tool/data integration. MCP can be one representation/protocol for such an integration, but MCP itself is not the semantic command family.

| Command          | Human-readable purpose                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ai.tool.list`   | **List recognised AI tool integrations.** Shows the external tools/data integrations configured or recognised for the project's AI environments. |
| `ai.tool.add`    | **Add/configure a supported AI tool integration.** Establishes the selected integration through its supported project representation.            |
| `ai.tool.update` | **Update an existing AI tool integration.** Changes its supported non-secret project-side configuration. Secrets remain Settings-owned.          |
| `ai.tool.remove` | **Remove an explicitly selected AI tool integration.** Removes the project-side integration configuration.                                       |

### Policy

AI policy governs what supported AI environments are permitted or instructed to do—not AppManager's global application authority.

| Command               | Human-readable purpose                                                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ai.policy.inspect`   | **Inspect the project's recognised AI policy.** Shows supported context, tool, execution/access and related restrictions applying to the project's AI-development environment.                                                                                     |
| `ai.policy.configure` | **Configure supported AI policy.** Semantically establishes or changes AI-specific restrictions across the supported project representations. Such policy may narrow behaviour but cannot grant authority beyond AppManager's managed scope and application rules. |

The final AI review explicitly records these 22 identities and excludes generic `ai.run`, `ai.prompt.run`, `ai.mcp.*`, provider CRUD and generic autonomous-agent execution commands.

---

# 8. Maintenance Domain — 4 commands

The **Maintenance domain** is deliberately small.

It owns maintenance **only where maintenance itself is the primary user intent and no stronger product domain owns the semantic object being maintained**. This prevents Maintenance becoming a miscellaneous dumping ground.

Thus cleaning Nuxt-generated state remains `nuxt.cleanup`; application reset remains `app.reset`; documentation updates remain Docs-owned; environment deletion remains Settings-owned.

The final surface contains exactly four commands.

| Command                               | Human-readable purpose                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maintenance.headers.validate`        | **Validate AppManager-managed source headers.** Inspects one, a selected set, a semantic managed unit, or the complete eligible managed source-header scope and reports per-resource plus aggregate conformance. It does not repair anything merely because repair is possible.                                |
| `maintenance.headers.repair`          | **Repair recognised defects in managed source headers.** Plans bounded repairs only for independently eligible resources and applies them through controlled source transformation. Unsupported, ambiguous, protected or stale files are not blindly rewritten.                                                |
| `maintenance.source-version.maintain` | **Maintain source-file/header version metadata under defined policy.** Applies the recognised source-version policy to eligible managed resources. It is not package versioning, application versioning, Git tagging, documentation versioning or Nuxt upgrading.                                              |
| `maintenance.cleanup`                 | **Remove explicitly recognised disposable Maintenance artefacts.** Cleans eligible temporary/test/log or other specifically classified disposable maintenance resources. It is not an arbitrary recursive delete facility and cannot absorb App-, Nuxt-, Git-, Docs-, Settings- or AI-owned cleanup semantics. |

These commands can operate over multiple eligible resources where their semantics allow it. Cardinality remains part of command **scope**, not a reason to invent `repair-all`, `cleanup-all`, or other duplicate command identities. The coordinated Maintenance clarification explicitly preserves this rule.

---

# Final Version 1 Command Surface

The resulting catalogue is:

| Domain          | Commands | Primary human concern                                                             |
| --------------- | -------: | --------------------------------------------------------------------------------- |
| **App**         |        8 | Operate the root application                                                      |
| **Git**         |        8 | Manage repositories and repository relationships                                  |
| **Nuxt**        |       13 | Manage Nuxt-specific structure, configuration, modules, layers and tooling        |
| **Docs**        |       13 | Produce, maintain and operate project documentation                               |
| **Quality**     |       10 | Test, inspect and evaluate project quality                                        |
| **Settings**    |       18 | Manage persisted project settings, metadata and declarative resources             |
| **AI**          |       22 | Manage the project's AI-development environment                                   |
| **Maintenance** |        4 | Perform bounded cross-cutting project maintenance with no stronger semantic owner |
| **Total**       |   **96** |                                                                                   |

There is a coherent pattern behind the entire catalogue.

**App** answers *“What do I want to do with my application?”*
**Git** answers *“What do I want to do with my repositories?”*
**Nuxt** answers *“What Nuxt-specific structure or framework behaviour do I want to manage?”*
**Docs** answers *“What documentation do I want to create, maintain or operate?”*
**Quality** answers *“What do I want to test, measure or evaluate?”*
**Settings** answers *“What persisted project-management information or declarative resource do I want to manage?”*
**AI** answers *“How do I want this project's AI-development environment configured and governed?”*
**Maintenance** answers *“What bounded maintenance work needs doing where no stronger domain owns the intent?”*

That gives AppManager a **96-command Version 1 surface without requiring 96 unrelated implementations**. The commands express stable application intent; common mechanics remain delegated to shared capabilities, providers and underlying tools.

Most importantly, the catalogue avoids two opposite failure modes. It does not expose every underlying `nuxt`, Git, package-manager or provider operation as though it were an AppManager command, and it does not collapse materially different human intentions into vague generic operations such as `run`, `manage`, `execute`, `bulk`, or `repair`.

The resulting command model therefore reads as a coherent management application rather than a thin command wrapper: **the user chooses the AppManager intent; AppManager determines the authorised scope, policy and orchestration; specialist capabilities perform bounded work; and the Application Engine retains final application-level authority over the outcome.**
