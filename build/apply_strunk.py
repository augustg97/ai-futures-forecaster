#!/usr/bin/env python3
"""Write the Elements of Style pass into web/js/narrative.js.

STRUNK'S RULE 14 WAS THE SHEET'S WORST HABIT. "This rule refers especially to loose sentences of
a particular type, those consisting of two co-ordinate clauses, the second introduced by a
conjunction or relative. Although single sentences of this type may be unexceptionable, a series
soon becomes monotonous and tedious."

Measured before the pass: 838 of 1,542 authored sentences — 54% — were of that type, 453 joined
by ", and" and 249 by ", so". August heard it without counting it: "obviously repetitive in their
'x, so y' pattern. we need further variation - if needed, making headings longer if that improves
the writing."

Each agent returned the construction it used, so the spread can be checked as well as the share.

    python3 build/apply_strunk.py <journal.jsonl> [...]
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
LOOSE = re.compile(r',\s+(and|but|so|which|who|when|where|while)\s')


def results(journals):
    """Each result, tagged with the table its agent was given.

    THE SHAPE OF A RETURN CANNOT TELL YOU WHICH TABLE IT BELONGS TO. The headline agents and the
    passage agents both return {key, stage, text}, and a short paragraph is indistinguishable
    from a long clause. What does tell them apart is the file each agent was told to read, which
    its own transcript records.
    """
    for j in journals:
        run = Path(j).parent
        for line in Path(j).read_text(encoding='utf-8').splitlines():
            try:
                r = json.loads(line)
            except ValueError:
                continue
            if r.get('type') != 'result':
                continue
            v = r.get('result') or r.get('value') or {}
            if not isinstance(v, dict):
                continue
            where = 'unknown'
            tr = run / ('agent-%s.jsonl' % r.get('agentId', ''))
            if tr.exists():
                body = tr.read_text(encoding='utf-8', errors='ignore')[:200000]
                for name, tag in (('style-headcl.json', 'head'),
                                  ('style-frag.json', 'passage'),
                                  ('style-cross.json', 'cross')):
                    if name in body:
                        where = tag
                        break
            yield where, v


def read_table(src, name):
    """The stage table as it stands, so a clause the pass did not touch survives."""
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
    flat = re.sub(r'"\s*\+\s*\n?\s*"', '', src[m.end():i])
    out = {}
    for row in re.finditer(r'\n  ([A-Z]\d+): \{([^}]*)\}', flat):
        r = {}
        for f in re.finditer(r'(s\d|near|mid|long|far): "((?:[^"\\]|\\.)*)"', row.group(2)):
            r[f.group(1)] = f.group(2)
        out[row.group(1)] = r
    return out


def emit_stages(table):
    body = []
    for k in sorted(table, key=lambda x: (x[0], int(x[1:]))):
        rows = ',\n'.join('        %s: %s' % (st, lit(dates(table[k][st]), 12))
                          for st in STAGES if table[k].get(st))
        body.append('  %s: {\n%s },\n' % (k, rows))
    return ''.join(body)


def loose_share(texts):
    sents = [x.strip() for t in texts for x in re.split(r'(?<=[.!?])\s+', t)
             if len(x.strip()) > 25]
    hits = [LOOSE.search(x) for x in sents]
    loose = [h for h in hits if h]
    by = {}
    for h in loose:
        by[h.group(1)] = by.get(h.group(1), 0) + 1
    return len(sents), len(loose), by


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    heads, paras, cross, forms = {}, {}, {}, {}
    for where, v in results(sys.argv[1:]):
        for c in (v.get('clauses') or []):
            key, st, t = c.get('key'), c.get('stage'), (c.get('text') or '').strip()
            if not (key and t):
                continue
            forms[c.get('form', '?')] = forms.get(c.get('form', '?'), 0) + 1
            if where == 'cross' or '|' in key:
                cross[key] = t
            elif where == 'head' and st in STAGES:
                heads.setdefault(key, {})[st] = t
            elif where == 'passage' and st in STAGES:
                paras.setdefault(key, {})[st] = t
    print('returned: headline %d · passage %d · crossings %d'
          % (sum(len(v) for v in heads.values()), sum(len(v) for v in paras.values()), len(cross)))
    print('constructions:', dict(sorted(forms.items(), key=lambda kv: -kv[1])))

    src = NARR.read_text(encoding='utf-8')
    cur_head, cur_frag = read_table(src, 'HEADCL'), read_table(src, 'FRAG')
    for key, rows in heads.items():
        for st, t in rows.items():
            cur_head.setdefault(key, {})[st] = t
    for key, rows in paras.items():
        for st, t in rows.items():
            cur_frag.setdefault(key, {})[st] = t
    src = replace_table(src, 'HEADCL', emit_stages(cur_head))
    src = replace_table(src, 'FRAG', emit_stages(cur_frag))
    if cross:
        body = ''.join('  "%s": %s,\n' % (k, lit(dates(cross[k]), 4)) for k in sorted(cross))
        src = replace_table(src, 'CROSS', body)
    NARR.write_text(src, encoding='utf-8')

    texts = ([t for r in cur_head.values() for t in r.values()]
             + [t for r in cur_frag.values() for t in r.values()] + list(cross.values()))
    n, loose, by = loose_share(texts)
    print('after the pass: %d sentences, %d loose (%.0f%%)' % (n, loose, 100 * loose / max(1, n)))
    print('  by connective:', dict(sorted(by.items(), key=lambda kv: -kv[1])))
    print('written', NARR)


if __name__ == '__main__':
    main()
