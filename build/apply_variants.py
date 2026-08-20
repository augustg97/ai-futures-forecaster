#!/usr/bin/env python3
"""Give every stage two more ways of saying itself.

THE REPETITION WAS ARITHMETIC. A world-line fixes ten positions; each position offered exactly
one clause per stage; there are six stages. Sixty sentences covered seventy-four years, so the
sheet repeated itself about four times over whatever was written into it. August: "our sentences
still repeat across years - they should not, our language should be as dynamic as the events we
are forecasting."

Each stage now holds three clauses and the drawing picks by the year. An alternative earns its
place by taking a DIFFERENT SUBJECT — the workflow returned the subject of each so the set can be
checked rather than trusted.

    python3 build/apply_variants.py <variants.json>
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
STOP = set('the a an and or of to in on at is are was were be by for from with that this it its '
           'as not no more most than then so which who whose what when where while their they '
           'them these those there has have had do does did one two three'.split())


def words(t):
    return {w for w in re.findall(r"[a-z][a-z'-]{3,}", t.lower()) if w not in STOP}


def read_headcl(src):
    m = re.search(r'export const HEADCL = \{', src)
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
    # A STAGE MAY BE A STRING OR AN ARRAY OF THEM, and a reader that knows only the string form
    # returns an EMPTY row rather than an error. Run against the tripled table it read 36 of 324
    # slots, emitted what it had read, and deleted 972 clauses with a success message. Both forms.
    for row in re.finditer(r'\n  ([A-Z]\d+): \{([^}]*)\}', flat):
        r = {}
        for f in re.finditer(r'(s\d): (\[[^\]]*\]|"(?:[^"\\]|\\.)*")', row.group(2)):
            body = f.group(2)
            r[f.group(1)] = re.findall(r'"((?:[^"\\]|\\.)*)"', body)
        out[row.group(1)] = r
    return out


def emit(table):
    body = []
    for k in sorted(table, key=lambda x: (x[0], int(x[1:]))):
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
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    got = json.load(open(sys.argv[1], encoding='utf-8'))
    src = NARR.read_text(encoding='utf-8')
    table = read_headcl(src)

    added, dropped, unknown, subjects = 0, [], [], {}
    for p in got:
        key = (p.get('key') or '').strip()
        if key not in table:
            unknown.append(key)
            continue
        for v in (p.get('variants') or []):
            st, t = v.get('stage'), (v.get('text') or '').strip()
            if st not in STAGES or not t:
                continue
            # AN ALTERNATIVE THAT REPEATS ITS SIBLING IS NOT ONE. Half the content words shared
            # with a clause already in the slot is the same test the CROSS sweep uses.
            near = False
            for have in table[key].get(st, []):
                a, b = words(t), words(have)
                if a and b and len(a & b) / min(len(a), len(b)) > 0.5:
                    near = True
            if near:
                dropped.append(t)
                continue
            table[key].setdefault(st, []).append(t)
            subjects.setdefault((key, st), []).append((v.get('subject') or '?').lower())
            added += 1

    src = replace_table(src, 'HEADCL', emit(table))
    NARR.write_text(src, encoding='utf-8')

    # THE SUBJECT IS THE POINT. Three clauses about firms is a failure however differently worded.
    same = [k for k, v in subjects.items() if len(v) > len(set(v))]
    sizes = {}
    for k in table:
        for st in STAGES:
            n = len(table[k].get(st) or [])
            sizes[n] = sizes.get(n, 0) + 1
    print('added %d · dropped as near-duplicates %d · unknown keys %s'
          % (added, len(dropped), sorted(set(unknown)) or 'none'))
    print('slots by number of clauses:', dict(sorted(sizes.items())))
    print('slots whose alternatives repeat a subject: %d' % len(same))
    for t in dropped[:4]:
        print('   near-duplicate: ' + t[:96])
    print('written', NARR)


if __name__ == '__main__':
    main()
