from pathlib import Path

root = Path(__file__).resolve().parents[1]
functional = root / 'docs' / 'functional'

for path in functional.glob('*-functional-specification-v01.md'):
    lines = path.read_text(encoding='utf-8').splitlines(True)
    out = []
    skipping = False
    for line in lines:
        if line.startswith('> **Legacy reconciliation source'):
            continue
        if line.startswith('## ') and ('Legacy Reconciliation' in line or 'Legacy Requirement Disposition' in line):
            skipping = True
            continue
        if skipping and line.startswith('## '):
            skipping = False
        if not skipping:
            out.append(line)
    text = ''.join(out)
    text = text.replace('Version 1 retains the legacy product behaviours to list, create and delete project AI instruction documents.', 'Version 1 provides product behaviours to list, create and delete project AI instruction documents.')
    text = text.replace('Cross-cutting authority / legacy provenance', 'Cross-cutting authority')
    text = text.replace('migration from legacy command stubs', 'concrete command integration')
    path.write_text(text, encoding='utf-8')

p = root / 'app_manager' / 'templates' / 'template-repository.json'
t = p.read_text(encoding='utf-8')
t = t.replace(" (per docs/archive/specification/architecture/templates/spec-templates-full-v01.md §1.2)", "")
t = t.replace(" carried over from docs/archive/specification/architecture/templates/spec-templates-full-v01.md §5", "")
t = t.replace(" (per docs/archive/specification/architecture/templates/spec-templates-full-v01.md §7)", "")
p.write_text(t, encoding='utf-8')
