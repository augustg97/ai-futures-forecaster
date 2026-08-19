#!/usr/bin/env python3
"""Merge the stage writers, their critics and the repair passes into two journals.

FOUR PASSES PRODUCE ONE TABLE. A writer per axis, a critic per axis, and — because a per-axis
critic cannot see a fault that runs across the whole set — a repair pass whose agents each read
the entire set. This applies them in that order and writes journals `apply_stages.py` can read.

THE FAULT THE REPAIR PASS EXISTS FOR. An instruction in a brief becomes a formula at scale, and
the more sentence-shaped the instruction the more literally it is copied. The stage-6 spec said
"what the sequence amounts to, and what is still open"; 21 of 48 passage paragraphs opened with
"The sequence amounts to" and 39 closed on "stays open". Nine per-axis critics passed all of it,
each seeing only its own five to eight positions.

    python3 build/merge_stages.py
"""
import json
import re
import sys
from pathlib import Path

WF = Path('/Users/augustgweon/.claude/projects/-Users-augustgweon/'
          '92fc10c8-fb2d-45a6-bea7-5cf3c139d7bd/subagents/workflows')
SP = Path('/private/tmp/claude-501/-Users-augustgweon/'
          '92fc10c8-fb2d-45a6-bea7-5cf3c139d7bd/scratchpad')
STAGES = ('s1', 's2', 's3', 's4', 's5', 's6')

# writer+critic run, repair run, whether the table carries bullets
RUNS = {
    'headline': ('wf_3f303a85-2b8', 'wf_f78af5f6-da2', False),
    'passage': ('wf_a3a70843-06c', 'wf_5d83af41-806', True),
}
# A LAST PASS OVER BOTH TABLES AT ONCE. The per-table repairs each cleared the formula they were
# shown; running the gate over the merged result found two more that only exist across tables —
# "the problem this creates" in fifteen paragraphs, and one insurance citation in eight
# positions. Its entries are keyed "table|position|stage".
FINAL = 'wf_f8483cbb-853'
# phrases lifted out of the brief, and the drawing's names for its own parts
COPIED = re.compile(
    r'the (?:first|second|early) consequence|second-order effect|[Tt]he sequence amounts|'
    r'[Ww]hat has settled|remains unsettled|stays unsettled|stays open|remains open|'
    r'is still open|remains untested|stays unknown', re.I)
MODEL = re.compile(r'\b(?:research rung|coding rung|the rung|this axis|this span|this setting|'
                   r'this position|world-line)\b', re.I)


def results(run):
    f = WF / run / 'journal.jsonl'
    if not f.exists():
        return
    for line in f.read_text(encoding='utf-8').splitlines():
        try:
            r = json.loads(line)
        except ValueError:
            continue
        if r.get('type') != 'result':
            continue
        v = r.get('result') or r.get('value') or {}
        if isinstance(v, dict):
            yield v


def build(write_run, repair_run):
    pos, fixes = {}, []
    for v in results(write_run):
        for p in (v.get('positions') or []):
            if p.get('key'):
                pos[p['key']] = p
        w = v.get('written')
        if w:
            for p in (w.get('positions') or []):
                if p.get('key'):
                    pos[p['key']] = p
        for f in (v.get('failures') or []):
            fixes.append(f)
        c = v.get('critique')
        if c:
            fixes += (c.get('failures') or [])
    applied = 0
    for f in fixes:
        k, st, rep = f.get('key'), f.get('stage'), (f.get('replacement') or '').strip()
        if k in pos and st in STAGES and rep:
            pos[k][st] = rep
            applied += 1

    repaired = 0
    for v in results(repair_run):
        # the headline repair returns {key, s6}; the passage repair returns {key, stage, text}
        for c in (v.get('clauses') or []):
            k = c.get('key')
            if k in pos and c.get('s6'):
                pos[k]['s6'] = c['s6'].strip()
                repaired += 1
        for c in (v.get('positions') or []):
            k, st, t = c.get('key'), c.get('stage'), (c.get('text') or '').strip()
            if k in pos and st in STAGES and t:
                pos[k][st] = t
                repaired += 1
    return pos, applied, repaired


def final_pass(tables):
    """The cross-table repair, applied to whichever table each entry names."""
    n = 0
    for v in results(FINAL):
        for c in (v.get('clauses') or []):
            parts = (c.get('id') or '').split('|')
            t = (c.get('text') or '').strip()
            if len(parts) != 3 or not t:
                continue
            table, key, st = parts
            if table in tables and key in tables[table] and st in STAGES:
                tables[table][key][st] = t
                n += 1
    return n


def main():
    built = {}
    for name, (write_run, repair_run, _b) in RUNS.items():
        built[name] = build(write_run, repair_run)
    tables = {k: v[0] for k, v in built.items()}
    last = final_pass(tables)
    print('cross-table repair applied to %d paragraphs' % last)
    for name, (write_run, repair_run, bullets) in RUNS.items():
        pos, applied, repaired = built[name]
        if not pos:
            print('%s: nothing found in %s' % (name, write_run), file=sys.stderr)
            continue
        left_c = sum(1 for p in pos.values() for st in STAGES if COPIED.search(p.get(st) or ''))
        left_m = sum(1 for p in pos.values() for st in STAGES if MODEL.search(p.get(st) or ''))
        out = SP / ('%s-final.jsonl' % name)
        payload = {'axis': 'ALL', 'positions': list(pos.values())}
        if not bullets:
            for p in payload['positions']:
                p.pop('bullets', None)
                p.pop('subhead', None)
        out.write_text(json.dumps({'type': 'result', 'result': payload}) + '\n', encoding='utf-8')
        print('%-8s %d positions · critic %d · repair %d · copied phrases left %d · model words %d'
              % (name, len(pos), applied, repaired, left_c, left_m))
        print('         → %s' % out)


if __name__ == '__main__':
    main()
