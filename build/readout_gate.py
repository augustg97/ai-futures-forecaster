#!/usr/bin/env python3
"""The readout gate — judge what the sheet would letter, never the strings it is made from.

Three checks over the COMPOSED headline and passage (build/compose_sweep.mjs runs the composer
over the likeliest path and a set of exemplars, year by year):

  1. PROVENANCE. Every composed paragraph and group carries a `src` — a ledger entry, a track
     value or a registry criterion. The present composer emits none, so this reports 100%
     unsourced until the chronicle composer of plan-2026-09-02 (P1) lands. That is the
     acceptance the plan wrote for P0: the gate exists, runs on every build, and fails on the
     passage it will replace.

  2. LANGUAGE, rules 1 to 4 of the standard in plan-2026-09-02 §2, applied to composed text:
     a noun phrase names its thing (no bare "the interval", "the arrangement", "the choice");
     a sentence names an actor; plain verbs; twenty-eight words at most; at most one ", and"
     join and one semicolon in a headline; no two consecutive sentences opening on the same
     word or built to the same shape.

  3. SANITY. A quantity past what the world could hold is a defect whoever computed it: on
     2026-09-01 the sheet lettered 52,361 GW of installed AI compute at 2077, about six times
     the world's generating capacity, and "$30.0 trillion, flat for five years" from the 2050s
     on (review of 2026-09-01, F4). Every track on every composed path is read against a
     documented ceiling, and a track frozen for twenty years is reported as saturated.

Modes. Default is REPORT: print every count with examples and exit 0, so the nightly keeps
publishing while the composer is rebuilt. `--strict` (or READOUT_STRICT=1) exits 7 on any
fault, which is the setting from P1 onward.

    python3 build/readout_gate.py [--strict] [--exemplars N] [--step N] [--json path]
"""
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SWEEP = os.path.join(ROOT, "build", "compose_sweep.mjs")
FORECAST = os.path.join(ROOT, "web", "data", "forecast")

# ── the language standard, as far as a regex can carry it ───────────────────
# Rule 1. A definite abstraction with nothing after it that says which one. The list is the
# corpus's own habits, from the review and the two mocks; widen it when a reader finds another.
BARE_NOUNS = ("interval arrangement arrangements choice gain gains gap moment question work "
              "sequence shift change changes move moves problem answer result decade drama "
              "story thing map boundary distance pace agenda outcome consequences loop "
              "transition difference divergence pattern process trend").split()
SPECIFIERS = {"of", "between", "that", "which", "to", "in", "from", "at", "on", "for", "with",
              "against", "before", "after", "since", "over", "under", "into", "behind"}
BARE = re.compile(r"\b[Tt]he (%s)\b(?!\s+(%s)\b)" % ("|".join(BARE_NOUNS),
                                                     "|".join(SPECIFIERS)))
# "the research loop" and "the capability loop" are the sheet's own terms and are specified
BARE_OK = re.compile(r"\b[Tt]he (research|capability|feedback) loop\b")

# Rule 2. A sentence names an actor: a proper noun off the sentence's first word, or a role
# the registry itself uses, or the systems.
ROLES = ("ai frontier systems laboratory laboratories regulator regulators insurer insurers council councils "
         "legislature legislatures congress court courts ministry ministries department "
         "commission government governments company companies firm firms employer employers "
         "hospital hospitals bank banks utility utilities machine machines system systems "
         "agent agents model models researcher researchers worker workers voter voters "
         "investor investors lender lenders developer developers state states washington "
         "beijing brussels operator operators buyer buyers supplier suppliers household "
         "households patient patients clinic clinics school schools university universities "
         "auditor auditors board boards judge judges parliament committee committees "
         "planner planners engineer engineers people public staff manager managers minister "
         "ministers official officials analyst analysts scientist scientists teacher teachers "
         "nurse nurses doctor doctors lawyer lawyers farmer farmers clerk clerks tenant tenants "
         "underwriter underwriters trustee trustees negotiator negotiators editor editors "
         "district districts county counties city cities town towns nation nations union unions "
         "fund funds programme programmes shopkeeper shopkeepers driver drivers parent parents").split()
ROLE = re.compile(r"\b(%s)\b" % "|".join(ROLES), re.I)
PROPER = re.compile(r"(?<=[a-z,;:] )[A-Z][a-z]{2,}")

# Rule 3. Verbs and phrases that describe a mood where the standard wants an act.
FIGURATIVE = [
    r"\bfaces? (?:its|their|a) (?:leverage )?moment\b", r"\bsets? (?:its|their) decade\b",
    r"\bsettles? into\b", r"\btakes? hold\b", r"\benters? the lexicon\b",
    r"\bstops? being a metaphor\b", r"\bthe drama\b", r"\bmigrates? elsewhere\b",
    r"\b(?:century|era|moment|future|decade) arrives\b", r"\bcomes? to a head\b",
    r"\bthe writing on the wall\b", r"\bwakes? up\b", r"\bpulls? ahead\b",
    r"\bhollows? out\b", r"\bloosens\b", r"\bin the eye of\b", r"\bat the speed of\b",
]
FIG = re.compile("|".join(FIGURATIVE), re.I)

MAX_WORDS = 28

# Rule 4. Shapes, so two neighbours can be compared.
SUBORD = re.compile(r"^(?:Because|Since|While|Although|When|As|After|Where|With|Having|Before|Until|Once|If)\b")


def sentences(text):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", str(text or "")) if len(s.strip()) > 3]


def shape(s):
    if ";" in s:
        return "semi"
    if re.search(r"\w:\s", s):
        return "colon"
    if ", and " in s:
        return "and"
    if SUBORD.match(s):
        return "sub"
    if re.search(r", at \$?\d", s):
        return "fig-appos"
    if re.search(r"\d", s):
        return "fig"
    return "simple"


def first_word(s):
    m = re.match(r"[A-Za-z]+", s)
    return m.group(0).lower() if m else ""


def has_actor(s):
    return bool(ROLE.search(s) or PROPER.search(s))


def check_language(headline):
    """Faults in one composed headline, as (rule, text) pairs."""
    faults = []
    sents = sentences(headline)
    for s in sents:
        for m in BARE.finditer(s):
            span = s[max(0, m.start() - 20):m.end() + 25]
            if BARE_OK.search(s[max(0, m.start() - 2):m.end() + 6]):
                continue
            faults.append(("bare noun", span.strip()))
        if not has_actor(s):
            faults.append(("no actor", s[:100]))
        m = FIG.search(s)
        if m:
            faults.append(("figurative", s[max(0, m.start() - 30):m.end() + 20].strip()))
        if len(s.split()) > MAX_WORDS:
            faults.append(("long", "%d words: %s" % (len(s.split()), s[:80])))
    if headline.count(", and ") > 1:
        faults.append(("joins", "%d ', and' joins in one headline" % headline.count(", and ")))
    if headline.count(";") > 1:
        faults.append(("joins", "%d semicolons in one headline" % headline.count(";")))
    for a, b in zip(sents, sents[1:]):
        if first_word(a) and first_word(a) == first_word(b):
            faults.append(("opening", "two sentences open on '%s'" % first_word(a)))
        sa, sb = shape(a), shape(b)
        if sa == sb and sa != "simple":
            faults.append(("shape", "two '%s' sentences in a row" % sa))
    return faults


# ── sanity ceilings, in the world's units ───────────────────────────────────
# World electricity generating capacity was near 9,500 GW in 2026 and has grown two to three
# per cent a year; an AI load larger than all generation cannot be served. World output near
# $115 trillion in 2026, three per cent a year; AI revenue above a quarter of it is a claim
# about the whole economy. Employment: the sheet's own band calls a fall past 18% "larger than
# any peacetime fall on record", so anything past 30% is beyond the record by a wide margin.
WORLD_GW_2026, WORLD_GW_GROWTH = 9500.0, 1.025
WORLD_GDP_2026, WORLD_GDP_GROWTH = 115.0, 1.03
JOBS_FLOOR = -30.0
FROZEN_YEARS = 20


def check_sanity(tracks, label):
    faults = []
    yrs = tracks["year"]
    def first(cond):
        for k, y in enumerate(yrs):
            if cond(k):
                return y
        return None
    y = first(lambda k: tracks["gw"][k] > WORLD_GW_2026 * WORLD_GW_GROWTH ** (yrs[k] - 2026))
    if y:
        faults.append(("ceiling", "%s: installed AI compute passes world generating capacity in %d "
                                  "(%.0f GW)" % (label, y, tracks["gw"][yrs.index(y)])))
    y = first(lambda k: tracks["rev"][k] > 0.25 * WORLD_GDP_2026 * WORLD_GDP_GROWTH ** (yrs[k] - 2026))
    if y:
        faults.append(("ceiling", "%s: AI revenue passes a quarter of world output in %d" % (label, y)))
    y = first(lambda k: tracks["jobs"][k] < JOBS_FLOOR)
    if y:
        faults.append(("ceiling", "%s: employment falls past %.0f%% below 2026 in %d"
                                  % (label, -JOBS_FLOOR, y)))
    for key in ("cap", "gw", "rev", "jobs", "appr", "copies"):
        v = tracks.get(key)
        if not v:
            continue
        # the first year from which the value never moves again, if that is 20+ years early
        last = len(v) - 1
        k = last
        while k > 0 and abs(v[k - 1] - v[last]) <= 1e-9 * max(1.0, abs(v[last])):
            k -= 1
        if last - k >= FROZEN_YEARS:
            faults.append(("frozen", "%s: %s frozen at %s from %d to %d"
                                     % (label, key, v[last], yrs[k], yrs[last])))
    return faults


def node_bin():
    for cand in [shutil.which("node"), "/opt/homebrew/bin/node", "/usr/local/bin/node"]:
        if cand and os.path.isfile(cand):
            return cand
    return None


def main():
    strict = "--strict" in sys.argv or os.environ.get("READOUT_STRICT") == "1"
    def arg(flag, default):
        return sys.argv[sys.argv.index(flag) + 1] if flag in sys.argv else default
    n_ex, step = arg("--exemplars", "12"), arg("--step", "3")
    node = node_bin()
    if not node:
        print("readout gate · node not found; the composed sweep cannot run. "
              "Say so out loud." + (" REFUSING." if strict else ""))
        raise SystemExit(7 if strict else 0)
    raw = subprocess.check_output([node, SWEEP, n_ex, step], cwd=ROOT)
    sweep = json.loads(raw.decode("utf-8"))
    if "--json" in sys.argv:
        with open(arg("--json", ""), "w", encoding="utf-8") as fh:
            json.dump(sweep, fh)

    # 1 · provenance
    units = unsourced = 0
    for line in sweep["lines"]:
        for yr in line["years"]:
            for p in yr["paras"]:
                gs = p["groups"] or [{"src": p["src"]}]
                for g in gs:
                    units += 1
                    if not g.get("src"):
                        unsourced += 1
    # 2 · language, over every composed headline
    lang = {}
    examples = {}
    heads = 0
    bad_heads = 0
    for line in sweep["lines"]:
        for yr in line["years"]:
            heads += 1
            f = check_language(yr["headline"])
            if f:
                bad_heads += 1
            for rule, text in f:
                lang[rule] = lang.get(rule, 0) + 1
                examples.setdefault(rule, [])
                if len(examples[rule]) < 3:
                    examples[rule].append("%s · %d · %s" % (
                        "likeliest" if line["mainline"] else "exemplar", yr["y"], text))
    # 3 · sanity, on the composed paths' tracks
    main_t = json.load(open(os.path.join(FORECAST, "mainline.json")))["tracks"]
    ex = json.load(open(os.path.join(FORECAST, "exemplars.json")))["lines"]
    sanity = check_sanity(main_t, "likeliest path")
    for i, L in enumerate([l for l in ex if not l.get("mainline")][:int(n_ex)]):
        sanity += check_sanity(L["tracks"], "exemplar %d" % i)
    # cross slots, from the sweep
    cross_missing = {}
    for line in sweep["lines"]:
        for c in line["cross"]:
            if not c["found"]:
                cross_missing[c["key"]] = cross_missing.get(c["key"], 0) + 1

    faults = unsourced + sum(lang.values()) + len(sanity)
    mode = "STRICT" if strict else "report mode"
    print("readout gate (%s) · %d paths · %d composed years" % (
        mode, len(sweep["lines"]), heads))
    print("  provenance: %d of %d composed units carry no src (%.0f%%)" % (
        unsourced, units, 100.0 * unsourced / max(1, units)))
    print("  language: %d of %d headlines carry a fault" % (bad_heads, heads))
    for rule in sorted(lang, key=lambda r: -lang[r]):
        print("    %-11s %5d   e.g. %s" % (rule, lang[rule], examples[rule][0]))
    print("  sanity: %d findings" % len(sanity))
    for kind, text in sanity[:12]:
        print("    %-8s %s" % (kind, text))
    if len(sanity) > 12:
        print("    … %d more" % (len(sanity) - 12))
    if cross_missing:
        top = sorted(cross_missing.items(), key=lambda kv: -kv[1])[:6]
        print("  cross slots unresolved on the composed paths: %s" % ", ".join(
            "%s (%d years)" % kv for kv in top))
    if faults and strict:
        print("READOUT GATE REFUSED · %d faults" % faults, file=sys.stderr)
        raise SystemExit(7)
    print("  %d faults · strict would %s" % (faults, "refuse" if faults else "pass"))


if __name__ == "__main__":
    main()
