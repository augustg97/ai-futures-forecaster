#!/usr/bin/env python3
"""Put the economy tables on the six-stage clock, and delete the one nothing reads.

WHAT THE MEASUREMENT LEFT. After the headline clauses were tripled and the tension table was
re-keyed, three tables were still keyed on the four CALENDAR SPANS: ECON, ECON_MOD and GOVERN.
Four texts cannot cover seventy-four years however well each is written.

GOVERN TURNED OUT TO BE DEAD. Its name appears exactly once in narrative.js — its own definition.
Thirty-two authored clauses about what the two principal states had settled, drawn by nothing,
superseded by FRAG C1 to C8 in the composed-passage rewrite. Adding sixty-four more to it would
have been the only wasted work of the pass, so the table goes instead.

ECON_MOD WAS DELIBERATELY MUTE PAST THE SECOND STAGE, and for a good reason: a modifier written
against the 2026 record — $725 billion of guided capital, a named tariff — has nothing to say in
2072, so the second variable spoke through its own headline clause instead. The record-grounded
texts stay exactly where they were, at s1 and s2. What is new is that s3 to s6 now hold clauses
written to the STAGE rather than to the record, so the PAIRING can go on speaking: E3 crossed with
S1 says something neither E3 nor S1 says alone, and that was being thrown away for four fifths of
the document's range.

    python3 build/apply_spans.py <span_out.json>
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


def read(src, name):
    m = re.search(r'const %s = \{' % name, src)
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
    for row in re.finditer(r'\n  ("?[A-Za-z0-9|]+"?): \{([^}]*)\}', flat):
        r = {}
        for f in re.finditer(r'(near|mid|long|far|s\d): "((?:[^"\\]|\\.)*)"', row.group(2)):
            r[f.group(1)] = f.group(2)
        out[row.group(1).strip('"')] = r
    return out


def emit(table, quote_keys):
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
        key = '"%s"' % k if quote_keys else k
        body.append('  %s: {\n%s },\n' % (key, ',\n'.join(rows)))
    return ''.join(body)


def drop_table(src, name):
    """Remove a top-level object literal entirely, declaration and all."""
    m = re.search(r'\nconst %s = \{' % name, src)
    if not m:
        return src, False
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
    while i < len(src) and src[i] in ';\n':
        i += 1
    return src[:m.start() + 1] + src[i:], True


def main():
    got = json.load(open(sys.argv[1], encoding='utf-8'))
    src = NARR.read_text(encoding='utf-8')

    if len(re.findall(r'\bGOVERN\b', src)) > 1:
        raise SystemExit('GOVERN is referenced somewhere now — do not delete it')
    src, dropped = drop_table(src, 'GOVERN')

    for name, quoted in (('ECON', False), ('ECON_MOD', True)):
        cur = read(src, name)
        table = {}
        for k, row in cur.items():
            table[k] = {}
            for sp, st in FROM_SPAN.items():
                if row.get(sp):
                    table[k][st] = [row[sp]]
            for st in STAGES:
                if row.get(st):
                    table[k].setdefault(st, []).append(row[st])
        added = 0
        for k, stages in got.items():
            if k not in table:
                continue
            for e in stages:
                st, t = e.get('stage'), (e.get('text') or '').strip()
                if st in STAGES and t and t not in table[k].get(st, []):
                    table[k].setdefault(st, []).append(t)
                    added += 1
        src = replace_table(src, name, emit(table, quoted))
        print('%-9s %2d keys · %3d clauses (was %d) · %d added'
              % (name, len(table), sum(len(v) for r in table.values() for v in r.values()),
                 sum(len(v) for v in cur.values()), added))

    # ECON_MOD SPEAKS AT EVERY STAGE NOW, falling back to the second variable's own clause only
    # where the pairing has nothing written for that stage.
    old = """    const early = /^s[12]$/.test(stageOf(year, tracks));
    const m = early
      ? (row && (typeof row === 'string' ? row : (row.near || row.mid)))
      : stageText(HEADCL[wl[k]], year, tracks);"""
    new = """    // THE PAIRING IS THE POINT, and it used to be thrown away past the second stage. The
    // record-grounded texts still hold s1 and s2; s3 to s6 are written to the stage, so E3
    // crossed with S1 goes on saying what neither says alone. Where a pairing has nothing for
    // this stage the second variable speaks through its own clause, as before.
    const m = stageText(row, year, tracks) || stageText(HEADCL[wl[k]], year, tracks);"""
    if old not in src:
        raise SystemExit('the ECON_MOD read in econClause is not where it was')
    src = src.replace(old, new)
    NARR.write_text(src, encoding='utf-8')
    print('GOVERN removed:', dropped)
    print('written', NARR)


if __name__ == '__main__':
    main()
