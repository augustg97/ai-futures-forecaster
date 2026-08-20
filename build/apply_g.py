#!/usr/bin/env python3
"""Write axis G, benefit realisation, into the sheet's tables.

THE AXIS EXISTS BECAUSE THE FORECAST COULD NOT SAY WHETHER ANYONE WAS BETTER OFF. Every other
axis measures a condition — capability, control, money, computing, rules, consent, labour share,
laboratory conduct — and none of them asks what any of it delivered to a person.

    python3 build/apply_g.py <head.json> <frag.json>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import dates, lit, replace_table  # noqa: E402
from apply_variants import emit, read_headcl  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'
STAGES = ('s1', 's2', 's3', 's4', 's5', 's6')


def read_frag(src):
    m = re.search(r'export const FRAG = \{', src)
    i, depth = m.end(), 1
    while i < len(src) and depth:
        c = src[i]
        if c == '"':
            i = src.index('"', i + 1)
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        i += 1
    flat = re.sub(r'"\s*\+\s*\n?\s*"', '', src[m.end():i])
    out = {}
    # Both forms, for the reason written over read_headcl: a reader blind to the array form
    # returns an empty row and the emitter then writes the table away.
    for row in re.finditer(r'\n  ([A-Z]\d+): \{([^}]*)\}', flat):
        r = {}
        for f in re.finditer(r'(s\d): (\[[^\]]*\]|"(?:[^"\\]|\\.)*")', row.group(2)):
            r[f.group(1)] = re.findall(r'"((?:[^"\\]|\\.)*)"', f.group(2))
        out[row.group(1)] = r
    return out


def main():
    head = json.load(open(sys.argv[1], encoding='utf-8'))
    frag = json.load(open(sys.argv[2], encoding='utf-8'))
    src = NARR.read_text(encoding='utf-8')
    H, F = read_headcl(src), read_frag(src)
    if any(k.startswith('G') for k in H):
        raise SystemExit('axis G is already in HEADCL')

    for k, rows in head.items():
        H[k] = {st: list(v) for st, v in rows.items()}
    for k, rows in frag.items():
        F[k] = {st: [v] for st, v in rows.items()}
    src = replace_table(src, 'HEADCL', emit(H))
    src = replace_table(src, 'FRAG', emit(F))

    # THE HEADLINE SLOTS ARE LISTS OF AXES. A table nothing reads draws nothing, and the last
    # axis added had to be put into both the slot list and the passage groups by hand.
    src = src.replace("const effect = pick(['D', 'A', 'E', 'T', 'L'], 0);",
                      "const effect = pick(['D', 'A', 'E', 'T', 'L', 'G'], 0);")
    src = src.replace("""    ['Crossings ahead', [crossingClause(tracks, year, engineY0), distanceClause(year, span)]],""",
                      """    // WHETHER ANYONE IS BETTER OFF, which the capability rows above cannot answer. A world
    // where a capability exists, deploys, does paid work and cures nobody was one this passage
    // could describe only by accident.
    ['Gains realised', [FR('G'), procAt(10) ? procClause(wl.G, year) : '']],
    ['Crossings ahead', [crossingClause(tracks, year, engineY0), distanceClause(year, span)]],""")
    NARR.write_text(src, encoding='utf-8')

    n = sum(len(v) for r in head.values() for v in r.values())
    print('axis G written · %d headline clauses · %d paragraphs' % (n, sum(len(v) for v in frag.values())))
    for probe, why in (("'G'], 0)", 'headline slot'), ("'Gains realised'", 'passage group')):
        print('   %-14s %s' % (why, 'wired' if probe in src else 'MISSING'))


if __name__ == '__main__':
    main()
