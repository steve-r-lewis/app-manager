from pathlib import Path

root = Path(__file__).resolve().parents[1]
guide = root / 'docs/project_management/domain-detailed-design-authoring-guide-v01.md'
text = guide.read_text(encoding='utf-8')
text = text.replace(
    '''docs/detailed_design/app-domain-detailed-design-v01.md\ndocs/detailed_design/git-domain-detailed-design-v01.md\ndocs/detailed_design/nuxt-domain-detailed-design-v01.md\ndocs/detailed_design/docs-domain-detailed-design-v01.md''',
    '''docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md\ndocs/dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md\ndocs/dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md\ndocs/dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md''')
text = text.replace(
    '''docs/detailed_design/quality-domain-detailed-design-v01.md\ndocs/detailed_design/settings-domain-detailed-design-v01.md\ndocs/detailed_design/ai-domain-detailed-design-v01.md\ndocs/detailed_design/utils-domain-detailed-design-v01.md''',
    '''docs/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md\ndocs/dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md\ndocs/dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md\ndocs/dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md''')
if 'docs/detailed_design/' in text:
    raise SystemExit('active authoring guide still contains docs/detailed_design/')
guide.write_text(text, encoding='utf-8')

report = root / 'docs/project_management/detailed-design-reference-reconciliation-v01.md'
r = report.read_text(encoding='utf-8')
r = r.replace('- `docs/project_management/domain-detailed-design-authoring-guide-v01.md` — active file — reviewed; signatures: `docs/detailed_design/`.\n', '')
anchor = '- `docs/project_management/detailed-design-structure-migration-inventory-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/, docs/decisions/`.\n'
addition = (
    '- `docs/project_management/functional-specification-conformance-audit-v01.md` — intentional historical Functional-phase audit evidence; signatures: `docs/decisions/`.\n'
    '- `docs/project_management/functional-specification-decomposition-plan-v01.md` — intentional historical Functional-phase planning evidence; signatures: `docs/decisions/`.\n'
)
if addition not in r:
    r = r.replace(anchor, anchor + addition)
report.write_text(r, encoding='utf-8')

for rel in (
    'docs/project_management/functional-specification-conformance-audit-v01.md',
    'docs/project_management/functional-specification-decomposition-plan-v01.md',
):
    if not (root / rel).is_file():
        raise SystemExit(f'missing restored historical record: {rel}')

print('R-7 final patch validated')
