#!/usr/bin/env python3
"""Write a workflow's authored layer into web/js/narrative.js.

THE AUTHORED LAYER IS GENERATED, NEVER TRANSCRIBED. Forty-eight positions times four spans,
plus headline clauses, bullets, multi-year processes and the economy modifiers, is more text
than a hand can copy without a splice. This reads the workflow journals, applies the date
policy, and rewrites each table in place.

THE DATE POLICY. A statute, an order, a treaty signature and a court ruling keep their exact
date, because the date is the operative fact. A market move, an earnings call, a product
release, a survey and a benchmark reading lose theirs and keep their figure.

    python3 build/apply_authored.py <journal.jsonl> [<journal.jsonl> ...]
"""
import datetime
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'

# ── the date policy ─────────────────────────────────────────────────────────
KEEP = set("""2026-01-01 2026-08-02 2027-01-01 2027-12-02 2026-07-27 2026-02-01 2026-06-30
2026-05-14 2024-09-05 2024-11-16 2026-02-19 2026-01-13 2026-06-12 2026-06-26 2026-07-10
2025-11-19 2025-12-08 2026-01-10 2026-02-05 2018-05-08 1975-03-26 1975-08-01 2024-06-12
2026-07-16 2028-08-02 2026-09-01 2026-05-15 2025-12-11 2026-12-02 2027-08-02
2026-07-06 2026-01-15 2026-10-01 2029-08-02 2026-07-01""".split())
# a forecast band written as a calendar date claims a precision no forecast has
BAND = {'2028-12-31': '2028', '2035-12-31': '2035', '2031-12-31': '2031', '2036-12-31': '2036',
        '2029-01-01': '2029', '2032-01-01': '2032', '2050-12-31': '2050',
        '2040-12-31': '2040', '2060-12-31': '2060', '2027-03-05': 'March 2027',
        '2027-12-31': '2027', '2033-12-31': '2033', '2045-12-31': '2045'}


def month(d):
    y, m, _ = d.split('-')
    return datetime.date(int(y), int(m), 1).strftime('%B ') + y


def dates(text):
    """Coarsen every date the policy does not keep."""
    for k, v in BAND.items():
        text = text.replace(k, v)
    iso = r'\d{4}-\d{2}-\d{2}'

    def drop(d):
        return d not in KEEP and d not in BAND

    # a span of two dropped dates becomes two months, before any deletion can strand a verb
    def pair(m):
        a, b = m.group(2), m.group(4)
        if not (drop(a) and drop(b)):
            return m.group(0)
        return '%s %s %s %s' % (m.group(1), month(a), m.group(3), month(b))
    text = re.sub(r'\b(between|from) (%s) (and|to) (%s)' % (iso, iso), pair, text)

    # a prepositional phrase whose only content is a dropped date goes; the figure stays
    def phrase(m):
        return '' if drop(m.group(1)) else m.group(0)
    text = re.sub(r' (?:on|of) (%s)\b' % iso, phrase, text)

    # anything still carrying one coarsens to its month
    def single(m):
        return month(m.group(1)) if drop(m.group(1)) else m.group(0)
    text = re.sub(r'\b(%s)\b' % iso, single, text)

    text = re.sub(r' +', ' ', text).replace(' ,', ',').replace(' .', '.')
    return re.sub(r'\bon (January|February|March|April|May|June|July|August|September|'
                  r'October|November|December) (\d{4})\b', r'in \1 \2', text).strip()


# ── the modifier's length ───────────────────────────────────────────────────
# THE HEADLINE IS THE LARGEST LETTERING ON THE SHEET. A modifier of 270 characters hung off an
# economy clause makes one breath of five figures and two subordinate clauses. Cutting at the
# consequence keeps the figures and the subject; cutting at the figures keeps neither.
def trim_clause(t, cap=185):
    if len(t) <= cap:
        return t
    for mark in [', so ', ', and ', ' while ']:
        at = t.rfind(mark)
        if 60 < at <= cap:
            return t[:at].rstrip(' ,') + '.'
    return t


# ── emitting a JS table ─────────────────────────────────────────────────────
def lit(text, indent, width=94):
    """One string, wrapped into concatenated literals at a given indent."""
    text = text.replace('\\', '\\\\').replace('"', '\\"')
    room = max(38, width - indent)
    if len(text) + indent + 2 <= width:
        return '"%s"' % text
    chunks, cur = [], ''
    for w in text.split(' '):
        if cur and len(cur) + 1 + len(w) > room:
            chunks.append(cur + ' ')
            cur = w
        else:
            cur = (cur + ' ' + w) if cur else w
    chunks.append(cur)
    joiner = ' +\n' + ' ' * indent
    return joiner.join('"%s"' % c for c in chunks)


def replace_table(src, name, body):
    """Swap the body of a top-level object literal, keeping its declaration."""
    m = re.search(r'((?:export )?const %s = )\{' % name, src)
    if not m:
        raise SystemExit('table not found: ' + name)
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
    old = src[m.end():i - 1]
    was, now = len(re.findall(r'"', old)) // 2, len(re.findall(r'"', body)) // 2
    if was and now < was:
        raise SystemExit('%s: refusing to write %d strings over %d — the read lost %d'
                         % (name, now, was, was - now))
    return src[:m.start()] + m.group(1) + '{\n' + body + '};' + src[i + 1:]


def main():
    journals = [Path(a) for a in sys.argv[1:]]
    if not journals:
        raise SystemExit(__doc__)
    frags, econ = {}, {}
    for j in journals:
        for line in j.read_text(encoding='utf-8').splitlines():
            try:
                row = json.loads(line)
            except ValueError:
                continue
            if row.get('type') != 'result':
                continue
            v = row.get('value') or row.get('result') or {}
            if isinstance(v, str):
                try:
                    v = json.loads(v)
                except ValueError:
                    continue
            for fr in (v.get('fragments') or []):
                frags[fr['key']] = fr
            if v.get('economy'):
                for c in (v.get('clauses') or []):
                    # STORED CAPITALISED. The composer lowercases a modifier when it joins one
                    # with "and" and keeps the capital when it stands as its own sentence; a
                    # clause stored lowercase has no capital for the second case to keep.
                    t = trim_clause(c['text'].strip())
                    econ['%s|%s' % (v['economy'], c['second'])] = t[:1].upper() + t[1:]

    src = NARR.read_text(encoding='utf-8')
    keys = sorted(frags, key=lambda k: (k[0], int(k[1:])))
    print('fragments %d · economy modifiers %d' % (len(keys), len(econ)))

    # FRAG — the paragraph opener, one per position per span
    body = []
    for k in keys:
        f = frags[k]
        body.append('  %s: { near: %s,\n        mid: %s,\n        long: %s,\n        far: %s },\n'
                    % (k, lit(dates(f['near']), 15), lit(dates(f['mid']), 14),
                       lit(dates(f['long']), 15), lit(dates(f['far']), 14)))
    src = replace_table(src, 'FRAG', ''.join(body))

    # HEADCL — one complete clause per position per span, for the headline
    body = []
    for k in keys:
        f = frags[k]
        body.append('  %s: { near: %s,\n        mid: %s,\n        long: %s,\n        far: %s },\n'
                    % (k, lit(dates(f['headNear']), 15), lit(dates(f['headMid']), 14),
                       lit(dates(f['headLong']), 15), lit(dates(f['headFar']), 14)))
    src = replace_table(src, 'HEADCL', ''.join(body))

    # PROCESS — the multi-year mechanisms, each with the number of years it runs
    body = []
    for k in keys:
        rows = []
        for p in (frags[k].get('processes') or []):
            years = re.findall(r'\(([^)]*?)\s*years?\)\s*$', p)
            nums = re.findall(r'\d+(?:\.\d+)?', years[0]) if years else []
            n = round(sum(float(x) for x in nums) / len(nums)) if nums else 0
            if not n:
                continue
            t = re.sub(r'\s*\([^)]*\)\s*$', '', p).rstrip('. ')
            rows.append('    { n: %d, t: %s },\n' % (n, lit(dates(t) + '.', 9)))
        if rows:
            body.append('  %s: [\n%s  ],\n' % (k, ''.join(rows)))
    src = replace_table(src, 'PROCESS', ''.join(body))

    # LONGFORM — the group heading and its bullets
    body = []
    for k in keys:
        f = frags[k]
        lines = ''.join('          %s,\n' % lit(dates(b), 10) for b in (f.get('bullets') or []))
        body.append('  %s: { head: %s,\n        lines: [\n%s        ] },\n'
                    % (k, lit(dates(f['subhead']), 15), lines))
    src = replace_table(src, 'LONGFORM', ''.join(body))

    # ECON_MOD — what the rest of the line does to the economy, one clause per pair
    if econ:
        body = ''.join('  "%s": %s,\n' % (k, lit(dates(econ[k]), 4)) for k in sorted(econ))
        src = replace_table(src, 'ECON_MOD', body)

    NARR.write_text(src, encoding='utf-8')
    print('written', NARR)


if __name__ == '__main__':
    main()
