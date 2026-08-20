#!/usr/bin/env python3
"""Refuse to publish an authored count that the registry has outgrown.

The coverage gate catches a position that changed meaning under a rebuild,
because the drawing declares which letters it can letter. It cannot catch a
SENTENCE, and on 2026-08-19 three of them were found still asserting the r4
registry on a sheet drawing r6:

  · 'ALL 26 POSITIONS' as the source register's heading, when the registry
    held 49 and the register reached 26 of them.
  · 'Every position now carries at least one source about the world', when 23
    positions — all of K, all of R, and eleven others — carried none.
  · 'A dossier now stands behind each variable', when seven dossiers stood
    behind nine variables.

The general form is worth stating, because it is not the letter finding of
2026-08-18 and it is worse: a letter inherits a new MEANING and is wrong about
one row, while a quantifier inherits a new DOMAIN and is wrong about every
member the rebuild added. 'All', 'every' and 'each' range over whatever set
the registry holds at the moment a reader reads them, and no rebuild touches
the sentence.

A dated statement of what was measured survives a rebuild. So the rule is:

    An authored count of axes, positions, variables or dossiers must either
    match the live registry, or carry in its own sentence the registry
    revision or the year it was measured in.

That is checkable, it is what an honest historical claim already does, and it
fires on the present-tense universal that is the actual defect.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, "web")

WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
    "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
    "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16,
    "seventeen": 17, "eighteen": 18, "nineteen": 19, "twenty": 20,
    "twenty-one": 21, "twenty-two": 22, "twenty-three": 23, "twenty-four": 24,
    "twenty-five": 25, "twenty-six": 26, "twenty-seven": 27, "twenty-eight": 28,
    "twenty-nine": 29, "thirty": 30, "forty-nine": 49, "fifty": 50,
    "fifty-five": 55, "sixty-one": 61,
}
NUM = r"(\d{1,3}|" + "|".join(sorted(WORDS, key=len, reverse=True)) + r")"
# THE SHEET CALLS THEM CONTROLS, and the gate was only watching the registry's own words. r8
# added an eleventh axis and the one sentence that would have gone stale said "nine controls".
NOUN = r"(positions?|axes|variables|dossiers|controls?|settings)"
COUNT = re.compile(NUM + r"\s+" + NOUN, re.I)

# A sentence carries its own date when it names a registry revision or a year.
QUALIFIED = re.compile(r"\br[3-9]\b|\b(19|20)\d{2}\b", re.I)


def literals(src):
    """Single-quoted string literals, with `' + '` concatenations glued.

    The prose is written as adjacent chunks joined across line breaks, so a
    count straddles a chunk boundary as often as not: `'the 26 ' + 'positions'`.
    Gluing first is what makes the sweep see the sentence the reader sees.
    """
    src = re.sub(r"'\s*\+\s*\n?\s*'", "", src)
    return re.findall(r"'((?:[^'\\\n]|\\.)*)'", src)


def sentences(text):
    return re.split(r"(?<=[.;])\s+", text)


def registry():
    net = json.load(open(os.path.join(WEB, "data", "forecast", "network.json")))
    axes = net["axes"]
    return {
        "axes": len(axes),
        "variables": len(axes),
        "positions": sum(len(a["positions"]) for a in axes),
        "version": net.get("version"),
    }


def main():
    live = registry()
    faults = []
    for name in sorted(os.listdir(os.path.join(WEB, "js"))):
        if not name.endswith(".js"):
            continue
        path = os.path.join(WEB, "js", name)
        src = open(path, encoding="utf-8").read()
        for lit in literals(src):
            for sent in sentences(lit):
                for raw, noun in COUNT.findall(sent):
                    n = WORDS.get(raw.lower(), None)
                    if n is None:
                        n = int(raw) if raw.isdigit() else None
                    if n is None:
                        continue
                    key = "positions" if noun.lower().startswith("position") \
                        else "axes" if noun.lower() == "axes" \
                        else "variables" if noun.lower() == "variables" \
                        else "dossiers"
                    want = live.get(key if key != "dossiers" else "variables")
                    if n == want:
                        continue
                    if QUALIFIED.search(sent):
                        continue
                    faults.append(
                        "%s: '%s %s' — the registry carries %d, and the "
                        "sentence names no revision or year:\n      “%s”"
                        % (name, raw, noun, want, sent.strip()[:170]))
    if faults:
        sys.stderr.write(
            "COUNT GATE — refusing to publish.\n  The registry is %s: %d axes, "
            "%d positions.\n  %s\n  A count the registry has outgrown must say "
            "which registry it counted, or a reader reads it as current.\n"
            % (live["version"], live["axes"], live["positions"],
               "\n  ".join(faults)))
        return 6
    print("counts OK · %d axes, %d positions · every authored count matches "
          "the registry or dates itself" % (live["axes"], live["positions"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
