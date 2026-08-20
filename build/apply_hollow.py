#!/usr/bin/env python3
"""Rewrite the sentences whose colon or semicolon opened onto nothing, and the ones that said
nothing at all.

AUGUST'S COMPLAINT, IN HIS WORDS: "Sometimes these nothing sentences have colons or semicolons,
the the subsequent clause does not elaborate or explain (and sometimes is just another nothing
statement)." `prose_gate.empty_marks()` turned it into a measurement — 32% of 245 marked
sentences had a second half carrying no figure, no named body and under five new content words.

THE REWRITES ARRIVE AS WHOLE SENTENCES, AND THE TABLES HOLD THEM WRAPPED. 113 of the 125 span a
JavaScript string concatenation, so a literal-level pass is the only one that can find them: read
each run of concatenated literals as one value, substitute, re-wrap at the run's own indent.

    python3 build/apply_hollow.py <fixes.json>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import lit  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'
# BOTH QUOTE STYLES. The stage tables are written with double quotes and the capability ladder
# with single ones, and a sentence August named sits in each.
RUNS = {
    '"': re.compile(r'"(?:[^"\\\n]|\\.)*"(?:\s*\+\s*\n?\s*"(?:[^"\\\n]|\\.)*")*'),
    "'": re.compile(r"'(?:[^'\\\n]|\\.)*'(?:\s*\+\s*\n?\s*'(?:[^'\\\n]|\\.)*')*"),
}


def decode(run, q):
    parts = re.findall(r'%s((?:[^%s\\\n]|\\.)*)%s' % (q, q, q), run)
    return ''.join(parts).replace('\\' + q, q).replace('\\\\', '\\')


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    fixes = json.load(open(sys.argv[1], encoding='utf-8'))
    pairs = [(f['before'].strip(), f['after'].strip()) for f in fixes
             if f.get('before') and f.get('after')]
    src = NARR.read_text(encoding='utf-8')
    applied = {b: 0 for b, _ in pairs}

    out = src
    for q, rx in RUNS.items():
        def swap(m, q=q):
            run = m.group(0)
            val = decode(run, q)
            new = val
            for b, a in pairs:
                if b in new:
                    new = new.replace(b, a)
                    applied[b] += 1
            if new == val:
                return run
            line_start = out.rfind('\n', 0, m.start()) + 1
            t = lit(new, m.start() - line_start)
            return t if q == '"' else t.replace('"', "'")
        out = rx.sub(swap, out)
    NARR.write_text(out, encoding='utf-8')

    done = sum(1 for b in applied if applied[b])
    print('rewrites applied %d of %d' % (done, len(pairs)))
    for b in applied:
        if not applied[b]:
            print('   NOT FOUND: ' + b[:100])
    flat = re.sub(r'["\']\s*\+\s*\n?\s*["\']', '', out)
    left = [b for b, _ in pairs if b in flat]
    print('originals still present: %d' % len(left))
    print('written', NARR)


if __name__ == '__main__':
    main()
