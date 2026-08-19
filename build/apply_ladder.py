#!/usr/bin/env python3
"""Write the rebuilt capability ladder into web/js/narrative.js.

THE CAPABILITY CLAUSE OPENS EVERY HEADLINE, so its repetition is the one a reader notices most.
Seven rungs times four spans gave 28 phrases for the whole document, and across 5,000 composed
headlines one of them carried 29.6% and three carried 55%. August: "our ai capabilities sentences
like 'AI is answering questions the people who commissioned it cannot check' are too repetitive -
we have to say more about AI capabilities than this."

Each rung now holds six stages with three alternatives in each — 126 phrases — and each
alternative takes a different subject: what the systems finish unaided, where a person is still
required, which fields have visibly changed, what the failures look like, what has become cheap.

    python3 build/apply_ladder.py <journal.jsonl>
"""
import json
import re
import sys
from pathlib import Path

NARR = Path(__file__).resolve().parent.parent / 'web' / 'js' / 'narrative.js'
STAGES = ('s1', 's2', 's3', 's4', 's5', 's6')


def lit(text, indent):
    text = text.replace('\\', '\\\\').replace("'", "\\'")
    room = max(38, 96 - indent)
    if len(text) + indent + 2 <= 96:
        return "'%s'" % text
    chunks, cur = [], ''
    for w in text.split(' '):
        if cur and len(cur) + 1 + len(w) > room:
            chunks.append(cur + ' ')
            cur = w
        else:
            cur = (cur + ' ' + w) if cur else w
    chunks.append(cur)
    return (" +\n" + ' ' * indent).join("'%s'" % c for c in chunks)


def main():
    rungs = {}
    for line in Path(sys.argv[1]).read_text(encoding='utf-8').splitlines():
        try:
            r = json.loads(line)
        except ValueError:
            continue
        if r.get('type') != 'result':
            continue
        for row in ((r.get('result') or {}).get('rungs') or []):
            if row.get('threshold'):
                rungs[str(float(row['threshold']))] = row

    src = NARR.read_text(encoding='utf-8')
    i = src.index('const RUNG_SHORT = [')
    j = src.index('\n];', i)
    order = sorted(rungs, key=lambda x: -float(x))
    body = []
    for th in order:
        row = rungs[th]
        parts = []
        for st in STAGES:
            opts = row.get(st) or []
            if not opts:
                continue
            items = ',\n'.join('      %s' % lit(o.strip(), 6) for o in opts)
            parts.append('    %s: [\n%s ]' % (st, items))
        body.append('  [%s, {\n%s }],\n' % (th, ',\n'.join(parts)))
    src = src[:i] + 'const RUNG_SHORT = [\n' + ''.join(body) + src[j + 1:]
    NARR.write_text(src, encoding='utf-8')
    n = sum(len(rungs[t].get(s) or []) for t in rungs for s in STAGES)
    print('rungs %d · stages %d · phrases %d' % (len(rungs), len(rungs) * 6, n))


if __name__ == '__main__':
    main()
