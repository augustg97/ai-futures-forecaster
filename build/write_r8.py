#!/usr/bin/env python3
"""Add axis G, benefit realisation, to the Atlas registry as r8, with the rules that can move it.

AUGUST ASKED FOR IT: "Improved model capabilities will unlock potentially untold benefits - we
should note these explicitly in a new control/variable on AI benefits and when/how/where they are
realized (biomedicine, logistics, potential benefits in Machines of Loving Grace)."

THE FORECAST COULD NOT SAY THIS. D measures the share of paid work machines do, which is a labour
quantity that says nothing about whether anyone is healthier. A world where a capability exists,
deploys, does paid work and cures nobody was one this network could only describe by accident.

THE OBJECTION IS MEASURED, NOT ARGUED, AND IT IS RECORDED IN THE CHANGELOG. Run a generous set of
benefit terms over the 2,180-event trunk and 17 events match, several of them falsely. There is no
health or science section in the feed at all. So the five rules below are written knowing they
will fire rarely, and the axis ships with a reading of how often it has actually moved, because a
frozen prior drawn as a live measurement is this project's own recurring defect.

    python3 build/write_r8.py
"""
import json
import re
import sys
import textwrap
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from write_r7 import block_end, merge_edges, q  # noqa: E402

AXES = Path.home() / 'AI Atlas' / 'Research' / 'timelines' / 'axes.py'
DESIGN = Path(__file__).resolve().parent.parent / 'Research' / 'findings' / 'r8-benefit-axis.json'

# ── the rules that take benefit as their subject ────────────────────────────
# Wherever a subject can speak both ways it gets a rule in each direction, which is the standing
# rule for this layer: a class of evidence that can only push one way drifts monotonically.
RULES = '''
  # G - benefit realisation. WRITTEN KNOWING THE TRUNK BARELY CARRIES THEM.
  # A generous term sweep over 2,180 events matched 17, and the feed has no
  # health or science section. These exist so that the day an approval, a
  # read-out or a payment decision does arrive, something hears it; until then
  # G reports its own application count rather than pretending to a reading.
  {"id": "ev-clinical-readout", "impact": "notable",
   "match": {"text_any": ["phase 3", "phase iii", "pivotal trial*",
                          "primary endpoint*", "fda approv*",
                          "approved by the fda", "marketing authoris*",
                          "marketing authoriz*", "ema approv*",
                          "randomi*ed controlled", "read out*", "readout*"],
             "text_all": ["ai"],
             "text_none": ["discontinu*", "failed to meet",
                           "missed its primary"]},
   "nudge": {("G", "G3"): +2, ("G", "G2"): +1, ("G", "G4"): -1},
   "cites": ["concepts/ai-drug-discovery"]},

  {"id": "ev-clinical-shortfall", "impact": "notable",
   "match": {"text_any": ["discontinu* the trial", "failed to meet",
                          "missed its primary", "halted the trial",
                          "no clinical benefit", "pipeline cull",
                          "no measurable benefit", "found no improvement",
                          "no significant difference"],
             "text_all": ["ai"]},
   "nudge": {("G", "G4"): +2, ("G", "G6"): +1, ("G", "G3"): -1},
   "cites": ["concepts/ai-drug-discovery"]},

  {"id": "ev-device-authorisation", "impact": "minor",
   "match": {"text_any": ["510(k)", "de novo", "premarket",
                          "cleared by the fda", "ai-enabled device*",
                          "medical device*", "radiolog*", "screening "
                          "programme*", "screening program*"]},
   "nudge": {("G", "G2"): +2, ("G", "G6"): +1, ("G", "G1"): -1},
   "cites": ["concepts/ai-in-medicine"]},

  {"id": "ev-benefit-delivery", "impact": "minor",
   "match": {"text_any": ["flood warning*", "early warning*", "reimburs*",
                          "payment code*", "cpt code*", "medicare*",
                          "weather forecast*", "drug discovery",
                          "materials discovery", "protein structure*",
                          "crop yield*", "grid dispatch"]},
   "nudge": {("G", "G1"): +2, ("G", "G3"): +1, ("G", "G5"): -1},
   "cites": ["concepts/ai-for-science"]},

  {"id": "ev-benefit-unmeasured", "impact": "minor",
   "match": {"text_any": ["no outcome data", "outcome* were not measured",
                          "equivalence to a predicate", "substantial "
                          "equivalence", "evidence gap*", "not been "
                          "evaluated", "no evidence that patients"]},
   "nudge": {("G", "G6"): +2, ("G", "G5"): +1, ("G", "G2"): -1},
   "cites": ["concepts/ai-in-medicine"]},
'''


def main():
    d = json.loads(DESIGN.read_text(encoding='utf-8'))
    src = AXES.read_text(encoding='utf-8')
    if '"key": "G"' in src:
        raise SystemExit('axis G is already present')

    pos = []
    for p in d['positions']:
        desc = ' '.join(x.strip() for x in (p['desc'], p.get('basis') or '') if x)
        pos.append('       ("%s", %s, %.3f,\n        %s,\n        %s),'
                   % (p['key'], q(p['name'], 8), p['prior'],
                      json.dumps(['concepts/ai-for-science']), q(desc, 8)))
    axis = ('    {"key": "G", "name": "Benefit realisation",\n'
            '     "desc": ' + q(d['question'].strip() + ' ' + d['desc'].strip(), 13) + ',\n'
            '     "cites": ["concepts/ai-for-science"],\n'
            '     "positions": [\n' + '\n'.join(pos) + '\n     ]},\n')

    m = re.search(r'\n  \],\n  "conditionals": \{', src)
    src = src[:m.start()] + '\n' + axis + '  ],\n  "conditionals": {' + src[m.end():]

    # EVERY EDGE RUNS INTO G, so the conditionals literal has no "G" block yet and merge_edges
    # refuses rather than creating a duplicate key. Open the block first, empty.
    start = src.index('"conditionals": {') + len('"conditionals": ')
    end = block_end(src, start)
    if not re.search(r'\n\s*"G":\s*\{', src[start:end]):
        src = src[:start + 1] + '\n      "G": {\n      },' + src[start + 1:]
    src, added = merge_edges(src, d['edges'])

    src = src.replace('EVIDENCE_RULES = [', 'EVIDENCE_RULES = [' + RULES.rstrip() + '\n', 1)
    src = src.replace('REGISTRY_VERSION = "r7-2026-08-20"',
                      'REGISTRY_VERSION = "r8-2026-08-20"', 1)

    entry = (
        '    {"version": REGISTRY_VERSION, "date": "2026-08-20",\n'
        '     "change": ' + q(
            "r8 - an eleventh axis, G, benefit realisation, and the first that asks whether "
            "anyone is better off. The ten existing axes measure capability, control, money, "
            "computing, rules, consent, labour share and conduct, and none of them asks what any "
            "of it delivered to a person. D counts the share of paid work machines do, which is "
            "a labour quantity; a world in which a capability exists, is deployed, does paid "
            "work and cures nobody was one this network could describe only by accident. Six "
            "positions, priors summing to 1, 57 conditional edges from all ten existing axes. "
            "THE RECORD SETS THE ZERO: no medicine whose discovery is attributed to a machine "
            "holds a marketing authorisation anywhere on 2026-08-20; the most advanced candidate "
            "published a 71-patient safety trial in June 2025 whose lung-function figure was a "
            "secondary endpoint with no between-arm test, and its 320-patient pivotal trial is "
            "dated to complete 2029-10-30. Against that, the United States device list held "
            "1,524 entries at its 2026-03-30 cut, 1,164 of them radiology and 1,466 cleared on "
            "equivalence to an existing device rather than on an outcome, and machine-learned "
            "weather forecasting has been an intergovernmental centre's headline product since "
            "2025-02-25 with flood warning reaching about 460 million people. The two clocks are "
            "measured apart: discovery compressed to 12-18 months while the arc to a "
            "prescription stayed near a decade. THREE OBJECTIONS, RECORDED BECAUSE TWO ARE "
            "UNRESOLVED. First, every one of the 57 edges is inbound - G receives and drives "
            "nothing, which makes it a readout sitting in the position space. Second, and now "
            "measured rather than argued, a generous sweep of benefit terms over the 2,180-event "
            "trunk matches 17 events, several falsely, because the feed carries no health or "
            "science section at all; the five rules below are written against that. Third, the "
            "sharpest numbers here are stocks whose flow nobody has measured, which is the shape "
            "of the window-label defect this project has now made twice. What survives all "
            "three: the residue is already 87 percent unexplained with six axes moving zero, and "
            "an axis nothing can move makes that map worse now and honest later.", 15) + ',\n'
        '     "approved": ' + q(
            "August (2026-08-20): 'Improved model capabilities will unlock potentially untold "
            "benefits - we should note these explicitly in a new control/variable on AI benefits "
            "and when/how/where they are realized (biomedicine, logistics, potential benefits in "
            "Machines of Loving Grace).' He asked after reading a passage that put AI being "
            "wrong beside the machines getting better and found the pairing incoherent.", 17) +
        '},\n')
    m2 = re.search(r'\n(\s*)\{"version": REGISTRY_VERSION, "date": "2026-08-20",', src)
    src = src[:m2.start()] + '\n' + entry.rstrip('\n') + src[m2.start():]

    AXES.write_text(src, encoding='utf-8')
    print('axis G written · %d edges merged · 5 rules added' % added)


if __name__ == '__main__':
    main()
