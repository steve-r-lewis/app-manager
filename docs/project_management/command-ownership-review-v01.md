# Version 1 Canonical Command Ownership Review

> **Document type:** Project-management working evidence
>
> **Status:** Retained — PBC-1 Maintenance stronger-owner assessment at the 78-command checkpoint
>
> **Normative product effect:** None. This matrix records the ownership review; normative corrections are carried by the level-appropriate clarifications and later folded into primary owners by NCR.

## 1. Purpose and Method

This review accounts for all 78 canonical Version 1 command identities after PR #171 corrected App and PR #172 corrected Nuxt. Each command is tested against the stronger-owner rule:

> A command belongs to Maintenance only when maintenance itself is the primary user/application intent and no stronger product domain owns the semantic object or policy being maintained.

Maintenance-like verbs (`clean`, `reset`, `upgrade`, `update`, `delete`, `remove`, `repair`) do not determine ownership. Technical mechanisms such as file deletion, process execution and source transformation remain capability/provider concerns rather than Maintenance commands.

Disposition vocabulary: **RETAIN**, **RENAME**, **RELOCATE**, **ADD**, **REMOVE**.

## 2. Quantified Result

| Domain | Reviewed | Final canonical count | Result |
|---|---:|---:|---|
| App | 8 | 8 | all retained with App |
| Git | 8 | 8 | all retained with Git |
| Nuxt | 13 | 13 | all retained with Nuxt |
| Docs | 13 | 13 | all retained with Docs |
| Quality | 10 | 10 | all retained with Quality |
| Settings | 18 | 18 | all retained with Settings |
| AI | 4 | 4 | all retained with AI |
| Utils / Maintenance | 4 | 4 | domain and four identities renamed |
| **Total** | **78** | **78** | **78/78 explicitly assessed; 0 cross-domain relocations required** |

The review therefore changes semantic naming/identity but not command cardinality. `utils` ceases to be a canonical Version 1 domain identifier.

## 3. App — 8/8

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `app.create` | no | App root-application creation intent | RETAIN |
| `app.prepare` | lifecycle readiness | App root lifecycle owns readiness | RETAIN |
| `app.develop` | no | App root operational lifecycle | RETAIN |
| `app.build` | no | App root operational lifecycle | RETAIN |
| `app.preview` | no | App root operational lifecycle | RETAIN |
| `app.generate` | no | App root operational lifecycle | RETAIN |
| `app.clean` | yes | App owns root-application clean policy/postcondition | RETAIN |
| `app.reset` | yes | App owns consequential root-application reset policy/postcondition | RETAIN |

## 4. Git — 8/8

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `git.inspect` | observational | Git repository semantics | RETAIN |
| `git.initialise` | setup | Git repository semantics | RETAIN |
| `git.commit` | no | Git repository semantics | RETAIN |
| `git.push` | no | Git repository/remote semantics | RETAIN |
| `git.synchronise` | maintenance-like | Git synchronization policy/state | RETAIN |
| `git.establish-relationship` | setup | Git relationship semantics | RETAIN |
| `git.initialise-layer-repositories` | setup | Git repository relationship semantics for selected managed layers | RETAIN |
| `git.delete-remote-repository` | destructive maintenance-like | Git owns remote-repository deletion intent/policy | RETAIN |

## 5. Nuxt — 13/13

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `nuxt.inspect` | observational | Nuxt structure/composition semantics | RETAIN |
| `nuxt.inspect-configuration` | observational | Nuxt configuration semantics | RETAIN |
| `nuxt.list-configuration` | observational | Nuxt configuration semantics | RETAIN |
| `nuxt.add-configuration` | no | Nuxt configuration semantics | RETAIN |
| `nuxt.remove-configuration` | maintenance-like | Nuxt configuration semantic object | RETAIN |
| `nuxt.add` | no | Nuxt-aware framework scaffolding | RETAIN |
| `nuxt.add-module` | no | Nuxt module semantics | RETAIN |
| `nuxt.upgrade` | yes | Nuxt framework upgrade policy/postcondition | RETAIN |
| `nuxt.analyze` | observational | Nuxt-specific analysis semantics | RETAIN |
| `nuxt.cleanup` | yes | Nuxt-generated/cache-state classification and postcondition | RETAIN |
| `nuxt.create-layer` | no | Nuxt layer semantics | RETAIN |
| `nuxt.integrate-layer` | no | Nuxt composition semantics | RETAIN |
| `nuxt.detach-layer` | maintenance-like | Nuxt composition relationship semantics | RETAIN |

## 6. Docs — 13/13

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `docs.document-application` | no | documentation semantics | RETAIN |
| `docs.document-source` | no | documentation semantics | RETAIN |
| `docs.document-layers` | no | documentation semantics | RETAIN |
| `docs.document-layer` | no | documentation semantics | RETAIN |
| `docs.document-tests` | no | documentation semantics | RETAIN |
| `docs.document-file` | no | documentation semantics | RETAIN |
| `docs.generate` | no | documentation generation semantics | RETAIN |
| `docs.update` | yes | Docs owns documentation-content update intent | RETAIN |
| `docs.extract` | no | documentation extraction semantics | RETAIN |
| `docs.aggregate` | no | documentation aggregation semantics | RETAIN |
| `docs.develop` | no | documentation-site operational intent | RETAIN |
| `docs.build` | no | documentation-site build intent | RETAIN |
| `docs.preview` | no | documentation-site preview intent | RETAIN |

## 7. Quality — 10/10

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `quality.test` | no | Quality evaluation semantics | RETAIN |
| `quality.test-unit` | no | Quality evaluation semantics | RETAIN |
| `quality.test-e2e` | no | Quality evaluation semantics | RETAIN |
| `quality.coverage` | no | Quality evidence semantics | RETAIN |
| `quality.test-ui` | no | Quality test-tool interaction | RETAIN |
| `quality.lint` | potentially corrective provider | primary intent is Quality evaluation; no implicit repair semantics | RETAIN |
| `quality.type-check` | no | Quality evaluation semantics | RETAIN |
| `quality.validate` | no | Quality validation semantics | RETAIN |
| `quality.gate` | no | Quality policy/gate semantics | RETAIN |
| `quality.run` | no | bounded Quality plan/orchestration | RETAIN |

## 8. Settings — 18/18

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `settings.inspect` | observational | Settings semantics | RETAIN |
| `settings.set` | no | Settings semantics | RETAIN |
| `settings.unset` | maintenance-like | Settings semantic value lifecycle | RETAIN |
| `settings.project-metadata.inspect` | observational | Settings project-metadata semantics | RETAIN |
| `settings.project-metadata.update` | yes | Settings owns metadata semantic object | RETAIN |
| `settings.environment.create` | no | Settings environment-definition semantics | RETAIN |
| `settings.environment.read` | observational | Settings environment-definition semantics | RETAIN |
| `settings.environment.set` | no | Settings environment-definition semantics | RETAIN |
| `settings.environment.unset` | maintenance-like | Settings environment-definition semantics | RETAIN |
| `settings.environment.delete` | yes | Settings environment-definition lifecycle | RETAIN |
| `settings.contributor.list` | observational | Settings contributor semantics | RETAIN |
| `settings.contributor.add` | no | Settings contributor semantics | RETAIN |
| `settings.contributor.remove` | maintenance-like | Settings contributor semantic object | RETAIN |
| `settings.licence.create` | no | Settings licence-management semantics | RETAIN |
| `settings.licence.delete` | yes | Settings licence-management semantics | RETAIN |
| `settings.template.list` | observational | Settings template-registration semantics | RETAIN |
| `settings.template.add` | no | Settings template-registration semantics | RETAIN |
| `settings.template.delete` | yes | Settings template-registration semantics | RETAIN |

## 9. AI — 4/4

| Command | Maintenance characteristic | Stronger owner / justification | Disposition |
|---|---|---|---|
| `ai.instruction.list` | observational | AI instruction-resource semantics | RETAIN |
| `ai.instruction.create` | no | AI instruction-resource semantics | RETAIN |
| `ai.instruction.replace` | yes | AI owns instruction-resource replacement semantics | RETAIN |
| `ai.instruction.delete` | yes | AI owns instruction-resource lifecycle | RETAIN |

## 10. Utils → Maintenance — 4/4

| Current identity | Final identity | Primary intent | Disposition |
|---|---|---|---|
| `utils.headers.validate` | `maintenance.headers.validate` | validate AppManager-managed source-header conformance | RENAME |
| `utils.headers.repair` | `maintenance.headers.repair` | repair recognised non-conforming managed source headers | RENAME |
| `utils.source-version.maintain` | `maintenance.source-version.maintain` | maintain source-header/file version metadata under defined policy | RENAME |
| `utils.cleanup` | `maintenance.cleanup` | remove narrowly classified disposable temporary/test/log project artefacts | RENAME |

The four operations form a coherent Maintenance domain because their primary semantic intent is project artefact maintenance and no stronger product domain owns the maintained semantic object.

## 11. Explicit Exclusions

Maintenance shall not absorb:

- App lifecycle (`app.clean`, `app.reset`, `app.prepare`);
- Nuxt framework maintenance (`nuxt.cleanup`, `nuxt.upgrade`);
- Git repository/remote maintenance;
- Docs content/site lifecycle;
- Quality evaluation;
- Settings-owned resource lifecycle;
- AI instruction-resource lifecycle;
- generic filesystem/process/source-transformation primitives.

No new generic `maintenance.inspect`, `maintenance.check` or `maintenance.repair` command is approved by this review. Such an aggregate would require a separately demonstrated stable user intent, bounded scope and non-overlap with stronger owners.

## 12. Conclusion

The review accounts for **78/78** canonical commands. The only ownership correction required is the semantic reclassification `utils` → `maintenance` and corresponding rename of its four canonical identities. **0 commands relocate from the seven stronger semantic domains, 0 commands are added, and 0 commands are removed.**

This result deliberately optimizes semantic ownership rather than the number of commands placed under Maintenance.