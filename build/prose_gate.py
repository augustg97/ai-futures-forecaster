#!/usr/bin/env python3
"""Refuse to publish a passage that has drifted back into plumbing.

The authored layer is written by workflows and rewritten often, and the failure it drifts into
is always the same one. On 2026-08-19 August read the sheet and named it twice:

  "Bankruptcy judges decide which halls keep running and under whose name" — unclear. What does
  this mean and why does it matter?
  "A notification registry receives the report, a claims bureau prices it and an accreditation
  board signs off the remediation, staffed on rotas by responders who train for the work." —
  weirdly and randomly specific and out of place.
  "this overall seems to focus solely on data centers - we should be talking about all of AI /
  the impacts of model capabilities."

Two measurable things go wrong, and both are checked here.

  1. INVENTED INSTITUTIONS AND INVENTED STAFFING. An indefinite body performing a procedural
     step — a claims bureau prices it, an accreditation board signs off, staffed on rotas — is
     a sentence a reader cannot check against anything. A named institution can be looked up;
     an invented one cannot.
  2. INFRASTRUCTURE AS THE DEFAULT SUBJECT. Data centres, chips and capital markets are one
     thread in a forecast about AI. When they carry more than a third of the authored strings,
     the sheet reads as a document about data centres.

Both thresholds are deliberately loose. This gate catches drift, not style.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'web' / 'js' / 'narrative.js'

# an indefinite body doing a procedural step, and staffing written as though observed
INVENTED = [
    (r'\b[Aa]n? (?:claims|notification|accreditation|certification|review|capacity|compliance|'
     r'standards|licensing|assurance|remediation|adjudication|verification) '
     r'(?:bureau|board|registry|desk|committee|panel|office|body|authority)\b',
     'an invented institution'),
    (r'\bstaffed (?:on rotas|by responders|by duty officers|by transcript readers)\b',
     'invented staffing'),
    (r'\bworking (?:three shifts|the rota|on rotas)\b', 'invented staffing'),
    (r'\b(?:an? )?(?:duty officer|incident-desk engineer|claims manager|loss adjuster)s? '
     r'(?:writes|files|works|carries|prices)\b', 'an invented job doing a procedural step'),
]
# the plumbing of finance and siting, which is machinery and not a claim about the world
PLUMBING = [
    (r'\bletter of credit\b', 'letter of credit'),
    (r'\bcontracted load\b', 'contracted load'),
    (r'\brate case\b', 'rate case'),
    (r'\bpayments? in lieu of taxes\b', 'payments in lieu of taxes'),
    (r'\bunder whose name\b', 'under whose name'),
    (r'\bassigned intact\b', 'assigned intact'),
    (r'\bholds? (?:its|their|the) deeds?\b', 'holds the deed'),
]
# A CLAUSE MAY NOT TALK ABOUT THE DRAWING. August struck out "past what this scale can measure"
# and "is off this scale": a reader wants to know what is true of the world, and the instrument's
# range is the document's problem. The same bars a clause describing the sheet it sits on.
SELF = [
    (r'\b(?:this|the) scale (?:ends|stops|runs out|cannot|can\'t)\b', 'the clause talks about the scale'),
    (r'\b(?:past|beyond|off) (?:what )?this scale\b', 'the clause talks about the scale'),
    (r'\bthis (?:document|sheet|drawing|forecast) (?:shows|says|cannot|draws)\b',
     'the clause talks about the document'),
]
INFRA = re.compile(
    r'\b(data ?cent\w*|halls?|campus(?:es)?|substations?|grids?|megawatts?|gigawatts?|'
    r'utilit\w+|interconnect\w*|turbines?|siting|tariffs?|energis\w+|power contracts?|'
    r'accelerators?|chips?|fabs?|wafers?|foundr\w+|capital expenditure|depreciat\w+|'
    r'bankrupt\w*|lenders?|bonds?|equity|valuations?|auctions?|balance sheets?)\b', re.I)


def literals(src):
    """Every authored string, with concatenation groups joined.

    COMMENTS ARE NOT PROSE. Every defect this gate looks for is written down in a comment
    beside the code that prevents it, quoted in the words August used, so a scan that reads
    comments reports the cure as the disease.
    """
    src = re.sub(r'^\s*//.*$', '', src, flags=re.M)
    flat = re.sub(r'"\s*\+\s*\n?\s*"', '', src)
    return [t for t in re.findall(r'"((?:[^"\\\n]|\\.)*)"', flat) if len(t) > 24]


def check(src):
    strings = literals(src)
    faults = []
    # AN ESCAPE IN AN AUTHORED STRING DRAWS. A scripted edit that wrote "\\n" into a single-quoted
    # literal put a newline in the middle of a sentence, which the drawing renders as a run of
    # whitespace and no check downstream sees.
    for raw in re.findall(r"'((?:[^'\\\n]|\\.)*)'", src) + re.findall(r'"((?:[^"\\\n]|\\.)*)"', src):
        if len(raw) > 24 and re.search(r'\\[nt]', raw):
            faults.append('an escape that draws as whitespace: "%s"' % raw[:70])
    for pat, why in INVENTED + PLUMBING + SELF:
        for t in strings:
            m = re.search(pat, t)
            if m:
                faults.append('%s: "%s"' % (why, t[max(0, m.start() - 40):m.start() + 70].strip()))
    infra = sum(1 for t in strings if INFRA.search(t))
    share = infra / max(1, len(strings))
    if share > 0.34:
        faults.append('infrastructure and capital carry %.0f%% of %d authored strings; a '
                      'forecast about AI reads as a document about data centres past a third'
                      % (100 * share, len(strings)))
    return faults, len(strings), share


def main():
    faults, n, share = check(NARR.read_text(encoding='utf-8'))
    if faults:
        print('PROSE GATE: FAIL — refusing to publish', file=sys.stderr)
        for f in faults[:12]:
            print('  ' + f, file=sys.stderr)
        if len(faults) > 12:
            print('  ... and %d more' % (len(faults) - 12), file=sys.stderr)
        print('\n  A clause states a fact, a development or a well-supported expectation, and\n'
              '  says why. A named institution can be looked up; an invented one cannot.',
              file=sys.stderr)
        raise SystemExit(5)
    print('prose OK · %d authored strings · infrastructure %.0f%%' % (n, 100 * share))


if __name__ == '__main__':
    main()
