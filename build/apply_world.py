#!/usr/bin/env python3
"""Write the world-facing re-author into web/js/narrative.js.

Two workflows feed this: one for the headline clauses (HEADCL, ECON, ECON_MOD) and one for the
passage (FRAG, LONGFORM). Each ran a writer per axis and then a CRITIC that read the writer's
work cold and returned only what failed, with a replacement. THE CRITIC'S REPLACEMENTS ARE
APPLIED HERE, so a clause that failed the three questions never reaches the sheet.

The three questions, from the brief both workflows ran under:
  1. Is this a fact, a development or a well-supported expectation, as opposed to a procedure?
  2. Would a non-specialist understand it?
  3. Does it say why?

    python3 build/apply_world.py <headline-journal> <passage-journal>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import dates, lit, replace_table  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'
SPANS = ('near', 'mid', 'long', 'far')


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
    """Everything the workflows returned, with critiques kept separate."""
    head, passage, econ, cross = {}, {}, {'base': {}, 'mods': {}}, {}
    fixes = []
    for j in journals:
        # the passage workflow returns positions; the headline workflow returns clauses
        body = Path(j).read_text(encoding='utf-8')
        where = ('cross' if '|' in body and '"clauses"' in body and '"positions"' not in body
                 and '"near"' not in body
                 else 'passage' if '"positions"' in body else 'head')
        for v in rows(j):
            for c in (v.get('clauses') or []):
                if not c.get('key'):
                    continue
                if where == 'cross' or '|' in c['key']:
                    cross[c['key']] = c
                else:
                    head[c['key']] = c
            for p in (v.get('positions') or []):
                if p.get('key'):
                    passage[p['key']] = p
            for b in (v.get('base') or []):
                if b.get('key'):
                    econ['base'][b['key']] = b
            for m in (v.get('mods') or []):
                econ['mods']['%s|%s' % (m['economy'], m['second'])] = m
            # A FIX MUST NAME ITS TABLE. Both workflows key on the same 48 letters, so a
            # passage critic's replacement matched the headline row first and overwrote a
            # clause the critic had never read. The target comes from which workflow the fix
            # arrived in, never from the key.
            for f in (v.get('failures') or []):
                fixes.append((where, f))
            # a pipeline stage returns the writer and its critic together
            w, c = v.get('written'), v.get('critique')
            if w:
                for p in (w.get('positions') or []):
                    if p.get('key'):
                        passage[p['key']] = p
                for cl in (w.get('clauses') or []):
                    if not cl.get('key'):
                        continue
                    if where == 'cross' or '|' in cl['key']:
                        cross[cl['key']] = cl
                    else:
                        head[cl['key']] = cl
            if c:
                for f in (c.get('failures') or []):
                    fixes.append((where, f))
    return head, passage, econ, cross, fixes


def apply_fixes(head, passage, econ, cross, fixes):
    """A clause the critic failed is replaced by the one it wrote, in its own table."""
    n = 0
    for where, f in fixes:
        key, span = f.get('key'), f.get('span')
        rep = (f.get('replacement') or '').strip()
        if not (key and rep):
            continue
        # a crossing clause has one text and no span
        if where == 'cross' or '|' in key:
            if key in cross:
                cross[key]['text'] = rep
                n += 1
            continue
        if span not in SPANS:
            continue
        targets = (passage,) if where == 'passage' else (head, econ['base'])
        for table in targets:
            row = table.get(key)
            if row and row.get(span):
                row[span] = rep
                n += 1
                break
    return n


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    head, passage, econ, cross, fixes = collect(sys.argv[1:])
    applied = apply_fixes(head, passage, econ, cross, fixes)
    print('headline %d · passage %d · economy %d base %d mods · crossings %d'
          % (len(head), len(passage), len(econ['base']), len(econ['mods']), len(cross)))
    print('critic failures %d, replacements applied %d' % (len(fixes), applied))

    src = NARR.read_text(encoding='utf-8')
    order = (lambda k: (k[0], int(k[1:])))

    if head:
        body = []
        for k in sorted(head, key=order):
            c = head[k]
            body.append('  %s: { near: %s,\n        mid: %s,\n        long: %s,\n        far: %s },\n'
                        % (k, lit(dates(c['near']), 15), lit(dates(c['mid']), 14),
                           lit(dates(c['long']), 15), lit(dates(c['far']), 14)))
        src = replace_table(src, 'HEADCL', ''.join(body))

    if econ['base']:
        body = []
        for k in sorted(econ['base'], key=order):
            c = econ['base'][k]
            body.append('  %s: { near: %s,\n        mid: %s,\n        long: %s,\n        far: %s },\n'
                        % (k, lit(dates(c['near']), 15), lit(dates(c['mid']), 14),
                           lit(dates(c['long']), 15), lit(dates(c['far']), 14)))
        src = replace_table(src, 'ECON', ''.join(body))

    if econ['mods']:
        # THE MODIFIER IS WRITTEN AGAINST THE RECORD, so it carries the near and mid spans only;
        # past those the second variable speaks through its own span text.
        body = []
        for k in sorted(econ['mods']):
            m = econ['mods'][k]
            body.append('  "%s": {\n    near: %s,\n    mid: %s },\n'
                        % (k, lit(dates(m['near']), 10), lit(dates(m['mid']), 9)))
        src = replace_table(src, 'ECON_MOD', ''.join(body))

    if passage:
        body = []
        for k in sorted(passage, key=order):
            p = passage[k]
            body.append('  %s: { near: %s,\n        mid: %s,\n        long: %s,\n        far: %s },\n'
                        % (k, lit(dates(p['near']), 15), lit(dates(p['mid']), 14),
                           lit(dates(p['long']), 15), lit(dates(p['far']), 14)))
        src = replace_table(src, 'FRAG', ''.join(body))

        body = []
        for k in sorted(passage, key=order):
            p = passage[k]
            lines = ''.join('          %s,\n' % lit(dates(b), 10) for b in (p.get('bullets') or []))
            body.append('  %s: { head: %s,\n        lines: [\n%s        ] },\n'
                        % (k, lit(dates(p['subhead']), 15), lines))
        src = replace_table(src, 'LONGFORM', ''.join(body))

    if cross:
        body = ''.join('  "%s": %s,\n' % (k, lit(dates(cross[k]['text']), 4))
                       for k in sorted(cross))
        src = replace_table(src, 'CROSS', body)

    NARR.write_text(src, encoding='utf-8')
    print('written', NARR)


if __name__ == '__main__':
    main()
