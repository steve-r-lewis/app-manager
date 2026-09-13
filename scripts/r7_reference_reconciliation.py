from pathlib import Path
import os
import re

ROOT = Path(__file__).resolve().parents[1]

primary = {
    'docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md': ('DD-1.1', 'DD-1 — Application Core'),
    'docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md': ('DD-1.2', 'DD-1 — Application Core'),
    'docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md': ('DD-1.3', 'DD-1 — Application Core'),
    'docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md': ('DD-1.4', 'DD-1 — Application Core'),
    'docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md': ('DD-1.5', 'DD-1 — Application Core'),
    'docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md': ('DD-2.1', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md': ('DD-2.2', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md': ('DD-2.3', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md': ('DD-2.4', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md': ('DD-2.5', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md': ('DD-2.6', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md': ('DD-2.7', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md': ('DD-2.8', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md': ('DD-2.9', 'DD-2 — Shared Capabilities'),
    'docs/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md': ('DD-2.10', 'DD-2 — Shared Capabilities'),
    'docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md': ('DD-3.1', 'DD-3 — High-Coupling Domains'),
}

clarifications = {
    'docs/dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md': 'DD-1.3, DD-1.4, DD-1.5',
    'docs/dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md': 'DD-1.1, DD-1.2',
    'docs/dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md': 'DD-2.10, DD-2.5, DD-2.6, DD-2.9',
    'docs/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md': 'DD-2.3, DD-2.4',
}

old_to_new = {
    'docs/detailed_design/application-invocation-detailed-design-v01.md': 'docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md',
    'docs/detailed_design/execution-outcomes-detailed-design-v01.md': 'docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md',
    'docs/detailed_design/managed-project-detailed-design-v01.md': 'docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md',
    'docs/detailed_design/configuration-resolution-detailed-design-v01.md': 'docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md',
    'docs/detailed_design/application-engine-detailed-design-v01.md': 'docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md',
    'docs/detailed_design/application-core-bootstrap-resolution-clarification-v01.md': 'docs/dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md',
    'docs/detailed_design/application-outcome-and-diagnostic-ownership-clarification-v01.md': 'docs/dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md',
    'docs/detailed_design/resource-access-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md',
    'docs/detailed_design/process-execution-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md',
    'docs/detailed_design/repository-capability-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md',
    'docs/detailed_design/source-intelligence-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md',
    'docs/detailed_design/source-transformation-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md',
    'docs/detailed_design/resource-registry-and-template-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md',
    'docs/detailed_design/ai-capability-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md',
    'docs/detailed_design/quality-capability-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md',
    'docs/detailed_design/documentation-capability-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md',
    'docs/detailed_design/nuxt-capability-detailed-design-v01.md': 'docs/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md',
    'docs/detailed_design/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md': 'docs/dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md',
    'docs/detailed_design/repository-source-intelligence-relationship-clarification-v01.md': 'docs/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md',
    'docs/detailed_design/app-domain-detailed-design-v01.md': 'docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md',
    'docs/decisions/architecture-decision-governance-v01.md': 'docs/project_management/decisions/architecture-decision-governance-v01.md',
    'docs/decisions/adr-template.md': 'docs/project_management/decisions/adr-template.md',
    'docs/decisions/adr-0001-primary-application-runtime.md': 'docs/project_management/decisions/adr-0001-primary-application-runtime.md',
}

labels = {
    'docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md': 'DD-1.1 — Application Invocation',
    'docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md': 'DD-1.2 — Execution Outcomes',
    'docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md': 'DD-1.3 — Managed Project',
    'docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md': 'DD-1.4 — Configuration Resolution',
    'docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md': 'DD-1.5 — Application Engine',
    'docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md': 'DD-2.1 — Resource Access',
    'docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md': 'DD-2.2 — Process Execution',
    'docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md': 'DD-2.3 — Repository Capability',
    'docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md': 'DD-2.4 — Source Intelligence',
    'docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md': 'DD-2.5 — Source Transformation',
    'docs/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md': 'DD-2.6 — Resource Registry and Template',
    'docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md': 'DD-2.7 — AI Capability',
    'docs/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md': 'DD-2.8 — Quality Capability',
    'docs/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md': 'DD-2.9 — Documentation Capability',
    'docs/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md': 'DD-2.10 — Nuxt Capability',
    'docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md': 'DD-3.1 — App Domain',
    'docs/dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md': 'Application Core Bootstrap Resolution Clarification',
    'docs/dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md': 'Application Outcome and Diagnostic Ownership Clarification',
    'docs/dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md': 'Nuxt Layer Scaffold Artefact Ownership Clarification',
    'docs/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md': 'Repository / Source Intelligence Relationship Clarification',
    'docs/project_management/decisions/adr-0001-primary-application-runtime.md': 'ADR-0001 — Primary Application Runtime',
    'docs/project_management/decisions/architecture-decision-governance-v01.md': 'Architecture Decision Governance',
    'docs/project_management/decisions/adr-template.md': 'ADR Template',
    'docs/project-documentation-guide-v01.md': 'Project Documentation Guide',
    'docs/appmanager-design-specification-v01.md': 'AppManager Design Specification',
    'docs/project_management/detailed-design-decomposition-plan-v01.md': 'Detailed Design Decomposition Plan and Canonical Register',
}

basename_map = {Path(old).name: new for old, new in old_to_new.items()}
for new in list(primary) + list(clarifications):
    basename_map[Path(new).name] = new

targets = set()
for base in ('docs/dd_1_application_core', 'docs/dd_2_shared_capabilities', 'docs/dd_3_high_coupling_domains'):
    targets.update(str(p.relative_to(ROOT)) for p in (ROOT / base).rglob('*.md'))
targets.update(str(p.relative_to(ROOT)) for p in (ROOT / 'docs/functional').glob('*.md'))
targets.update({
    'docs/project_management/domain-detailed-design-authoring-guide-v01.md',
    'docs/project_management/detailed-design-decomposition-plan-v01.md',
    'docs/project_management/documentation-rationalisation-status-v01.md',
    'docs/project_management/technology-architecture-review-v01.md',
    'docs/project_management/functional-specification-decomposition-plan-v01.md',
    'docs/project_management/functional-specification-conformance-audit-v01.md',
    'docs/project_management/decisions/architecture-decision-governance-v01.md',
    'docs/project_management/decisions/adr-0001-primary-application-runtime.md',
    'docs/project_management/decisions/adr-template.md',
})
targets = {p for p in targets if (ROOT / p).exists()}


def canonical_repo_path(token: str, source: Path):
    token = token.strip()
    if token in old_to_new:
        return old_to_new[token]
    if token.startswith('docs/decisions/'):
        return token.replace('docs/decisions/', 'docs/project_management/decisions/', 1)
    if token.startswith('docs/') and (ROOT / token).is_file():
        return token
    if token in basename_map:
        return basename_map[token]
    if token.endswith('.md') and not token.startswith(('http://', 'https://')):
        candidate = (source.parent / token).resolve()
        try:
            rel = candidate.relative_to(ROOT.resolve())
        except ValueError:
            return None
        if candidate.is_file():
            return rel.as_posix()
    return None


def make_link(repo_path: str, source: Path, original: str):
    target = ROOT / repo_path
    if not target.is_file():
        return None
    rel = os.path.relpath(target, source.parent).replace(os.sep, '/')
    label = labels.get(repo_path, original)
    return f'[{label}]({rel})'


code_span = re.compile(r'`([^`\n]+\.md)`(?!\]\()')


def linkify_line(line: str, source: Path):
    def repl(m):
        token = m.group(1)
        repo_path = canonical_repo_path(token, source)
        if not repo_path:
            return m.group(0)
        link = make_link(repo_path, source, token)
        return link or m.group(0)
    return code_span.sub(repl, line)


changed = []
for rel in sorted(targets):
    path = ROOT / rel
    text = path.read_text(encoding='utf-8')
    original = text

    if rel in primary:
        ddid, family = primary[rel]
        lines = text.splitlines(keepends=True)
        if lines and ddid not in lines[0]:
            h1 = lines[0].rstrip('\r\n')
            nl = '\r\n' if lines[0].endswith('\r\n') else '\n'
            if h1.startswith('# '):
                lines[0] = f'# {ddid} — {h1[2:]}{nl}'
        text = ''.join(lines)
        if f'**Detailed Design ID:** {ddid}' not in text:
            first_nl = text.find('\n')
            block = f'\n> **Detailed Design ID:** {ddid}\n>\n> **Design family:** {family}\n'
            text = text[:first_nl + 1] + block + text[first_nl + 1:]

    if rel in clarifications:
        clarifies = clarifications[rel]
        if '**Document type:** Detailed Design clarification' not in text:
            first_nl = text.find('\n')
            block = f'\n> **Document type:** Detailed Design clarification\n>\n> **Clarifies:** {clarifies}\n'
            text = text[:first_nl + 1] + block + text[first_nl + 1:]

    if rel == 'docs/project_management/domain-detailed-design-authoring-guide-v01.md':
        text = text.replace(
            'the normative DD-1 Application Core specifications under `docs/detailed_design/`;',
            'the normative DD-1 Application Core specifications under [docs/dd_1_application_core/](../dd_1_application_core/);')
        text = text.replace(
            'the normative DD-2 Shared Capability specifications under `docs/detailed_design/`;',
            'the normative DD-2 Shared Capability specifications under [docs/dd_2_shared_capabilities/](../dd_2_shared_capabilities/);')
    elif rel == 'docs/project_management/documentation-rationalisation-status-v01.md':
        text = text.replace(
            'the active Detailed Design Specifications beneath `docs/detailed_design/`.',
            'the active Detailed Design Specifications beneath `docs/dd_1_application_core/`, `docs/dd_2_shared_capabilities/`, `docs/dd_3_high_coupling_domains/`, and `docs/dd_4_policy_and_resource_domains/`.')
    elif rel == 'docs/project_management/decisions/architecture-decision-governance-v01.md':
        text = text.replace('docs/decisions/', 'docs/project_management/decisions/')

    out = []
    in_fence = False
    for line in text.splitlines(keepends=True):
        if line.lstrip().startswith('```'):
            in_fence = not in_fence
            out.append(line)
        elif in_fence:
            out.append(line)
        else:
            out.append(linkify_line(line, path))
    text = ''.join(out)

    if text != original:
        path.write_text(text, encoding='utf-8')
        changed.append(rel)

link_re = re.compile(r'\[[^\]]+\]\(([^)]+\.md)\)')
broken = []
signatures = ['docs/detailed_design/', 'docs/decisions/']
for rel in sorted(targets):
    path = ROOT / rel
    text = path.read_text(encoding='utf-8')
    for target in link_re.findall(text):
        if target.startswith(('http://', 'https://')):
            continue
        if not (path.parent / target).resolve().is_file():
            broken.append(f'{rel}: {target}')

historical_allow = {
    'docs/project-documentation-guide-v01.md',
    'docs/project_management/archive-absence-conformance-audit-v01.md',
    'docs/project_management/application-core-detailed-design-conformance-audit-v01.md',
    'docs/project_management/shared-capability-detailed-design-conformance-audit-v01.md',
    'docs/project_management/detailed-design-dd1-handover-review-v01.md',
    'docs/project_management/dd2-independent-review-reconciliation-v01.md',
    'docs/project_management/dd2-reconciliation-handover-v01.md',
    'docs/project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md',
    'docs/project_management/detailed-design-structure-migration-inventory-v01.md',
    'docs/project_management/detailed-design-decomposition-plan-v01.md',
    'docs/project_management/documentation-rationalisation-status-v01.md',
}

residual_files = {}
for path in (ROOT / 'docs').rglob('*.md'):
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding='utf-8')
    hits = [sig for sig in signatures if sig in text]
    if hits:
        residual_files[rel] = hits

unresolved = [
    f'{p}: {", ".join(h)}'
    for p, h in residual_files.items()
    if p not in historical_allow and p not in targets
]

report = ROOT / 'docs/project_management/detailed-design-reference-reconciliation-v01.md'
report_lines = [
    '# AppManager Detailed Design Reference Reconciliation\n\n',
    '> **Status:** Version 1 project-management reconciliation record\n>\n',
    '> **Work package:** R-7 — Cross-document navigation repair\n>\n',
    '> **Baseline:** `master` at `df03ab62ece6135515f3364ea260dfee7cdbffbb`\n>\n',
    '> **Normative effect:** None. This work repairs identity metadata and navigation to the already-approved Detailed Design structure; it does not revise architecture or responsibility ownership.\n\n',
    '## 1. Scope\n\n',
    'R-7 reconciles active Detailed Design, Functional, architecture-decision, and current Detailed Design authoring/navigation references after the R-4 through R-6 physical migrations. Historical conformance, handover, reconciliation, and migration evidence is not mechanically rewritten when the superseded path is part of the recorded historical state.\n\n',
    '## 2. Active Reference Policy\n\n',
    '- Primary Detailed Designs carry their stable `DD-<family>.<item>` identity in the H1 and metadata.\n',
    '- Detailed Design clarifications identify their document type and the primary DDs clarified without receiving fictitious primary DD IDs.\n',
    '- Active internal Markdown document references use repository-relative links.\n',
    '- Legacy `docs/detailed_design/` and `docs/decisions/` locations are not used as active navigation targets.\n',
    '- Historical records may retain those strings where they document the repository state or migration itself.\n\n',
    '## 3. Files Reconciled\n\n',
]
for rel in changed:
    report_lines.append(f'- `{rel}`\n')
report_lines.append('\n## 4. Residual Legacy-Path Classification\n\n')
if residual_files:
    for rel, hits in sorted(residual_files.items()):
        classification = 'intentional historical / migration evidence' if rel in historical_allow else ('active file — reviewed' if rel in targets else 'unclassified')
        report_lines.append(f'- `{rel}` — {classification}; signatures: `{", ".join(hits)}`.\n')
else:
    report_lines.append('- No legacy path signatures remain.\n')
report_lines.extend([
    '\n## 5. Validation\n\n',
    f'- Active files changed: **{len(changed)}**.\n',
    f'- Broken relative Markdown `.md` links detected in the active R-7 target set: **{len(broken)}**.\n',
    f'- Unclassified legacy-path residual files outside the active target set: **{len(unresolved)}**.\n',
    '\nR-7 is conformant only when both validation counts above are zero.\n',
])
report.write_text(''.join(report_lines), encoding='utf-8')

if broken:
    print('Broken links:')
    print('\n'.join(broken))
    raise SystemExit(2)
if unresolved:
    print('Unclassified residuals:')
    print('\n'.join(unresolved))
    raise SystemExit(3)

print(f'Reconciled {len(changed)} active files')
print(f'Residual legacy-path files: {len(residual_files)} (classified)')
