#!/usr/bin/env python3
"""Write axis L's prose into the drawing, and restate the coverage declaration.

THE COVERAGE GATE IS WHAT MAKES A REGISTRY CHANGE SAFE. `web/data/registry-covered.json` is the
drawing's own statement of which positions it can letter and what each one means; the build
refuses (exit 4) when the parent has moved under it. Adding an axis to the engine without
restating the coverage would fail the build, which is the gate working.

    python3 build/apply_l.py
"""
import json
import re
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import dates, lit, replace_table  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'
PROSE = ROOT / 'Research' / 'findings' / 'r7-laboratory-prose.json'
COV = ROOT / 'web' / 'data' / 'registry-covered.json'
NET = ROOT / 'web' / 'data' / 'forecast' / 'network.json'
STAGES = ('s1', 's2', 's3', 's4', 's5', 's6')


def read_table(src, name):
    m = re.search(r'(?:export )?const %s = \{' % name, src)
    i = m.end()
    depth = 1
    while i < len(src) and depth:
        c = src[i]
        if c == '"':
            i = src.index('"', i + 1)
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        i += 1
    return src[:m.end()], src[m.end():i - 1], src[i - 1:]


def main():
    prose = json.loads(PROSE.read_text(encoding='utf-8'))
    src = NARR.read_text(encoding='utf-8')

    for table, field in (('HEADCL', 'headline'), ('FRAG', 'passage')):
        head, body, tail = read_table(src, table)
        rows = []
        for k in sorted(prose):
            stages = prose[k][field]
            lines = ',\n'.join('        %s: %s' % (st, lit(dates(stages[st]), 12))
                               for st in STAGES if stages.get(st))
            rows.append('  %s: {\n%s },\n' % (k, lines))
        src = head + body + ''.join(rows) + tail
    head, body, tail = read_table(src, 'LONGFORM')
    rows = []
    for k in sorted(prose):
        p = prose[k]
        bl = ''.join('          %s,\n' % lit(dates(b), 10) for b in p['bullets'])
        rows.append('  %s: { head: %s,\n        lines: [\n%s        ] },\n'
                    % (k, lit(dates(p['subhead']), 15), bl))
    src = head + body + ''.join(rows) + tail
    NARR.write_text(src, encoding='utf-8')
    print('prose written for %d positions × %d stages × 2 tables'
          % (len(prose), len(STAGES)))

    # THE COVERAGE DECLARATION IS RESTATED FROM WHAT THE PARENT NOW EMITS, never hand-edited:
    # the point of the gate is that the two are compared, so writing both from one hand would
    # defeat it. This reads the emitted network and records what the drawing can now letter.
    net = json.loads(NET.read_text(encoding='utf-8'))
    cov = {'version': net.get('version'),
           'axes': {a['key']: [p[0] for p in a['positions']] for a in net['axes']},
           'meanings': {p[0]: p[1] for a in net['axes'] for p in a['positions']}}
    COV.write_text(json.dumps(cov, indent=1) + '\n', encoding='utf-8')
    print('coverage restated at %s · %d axes · %d positions'
          % (cov['version'], len(cov['axes']), len(cov['meanings'])))


if __name__ == '__main__':
    main()
