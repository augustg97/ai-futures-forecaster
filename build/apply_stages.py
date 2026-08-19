#!/usr/bin/env python3
"""Write six-stage progressions into web/js/narrative.js.

A SPAN IS A STATE; A STAGE IS A POSITION IN A SEQUENCE. The passage held four descriptions per
setting, one per span, and a span runs nine to forty years — so a reader who moved the slider
from 2032 to 2038 read the identical sentence twice. August, 2026-08-19:

  "Even if variables are consistent these should vary to reflect the passage of time - how do
  things move, under these conditions, from 2032 to 38? Major and minor developments mature and
  change over time, and can have long term cross-cutting effects. Moreover, for a given
  variable/control set, we should see a progression across the timeline."

Each position now carries s1 to s6, six stages of one process, and the drawing selects the stage
the world has reached on a clock that runs at that world-line's own pace.

The critic's replacements are applied here, as in apply_world.py.

    python3 build/apply_stages.py <headline-journal> <passage-journal>
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


def rows(journal):
    for line in Path(journal).read_text(encoding='utf-8').splitlines():
        try:
            r = json.loads(line)
        except ValueError:
            continue
        if r.get('type') != 'result':
            continue
        v = r.get('result') or r.get('value') or {}
        if isinstance(v, str):
            try:
                v = json.loads(v)
            except ValueError:
                continue
        yield v


def collect(journals):
    """Positions and critiques, kept apart by which workflow they arrived in."""
    tables, fixes = {}, []
    for j in journals:
        body = Path(j).read_text(encoding='utf-8')
        # the passage workflow asks for bullets; the headline workflow does not
        where = 'passage' if '"bullets"' in body else 'head'
        tables.setdefault(where, {})
        for v in rows(j):
            for p in (v.get('positions') or []):
                if p.get('key'):
                    tables[where][p['key']] = p
            for f in (v.get('failures') or []):
                fixes.append((where, f))
            w, c = v.get('written'), v.get('critique')
            if w:
                for p in (w.get('positions') or []):
                    if p.get('key'):
                        tables[where][p['key']] = p
            if c:
                for f in (c.get('failures') or []):
                    fixes.append((where, f))
    return tables, fixes


def apply_fixes(tables, fixes):
    n = 0
    for where, f in fixes:
        key, st = f.get('key'), f.get('stage')
        rep = (f.get('replacement') or '').strip()
        if not (key and st in STAGES and rep):
            continue
        row = tables.get(where, {}).get(key)
        if row and row.get(st):
            row[st] = rep
            n += 1
    return n


def emit(table, indent_key=8):
    """A stage table, six keys to a position."""
    body = []
    for k in sorted(table, key=lambda x: (x[0], int(x[1:]))):
        p = table[k]
        lines = ',\n'.join('%s%s: %s' % (' ' * indent_key, st, lit(dates(p[st]), indent_key + 4))
                           for st in STAGES if p.get(st))
        body.append('  %s: {\n%s },\n' % (k, lines))
    return ''.join(body)


def progression_faults(table, label):
    """A sequence whose stages could be shuffled unnoticed is six descriptions, not a progression.

    The cheap machine-readable test is overlap: two stages of one position sharing most of their
    content words are the same claim written twice, which is the defect this pass removes.
    """
    stop = set('the a an and or of to in on at is are was were be been by for from with that this '
               'it its as not no more most than then so which who whose what when where while '
               'their they them these those there has have had do does did one two three'.split())
    faults = []
    for k, p in table.items():
        words = {}
        for st in STAGES:
            t = (p.get(st) or '').lower()
            words[st] = {w for w in re.findall(r"[a-z][a-z'-]{3,}", t) if w not in stop}
        for i, a in enumerate(STAGES):
            for b in STAGES[i + 1:]:
                if not words[a] or not words[b]:
                    continue
                overlap = len(words[a] & words[b]) / min(len(words[a]), len(words[b]))
                if overlap > 0.62:
                    faults.append('%s %s: %s and %s share %.0f%% of their content words'
                                  % (label, k, a, b, 100 * overlap))
    return faults


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    tables, fixes = collect(sys.argv[1:])
    applied = apply_fixes(tables, fixes)
    head, passage = tables.get('head', {}), tables.get('passage', {})
    print('headline positions %d · passage positions %d' % (len(head), len(passage)))
    print('critic failures %d, replacements applied %d' % (len(fixes), applied))

    faults = progression_faults(head, 'headline') + progression_faults(passage, 'passage')
    if faults:
        print('\nstages that repeat each other (%d):' % len(faults))
        for f in faults[:10]:
            print('  ' + f)

    src = NARR.read_text(encoding='utf-8')
    if head:
        src = replace_table(src, 'HEADCL', emit(head))
    if passage:
        src = replace_table(src, 'FRAG', emit(passage))
        body = []
        for k in sorted(passage, key=lambda x: (x[0], int(x[1:]))):
            p = passage[k]
            lines = ''.join('          %s,\n' % lit(dates(b), 10) for b in (p.get('bullets') or []))
            body.append('  %s: { head: %s,\n        lines: [\n%s        ] },\n'
                        % (k, lit(dates(p['subhead']), 15), lines))
        src = replace_table(src, 'LONGFORM', ''.join(body))
    NARR.write_text(src, encoding='utf-8')
    print('written', NARR)


if __name__ == '__main__':
    main()
