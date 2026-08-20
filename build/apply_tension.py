#!/usr/bin/env python3
"""Put the tension table on the six-stage clock and give each stage a second way of saying itself.

WHAT THE MEASUREMENT SAID. After the headline clauses were tripled, the worst repeat inside one
world-line was still 43 — one sentence, forty-three times across seventy-four years — and it came
from here. TENSION is keyed on the sharpest pressure in the line, which persists, and it held four
texts per key, one for each calendar span. Four sentences cannot cover a century however well they
are written.

near maps to s1, mid to s3, long to s4, far to s6, which is what spanFromStage was already doing;
s2 and s5 were the two positions in the sequence that had no text at all.

    python3 build/apply_tension.py <tension_stages.json>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import dates, lit, replace_table  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'
STAGES = ('s1', 's2', 's3', 's4', 's5', 's6')
FROM_SPAN = {'near': 's1', 'mid': 's3', 'long': 's4', 'far': 's6'}


def read_tension(src):
    m = re.search(r'const TENSION = \{', src)
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
    for row in re.finditer(r'\n  (\w+): \{([^}]*)\}', flat):
        r = {}
        for f in re.finditer(r'(near|mid|long|far|s\d): "((?:[^"\\]|\\.)*)"', row.group(2)):
            r[f.group(1)] = f.group(2)
        out[row.group(1)] = r
    return out


def emit(table):
    body = []
    for k in sorted(table):
        rows = []
        for st in STAGES:
            alts = table[k].get(st) or []
            if not alts:
                continue
            if len(alts) == 1:
                rows.append('        %s: %s' % (st, lit(dates(alts[0]), 12)))
            else:
                inner = ',\n'.join('          %s' % lit(dates(a), 10) for a in alts)
                rows.append('        %s: [\n%s ]' % (st, inner))
        body.append('  %s: {\n%s },\n' % (k, ',\n'.join(rows)))
    return ''.join(body)


def main():
    new = json.load(open(sys.argv[1], encoding='utf-8'))
    src = NARR.read_text(encoding='utf-8')
    cur = read_tension(src)
    table = {}
    for k, row in cur.items():
        table[k] = {}
        for sp, st in FROM_SPAN.items():
            if row.get(sp):
                table[k][st] = [row[sp]]
        for st, alts in (new.get(k) or {}).items():
            table[k].setdefault(st, []).extend(alts)
    src = replace_table(src, 'TENSION', emit(table))

    # THE HEADLINE READ THIS TABLE BY SPAN. A stage table read by span sees four of its states.
    old = "strip(TENSION[tensionKey(wl, tracks, i)][span] || '')"
    if old not in src:
        raise SystemExit('the tension read in headline() is not where it was')
    src = src.replace(old, "strip(stageText(TENSION[tensionKey(wl, tracks, i)], year, tracks) || '')")
    NARR.write_text(src, encoding='utf-8')

    sizes = {}
    for k in table:
        n = sum(len(v) for v in table[k].values())
        sizes[k] = n
    print('tension on the stage clock · %d keys · %d clauses (was %d)'
          % (len(table), sum(sizes.values()), sum(len(v) for v in cur.values())))
    print('  per key:', dict(sorted(sizes.items())))
    print('written', NARR)


if __name__ == '__main__':
    main()
