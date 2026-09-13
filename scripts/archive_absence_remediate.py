from pathlib import Path

root = Path(__file__).resolve().parents[1]
for path in (root / 'docs' / 'functional').glob('*-functional-specification-v01.md'):
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines(True)
    lines = [line for line in lines if not line.startswith('> **Legacy reconciliation source')]
    path.write_text(''.join(lines), encoding='utf-8')

p = root / 'app_manager' / 'templates' / 'template-repository.json'
t = p.read_text(encoding='utf-8')
t = t.replace(" (per docs/archive/specification/architecture/templates/spec-templates-full-v01.md §1.2)", "")
t = t.replace(" carried over from docs/archive/specification/architecture/templates/spec-templates-full-v01.md §5", "")
t = t.replace(" (per docs/archive/specification/architecture/templates/spec-templates-full-v01.md §7)", "")
p.write_text(t, encoding='utf-8')
