#!/usr/bin/env python3
"""Add axis L, laboratory conduct, to the Atlas registry as r7.

A REGISTRY CHANGE IS A DECISION, so this carries its own changelog entry naming what changed, why,
and the evidence. August approved it on 2026-08-20 and removed the standing rule requiring his
word each time; the discipline it protected is now practice rather than permission.

THE MERGE IS THE HARD PART, AND IT FAILED SILENTLY ONCE. `REGISTRY["conditionals"]` is a dict
literal keyed by child axis. Inserting a new `"A": {...}` block instead of merging into the
existing one produces DUPLICATE KEYS in one literal, which Python resolves by keeping the last —
so 38 carefully sized edges vanished with no error, no traceback and a file that still parsed.
This walks the literal and merges into each block that already exists.

    python3 build/write_r7.py
"""
import json
import re
import textwrap
from pathlib import Path

AXES = Path.home() / 'AI Atlas' / 'Research' / 'timelines' / 'axes.py'
DESIGN = Path(__file__).resolve().parent.parent / 'Research' / 'findings' / 'r7-laboratory-axis.json'


def q(text, indent):
    """A wrapped python string literal in the file's own style."""
    text = text.replace('\\', '\\\\').replace('"', '\\"')
    lines = textwrap.wrap(text, max(30, 78 - indent))
    pad = ' ' * indent
    return ('\n' + pad).join('"%s "' % l if i < len(lines) - 1 else '"%s"' % l
                             for i, l in enumerate(lines))


def block_end(src, start):
    """The index just past the matching close brace of a dict literal opened at `start`."""
    i, depth = start, 0
    while i < len(src):
        c = src[i]
        if c == '"':
            i = src.index('"', i + 1)
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise SystemExit('unbalanced literal')


def merge_edges(src, edges):
    """Add each edge to the conditional block of the axis it acts on, never beside it.

    THE SEARCH IS SCOPED, NOT GUESSED. A first version matched `\n  "A": {` and missed the real
    block, which is indented four spaces — and then created a second `"A"` key in the same dict
    literal, which Python resolves by dropping one silently. The block boundaries are found by
    walking the literal, and a key is looked for only inside them.
    """
    by_child = {}
    for e in edges:
        by_child.setdefault(e['to'][0], {}).setdefault(e['from'], {})[e['to']] = e['multiplier']
    start = src.index('"conditionals": {') + len('"conditionals": ')
    end = block_end(src, start)
    added = 0
    for child_axis, parents in sorted(by_child.items(), reverse=True):
        m = re.search(r'\n\s*"%s":\s*\{' % child_axis, src[start:end])
        if not m:
            raise SystemExit('no conditional block for %s inside the conditionals literal — '
                             'refusing to create a duplicate key' % child_axis)
        at = start + m.end() - 1              # the opening brace of that axis's block
        lines = ''.join('\n           "%s": %s,' % (pp, json.dumps(kids))
                        for pp, kids in sorted(parents.items()))
        src = src[:at + 1] + lines + src[at + 1:]
        end += len(lines)
        added += sum(len(k) for k in parents.values())
    return src, added


def main():
    d = json.loads(DESIGN.read_text(encoding='utf-8'))
    src = AXES.read_text(encoding='utf-8')
    if '"key": "L"' in src:
        raise SystemExit('axis L is already present')

    pos = []
    for p in d['positions']:
        desc = ' '.join(x.strip() for x in (p['desc'], p.get('postRSI') or '',
                                            p.get('safety') or '', p.get('largesse') or '') if x)
        pos.append('       ("%s", %s, %.3f,\n        %s,\n        %s),'
                   % (p['key'], q(p['name'], 8), p['prior'],
                      json.dumps(['analysis/frontier-lab-conduct']), q(desc, 8)))
    axis = ('    {"key": "L", "name": "Laboratory conduct",\n'
            '     "desc": ' + q(d['question'].strip() + ' ' + d['desc'].strip(), 13) + ',\n'
            '     "cites": ["analysis/frontier-lab-conduct"],\n'
            '     "positions": [\n' + '\n'.join(pos) + '\n     ]},\n')

    m = re.search(r'\n  \],\n  "conditionals": \{', src)
    src = src[:m.start()] + '\n' + axis + '  ],\n  "conditionals": {' + src[m.end():]

    src, added = merge_edges(src, d['edges'])
    src = src.replace('REGISTRY_VERSION = "r6-2026-08-18"',
                      'REGISTRY_VERSION = "r7-2026-08-20"', 1)

    entry = (
        '    {"version": REGISTRY_VERSION, "date": "2026-08-20",\n'
        '     "change": ' + q(
            "r7 - a tenth axis, L, laboratory conduct, and the first that asks what an actor "
            "CHOOSES. Every existing axis is a condition the laboratories find themselves in: T "
            "how fast capability arrives, S who owns the computing, E whether the money holds, C "
            "what the two governments settle, R who writes the rules, P what the public does. "
            "February 2026 showed that conduct is separate: four United States frontier "
            "laboratories met the same Department of War demand for all-lawful-purposes access "
            "inside one week and chose four postures. One published a refusal naming two "
            "exclusions, was designated a supply-chain risk the next day, and is still "
            "litigating. One signed and engineered the limits into architecture and contract, "
            "retaining discretion over its own safety stack, then amended after a backlash. One "
            "agreed to adjust safety settings on request. One took the contract with no public "
            "red line. Same environment, same week, four choices, which no structural axis can "
            "express. Six postures, priors summing to 1, 38 conditional edges. Each position "
            "states what it does once systems improve themselves - who sets the research agenda, "
            "at what rate, open-ended or confined, held or published, coordinated or not - and "
            "its approach to safety and its use of wealth. THE OBJECTION, RECORDED BECAUSE IT "
            "WAS NOT RESOLVED: a posture can be voided by the state in an afternoon, so L may be "
            "R4 wearing six coats. The answer is that four laboratories differed under one "
            "government in one week, which R4 cannot say.", 15) + ',\n'
        '     "approved": ' + q(
            "August (2026-08-20). He set the framing - 'for the AI labs, this is about what they "
            "choose to do, given their environment. this is not about structural factors - it is "
            "about their choices and how they adapt and change' - sharpened it twice, with "
            "'Especially post RSI, how they choose to approach AI development also' and 'include "
            "AI lab's approach to AI safety and how they use their potential largesse', and "
            "chose 'Add it - write r7' from a proposal that named the objection above.", 17) +
        '},\n')
    m2 = re.search(r'\n(\s*)\{"version": REGISTRY_VERSION, "date": "2026-08-18",', src)
    src = src[:m2.start()] + '\n' + entry.rstrip('\n') + src[m2.start():]

    AXES.write_text(src, encoding='utf-8')
    print('axis L written · %d edges merged' % added)


if __name__ == '__main__':
    main()
