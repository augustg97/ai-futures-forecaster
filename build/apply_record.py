#!/usr/bin/env python3
"""Write a rewritten record into web/js/record.js, matched by year.

THE RECORD CARRIES MORE WEIGHT THAN IT DID. The sheet used to run its forecast machinery at 2026,
so the present year printed whichever branch the controls had selected — "savings tied to AI
companies lose most of their value" against a record that says Nvidia closed at an all-time high
in April. 2026 and every earlier year now draw these entries, so their prose is read as often as
the forecast's.

Each entry has `t`, what happened, and `m`, what it established. The two print one after the
other, and `m` had been written as a noun phrase, which gave the reader a sentence followed by a
fragment. Strunk's Rule 6: do not break sentences in two.

    python3 build/apply_record.py <journal.jsonl> [...]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REC = ROOT / 'web' / 'js' / 'record.js'
# the drawing's names for its own parts, which a reader has never met
MODEL = re.compile(r'\b(the ladder|this chart|this sheet|this document|this forecast|'
                   r'the \w+ axis|capability index|the scale ruled)\b', re.I)


def results(journals):
    for j in journals:
        for line in Path(j).read_text(encoding='utf-8').splitlines():
            try:
                r = json.loads(line)
            except ValueError:
                continue
            if r.get('type') != 'result':
                continue
            v = r.get('result') or r.get('value') or {}
            if isinstance(v, dict):
                yield v


def wrap(text, indent):
    """A JS single-quoted literal, wrapped into concatenated parts."""
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
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    new = {}
    for v in results(sys.argv[1:]):
        for e in (v.get('entries') or []):
            if e.get('y'):
                new[str(e['y'])] = e
    src = REC.read_text(encoding='utf-8')

    # each entry is { y: N, lane: '..', k: '..', t: '..', m: '..' }, t and m possibly wrapped
    ENTRY = re.compile(
        r"(\{\s*y:\s*)([\d.]+)(,\s*lane:\s*'[^']*',\s*k:\s*'(?:[^'\\]|\\.)*',\s*t:\s*)"
        r"((?:'(?:[^'\\\n]|\\.)*'(?:\s*\+\s*\n?\s*'(?:[^'\\\n]|\\.)*')*))"
        r"(,\s*m:\s*)"
        r"((?:'(?:[^'\\\n]|\\.)*'(?:\s*\+\s*\n?\s*'(?:[^'\\\n]|\\.)*')*))")
    hit = [0, 0]

    def swap(m):
        y = m.group(2)
        e = new.get(y)
        if not e:
            return m.group(0)
        hit[0] += 1
        t = wrap(e['t'].strip(), 8)
        mm = wrap(e['m'].strip(), 8)
        if MODEL.search(e['t']) or MODEL.search(e['m']):
            hit[1] += 1
        return m.group(1) + y + m.group(3) + t + m.group(5) + mm
    out = ENTRY.sub(swap, src)
    REC.write_text(out, encoding='utf-8')

    # every consequence must now be a complete sentence
    flat = re.sub(r"'\s*\+\s*\n?\s*'", '', out)
    ms = re.findall(r"m:\s*'((?:[^'\\]|\\.)*)'", flat)
    frag = [x for x in ms if not re.match(r'^[A-Z“"]', x.strip()) or not x.strip().endswith(('.', '!', '?'))]
    left = [x for x in re.findall(r"[tm]:\s*'((?:[^'\\]|\\.)*)'", flat) if MODEL.search(x)]
    print('entries rewritten %d of %d · fragments left %d · model vocabulary left %d'
          % (hit[0], len(new), len(frag), len(left)))
    for x in left[:4]:
        print('   model vocabulary: ' + x[:90])
    print('written', REC)


if __name__ == '__main__':
    main()
