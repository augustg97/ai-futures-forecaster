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
# A CLOSING FORMULA IS A REPEATED FRAMING. The stage-6 brief asked for "what is still open", and
# 29 of 48 positions duly closed on "stays open" or "remains unsettled" — one instruction
# producing one sentence forty-eight times. The n-gram check below cannot see it, because the
# repeated part is a two-word tail; this names it directly.
# A phrase struck in one rewriting pass comes back in the next, because each pass sees only the
# tables it was given. These are struck permanently, with the round that first removed them.
# ── a metaphor is not a mechanism ───────────────────────────────────────────
# August rewrote one himself and the rewrite is the rule:
#   BEFORE  Middle powers running both blocs' systems have become the translators whose
#           conventions travel furthest.
#   AFTER   Middle powers adopt both blocs' AI systems, and achieve influence in setting
#           protocols and conventions.
# "have become the translators" asks a reader to decode an image; the rewrite says what these
# states DO and what they GET. Of the same family as "adoption decides reach alongside export
# control", which he called "too slick - would wikipedia say this?" An abstraction cannot act,
# and a sentence shaped to sound finished usually is not saying anything.
METAPHOR = [
    (r'\b(?:have |has |had )?become the \w+\b', 'a metaphor standing in for a role'),
    (r'\btravels? furthest\b|\bcarr(?:y|ies) furthest\b', 'a distance metaphor'),
    (r'\bmarks the (?:outer )?(?:edge|limit|boundary) of\b', 'a boundary metaphor'),
    # A NAMED BODY IS NOT AN ABSTRACTION. The rule catches "adoption decides reach"; it caught
    # "the Federal Energy Regulatory Commission decides whether" too, which is a body a reader
    # can look up doing the thing it exists to do. The -ion word has to be a common noun.
    (r'\b[a-z]+ion (?:decides|governs|dictates) \w+\b', 'an abstraction verbing an abstraction'),
    (r'(?:^|(?<=[.!?] ))[A-Z][a-z]+ion (?:decides|governs|dictates) \w+\b',
     'an abstraction verbing an abstraction'),
    (r'\bthe (?:scarce|binding|operative) (?:good|input|limit|constraint)\b',
     'an abstraction as the grammatical subject'),
]
RETIRED = [
    (r'\bset the pace\b', 'a phrase retired on 2026-08-19: it carried eight different claims'),
    (r'\bthe sequence amounts to\b', 'a phrase retired on 2026-08-19: copied from a brief'),
    (r'\bthe problem this creates\b', 'a phrase retired on 2026-08-19: copied from a brief'),
]
CLOSING = [
    (r'\b(?:stays|remains|is still) (?:open|unsettled)\b', 'a closing formula'),
    (r'\bwhat (?:stays|remains) (?:open|unsettled)\b', 'a closing formula'),
]
SELF = [
    (r'\b(?:this|the) scale (?:ends|stops|runs out|cannot|can\'t)\b', 'the clause talks about the scale'),
    (r'\b(?:past|beyond|off) (?:what )?this scale\b', 'the clause talks about the scale'),
    (r'\bthis (?:document|sheet|drawing|forecast) (?:shows|says|cannot|draws)\b',
     'the clause talks about the document'),
    # AUGUST, 2026-08-19: "remove all self-referential language". The rule above wanted a verb
    # after the noun and so missed "the first population statistic in this forecast" and "the
    # forecast's own question" — a clause naming the drawing as a place or an owner rather than
    # as an actor. Two of them shipped inside the benefit axis on 2026-08-20.
    # "on the model of the Terrorism Risk Insurance Act" is ordinary English, so `model` is only
    # self-reference when the clause is not pointing at something else with `of`.
    # A CONTROL EXPLAINER MUST NAME THE DOCUMENT — "changing any of them rewrites this passage and
    # redraws every chart on the sheet" is the sentence telling a reader what the control does,
    # and there is no way to say it without saying it. Declared, so the rule stays strict
    # everywhere else rather than being softened to accommodate one legitimate case.
    (r'\b(?:in|on|of|across) (?:this|the) (?:forecast|document|sheet|drawing|chart)\b'
     r'(?<!redraws every chart on the sheet)',
     'the clause talks about the document'),
    (r'\b(?:in|across) (?:this|the) model\b', 'the clause talks about the document'),
    (r"\b(?:this|the) (?:forecast|document|sheet|drawing)'s\b",
     'the clause talks about the document'),
]
# ── August's language rules, 2026-08-19 ─────────────────────────────────────
# He edited six sentences by hand and each edit is a rule. Three of them are machine-checkable.
#
#   "A job survives where a mistake is expensive"  →  "Jobs survive where mistakes are expensive"
# THE INDEFINITE SINGULAR STANDING FOR THE GENERAL CASE. "a job", "a company", "a country" used
# to mean all of them. The plural says the same thing without inviting the reader to picture one.
# Checked SENTENCE-INITIALLY only. Mid-sentence "a doctor signs every diagnosis" reads as
# ordinary English; it is the clause that OPENS on an indefinite singular and then makes a
# general claim about all of them that he struck out.
# The noun list was closed, so "A health system with an organised screening invitation gains most"
# passed while "A hospital ..." failed. Widened on 2026-08-20 with the institutions this corpus
# actually writes about, and with one optional modifier, which is how they arrive in practice
# ("A frontier laboratory", "A diagnostic system"). It found eleven the closed list had missed.
# A SPECIFIC EVENT KEEPS ITS ARTICLE — "A court granted it a preliminary injunction" is one court
# on one day — so this reports rather than deciding, and a past-tense main verb is left alone.
GENERAL_SINGULAR = re.compile(
    r"(?:^|(?<=[.!?] ))A ((?:[a-z]+[ -])?(?:job|company|firm|worker|employee|country|user|patient|"
    r"doctor|lawyer|student|household|city|town|nation|government|hospital|school|system|service|"
    r"programme|program|authority|agency|board|department|ministry|regulator|insurer|laboratory|"
    r"clinic|university|union|fund|buyer|seller|vendor|supplier|operator|developer|manufacturer|"
    r"regime))\b(?!'s)(?=[^.!?]*\b(?:is|are|has|have|holds?|keeps?|gets?|gives?|takes?|makes?|"
    r"needs?|wants?|must|may|can|will|now|then|therefore)\b)")
#
#   "and machines take tasks whose errors are cheap"  →  "while machines automate low-risk tasks"
# DO NOT REPEAT A FRAMING. Once a mechanism is established, later clauses name its consequences.
# A phrase recurring across the corpus is that failure at scale: "what stays open is whether"
# closed nine different positions the same way.
#
#   "Machines do a third of paid work, and the rest needs..."  →  "...; the rest requires..."
# VARY THE JOIN. A page joined entirely by "and" reads as one list.
JOIN_AND = re.compile(r',\s+and\s')
JOIN_REL = re.compile(r'(?:,\s+(?:although|while|because|since|so|though|whereas|yet|as)\s|;)')

# THE DRAWING'S NAMES FOR ITS OWN PARTS ARE NOT ENGLISH. "the research rung", "this axis",
# "this span", "this setting", "world-line" are internal vocabulary; a reader meets the sentence
# with none of it. Say the thing itself — "the point at which systems run their own research".
MODEL_WORDS = [
    (r'\b(?:the research rung|the coding rung|the rung|rungs?\b(?! of a ladder))', 'ladder vocabulary'),
    (r'\bthis (?:axis|span|setting|position|world-line|line)\b', 'model vocabulary'),
    (r'\bworld-lines?\b', 'model vocabulary'),
]
# ── Strunk's Rule 14, measured ──────────────────────────────────────────────
# "This rule refers especially to loose sentences of a particular type, those consisting of two
# co-ordinate clauses, the second introduced by a conjunction or relative. Although single
# sentences of this type may be unexceptionable, A SERIES SOON BECOMES MONOTONOUS AND TEDIOUS."
# On 2026-08-19 that series was 54% of the 1,542 authored sentences, 249 of them joined by ", so"
# — the pattern August named: "obviously repetitive in their 'x, so y' pattern".
# The remedy is Strunk's own: "simple sentences... two clauses joined by a semicolon... periodic
# sentences of two clauses... sentences, loose or periodic, of three clauses — whichever best
# represent the real relations of the thought."
LOOSE = re.compile(r',\s+(and|but|so|which|who|when|where|while)\s')
LOOSE_SHARE = 0.34      # of all authored sentences
LOOSE_ONE_CONNECTIVE = 0.17   # no single connective may carry more than this share

INFRA = re.compile(
    r'\b(data ?cent\w*|halls?|campus(?:es)?|substations?|grids?|megawatts?|gigawatts?|'
    r'utilit\w+|interconnect\w*|turbines?|siting|tariffs?|energis\w+|power contracts?|'
    r'accelerators?|chips?|fabs?|wafers?|foundr\w+|capital expenditure|depreciat\w+|'
    r'bankrupt\w*|lenders?|bonds?|equity|valuations?|auctions?|balance sheets?)\b', re.I)


def ladder_clauses(src):
    """The capability ladder's own strings. They are PREDICATES, not sentences."""
    m = re.search(r'const RUNG_SHORT = \[', src)
    if not m:
        return []
    i, depth = m.end(), 1
    while i < len(src) and depth:
        c = src[i]
        if c == "'":
            j = src.find("'", i + 1)
            i = j if j > 0 else i
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
        i += 1
    flat = re.sub(r"'\s*\+\s*\n?\s*'", '', src[m.end():i])
    return [t for t in re.findall(r"'((?:[^'\\\n]|\\.)*)'", flat) if len(t) > 24]


def calendar_entries(src):
    """The dated calendar's own strings, which are keyed to a year and exempt from the
    future-date rule for that reason."""
    m = re.search(r'(?:export )?const MARKERS = \[', src)
    if not m:
        return []
    i, depth = m.end(), 1
    while i < len(src) and depth:
        c = src[i]
        if c in '\'"':
            j = src.find(c, i + 1)
            i = j if j > 0 else i
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
        i += 1
    body = src[m.end():i]
    out = []
    for q in ('"', "'"):
        flat = re.sub(r"%s\s*\+\s*\n?\s*%s" % (q, q), '', body)
        out += re.findall(r"%s((?:[^%s\\\n]|\\.)*)%s" % (q, q, q), flat)
    return out


def literals(src):
    """Every authored string, with concatenation groups joined.

    COMMENTS ARE NOT PROSE. Every defect this gate looks for is written down in a comment
    beside the code that prevents it, quoted in the words August used, so a scan that reads
    comments reports the cure as the disease.
    """
    src = re.sub(r'^\s*//.*$', '', src, flags=re.M)
    out = []
    # BOTH QUOTE STYLES. This read only double quotes, and the capability ladder — RUNG,
    # RUNG_SHORT, MARKERS, SPANS — is written with single ones. 222 authored strings and 4,045
    # words, the largest lettering on the sheet among them, had never once been through this
    # gate. It is why "AI is wrong in ways found on the factory floor" and "AI is cheap where
    # each experiment needed a graduate student to run it" reached a reader rather than a build.
    for q in ('"', "'"):
        flat = re.sub(r"%s\s*\+\s*\n?\s*%s" % (q, q), '', src)
        out += [t for t in re.findall(r"%s((?:[^%s\\\n]|\\.)*)%s" % (q, q, q), flat)
                if len(t) > 24]
    return out


# ── three faults the reader found and the gates did not, 2026-08-20 ─────────
# He quoted eight sentences. Generalising from them found thirty-two, and each of the three
# classes below is now checkable. All of them share one cause: a clause is COMPOSED ALONE — the
# sheet takes one sentence from each setting and stands them side by side — so a clause that
# leans on a neighbour, or on the calendar, has nothing to lean on.
#
#   "Ownership changed hands and the capability stayed intact."  — "ownership of what? Capability
# of what?" An abstract noun takes a verb and nobody does anything, nothing is counted, and it
# happens nowhere.
NO_ACTOR = re.compile(
    r'^(Public budgets|Public listing|Public argument|Public trust|Public consent|Ownership|'
    r'Credit|Capital|Capability|Adoption|Deployment|Compliance|Composition|Verification|'
    r'Integration|Investment|Consent|Enforcement|Oversight|Coverage|Automation|Concentration|'
    r'Provision|Regulation|Governance)\s+'
    r'(?:is|are|was|were|has|have|reprices|completes|changed|changes|grows|grew|falls|fell|rises|'
    r'rose|moves|moved|turns|turned|holds|held|stays|stayed|advanced|advances|costs|cost|remains|'
    r'remained|spread|spreads|widens|widened)\b')
#
#   "Counties that host the buildings ..."  — "??? What are the 'buildings'?"
# A pointer to something the reader was never shown. A clause introduces whatever it refers to.
NO_ANTECEDENT = re.compile(
    r'^(?:Both changes|Both moves|The same|Those |These |Such )')
#
#   "Both changes arrive before the European Union's high-risk duties take effect in December
# 2027, leaving each government a single session to respond."  — drawn in 2036. THIS IS THE WORST
# OF THE THREE. A stage is a position in a sequence, reached whenever a world-line's own pace
# reaches it, so a stage clause naming a date a reader could still be waiting for will eventually
# be drawn after that date has passed and go on promising it. A date already past, framed in the
# past, is fine; anything else has to be written as a stage instead.
FUTURE_DATE = re.compile(
    r'\b(?:arrives? before|arrive before|takes? effect|comes? into force|due (?:in|by)|'
    r'ahead of|deadline)\b[^.]{0,60}\b20[2-9]\d\b|'
    r'\b20[2-9]\d\b[^.]{0,40}\b(?:takes? effect|comes? into force|is still ahead)\b')

# ── a mark that promises elaboration and does not deliver ───────────────────
# August, 2026-08-20: "Sometimes these nothing sentences have colons or semicolons, but the
# subsequent clause does not elaborate or explain (and sometimes is just another nothing
# statement)." A colon commits the writer: the second half must deliver what the first promises.
# The test is whether the second half brings anything the first did not — a figure, a named body,
# or a real number of new content words.
STOPWORDS = set(
    "that this they them their with from have has been which when where while then than into "
    "over under what because since although other same more most will would could should than "
    "these those there here also only just even much many some such".split())


def content_words(text):
    return {w for w in re.findall(r"[a-z][a-z'-]{3,}", text.lower()) if w not in STOPWORDS}


def empty_marks(sents):
    """Sentences whose colon or semicolon opens onto nothing new."""
    out = []
    for x in sents:
        m = re.search(r'(.+?)[;:]\s+(.+)', x)
        if not m:
            continue
        first, second = m.group(1), m.group(2)
        if re.search(r'\d', second) or re.search(r'\b[A-Z][a-z]{2,}', second):
            continue                      # a figure or a named body is delivery
        if len(content_words(second) - content_words(first)) > 4:
            continue                      # genuinely new material
        out.append(x)
    return out


def check(src):
    strings = literals(src)
    faults = []
    # AN ESCAPE IN AN AUTHORED STRING DRAWS. A scripted edit that wrote "\\n" into a single-quoted
    # literal put a newline in the middle of a sentence, which the drawing renders as a run of
    # whitespace and no check downstream sees.
    for raw in re.findall(r"'((?:[^'\\\n]|\\.)*)'", src) + re.findall(r'"((?:[^"\\\n]|\\.)*)"', src):
        if len(raw) > 24 and re.search(r'\\[nt]', raw):
            faults.append('an escape that draws as whitespace: "%s"' % raw[:70])
    # A closing formula is only a fault at scale: one position may honestly end on an open
    # question, and forty-eight ending the same way is a template.
    closing = sum(1 for t in strings for pat, _ in CLOSING if re.search(pat, t))
    if closing >= 12:
        faults.append('%d clauses close on "stays open" or "remains unsettled"; one instruction '
                      'produced one sentence many times' % closing)
    # the three 2026-08-20 classes, reported with the sentence so a reader can judge
    calendar = set(calendar_entries(NARR.read_text(encoding='utf-8')))
    # THE CAPABILITY LADDER IS COMPOSED AS "In 2040, AI is <clause>." — so its entries are
    # predicates, they do not open with a subject, and they carry no terminal full stop. Two
    # written as whole sentences produced "AI is Robots at the Argonne and Berkeley national
    # laboratories pipette through the night ... until two.." — broken twice over, and the
    # doubled stop is the only half a reader would have called a typo.
    for t in ladder_clauses(NARR.read_text(encoding='utf-8')):
        if re.match(r'^[A-Z]', t):
            faults.append('a capability clause that opens on a subject cannot finish '
                          '"AI is ...": "%s"' % t[:100])
        if t.rstrip().endswith('.'):
            faults.append('a capability clause ending in a full stop composes ".."'
                          ': "%s"' % t[-70:])
    for t in strings:
        first = re.split(r'(?<=[.!?])\s+', t)[0]
        if NO_ACTOR.match(first):
            faults.append('an abstract noun takes a verb and nobody does anything: "%s"' % first[:110])
        if NO_ANTECEDENT.match(t.strip()):
            faults.append('points at something the clause never shows: "%s"' % t[:110])
        # THE DATED CALENDAR IS EXEMPT AND MUST BE. MARKERS entries are keyed to their own year
        # and drawn within two of it, so "takes effect on 1 January 2027" in the 2027 entry is
        # the fact, not a promise. The fault is a date inside a STAGE clause, which is reached at
        # whatever year a world-line's pace reaches it and may be drawn decades later.
        m = FUTURE_DATE.search(t)
        if m and t not in calendar:
            faults.append('a stage clause naming a date a reader could still be waiting for: "%s"'
                          % t[max(0, m.start() - 30):m.start() + 90].strip())

    for pat, why in INVENTED + PLUMBING + SELF + MODEL_WORDS + RETIRED + METAPHOR:
        for t in strings:
            m = re.search(pat, t)
            if m:
                faults.append('%s: "%s"' % (why, t[max(0, m.start() - 40):m.start() + 70].strip()))
    # a stock phrase recurring across positions is a framing repeated, not a fact restated
    proper = set()
    for t in strings:
        for w in re.findall(r'(?<=[a-z,] )([A-Z][a-z]{2,})', t):
            proper.add(w.lower())
    stop = set('the a an and or of to in on at is are was were be been by for from with that this '
               'it its as not no more most than then so which who whose what when where while '
               'their they them these those there has have had do does did one two three'.split())
    grams = {}
    for t in strings:
        w = re.findall(r"[a-z][a-z'-]+", t.lower())
        for n in (3, 4):
            for i in range(len(w) - n + 1):
                g = w[i:i + n]
                if sum(1 for x in g if x in stop) > n - 2 or g[0] in stop:
                    continue   # a measure idiom ("of paid work") is not a framing
                if any(x in proper for x in g):
                    continue
                grams[' '.join(g)] = grams.get(' '.join(g), 0) + 1
    for g, c in sorted(grams.items(), key=lambda kv: -kv[1]):
        if c >= 8:
            faults.append('a framing repeated %d times: "%s"' % (c, g))

    for t in strings:
        m = GENERAL_SINGULAR.search(t)
        if m:
            faults.append('the indefinite singular for the general case: "%s"'
                          % t[max(0, m.start() - 30):m.start() + 60].strip())

    ands = sum(len(JOIN_AND.findall(t)) for t in strings)
    rels = sum(len(JOIN_REL.findall(t)) for t in strings)
    if ands + rels > 50 and ands / (ands + rels) > 0.68:
        faults.append('%d%% of clause joins are ", and" (%d against %d carrying a relation); a '
                      'page joined entirely by "and" reads as one list'
                      % (100 * ands / (ands + rels), ands, rels))

    # Rule 14 is a property of the SET, never of one sentence, so it is counted over all of them.
    sents = [x.strip() for t in strings
             for x in re.split(r'(?<=[.!?])\s+', t) if len(x.strip()) > 25]
    # A colon or semicolon whose second half adds nothing was 31% of marked sentences when
    # August named it. Counted over the set, because one such sentence is a slip and a page of
    # them is a habit.
    marked = [x for x in sents if re.search(r'[;:]\s', x)] if len(sents) > 200 else []
    if marked:
        hollow = empty_marks(marked)
        if len(hollow) / len(marked) > 0.20:
            faults.append('%.0f%% of %d sentences with a colon or semicolon open onto nothing '
                          'new; the mark promises elaboration'
                          % (100 * len(hollow) / len(marked), len(marked)))

    if len(sents) > 200:
        hits = [LOOSE.search(x) for x in sents]
        loose = [h for h in hits if h]
        share = len(loose) / len(sents)
        if share > LOOSE_SHARE:
            faults.append('%.0f%% of %d sentences are loose two-clause sentences (Strunk 14: "a '
                          'series soon becomes monotonous and tedious")' % (100 * share, len(sents)))
        by = {}
        for h in loose:
            by[h.group(1)] = by.get(h.group(1), 0) + 1
        for conn, n in sorted(by.items(), key=lambda kv: -kv[1]):
            if n / len(sents) > LOOSE_ONE_CONNECTIVE:
                faults.append('", %s" joins %.0f%% of all sentences; vary the construction'
                              % (conn, 100 * n / len(sents)))
                break

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
