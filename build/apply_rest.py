#!/usr/bin/env python3
"""Write the second Elements of Style pass into the four tables the first one missed.

The first pass rewrote FRAG, HEADCL and CROSS and took them to 6-21% loose sentences. It left
ECON at 95%, ECON_MOD at 95% and TENSION at 92%, which is where Strunk's Rule 14 fault then
lived. This writes the rewrites of all four.

    python3 build/apply_rest.py <journal.jsonl>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import dates, lit, replace_table  # noqa: E402

NARR = Path(__file__).resolve().parent.parent / 'web' / 'js' / 'narrative.js'
SPANS = ('near', 'mid', 'long', 'far')


def results(j):
    for line in Path(j).read_text(encoding='utf-8').splitlines():
        try:
            r = json.loads(line)
        except ValueError:
            continue
        if r.get('type') == 'result' and isinstance(r.get('result'), dict):
            yield r['result']


def main():
    tables = {}
    longform = {}
    for v in results(sys.argv[1]):
        for row in (v.get('rows') or []):
            k = row.get('key')
            if not k:
                continue
            if row.get('lines') is not None:
                longform[k] = row
            elif row.get('field') in SPANS and row.get('text'):
                tables.setdefault(k, {})[row['field']] = row['text'].strip()
    src = NARR.read_text(encoding='utf-8')

    # ECON and TENSION key on a bare name; ECON_MOD keys on a quoted pair
    econ = {k: v for k, v in tables.items() if re.fullmatch(r'E\d', k)}
    mod = {k: v for k, v in tables.items() if '|' in k}
    tension = {k: v for k, v in tables.items() if k not in econ and k not in mod}

    def span_body(t, quote):
        out = []
        for k in sorted(t):
            rows = ',\n'.join('        %s: %s' % (f, lit(dates(t[k][f]), 12))
                              for f in SPANS if t[k].get(f))
            name = '"%s"' % k if quote else k
            out.append('  %s: {\n%s },\n' % (name, rows))
        return ''.join(out)

    if econ:
        src = replace_table(src, 'ECON', span_body(econ, False))
    if tension:
        src = replace_table(src, 'TENSION', span_body(tension, False))
    if mod:
        body = []
        for k in sorted(mod):
            rows = ',\n'.join('    %s: %s' % (f, lit(dates(mod[k][f]), 9))
                              for f in ('near', 'mid') if mod[k].get(f))
            body.append('  "%s": {\n%s },\n' % (k, rows))
        src = replace_table(src, 'ECON_MOD', ''.join(body))
    if longform:
        body = []
        for k in sorted(longform, key=lambda x: (x[0], int(x[1:]))):
            r = longform[k]
            lines = ''.join('          %s,\n' % lit(dates(x), 10) for x in r['lines'])
            body.append('  %s: { head: %s,\n        lines: [\n%s        ] },\n'
                        % (k, lit(dates(r['head']), 15), lines))
        src = replace_table(src, 'LONGFORM', ''.join(body))
    NARR.write_text(src, encoding='utf-8')
    print('ECON %d · TENSION %d · ECON_MOD %d · LONGFORM %d'
          % (len(econ), len(tension), len(mod), len(longform)))


if __name__ == '__main__':
    main()
